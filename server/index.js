const WebSocket = require('ws')
const http = require('http')
const { setupWSConnection } = require('y-websocket/bin/utils')

const server = http.createServer((request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/plain' })
  response.end('y-websocket server running')
})

const wss = new WebSocket.Server({ server })

wss.on('connection', (conn, req, { request } = {}) => {
  setupWSConnection(conn, req, { docName: req.url.slice(1).split('?')[0] })
})

const port = process.env.PORT || 1234
server.listen(port, () => {
  console.log(`WebSocket server running at 'localhost' on port ${port}`)
})