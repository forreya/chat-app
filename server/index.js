const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken');
const UserModel = require('./models/user')
const cors = require('cors')
const bcrypt = require('bcryptjs')
const ws = require('ws')

dotenv.config();

const app = express();
app.use(cors({
  credentials: true,
  origin: process.env.CLIENT_URL
}))
app.use(express.json())
app.use(cookieParser())

const PORT = process.env.PORT || 4000;
const MONGO_URL = process.env.MONGO_URL;
const JWT_SECRET = process.env.JWT_SECRET;
const bcryptSalt = bcrypt.genSaltSync(10)

mongoose.connect(MONGO_URL).then(() => {
  const server = app.listen(PORT, () => {
    console.log(`Server listening on PORT ${PORT}...`)
  })
  const ws_server = new ws.WebSocketServer({server})
  ws_server.on('connection', (connection, req) => {

    // Read username and id from the cookie for this connection
    const cookies = req.headers.cookie
    if (cookies) {
      const tokenCookieString = cookies.split(';').find(str => str.startsWith('token='));
      if (tokenCookieString) {
        const token = tokenCookieString.split('=')[1];
        if (token) {
          jwt.verify(token, JWT_SECRET, {}, (error, userData) => {
            if (error) {
              connection.send('Error verifying token');
            }
            const {userId, username} = userData;
            connection.userId = userId;
            connection.username = username;
          })
        }
      }
    }

    connection.on('message', (message) => {
      const messageData = JSON.parse(message.toString());
      const {recipient, text} = messageData;
      if (recipient && text) {
        Array.from(ws_server.clients)
          .filter(client => client.userId === recipient)
          .forEach(client => client.send(JSON.stringify({text})));
      }
    })

    // Notify everyone about other online people
    Array.from(ws_server.clients).forEach(client => {
      client.send(JSON.stringify({
        online: [...ws_server.clients].map(client => ({userId:client.userId, username:client.username}))
      }
      ))
    })
  })
}).catch((error) => {
  console.error('Failed to connect to MongoDB:', error)
});

app.get('/test', (req,res) => {
  res.json('Test ok');
})

app.get('/profile', (req,res) => {
  const token = req.cookies?.token;
  if (token) {
    jwt.verify(token, JWT_SECRET, {}, (error, userData) => {
      if (error) {
        res.status(500).json('Error verifying token')
      }
      res.json(userData)
    })
  } else {
    res.status(401).json('No token found')
  }
})

app.post('/login', async (req,res) => {
  const {username, password} = req.body;
  const foundUser = await UserModel.findOne({username});
  if (foundUser) {
    const passwordMatch = bcrypt.compareSync(password, foundUser.password)
    if (passwordMatch) {
      jwt.sign({userId: foundUser._id, username}, JWT_SECRET, {}, (error, token) => {
        res.cookie('token', token, {sameSite:'none', secure: true}).json({
          id: foundUser._id,
        })
      })
    }
  } 
})

app.post('/register', async (req,res) => {
  const {username,password} = req.body;
  try {
    const hashedPassword = bcrypt.hashSync(password, bcryptSalt)
    const createdUser = await UserModel.create({
      username: username, 
      password: hashedPassword,
    });
    jwt.sign({userId: createdUser._id, username}, JWT_SECRET, {}, (error, token) => {
      if (error) {
        res.status(500).json('Error signing token')
      }
      res.cookie('token', token, {sameSite:'none', secure: true}).status(201).json({
        id: createdUser._id,
      })
    })
  } catch(error) {
    res.status(500).json('Error creating user')
  }
})
