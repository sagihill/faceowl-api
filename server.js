const express = require('express');
const cors = require('cors');
const app = express();
const knex = require('knex');
const bcrypt = require('bcrypt-nodejs');
const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');
const db = knex({
  	client: 'pg',
  	connection: {
	    host : process.env.DATABASE_URL,
	    ssl: true
  	}});

app.use(cors())
app.use(express.urlencoded({extended: false}));
app.use(express.json());

app.get('/', (req,res) => {res.send('This is working!');})
app.post('/signin',signin.handleSignIn(db, bcrypt));
app.post('/register',register.handleRegister(db, bcrypt));
app.get('/profile/:id', profile.handleProfile(db));
app.put('/image',image.handleImage(db));
app.post('/imageURL',image.handleAPICall());

app.listen(process.env.PORT || 3000 , () => {console.log(`App is running on port ${process.env.PORT}`);})

