/**
 * Creates a public key.
 *
 * @param cert - an auth0 certificate
 */
export function certToPEM(cert) {
  cert = cert.match(/.{1,64}/g).join('\n')
  cert = `-----BEGIN CERTIFICATE-----\n${cert}\n-----END CERTIFICATE-----\n`
  return cert
}
