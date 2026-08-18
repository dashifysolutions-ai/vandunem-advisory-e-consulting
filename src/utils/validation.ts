/**
 * Email validation utility
 * Validates against standard RFC 5322 format: user@domain.tld
 * Rejects invalid strings such as: "EDTHGFGFGFG", "teste", "abc@", "abc@abc"
 */
export function isValidEmail(email: string | null | undefined): boolean {
  if (!email || typeof email !== "string") return false;
  const trimmed = email.trim();
  if (trimmed.length < 5 || trimmed.length > 254) return false;
  
  // Strict standard email format: local-part@domain.tld (TLD min 2 chars)
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  
  if (!emailRegex.test(trimmed)) {
    return false;
  }

  // Ensure domain has at least one dot and a valid TLD
  const parts = trimmed.split("@");
  if (parts.length !== 2) return false;
  const domain = parts[1];
  const domainParts = domain.split(".");
  if (domainParts.length < 2) return false;
  const tld = domainParts[domainParts.length - 1];
  if (tld.length < 2) return false;

  return true;
}
