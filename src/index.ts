const express = require('express')
const dotenv = require('dotenv')
const app = express()
const port = 3000
const { connectDB } = require('./db/connectDB')
const cookieParser = require('cookie-parser')
const path = require('path')

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
  res.sendFile(path.join(__dirname, 'views', 'index.html'))
})

app.use('/recipe', recipeRoute)

// JUST TO SEE IT ON THE SAME SCREEN -
app.use('/register', (req, res, next) => {
  try {
    // log request
    // req.body -> schema validation ({ email, first name, last name, date of birth, title })
    // return if false
    // log error
    // throw new Error()
    // validate the email address (regexp)
    // return if false
    // log error
    // check if this email already exists in the db
    // return if so
    // log error
    // insert user details into db
    // send an email to the user (welcome message)
    // log the response of sending an email - so you know if the email was sent
    // return [message]
  } catch (error) {
    // and if it fails:
    next({
      functionName: 'getUsers()',
      message: 'faild to connect to the db',
      staus: 401,
      error,
    })
  }
})

app.use((error, req, res) => {
  console.log(error) // { functionName, message, error }

  /*
    HOW TO HANDLE THE ERRORS

    1.) -> INSERT INTO THE DB - STRAIGHT AWAY
      PUSHBACK -> WHAT IF THE DB IS DOWN ???? WOULD THAT BE A "LOOP" - CONSTANTLY TRYING TO ACCESS THE DB AND WRITE IN? (MEMORY LEAK??)

    2.) -> POST/STREAM IT TO A 3RD PARTY - LIKE GRAFANA
      PUSHBACK -> WHAT IF THE 3RD PARTY IS DOWN?????

    ----

    CAN YOU DO JUST CONSOLE.LOG()????
      - TECHNICALLY.. YOU CAN... IS GOOD? FLEXIBLE? EASY TO HANDLE??? ---> NOT SURE

    WHAT ELSE CAN WE DO? 🤔
      - LOGGING INTO FILE???
        PUSHBACK -> HOW BIG A FILE CAN GET? ... THINK ABOUT FILENAME... (TIMESTAMP???) -> WHAT IF THE FILE IS CALLED AS log_YYYYMMDDHHMM.log ??
                        -> NOW - HOW BIT THE FILE WOULD BE? -> NOT THAT BIG... AS WE HAVE LOGS ON A "PER MINUTE" BASIS...
                -> HOW TO TRACK?
                    -> OK.. SO HOW TO TRACK IT?
          
          SO WE COLLECT THE LOGS IN LOG-FILES... EACH FILE HAS A NAME OF THE MINUTE WHEN IT WAS CREATED...
          THEN PERIODICALLY WE READ THE CONTENT OF THESE FILES AND UPLOAD THEM INTO EITHER A DB OR A 3RD PARTY.... (HANDLING THE ERRORS OF THAT PROCESS SEPARETLY..)
          THEN IF THE 'UPLOAD' WAS SUCCESSFUL.... WE DELETE THOSE FILES IMMEDIATELY...
  */

  res.status(error.status || 500).json({ message: error.message || 'internal server error' })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
