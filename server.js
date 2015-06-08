var express = require('express');
var jwt = require('jwt-simple');
var app = express();

var _ = require('lodash');
var bcrypt = require('bcrypt');

var User = require('./user');

app.use(require('body-parser').json());


var secretkey = 'mysecretkey'; //Change this
var users = [{username: 'tomi' , password: '$2a$10$C503Ai1d7CDQ8mvLSYhqsOcPLvZCezEu85ZfwpHsFLYvD4oVTvtAW'}]; //Bcrypt hash of a password - use code from the snippets folder to test

function findUserByUsername (username) {
	return _.find(users, {username: username});
}

function validateUser (user, password, callback) {
	bcrypt.compare(password, user.password, callback);
	//return user.password === password;
}


app.post('/session', function (request, response, next) {
	User.findOne({username: request.body.username})
		.select('password')
		.exec(function (error, user) {
		if (error) { return next(error) }
		if (!user) {
			response.status(401);
			return response.send('Authentication unsuccessful');
		}
		bcrypt.compare(request.body.password, user.password, function (error, valid) {
			if (error) { return next(error) };
			if (!valid) {
				response.status(401);
				return response.send('Authentication unsuccessful');
			}

			var token = jwt.encode({username: user.username}, secretkey);
			response.json(token);
		})
	})
})

app.post('/user', function (request, response, next) {
	console.log("foo");
	var user = new User({username: request.body.username});
	bcrypt.hash(request.body.password, 10, function(error, hash) {
		user.password = hash;
		user.save(function (error, user) {
			if (error) {
				throw next(error);
			}
			response.status(201);
			response.send("User: " + request.body.username + " created");
		})
	})
})

app.get('/user', function (request, response) {
	var token = request.headers['x-auth'];
	var user = jwt.decode(token, secretkey);
	
	//Get user info from database here
	User.findOne({username: user.username}, function (error, user) {
		response.json(user);
	})
})

app.listen(3000);