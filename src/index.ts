const express = require('express')
const dotenv = require('dotenv')
const app = express()
const port = 3000
const { connectDB } = require('./db/connectDB')
const { startErrorSyncJob } = require('./jobs/syncErrors')
const cookieParser = require('cookie-parser')
const path = require('path')

//routes
const recipeRoute = require('./routes/recipeRoute')

//middleware
const { authenticateCookie } = require('./middleware/authentication')
const { errorHandler } = require('./middleware/errorHandler')

dotenv.config()

//start connect to mongoDB
connectDB()
startErrorSyncJob()

app.use(express.static(path.join(__dirname, 'views')))
app.use(cookieParser())
app.use(express.json({ limit: '20mb' }))
app.use(express.urlencoded({ limit: '20mb', extended: true }))
app.use(authenticateCookie)

app.get('/favicon.ico', (_req: any, res: any) => res.sendStatus(204))

app.get('/', (req: any, res: any) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'))
})

app.use('/recipe', recipeRoute)

app.get('/test/trigger-error', () => {
  throw Object.assign(new Error('Deliberate test error'), { status: 500 })
})

app.use(errorHandler)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
