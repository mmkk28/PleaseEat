const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const app = express()
const port = 3000
const { connectDB } = require('./db/connectDB')

dotenv.config()

//start connect to mongoDB
connectDB()

// app.use(express.json({ limit: '20mb' }))
// app.use(express.urlencoded({ limit: '20mb', extended: true }))

app.get('/', (req: any, res: any) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
