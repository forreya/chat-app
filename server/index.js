const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();

const PORT = process.env.PORT || 4000;
const MONGO_URL = process.env.MONGO_URL;

mongoose.connect(MONGO_URL);

const app = express();

app.get('/test', (req,res) => {
  res.json('test ok');
})

app.post('/register', (req,res) => {

})

app.listen(PORT);