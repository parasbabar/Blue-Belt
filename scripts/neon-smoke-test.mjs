import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url || (!url.startsWith('postgres://') && !url.startsWith('postgresql://'))) {
    console.error('FAIL: DATABASE_URL is not a PostgreSQL connection string');
    process.exit(1);
  }

  const pool = new Pool({ connectionString: url });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  let pass = 0, fail = 0;
  const report = (label, ok, extra) => {
    console.log((ok ? 'PASS' : 'FAIL') + ': ' + label + (extra ? ' — ' + extra : ''));
    ok ? pass++ : fail++;
  };

  try {
    await prisma.$queryRaw`SELECT 1`;
    report('Neon connection', true);
  } catch (e) {
    report('Neon connection', false, e.message);
    await prisma.$disconnect(); await pool.end(); process.exit(1);
  }

  const tables = await prisma.$queryRaw`SELECT tablename FROM pg_tables WHERE schemaname='public'`;
  const names = tables.map(function(t) { return t.tablename; });
  // Prisma creates tables with quoted identifiers, preserving PascalCase in PostgreSQL
  const requiredTables = ['User', 'PaymentRequest', 'Payment', 'Feedback', 'Notification'];
  for (const t of requiredTables) {
    report('Table: ' + t, names.includes(t), names.includes(t) ? '' : 'Missing. Found: ' + names.join(','));
  }

  const testEmail = 'smoke-test-' + Date.now() + '@scholarpay-test.invalid';
  let user;
  try {
    user = await prisma.user.create({
      data: { email: testEmail, passwordHash: 'hash_placeholder', name: 'Smoke Test', role: 'STUDENT', country: 'Test' }
    });
    report('User registration persistence', !!user?.id);
  } catch (e) { report('User registration persistence', false, e.message); }

  try {
    const found = await prisma.user.findUnique({ where: { email: testEmail } });
    report('User lookup', found?.id === user?.id);
  } catch (e) { report('User lookup', false, e.message); }

  let req;
  try {
    req = await prisma.paymentRequest.create({
      data: {
        title: 'Smoke Test Request', purpose: 'Tuition', amount: 100, asset: 'XLM',
        recipientAddress: 'GAAZI4TCR3TY5OJHCTJC2A4QSY6CJWJH5IAJTGKIN2ER7LBNVKOCCWN',
        deadline: new Date(Date.now() + 86400000), studentId: user.id
      }
    });
    report('PaymentRequest persistence', !!req?.id);
  } catch (e) { report('PaymentRequest persistence', false, e.message); }

  try {
    const found = await prisma.paymentRequest.findUnique({ where: { id: req?.id } });
    report('PaymentRequest retrieval', found?.id === req?.id);
  } catch (e) { report('PaymentRequest retrieval', false, e.message); }

  let payment;
  try {
    payment = await prisma.payment.create({
      data: {
        paymentRequestId: req.id, senderWallet: 'GAAZI4TCR3TY5OJHCTJC2A4QSY6CJWJH5IAJTGKIN2ER7LBNVKOCCWN',
        amount: 100, transactionHash: 'smoke-' + Date.now(), status: 'SUBMITTED'
      }
    });
    report('Payment persistence', !!payment?.id);
  } catch (e) { report('Payment persistence', false, e.message); }

  try {
    const fb = await prisma.feedback.create({ data: { paymentId: payment.id, rating: 5, comment: 'Smoke test feedback' } });
    report('Feedback persistence', !!fb?.id);
  } catch (e) { report('Feedback persistence', false, e.message); }

  try {
    const notif = await prisma.notification.create({
      data: { userId: user.id, title: 'Smoke Test', message: 'Smoke test notification', read: false }
    });
    report('Notification persistence', !!notif?.id);
  } catch (e) { report('Notification persistence', false, e.message); }

  try {
    await prisma.notification.deleteMany({ where: { userId: user.id } });
    await prisma.feedback.deleteMany({ where: { paymentId: payment?.id } });
    await prisma.payment.deleteMany({ where: { paymentRequestId: req?.id } });
    await prisma.paymentRequest.deleteMany({ where: { studentId: user.id } });
    await prisma.user.delete({ where: { id: user.id } });
    console.log('Cleanup: smoke test records deleted from Neon');
  } catch (e) { console.log('Cleanup warning:', e.message); }

  await prisma.$disconnect();
  await pool.end();

  console.log('\nResults: ' + pass + ' PASS, ' + fail + ' FAIL');
  process.exit(fail > 0 ? 1 : 0);
}

main().catch(e => { console.error('Fatal:', e.message); process.exit(1); });
