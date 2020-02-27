const express = require('express');
const cors = require('cors');
const app = express();
const knex = require('knex');
const bcrypt = require('bcrypt-nodejs');
const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');
// knex package for implementing pg db
const db = knex({
  	client: 'pg',
  	connection: {
	    connectionString: process.env.DATABASE_URL,
	    ssl: true
  	}});

app.use(cors())
app.use(express.urlencoded({extended: false}));
app.use(express.json());

app.get('/', (req,res) => {res.send('This is working!');})
app.get('/profile/:id', profile.handleProfile(db)); //profile route - currently no use, future profile page
app.post('/signin',signin.handleSignIn(db, bcrypt)); //sign in route - invoking handleSignIn method
app.post('/register',register.handleRegister(db, bcrypt)); //register route - invoking handleRegister method
app.put('/image',image.handleImage(db)); // image route - handeling user rank increment
app.post('/imageURL',image.handleAPICall()); // imageURL route - invoking clarifai api

app.listen(process.env.PORT || 8080 , () => {console.log(`App is running on port ${process.env.PORT}`);})


