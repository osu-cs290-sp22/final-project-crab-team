/*
Server-side shenanigans
*/

const express = require("express");
var path = require('path');
var fs = require('fs');
var hbs = require('express-handlebars');
//var fact_data = require(__dirname + '/crab_facts.json');
//var trivia_data = require(__dirname + '/trivia_questions.json');
var app = express();

//includes all our funky little css and js files
app.use(express.static(__dirname + '/public'));

var port = process.env.PORT || 3000;

app.set('view engine', 'handlebars');

app.engine('handlebars', hbs.engine({
	layoutsDir: path.join(__dirname, '/views/layouts'),
	extname: 'handlebars',
	defaultLayout: 'main',
	partialsDir: path.join(__dirname, '/views/partials')
}));

app.get('/', function (request, response)
{
	response.status(200).render('facts', {layout: 'main'});
});

app.get('/trivia', function (request, response, next)
{
	response.status(200).render('trivia', {layout: 'main'});
})

app.get('*', function (request, response) {
	response.status(404).render('404', {layout: 'main'});
});

app.listen(port, function () {
	console.log("Server is listening on port", port);
});