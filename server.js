const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const cors = require('cors')
const pharmacyRoutes = require('./controllers/pharmacy')
const itemRoutes = require('./controllers/item')

dotenv.config()

const app = express()

// Middleware
app.use(cors({ origin: 'http://localhost:5174' }))
app.use(express.json())

// Routes
app.use('/api/pharmacies', pharmacyRoutes)
app.use('/api/items', itemRoutes)

// Database Connection
mongoose.connect(process.env.MONGODB_URI)

mongoose.connection.on('connected', () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`)
})

// Start Server
app.listen(4000, () => console.log('Server running...'))
