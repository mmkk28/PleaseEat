const mongoose = require('mongoose')
const dotenv = require('dotenv')

export const connectDB = async (): Promise<void> => {
  const mongoURL = process.env.MONGO_URL || ''

  if (!mongoURL) {
    throw new Error('MONGO_URL is not defined in environment variables')
  }

  try {
    await mongoose.connect(mongoURL)
    console.log('DB connected!')
  } catch (err) {
    console.error('Failed to connect to MongoDB', err)
    throw new Error('Failed to connect to MongoDB')
  }
}
