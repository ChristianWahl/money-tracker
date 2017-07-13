import { WebAuth } from 'auth0-js'
/**
 * @see https://auth0.com/docs/connections/passwordless/spa-email-code/v8
 */
const auth0 = new WebAuth({
  domain: process.env.REACT_APP_AUTH_DOMAIN,
  clientID: process.env.REACT_APP_AUTH_CLIENT_ID,
  redirectUri: process.env.REACT_APP_AUTH_REDIRECT,
  responseType: 'token'
})

export async function sendAuthCode(email) {
  return new Promise((resolve, reject) => {
    auth0.passwordlessStart(
      {
        connection: 'email',
        send: 'code',
        email
      },
      (error, result) => (error ? reject(error) : resolve(result))
    )
  })
}

export async function verifyAuthCode(email, verificationCode) {
  return new Promise((resolve, reject) => {
    auth0.passwordlessVerify(
      {
        connection: 'email',
        email,
        verificationCode
      },
      (error, result) => (error ? reject(error) : resolve(result))
    )
  })
}

export async function parseHash(hash) {
  return new Promise((resolve, reject) => {
    auth0.parseHash(hash, (error, authResult) => {
      if (error) return reject(error)
      auth0.client.userInfo(authResult.accessToken, (error, userInfo) => {
        if (error) return reject(error)
        resolve({ ...authResult, ...userInfo })
      })
    })
  })
}
