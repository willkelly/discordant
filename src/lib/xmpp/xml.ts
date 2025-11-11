/**
 * XML Utilities for XMPP
 *
 * Provides XML parsing and building utilities using native Web APIs.
 *
 * In browser environments, uses the native DOMParser.
 * In Deno test environments, the tests import and configure xmldom separately.
 */

/**
 * Parse XML string to Document
 *
 * Security: Validates input to prevent XML entity expansion attacks and XSS.
 * XMPP stanzas should not contain DOCTYPE declarations or HTML elements.
 */
export function parseXML(xml: string): Document {
  // Security: Reject DOCTYPE declarations to prevent entity expansion attacks
  // XML entity expansion can cause denial of service by exponentially expanding entities
  if (/<!DOCTYPE/i.test(xml)) {
    throw new Error(
      'Security: DOCTYPE declarations not allowed in XMPP stanzas (prevents entity expansion attacks)',
    );
  }

  // Security: Reject dangerous HTML/script elements to prevent XSS
  // Note: XMPP legitimately uses <body> for message text, so we only block HTML-specific tags
  const dangerousPatterns = [
    /<script[\s>]/i, // <script> tags
    /<iframe[\s>]/i, // <iframe> tags
    /<object[\s>]/i, // <object> tags
    /<embed[\s>]/i, // <embed> tags
    /<form[\s>]/i, // <form> tags
    /<html[\s>]/i, // <html> tags
    /\son\w+\s*=/i, // event handlers like onclick=, onload=, etc.
  ];

  for (const pattern of dangerousPatterns) {
    if (pattern.test(xml)) {
      throw new Error(
        `Security: Potentially dangerous content detected in XML (prevents XSS)`,
      );
    }
  }

  // Use native DOMParser (available in browser, or polyfilled via globalThis in tests)
  const parser = new DOMParser();
  const doc = parser.parseFromString(xml, 'text/xml');

  // Check for parse errors - works with both browser DOMParser and xmldom
  if (doc.querySelector) {
    // Browser environment
    const parserError = doc.querySelector('parsererror');
    if (parserError) {
      throw new Error(`XML Parse Error: ${parserError.textContent}`);
    }
  } else {
    // xmldom environment - check for parsererror in the document element
    const docElement = doc.documentElement;
    if (docElement && docElement.tagName === 'parsererror') {
      throw new Error(`XML Parse Error: ${docElement.textContent}`);
    }
  }

  return doc;
}

/**
 * Build XML element
 */
export class XMLBuilder {
  private element: Element;

  constructor(name: string, attrs: Record<string, string> = {}) {
    const doc = document.implementation.createDocument(null, name, null);
    this.element = doc.documentElement;

    for (const [key, value] of Object.entries(attrs)) {
      this.element.setAttribute(key, value);
    }
  }

  /**
   * Add child element
   */
  c(name: string, attrs: Record<string, string> = {}): XMLBuilder {
    const child = this.element.ownerDocument!.createElement(name);
    for (const [key, value] of Object.entries(attrs)) {
      child.setAttribute(key, value);
    }
    this.element.appendChild(child);

    const builder = new XMLBuilder('temp');
    builder.element = child;
    return builder;
  }

  /**
   * Add text content
   */
  t(text: string): XMLBuilder {
    const textNode = this.element.ownerDocument!.createTextNode(text);
    this.element.appendChild(textNode);
    return this;
  }

  /**
   * Go up to parent
   */
  up(): XMLBuilder {
    const parent = this.element.parentElement;
    if (parent) {
      const builder = new XMLBuilder('temp');
      builder.element = parent;
      return builder;
    }
    return this;
  }

  /**
   * Convert to string
   */
  toString(): string {
    return new XMLSerializer().serializeToString(this.element);
  }

  /**
   * Get the root element
   */
  tree(): Element {
    let current = this.element;
    while (current.parentElement) {
      current = current.parentElement;
    }
    return current;
  }
}

/**
 * Create XML builder for common XMPP stanzas
 */
export function $msg(attrs: Record<string, string> = {}): XMLBuilder {
  return new XMLBuilder('message', attrs);
}

export function $pres(attrs: Record<string, string> = {}): XMLBuilder {
  return new XMLBuilder('presence', attrs);
}

export function $iq(attrs: Record<string, string> = {}): XMLBuilder {
  return new XMLBuilder('iq', attrs);
}

/**
 * Extract JID parts
 */
export function parseJIDString(jid: string): {
  local?: string;
  domain: string;
  resource?: string;
  bare: string;
  full: string;
} {
  const resourceMatch = jid.match(/^([^/]+)(?:\/(.+))?$/);
  const bareJid = resourceMatch?.[1] || jid;
  const resource = resourceMatch?.[2];

  const localMatch = bareJid.match(/^([^@]+)@(.+)$/);
  const local = localMatch?.[1];
  const domain = localMatch?.[2] || bareJid;

  return {
    local,
    domain,
    resource,
    bare: bareJid,
    full: jid,
  };
}

/**
 * Get bare JID from full JID
 */
export function getBareJid(jid: string): string {
  return jid.split('/')[0];
}

/**
 * Get resource from JID
 */
export function getResource(jid: string): string | undefined {
  const parts = jid.split('/');
  return parts.length > 1 ? parts[1] : undefined;
}

/**
 * Get domain from JID
 */
export function getDomain(jid: string): string {
  const bare = getBareJid(jid);
  const parts = bare.split('@');
  return parts.length > 1 ? parts[1] : parts[0];
}

/**
 * Get local part from JID
 */
export function getLocal(jid: string): string | undefined {
  const bare = getBareJid(jid);
  const parts = bare.split('@');
  return parts.length > 1 ? parts[0] : undefined;
}
