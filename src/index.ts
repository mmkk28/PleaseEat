const express = require('express')
const dotenv = require('dotenv')
const app = express()
const port = 3000
const { connectDB } = require('./db/connectDB')
const cookieParser = require('cookie-parser')

//routes
const recipeRoute = require('./routes/recipeRoute')

//middleware
const { authenticateCookie } = require('./middleware/authentication')

dotenv.config()

//start connect to mongoDB
connectDB()

app.use(cookieParser())
app.use(express.json({ limit: '20mb' }))
app.use(express.urlencoded({ limit: '20mb', extended: true }))
app.use(authenticateCookie)

app.get('/', (req: any, res: any) => {
  res.send(/*html*/ `
    <html>
      <header><title>PleaseEat API</title></header>
      <body>
      <h1>PleaseEat API is running</h1>
      </body>
    </html>
    `)
})

app.use('/recipe', recipeRoute)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
