import {
  Horizon,
  Asset,
  Operation,
  TransactionBuilder,
  BASE_FEE,
  StrKey,
} from "@stellar/stellar-sdk";
import { rpc as SorobanRpc } from "@stellar/stellar-sdk";
import { env } from "./env";

export const STELLAR_NETWORK = env.NEXT_PUBLIC_STELLAR_NETWORK;
export const STELLAR_NETWORK_PASSPHRASE = env.NEXT_PUBLIC_STELLAR_NETWORK_PASSPHRASE; // "Test SDF Network ; September 2015"
export const HORIZON_URL = env.NEXT_PUBLIC_STELLAR_HORIZON_URL;
export const SOROBAN_RPC_URL = env.NEXT_PUBLIC_STELLAR_RPC_URL;
export const EXPLORER_TX_URL = "https://stellar.expert/explorer/testnet/tx";
export const FRIENDBOT_URL = "https://friendbot.stellar.org";

export const CONTRACT_ID = env.NEXT_PUBLIC_SOROBAN_CONTRACT_ID;

export const horizonServer = new Horizon.Server(HORIZON_URL);
export const rpcServer = new SorobanRpc.Server(SOROBAN_RPC_URL);

/**
 * Validates a Stellar address (G... format only, not contract addresses)
 */
export function isValidStellarAddress(address: string): boolean {
  if (!address) return false;
  try {
    return StrKey.isValidEd25519PublicKey(address);
  } catch {
    return false;
  }
}

/**
 * Gets account information from Horizon
 */
export async function getAccountInfo(address: string) {
  try {
    const account = await horizonServer.loadAccount(address);
    return { success: true, account };
  } catch (err: unknown) {
    const e = err as { response?: { status?: number } };
    if (e?.response?.status === 404) {
      return { success: false, error: "Account not found. Please fund your testnet account via Friendbot." };
    }
    return { success: false, error: "Failed to load account from Stellar network." };
  }
}

/**
 * Returns a short wallet address for display (G...XXXX format)
 */
export function shortenAddress(address: string, start = 4, end = 4): string {
  if (!address) return "";
  return `${address.slice(0, start + 1)}...${address.slice(-end)}`;
}

/**
 * Prepares an XLM native payment transaction (non-contract, for simple XLM transfers).
 * Returns the XDR string to be signed by the user's wallet.
 */
export async function prepareXLMPaymentTransaction(
  senderAddress: string,
  recipientAddress: string,
  amount: string
): Promise<{ xdr: string; error?: undefined } | { error: string; xdr?: undefined }> {
  try {
    const account = await horizonServer.loadAccount(senderAddress);
    const transaction = new TransactionBuilder(account, {
      fee: BASE_FEE,
      networkPassphrase: STELLAR_NETWORK,
    })
      .addOperation(
        Operation.payment({
          destination: recipientAddress,
          asset: Asset.native(),
          amount: amount,
        })
      )
      .setTimeout(180)
      .build();

    return { xdr: transaction.toXDR() };
  } catch (err: unknown) {
    const e = err as { message?: string };
    const msg = e?.message || "Failed to prepare transaction.";
    if (msg.includes("not found")) {
      return { error: "Sender account not found on testnet. Please fund via Friendbot." };
    }
    return { error: msg };
  }
}

/**
 * Verifies a submitted Stellar transaction on Horizon (TESTNET).
 * Returns full verification result for the backend to validate.
 */
export async function verifyTransaction(txHash: string): Promise<{
  valid: boolean;
  sender?: string;
  recipient?: string;
  amount?: string;
  asset?: string;
  error?: string;
}> {
  try {
    const tx = await horizonServer.transactions().transaction(txHash).call();

    if (!tx.successful) {
      return { valid: false, error: "Transaction was not successful on-chain." };
    }

    // Fetch operations for this transaction
    const ops = await horizonServer
      .operations()
      .forTransaction(txHash)
      .call();

    type PaymentRecord = {
      type: string;
      to?: string;
      account?: string;
      amount?: string;
      starting_balance?: string;
      asset_type?: string;
      asset_code?: string;
      asset_issuer?: string;
    };

    const paymentOp = ops.records.find(
      (op: { type: string }) => op.type === "payment" || op.type === "create_account"
    ) as PaymentRecord | undefined;

    if (!paymentOp) {
      return { valid: false, error: "No payment operation found in transaction." };
    }

    return {
      valid: true,
      sender: tx.source_account,
      recipient: paymentOp.to || paymentOp.account,
      amount: paymentOp.amount || paymentOp.starting_balance,
      asset: paymentOp.asset_type === "native" ? "XLM" : `${paymentOp.asset_code}:${paymentOp.asset_issuer}`,
    };
  } catch (err: unknown) {
    const e = err as { response?: { status?: number }; message?: string };
    if (e?.response?.status === 404) {
      return { valid: false, error: "Transaction not found on testnet." };
    }
    return { valid: false, error: e?.message || "Verification failed." };
  }
}
