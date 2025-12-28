const authRoutes = require('./routes/auth')
const express = require('express')
const http = require('http')
const WebSocket = require('ws')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const cors = require('cors')
const { setupWSConnection } = require('y-websocket/bin/utils')
const documentRoutes = require('./routes/documents')

/* Configuration */
dotenv.config() // Load variables from .env file
const app = express()
const server = http.createServer(app)
const wss = new WebSocket.Server({ server })

/* Middleware */
app.use(cors()) // Allow requests from different ports (frontend)
app.use(express.json()) // Allow server to parse JSON bodies 

/* Routes */
app.use('/api/auth', authRoutes)
app.use('/api/documents', documentRoutes)

/* Basic Route to check if server is running */
app.get('/', (req, res) => {
  res.send('Collaborative Editor Server is Running')
})

/* Database Connection */
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB Atlas'))
  .catch((err) => console.error('❌ MongoDB Connection Error:', err))

wss.on('connection', (conn, req) => {
  /* Extract document name from URL */
  const docName = req.url.slice(1).split('?')[0]
  
  /* Hand off connection to Yjs logic */
  setupWSConnection(conn, req, { docName })
})

/* Start listening */
const PORT = process.env.PORT || 1234
server.listen(PORT, () => {
  console.log(`Server running at 'localhost' on port ${PORT}`)
})