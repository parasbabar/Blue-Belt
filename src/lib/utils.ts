/**
 * Safely converts any error (Error instance, error object {code, message}, string, or unknown API error response)
 * into a human-readable string to prevent React runtime crash "Objects are not valid as a React child".
 */
export function formatErrorMessage(err: unknown, defaultMsg = "An unexpected error occurred. Please try again."): string {
  if (!err) return defaultMsg;

  if (typeof err === "string") {
    return err;
  }

  if (err instanceof Error) {
    return err.message;
  }

  if (typeof err === "object") {
    const obj = err as Record<string, any>;
    
    // Handles { code, message } e.g. from Freighter/Albedo wallet extension
    if (typeof obj.message === "string" && obj.message) {
      return obj.code !== undefined && obj.code !== null ? `[${obj.code}] ${obj.message}` : obj.message;
    }
    
    // Handles { error: "..." } or { error: { code, message } }
    if (typeof obj.error === "string" && obj.error) {
      return obj.error;
    }
    if (typeof obj.error === "object" && obj.error !== null) {
      if (typeof obj.error.message === "string" && obj.error.message) {
        return obj.error.code ? `[${obj.error.code}] ${obj.error.message}` : obj.error.message;
      }
    }

    if (typeof obj.detail === "string" && obj.detail) {
      return obj.detail;
    }

    try {
      const str = JSON.stringify(err);
      return str !== "{}" ? str : defaultMsg;
    } catch {
      return defaultMsg;
    }
  }

  return String(err);
}
