const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const app = express()
const port = 3000

dotenv.config()

//start connect to mongoDB
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log('DB connected!'))
  .catch((err: Error) => console.log(err))

app.use(express.json({ limit: '20mb' }))
app.use(express.urlencoded({ limit: '20mb', extended: true }))

app.get('/', (req: any, res: any) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
