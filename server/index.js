const express = require('express');
const app = express();
require('dotenv').config();

const PORT = process.env.PORT || 4000;

console.log(PORT)

app.get('/test', (req,res) => {
  res.json('test ok');
})

app.post('/register', (req,res) => {

})

app.listen(PORT);