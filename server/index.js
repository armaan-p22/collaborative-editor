const WebSocket = require('ws')
const http = require('http')
const { setupWSConnection } = require('y-websocket/bin/utils')

/* Basic HTTP server to check if service is running */
const server = http.createServer((request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/plain' })
  response.end('y-websocket server running')
})

/* WebSocket Server setup */
const wss = new WebSocket.Server({ server })

wss.on('connection', (conn, req) => {
  /* Extract document name from URL */
  const docName = req.url.slice(1).split('?')[0]
  
  /* Hand off connection to Yjs logic */
  setupWSConnection(conn, req, { docName })
})

/* Start listening */
const port = process.env.PORT || 1234
server.listen(port, () => {
  console.log(`Server running at 'localhost' on port ${port}`)
})