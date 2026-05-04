import { saveErrorLog } from '../db/functionHandler'
import { saveError } from '../utils/offlineErrorLogger'

const SENSITIVE_KEYS = ['password', 'token', 'secret', 'authorization']

function sanitizeBody(body: any) {
  if (!body || typeof body !== 'object') return body
  const sanitized = { ...body }
  for (const key of Object.keys(sanitized)) {
    if (SENSITIVE_KEYS.some((s) => key.toLowerCase().includes(s))) sanitized[key] = '[REDACTED]'
  }
  return sanitized
}

export const errorHandler = async (err: any, req: any, res: any, _next: any) => {
  const statusCode = err.status || 500

  // 1️⃣ DB First: Save ALL errors to MongoDB
  const errorData = {
    message: err.message,
    stack: err.stack,
    method: req.method,
    url: req.originalUrl,
    statusCode,
    body: sanitizeBody(req.body),
    user: req.user?.id || null,
    createdAt: new Date()
  }

  try {
    await saveErrorLog(errorData)
  } catch {
    // 2️⃣ Fallback: Save to offline file if DB is unavailable
    console.error('DB failure: saving error to offline log')
    try {
      await saveError(errorData)
    } catch (fileError) {
      console.error('Failed to save error to offline log:', fileError)
    }
  }

  res.status(statusCode).json({
    message:
      statusCode === 500
        ? 'Internal Server Error'
        : 'something went wrong, please try again later'
  })
}
