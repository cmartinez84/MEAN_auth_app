const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const mongoose = require('mongoose');
const config = require('./config/database');
// const router = require('router');

const users = require('./routes/users');

const app = express();

const port = 3000;

mongoose.connect('mongodb://localhost:27017/meanauth', {useMongoClient: true});

mongoose.connection.on('connected', ()=>{
  console.log('connected to db' + config.database) ;
})

mongoose.connection.on('error', (err)=>{
  console.log( err) ;
})
//any domain can access this api
app.use(cors());

app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json());

app.use('/users', users);

app.get('/', (req, res)=>{
  res.send('invalid')
})
app.listen(port, ()=>{
  console.log('server started');
})
