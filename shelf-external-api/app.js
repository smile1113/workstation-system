const express = require('express')
const cors = require('cors')
const dataRouter = require('./router/data')

const app = express()
app.use((err, req, res, next) => {
    res.send({
      message: err instanceof Error ? err.message : err
    })
  next()
})
app.use(cors())
app.use(express.json())
// app.use(express.urlencoded({ extended: false }))

app.use('/api', dataRouter)

app.listen(3009, () => {
  console.log("http://127.0.0.1:3009");
})