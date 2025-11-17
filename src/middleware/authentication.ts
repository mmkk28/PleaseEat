import { randomUUID } from 'crypto'

export const authenticateCookie = (req: any, res: any, next: any) => {
  const sessionToken = req.cookies.sessionToken

  if (!sessionToken && req.method !== 'GET') {
    return res
      .status(401)
      .json({ status: 'error', message: 'Unauthorized: No session token' })
  }

  if (!sessionToken) {
    const newToken = `PE${randomUUID}`
    res.cookies('sessionToken', newToken, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7
    })
    res.cookies.sessionToken = newToken
  } else {
    res.cookies.sessionToken = sessionToken
  }

  next()
}
