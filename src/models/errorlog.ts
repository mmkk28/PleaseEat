import mongoose from 'mongoose'

const errorSchema = new mongoose.Schema({
  localId: { type: String, unique: true, sparse: true },
  message: { type: String, required: true },
  stack: String,
  method: String,
  url: String,
  statusCode: Number,
  user: String,
  createdAt: { type: Date, default: Date.now }
})

export default mongoose.model('ErrorLog', errorSchema)
