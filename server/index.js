const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken');
const UserModel = require('./models/user')
const cors = require('cors')

dotenv.config();

const PORT = process.env.PORT || 4000;
const MONGO_URL = process.env.MONGO_URL;
JWT_SECRET = process.env.JWT_SECRET;

mongoose.connect(MONGO_URL).then(() => {
  app.listen(PORT, () => {
    console.log(`Server listening on PORT ${PORT}...`)
  })
}).catch((error) => {
  console.error('Failed to connect to MongoDB:', error)
});

const app = express();
app.use(cors({
  credentials: true,
  origin: process.env.CLIENT_URL
}))
app.use(express.json())
app.use(cookieParser())
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

app.post('/register', async (req,res) => {
  const {username,password} = req.body;
  try {
    const createdUser = await UserModel.create({username, password});
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
