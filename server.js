/*
Server-side shenanigans
*/

const express = require("express");
var path = require('path');
var fs = require('fs');
var hbs = require('express-handlebars');
var fact_data = require(__dirname + '/crab_facts.json');
//var trivia_data = require(__dirname + '/trivia_questions.json');
var app = express();

//includes all our funky little css and js files
app.use(express.static(__dirname + '/public'));
app.use(express.json());

var port = process.env.PORT || 3000;

app.set('view engine', 'handlebars');

app.engine('handlebars', hbs.engine({
	layoutsDir: path.join(__dirname, '/views/layouts'),
	extname: 'handlebars',
	defaultLayout: 'main',
	partialsDir: path.join(__dirname, '/views/partials')
}));

app.post('/add', function (request, response, next) {
	console.log('post request recieved');
	console.log(request.body);
	if (request.body && request.body.title && request.body.text && request.body.author) {
		if (!request.body.tags) {
			fact_data.push({
				"title": request.body.title,
				"text": request.body.text,
				"author": request.body.author,
				"tags": null
			});
		}
		else {
			fact_data.push({
				"title": request.body.title,
				"text": request.body.text,
				"author": request.body.author,
				"tags": request.body.tags
			})
		}
		fs.writeFile(
			"./crab_facts.json",
			JSON.stringify(fact_data, null, 2),
			function (error) {
				if (!error) { response.status(200).send(); }
				else { response.status(500).send("server did not store file correctly"); }
			}
		);
	}
	else {
		response.status(400).send("Bad request :(");
	}
});

//Server's GET requests for pages
app.get('/', function (request, response) {
	response.status(200).render('facts', { layout: 'main', facts: fact_data });
});

app.get('/trivia', function (request, response, next) {
	response.status(200).render('trivia', { layout: 'main', start: false, win: true, lose: false });
});

app.get('/slide', function (request, response, next){
	response.status(200).render('slide', { layout: 'main', button: false });
});

app.get('/slide/:num', function (request, response, next){
	var number = request.params.num;
	if (number < 0 || number > 2) { next(); }
	var image = "/images/slide/crab" + number + ".jpg";
	//console.log(image);
	response.status(200).render('slide', { layout: 'main', button: true});
});

app.get('*', function (request, response) {
	response.status(404).render('404', { layout: 'main' });
});

app.listen(port, function () {
	console.log("Server is listening on port", port);
});