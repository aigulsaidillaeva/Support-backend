const express = require('express')
const app = express()
const supportRoutes = require('./routes/supportRoutes')
require('dotenv').config()
const cors = require('cors')

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/uploads', express.static('uploads'))

app.use('/api', supportRoutes)

const PORT = process.env.PORT || 4000
app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`)
})
