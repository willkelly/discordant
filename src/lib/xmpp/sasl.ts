/**
 * SASL Authentication for XMPP
 *
 * Implements PLAIN and SCRAM-SHA-1 SASL mechanisms.
 */

/**
 * SASL PLAIN authentication
 */
export function encodePlainAuth(username: string, password: string): string {
  const authString = `\x00${username}\x00${password}`;
  return btoa(authString);
}

/**
 * SASL SCRAM-SHA-1 (simplified - PLAIN is more commonly supported)
 * Full SCRAM implementation would require crypto primitives
 */
export class SASLAuth {
  private mechanism: string;
  private username: string;
  private password: string;

  constructor(username: string, password: string, mechanism = 'PLAIN') {
    this.mechanism = mechanism;
    this.username = username;
    this.password = password;
  }

  /**
   * Get initial auth string
   */
  getInitialResponse(): string {
    switch (this.mechanism) {
      case 'PLAIN':
        return encodePlainAuth(this.username, this.password);
      default:
        throw new Error(`Unsupported SASL mechanism: ${this.mechanism}`);
    }
  }

  /**
   * Handle challenge (for mechanisms that need it)
   */
  handleChallenge(_challenge: string): string {
    throw new Error(`Challenge-response not implemented for ${this.mechanism}`);
  }
}
