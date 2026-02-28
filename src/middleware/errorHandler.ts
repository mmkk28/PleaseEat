const logger = require('./config/logger')
const ErrorLog = require('./models/ErrorLog')

export const errorHandler = async (err: any, req: any, res: any, next: any) => {
  const statusCode = err.status || 500

  // 1️⃣ Log to file
  logger.error({
    message: err.message,
    stack: err.stack,
    method: req.method,
    url: req.originalUrl,
    statusCode
  })

  // 2️⃣ Save only serious errors to DB
  if (statusCode >= 500) {
    try {
      await ErrorLog.create({
        message: err.message,
        stack: err.stack,
        method: req.method,
        url: req.originalUrl,
        statusCode,
        user: req.user?.id || null
      })
    } catch (dbError) {
      logger.error(dbError) // log DB failure
    }
  }

  res.status(statusCode).json({
    message: statusCode === 500 ? 'Internal Server Error' : err.message
  })
  next()
}
