const express = require('express');
const app = express();
const http = require('http');
const WebSocket = require('ws');

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
  console.log("connected");

  ws.on('message', (message) => {
    console.log(`Received: ${message}`);
    
    try {
      // Parse the JSON string
      let receivedObject = JSON.parse(message);
      console.log('Parsed Object:', receivedObject);

      // Modify the object if needed
      receivedObject.position.z += 0;

      // Convert the object back to JSON
      let response = JSON.stringify(receivedObject);

      // Broadcast the message to all connected clients
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(response);
        }
      });
    } catch (error) {
      console.error('Error parsing message:', error);
      ws.send(JSON.stringify({ error: 'Invalid JSON' }));
    }
  });

  ws.send('Hello! Message From Server!!');
});

// Serve static files from 'public' directory
app.use(express.static('unity_build'));

const listener = server.listen(3000, () => {
  console.log('Your app is listening on port ' + listener.address().port);
});
