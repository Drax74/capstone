import { CustomAuthorizerEvent, CustomAuthorizerResult } from 'aws-lambda'
import 'source-map-support/register'

import { verify, decode } from 'jsonwebtoken'
import { createLogger } from '../../utils/logger'
import Axios from 'axios'
import { Jwt } from '../../auth/Jwt'
import { JwtPayload } from '../../auth/JwtPayload'
import { certToPEM } from '../../utils/certToPem'

const logger = createLogger('auth')

// Provides a URL that can be used to download a certificate that can be used
// to verify JWT token signature.
const jwksUrl = process.env.AUTH0_JWKS_URL

export const handler = async (
  event: CustomAuthorizerEvent
): Promise<CustomAuthorizerResult> => {
  logger.info('Authorizing a user', event.authorizationToken)
  try {
    const jwtToken = await verifyToken(event.authorizationToken)
    logger.info('User was authorized', jwtToken)

    return {
      principalId: jwtToken.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    }
  } catch (e) {
    logger.error('User not authorized', { error: e.message })

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    }
  }
}

async function verifyToken(authHeader: string): Promise<JwtPayload> {
  const token = getToken(authHeader)
  const jwt: Jwt = decode(token, { complete: true }) as Jwt

  // Token verification
  // You can read more about this here: https://auth0.com/blog/navigating-rs256-and-jwks/
  if (!jwt) {
    throw new Error('invalid token')
  }

  try {
    const response = await Axios.get(jwksUrl)
    const jwks = response.data.keys
    const signingKeys = jwks
      .filter(
        key =>
          key.use === 'sig' && // JWK property `use` determines the JWK is for signature verification
          key.kty === 'RSA' && // We are only supporting RSA (RS256)
          key.kid && // The `kid` must be present to be useful for later
          ((key.x5c && key.x5c.length) || (key.n && key.e)) // Has useful public keys
      )
      .map(key => {
        return { kid: key.kid, nbf: key.nbf, publicKey: certToPEM(key.x5c[0]) }
      })

    if (!signingKeys.length) {
      throw new Error(
        'The JWKS endpoint did not contain any signature verification keys'
      )
    }

    const signingKey = signingKeys[0].publicKey

    return verify(token, signingKey, { algorithms: ['RS256'] }) as JwtPayload
  } catch (error) {
    throw new Error('Not able to verify token')
  }
}

function getToken(authHeader: string): string {
  if (!authHeader) throw new Error('No authentication header')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')

  const split = authHeader.split(' ')
  const token = split[1]

  return token
}
