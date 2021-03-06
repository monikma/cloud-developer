import { verify } from 'jsonwebtoken'

import { CustomAuthorizerEvent, CustomAuthorizerResult } from 'aws-lambda'
import 'source-map-support/register'
import { JwtToken } from './../../auth/JwtToken'

export const handler = async (event: CustomAuthorizerEvent): Promise<CustomAuthorizerResult> => {

  const token = event.authorizationToken
  const decodedToken = verifyToken(token);

  return {
     principalId: decodedToken.sub, // the user id
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
 }

function verifyToken(authHeader: string): JwtToken{
    // handle missing header / wrong format
    const split = authHeader.split(' ')
    const token = split[1]
    return verify(
        token,           // Token from an HTTP header to validate
        `-----BEGIN CERTIFICATE-----
MIIDDTCCAfWgAwIBAgIJeGCdq930MlVLMA0GCSqGSIb3DQEBCwUAMCQxIjAgBgNV
BAMTGWRldi03Z2t0NjZ0NS5ldS5hdXRoMC5jb20wHhcNMjAxMDEwMTM0MDIyWhcN
MzQwNjE5MTM0MDIyWjAkMSIwIAYDVQQDExlkZXYtN2drdDY2dDUuZXUuYXV0aDAu
Y29tMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAxtIclgPjIrk15Rbq
dWtUUSTz9KeyVoXbv+Zc+0Kotb23kx+Zqpc8ws9B47b24t1TVb1gzhESbubLeLQ7
T0PnIrGHQGCUWGoqEVFzV66ESqVYKXy9kth6YqPpgGtqUNYTCj3D1pgwjh2M2wx0
Rl6IdWtm12O2MCb8GzmpVkKcEVGNoetIPNtQ7GRorEmwvsrDTuMVap/qs7ezT5Ar
gTKUOUOdWHRjbfuSBqs4ZBMtyHI22jbY5epMJLrdgYU385LhoypCl6Wu+xXoGn63
pqJyaNyvpcdt1Qndc6TE3GdzjTLkc8cJt+6+xrLsrEUQbmLXjeilczATmyqsYlIT
mvKkYQIDAQABo0IwQDAPBgNVHRMBAf8EBTADAQH/MB0GA1UdDgQWBBQLwAJNmdlQ
DOxgCe+RdFO02v8jaDAOBgNVHQ8BAf8EBAMCAoQwDQYJKoZIhvcNAQELBQADggEB
ACGizVQEPS/ZC9ReiCHZXk06fY4Lx21iqFdWtWKcv0WEBlUtHfQnRMBH/niQMAcL
FUWDQp1oH/awSOnE6Sr6kKrnDVDdGy0FHJ0lfC0z9eZ6/ND16mXPt4IIq/HXzEOy
p0rTKYHnSOn+weYyl86UzgTgHcF/lnO63MkOpl8cWnD2zSGgiK0skITSnq6s5cFb
oXTS55wj+b6fP66h+4zbS0lm2PWU6zR6XLw3gQ6e8i9TcjDVfw9YVG60eJAIK1G8
ZRYFAi/cRsiTyyW3e+nNWSFcTQK19TGvtRL5NyA+jNLutj864M2PnrkMHCuPnnnM
7I9Bio/MJBDjhimkpjN4abA=
-----END CERTIFICATE-----`,   // A certificate copied from Auth0 website
        { algorithms: ['RS256'] } // We need to specify that we use the RS256 algorithm
    ) as JwtToken
}