const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const UserModel = require('./models/User')

dotenv.config();

const PORT = process.env.PORT || 4000;
const MONGO_URL = process.env.MONGO_URL;
JWT_SECRET = process.env.JWT_SECRET;

mongoose.connect(MONGO_URL);

const app = express();

app.get('/test', (req,res) => {
  res.json('test ok');
})

app.post('/register', async (req,res) => {
  const {username,password} = req.body;
  const createdUser = await UserModel.create({username, password});
  jwt.sign({userId: createdUser._id}, JWT_SECRET, (error, token) => {
    if (error) throw error;
    res.cookie('token', token).status(201).json('ok')
  })
})

app.listen(PORT);