const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const cors = require('cors')
const pharmacyRoutes = require('./controllers/pharmacy')
const itemRoutes = require('./controllers/item')
const authRouter = require('./controllers/auth')
const userRouter = require('./controllers/user')
const { verifyToken } = require('./middleware/jwtUtils')
dotenv.config()

const app = express()
app.use(express.static('public'))
app.use(cors({ origin: 'http://localhost:5173', credentials: true }))
app.use(express.json())

// Routes
app.use('/auth', authRouter)
app.use('/user', verifyToken, userRouter)
app.use('/pharmacy', pharmacyRoutes)
app.use('/item', verifyToken, itemRoutes)

// Database Connection
mongoose.connect(process.env.MONGODB_URI)

mongoose.connection.on('connected', () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`)
})

// Start Server
app.listen(4000, () => console.log('Server running...'))
