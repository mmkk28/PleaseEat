const mongoose = require('mongoose')
const dotenv = require('dotenv')

export const connectDB = async (): Promise<void> => {
  const mongoURI = process.env.MONGO_URL || ''

  if (!mongoURI) {
    throw new Error('MONGO_URL is not defined in environment variables')
  }

  try {
    await mongoose.connect(mongoURI)
    console.log('DB connected!')
  } catch (err) {
    console.error('Failed to connect to MongoDB', err)
    throw err
    process.exit(1)
  }
}
