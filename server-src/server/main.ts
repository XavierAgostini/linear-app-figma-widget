const pathToEnv = process.env.NODE_ENV === 'production' ? '.env':  '../.env'
require('dotenv').config({ path: pathToEnv });

import axios from "axios";
import express from "express";
import ViteExpress from "vite-express";
import WebSocket from 'ws';
import { v4 } from 'uuid';

const uuidv4 = v4;

const app = express();

const server = ViteExpress.listen(app, 3000, () =>
  console.log("Server is listening on port 3000...")
);

// Initialize a new WebSocket server
const wss = new WebSocket.Server({ server });

// Map of connected clients
const clients = new Map<String, WebSocket>();

// WebSocket connection handler
wss.on('connection', (ws: any) => {
  // Generate a unique ID for this connection
  const connectionId = uuidv4();

  console.log(`New connection from ${connectionId}`);

  // Store the connection ID as a property on the WebSocket object
  ws.connectionId = connectionId;

  clients.set(connectionId, ws)
  ws.send(JSON.stringify({ type: 'connect', connectionId }))
  // gernate unique id for each connection and store mapping in clients object
 

  // WebSocket message handler
  ws.on('message', (message: any) => {
    console.log(`Received message: ${message}`);
  });

  // WebSocket close handler
  ws.on('close', () => {
    console.log(`Connection closed by ${ws?.connectionId}`);
    clients.delete(ws);
  });
});
const VALID_OAUTH_ORIGINS = ['5f73-2800-e2-b580-bee-c7d-8412-79ee-b6d3.ngrok.io', 'auth.virtualyam.com', 'linear.app']
app.get('/oauth/callback', async (req: any, res: any) => {
  try {
    const origin = req.get('host')
   
    // If someone tries to access this endpoint directly, redirect them to the oauth error page
    if (!VALID_OAUTH_ORIGINS.includes(origin)) {
      console.error("Invalid origin", origin)
      return res.status(400).redirect('/oauth/invalid')
    }
    const { code, state } = req.query;
    // If there is no code or state parameter in the query string, redirect to the oauth error page
    if (!code || !state) {
      console.error("No code or state parameter in query string")
      return res.status(400).redirect('/oauth/invalid')
    }
 
    // Exchange the code for an access token
    const oauthTokenResponse = await axios.post('https://api.linear.app/oauth/token', {
      client_id: process.env.VITE_LINEAR_CLIENT_ID,
      client_secret: process.env.VITE_LINEAR_CLIENT_SECRET,
      code: code,
      redirect_uri: process.env.VITE_LINEAR_REDIRECT_URI,
      grant_type: 'authorization_code'
    }, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    const accessToken = oauthTokenResponse.data.access_token;
    
    const client = clients.get(state)
    if (!client) {
      console.error("OauthTokenRepsonse.data.state does not match any current connectionIds")
      return res.status(400).redirect('/oauth/invalid')
    }
    client.send(JSON.stringify({ type: 'accessToken', accessToken }))
   
    return res.redirect('/oauth/redirect')
  } catch (error) {
    console.error("Error doing '/oauth/callback'", error);
    return res.status(500).redirect('/oauth/invalid')
  }
});