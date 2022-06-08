//insert client-side javascript here

const post_url = window.location.protocol + '/add';
var url = window.location.pathname.split('/');

function add_fact(title, text, author, tags) {
	if (!validate()) { return; }

	var tags_array = tags.split(', ');
	tags_array = create_tags(tags_array);

	var new_fact = {
		title: title,
		text: text,
		author: author,
		tags: tags_array
	};

	unhide_modal();

	post('/add', new_fact)
		.then(data => {
			console.log(data);
		});

	//console.log(new_fact);

	unhide_modal();
}

async function post(url, data) {
	console.log(data);
	const response = await fetch(url, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(data)
	});
	return response.json();
}

function create_tags(tags) {
	var hash = "#";
	for (var tag = 0; tag < tags.length; tag++) { tags[tag] = hash.concat(tags[tag]); }
	return tags;
}

function unhide_modal() {
	var modal = document.getElementById("add-fact-modal");
	var backdrop = document.getElementById("modal-backdrop");
	if (modal.style.display === "none" && backdrop.style.display === "none") {
		modal.style.display = "block";
		backdrop.style.display = "block";
	}
	else {
		modal.style.display = "none";
		backdrop.style.display = "none";

		document.getElementById('fact-text-input').value = '';
		document.getElementById("fact-author-input").value = '';
		document.getElementById('fact-title-input').value = '';
		document.getElementById('fact-tag-input').value = '';
	}
}


//sends alert if an input field in the fact form is empty
function validate() {
	var title = document.getElementById('fact-title-input').value;
	var content = document.getElementById('fact-text-input').value;
	var author = document.getElementById("fact-author-input").value;
	if (content === '') {
		alert("Content field is empty");
		return false;
	}
	else if (author === '') {
		alert("Author field is empty");
		return false;
	}
	else if (title === '') {
		alert("You must provide a valid title");
		return false;
	}
	else { return true; }
}

if (url[1] == 'trivia' || url[1] == 'slide' || url[1] == 'memory') {
	unhide_modal();
	//on button click, open and close the fact creator
	document.getElementsByClassName("add-fact-button")[0].addEventListener("click", unhide_modal);

	var close = document.querySelector('.modal-close-button');
	var cancel = document.querySelector('.modal-cancel-button');

	close.onclick = unhide_modal;
	cancel.onclick = unhide_modal;

	//on button click, create a new fact
	var container = document.querySelector('.crab-container');
	var create = document.querySelector('.modal-accept-button');

	create.addEventListener("click", function () {
		console.log("hi");
		add_fact(document.getElementById('fact-title-input').value,
			document.getElementById('fact-text-input').value,
			document.getElementById("fact-author-input").value,
			document.getElementById('fact-tag-input').value);
		unhide_modal();
	});
}

/****************************************************
MEMORY GAME
*****************************************************/
function flip_card() {
	if (lock) { return; }

	this.classList.add('flip');
	var front = this.querySelector('.front-face');
	var back = this.querySelector('.back-face');
	front.classList.remove('hide');
	back.classList.add('hide');

	if (!flipped) {
		flipped = true;
		card1 = this;
		return;
	}

	card2 = this;
	flipped = false;
	match();

}

function unflip_cards() {
	lock = true;
	setTimeout(() => {
		card1.classList.remove('flip');
		card1.querySelector('.front-face').classList.add('hide');
		card1.querySelector('.back-face').classList.remove('hide');
		card2.classList.remove('flip');
		card2.querySelector('.front-face').classList.add('hide');
		card2.querySelector('.back-face').classList.remove('hide');
	}, 500);
	lock = false;
}

function match() {
	var front1 = card1.querySelector('.front-face').src;
	var front2 = card2.querySelector('.front-face').src;
	if (front1 === front2) {
		disable_cards();
		if (counter == 12) { display_win(); }
		return;
	}
	unflip_cards();
}

function disable_cards() {
	card1.removeEventListener('click', flip_card);
	card2.removeEventListener('click', flip_card);
	counter += 2;
}

function display_win() {
	console.log("yay");
	var win_screen = document.getElementById('win');
	win_screen.classList.remove('hide');
}

if (url[1] == 'memory') {
	var flipped = false;
	let card1, card2;
	var counter = 0;
	var lock = false;

	const cards = document.querySelectorAll('.memory-card')
	cards.forEach(card => {
		let ramdomPos = Math.floor(Math.random() * 12);
		card.style.order = ramdomPos;
	});
	cards.forEach(card => card.addEventListener('click', flip_card));
}

if (url[1] == '') {
	var facts = document.getElementsByClassName('fact-text');
    var authors = document.getElementsByClassName('fact-author');
	var tags = document.getElementsByClassName('tag-text');
	var search = document.getElementById('nav-search-input');

	search.addEventListener('input', function () {
		var usertext = document.getElementById('nav-search-input').value;
		var searchtext = usertext.toLowerCase();
        //if text is not found within the fact text, author, or tags
		var nodes = document.getElementsByClassName('crab-fact');
		var facts = document.getElementsByClassName('fact-text');
		var authors = document.getElementsByClassName('fact-author');
		var tags = document.getElementsByClassName('tag-text');

        for (i = nodes.length - 1; i >= 0; i--) {
			//lowercase the text from the current twit and the current twit author
			var nodeText = facts[i].textContent.toLowerCase();
			var author = authors[i].textContent.toLowerCase();
			var tagset = tags[i].textContent.toLowerCase();

			//if text is not found within the twit text or the twit author
			if (!nodeText.includes(searchtext) && !author.includes(searchtext) && !tagset.includes(searchtext)) {
				nodes[i].classList.add('hide');
			}
			if (nodeText.includes(searchtext) || author.includes(searchtext) || tagset.includes(searchtext)) {
				nodes[i].classList.remove('hide');
			}
		}
	})

	  
}

/****************************************************
SLIDE PUZZLE
*****************************************************/
function click_tile(row, col) {
	var cell = document.getElementById("cell" + row + col);
	var tile = cell.className;

	if (tile != "tile9") //if not empty tile
	{
		if (col < 3) //if empty tile to the right
		{
			if (document.getElementById("cell" + row + (col + 1)).className === "tile9") {
				swap("cell" + row + col, "cell" + row + (col + 1));
				return checkWin();
			}
		}

		if (col > 1) //if empty tile to the left
		{
			if (document.getElementById("cell" + row + (col - 1)).className === "tile9") {
				swap("cell" + row + col, "cell" + row + (col - 1));
				validClick = true;
				return checkWin();
			}
		}

		if (row > 1) //if empty tile above
		{
			if (document.getElementById("cell" + (row - 1) + col).className === "tile9") {
				swap("cell" + row + col, "cell" + (row - 1) + col);
				return checkWin();
			}
		}

		if (row < 3) //if empty tile below
		{
			if (document.getElementById("cell" + (row + 1) + col).className === "tile9") {
				swap("cell" + row + col, "cell" + (row + 1) + col);
				return checkWin();
			}
		}
	}
	return false;
}

function solvable() {
	var inversions = getInversions();
	if (inversions % 2 === 0)
		return true;
	return false;
}

function checkWin() {
	var inversions = getInversions();
	var lastCell = document.getElementById('cell33');
	if (inversions == 0 && lastCell.classList[0] == 'tile9')
		return true;
	return false;
}

function getInversions() {
	var tiles = document.getElementsByClassName('tiles');
	var order = [];
	for (let i = 0; i < tiles.length; i++) {
		var square = tiles[i].classList[0];
		var num = square[4];
		order.push(num);
	}
	console.log("Order: ", order);
	var inversions = 0;
	for (let i = 0; i < order.length; i++) {
		for (let x = i + 1; x < order.length; x++) {
			if (order[i] > order[x])
				inversions = inversions + 1;
		}
	}
	return inversions;
}

function swap(cell1, cell2) {
	var temp = document.getElementById(cell1).className;
	var temp1 = document.getElementById(cell1).textContent;
	document.getElementById(cell1).className = document.getElementById(cell2).className;
	document.getElementById(cell1).textContent = document.getElementById(cell2).textContent;
	document.getElementById(cell2).className = temp;
	document.getElementById(cell2).textContent = temp1;
}

function shuffle() {
	do {
		for (var row = 1; row <= 3; row++) {
			for (var col = 1; col <= 3; col++) {
				var row2 = Math.floor(Math.random() * 3 + 1); //Pick a random row from 1 to 3
				var col2 = Math.floor(Math.random() * 3 + 1); //Pick a random column from 1 to 3

				swap("cell" + row + col, "cell" + row2 + col2); //Swap the look & feel of both cells
			}
		}
		var solve = solvable();
	} while (solve === false);
}

function displaySolved(whichImg) {
	var missingPiece = document.getElementById('cell33');
	var classToAdd = 'solved' + whichImg;
	missingPiece.classList.add(classToAdd);
	var gameMessage = document.getElementById('game-play-message');
	gameMessage.classList.add('hide');
	var winMessage = document.getElementById('solved-message');
	winMessage.classList.remove('hide');
	var gameButtons = document.getElementById('game-play-buttons');
	var winButtons = document.getElementById('puzzle-solved-buttons');
	gameButtons.classList.add('hide');
	winButtons.classList.remove('hide');
	var t = document.getElementById('table');
	console.log(t)
	t.classList.add('winborder');
	t.classList.remove('unsolved-border');
	var addFact = document.getElementsByClassName('add-fact-button')[0];
	addFact.classList.add("solved-add-fact");
	hideNumbers();
}

function hideNumbers() {
	var tiles = document.getElementsByClassName('tiles');
	for (let i = 0; i < tiles.length; i++) {
		tiles[i].classList.add('no-numbers');
		tiles[i].classList.remove('show-numbers');
	}
}

if (url[1] == "slide") {
	var tiles = [];
	var whichPic = 0;

	if (url[2] == 1) {
		whichPic = 1;
		tiles = document.getElementsByClassName('tiles');
		console.log(tiles);
		Array.from(tiles).forEach(function (tile) {
			tile.classList.add('tiles2');
			console.log(tile.className);
		});
	}
	else if (url[2] == 2) {
		whichPic = 2;
		tiles = document.getElementsByClassName('tiles');
		Array.from(tiles).forEach(function (tile) {
			tile.classList.add('tiles3');
			console.log(tile.className);
		});

	}

	else if (url[2] == 3) {
		whichPic = 3;
		tiles = document.getElementsByClassName('tiles');
		Array.from(tiles).forEach(function (tile) {
			tile.classList.add('tiles4');
			console.log(tile.className);
		});
	}


	var tile1 = document.getElementById('cell11');
	var tile2 = document.getElementById('cell12');
	var tile3 = document.getElementById('cell13');

	var tile4 = document.getElementById('cell21');
	var tile5 = document.getElementById('cell22');
	var tile6 = document.getElementById('cell23');

	var tile7 = document.getElementById('cell31');
	var tile8 = document.getElementById('cell32');
	var tile9 = document.getElementById('cell33');

	shuffle();


	var newgame = document.getElementById('newgame');
	newgame.addEventListener("click", shuffle);

	var shownums = document.getElementById('show-numbers');
	var hidenums = document.getElementById('hide-numbers');

	shownums.addEventListener("click", function () {
		shownums.classList.add('hide');
		hidenums.classList.remove('hide');
		var tiles = document.getElementsByClassName('tiles');
		for (let i = 0; i < tiles.length; i++) {
			tiles[i].classList.remove('no-numbers');
			tiles[i].classList.add('show-numbers');
		}
	})

	hidenums.addEventListener("click", function () {
		shownums.classList.remove('hide');
		hidenums.classList.add('hide');
		hideNumbers(shownums, hidenums);
	})

	tile1.addEventListener("click", function () {
		var solved = click_tile(1, 1);
		if (solved === true)
			displaySolved(whichPic);
	});
	tile2.addEventListener("click", function () {
		var solved = click_tile(1, 2);
		if (solved === true)
			displaySolved(whichPic);
	});
	tile3.addEventListener("click", function () {
		var solved = click_tile(1, 3);
		if (solved === true)
			displaySolved(whichPic);
	});

	tile4.addEventListener("click", function () {
		var solved = click_tile(2, 1);
		if (solved === true)
			displaySolved(whichPic);
	});
	tile5.addEventListener("click", function () {
		var solved = click_tile(2, 2);
		if (solved === true)
			displaySolved(whichPic);
	});
	tile6.addEventListener("click", function () {
		var solved = click_tile(2, 3);
		if (solved === true)
			displaySolved(whichPic);
	});

	tile7.addEventListener("click", function () {
		var solved = click_tile(3, 1);
		if (solved === true)
			displaySolved(whichPic);
	});
	tile8.addEventListener("click", function () {
		var solved = click_tile(3, 2);
		if (solved === true)
			displaySolved(whichPic);
	});
	tile9.addEventListener("click", function () {
		var solved = click_tile(3, 3);
		if (solved === true)
			displaySolved(whichPic);
	});
}

/****************************************************
TRIVIA GAME
*****************************************************/

if (url[1] == 'trivia') {
	var startButton = document.getElementById("start-button");
	var nextButton = document.getElementById('next-button')
	var questionContainer = document.getElementById("trivia-container");
	var displayQuestion = document.getElementById("trivia-question");
	var quizAnswers = document.getElementById("answers");
	var shuffledQuestions, currentQuestionIndex, currentQuestionLabel;
	var questionLabel = document.getElementById("question-label");
	var instructions = document.getElementById("trivia-start-instruct");
	var loss = document.getElementById("loss");
	var win = document.getElementById("win");
	var correctAnswers;

	startButton.addEventListener("click", StartGame);

	nextButton.addEventListener('click', () => {
		currentQuestionIndex++;
		currentQuestionLabel++;
		if (currentQuestionIndex == 10) {
			endGame();
		}
		else {
			questionLabel.innerText = currentQuestionLabel
			setNextQuestion();
		}
	});
}

function StartGame() {
	console.log('started');
	questionContainer.classList.remove("hide");
	questionLabel.classList.remove("hide");
	displayQuestion.classList.remove('hide');
	win.classList.add("hide");
	loss.classList.add("hide");
	shuffledQuestions = questionsArray.sort(() => Math.random() - .5)
	currentQuestionIndex = 0;
	correctAnswers = 0;
	currentQuestionLabel = 1;
	startButton.classList.add("hide");
	setNextQuestion()
}

function setNextQuestion() {
	resetState();
	showQuestion(shuffledQuestions[currentQuestionIndex]);
}

function showQuestion(question) {
	displayQuestion.innerText = question.question;
	question.answers.forEach(answer => {
		const button = document.createElement('button')
		button.setAttribute("type", "button");
		button.classList.add("answer-choice")
		button.innerText = answer.text
		button.classList.add('button')
		if (answer.correct) {
			button.dataset.correct = answer.correct
		}
		button.addEventListener('click', selectAnswer)
		quizAnswers.appendChild(button)
	})
}

function selectAnswer(ans) {
	const selectedButton = ans.target
	nextButton.classList.remove("hide");
	const correct = selectedButton.dataset.correct
	if (correct) {
		correctAnswers++;
	}
	setCorrect(document.body, correct)
	Array.from(quizAnswers.children).forEach(button => {
		setCorrect(button, button.dataset.correct)
	})
}

function endGame() {
	resetState();
	clearCorrect(document.body)
	instructions.classList.add('hide');
	displayQuestion.classList.add('hide');
	nextButton.classList.add('hide');
	questionLabel.classList.add("hide");
	startButton.innerText = "RETRY"
	startButton.classList.remove("hide");
	if (correctAnswers >= 7) {
		win.classList.remove("hide");
	}
	else {
		loss.classList.remove("hide");
	}

}

function resetState() {
	clearCorrect(document.body)
	nextButton.classList.add('hide')
	while (quizAnswers.firstChild) {
		quizAnswers.removeChild(quizAnswers.firstChild)
	}
}

function setCorrect(element, correct) {
	clearCorrect(element)
	if (correct) {
		element.classList.add('correct')
	} else {
		element.classList.add('wrong')
	}
}

function clearCorrect(element) {
	element.classList.remove('correct');
	element.classList.remove('wrong');
}

const questionsArray = [
	{
		question: "What is the largest species of crab?",
		answers: [
			{ text: "Japanese Spider Crab", correct: true },
			{ text: "Red King Crab", correct: false },
			{ text: "Coconut Crab", correct: false },
			{ text: "Florida Stone Crab", correct: false }
		]
	},
	{
		question: "How many species of crabs are there (best answer)?",
		answers: [
			{ text: "Over 8,000", correct: false },
			{ text: "Over 4,500", correct: true },
			{ text: "Over 2,500", correct: false },
			{ text: "Over 10,000", correct: false }
		]
	},
	{
		question: "What is a group of crabs called?",
		answers: [
			{ text: "an infection", correct: false },
			{ text: "a crew", correct: false },
			{ text: "a cast", correct: true },
			{ text: "a colony", correct: false }
		]
	},
	{
		question: "How old is the oldest known crab species?",
		answers: [
			{ text: "100 million years old", correct: false },
			{ text: "250 million years old", correct: false },
			{ text: "600 million years old", correct: false },
			{ text: "445 million years old", correct: true }
		]
	},
	{
		question: "Which of these “crabs” is not a true crab?",
		answers: [
			{ text: "Horseshoe crab", correct: true },
			{ text: "Blue crab", correct: false },
			{ text: "Pea crab", correct: false },
			{ text: "Red rock crab", correct: false }
		]
	},
	{
		question: "What size is the smallest crab in the world?",
		answers: [
			{ text: "1 inch", correct: false },
			{ text: "½ inch", correct: true },
			{ text: "1 1/2 inch", correct: false },
			{ text: "1/4 inch", correct: false }
		]
	},
	{
		question: "What is the most recently discovered crab (June 2021)?",
		answers: [
			{ text: "Callichimaera perplexa", correct: false },
			{ text: "Leptarma biju", correct: false },
			{ text: "Mabui calculus", correct: true },
			{ text: "Afrithelphusa afzelii", correct: false }
		]
	},
	{
		question: "What is the state crustacean of Oregon?",
		answers: [
			{ text: "Horseshoe crab", correct: false },
			{ text: "Red rock crab", correct: false },
			{ text: "King crab", correct: false },
			{ text: "Dungeness crab", correct: true }
		]
	},
	{
		question: "What is the primary material that composes the exoskeletons of a crab?",
		answers: [
			{ text: "Calcium carbonate", correct: true },
			{ text: "Bone", correct: false },
			{ text: "Silica", correct: false },
			{ text: "Periostracum", correct: false }
		]
	},
	{
		question: "What antioxidant is responsible for the red coloring of crabs and lobster?",
		answers: [
			{ text: "Red #5", correct: false },
			{ text: "Astaxanthin", correct: true },
			{ text: "Beta carotene", correct: false },
			{ text: "Manganese", correct: false }
		]
	},
	{
		question: "The scientific name for the common (or green) shore crab is what?",
		answers: [
			{ text: "Cancer pagurus", correct: false },
			{ text: "Carcinus maenas", correct: true },
			{ text: "Necora puber", correct: false },
			{ text: "Pagurus bernhardus", correct: false }
		]
	},
	{
		question: "What color are the eyes of the velvet swimmer crab?",
		answers: [
			{ text: "Blue", correct: false },
			{ text: "Black", correct: false },
			{ text: "Red", correct: true },
			{ text: "Yellow", correct: false }
		]
	},
	{
		question: "Which of these does a boxer crab use for self defense?",
		answers: [
			{ text: "Shells", correct: false },
			{ text: "Urchin Spines", correct: false },
			{ text: "Coral", correct: false },
			{ text: "Anemones", correct: true }
		]
	},
	{
		question: "How many tons of crab are consumed annually?",
		answers: [
			{ text: "1.4 million", correct: true },
			{ text: "2.3 million", correct: false },
			{ text: ".8 million", correct: false },
			{ text: "4.2 million", correct: false }
		]
	},
	{
		question: "What phylum are crabs in?",
		answers: [
			{ text: "Crustacea", correct: false },
			{ text: "Arthropod", correct: true },
			{ text: "Decapod", correct: false },
			{ text: "Chelicerata", correct: false }
		]
	}
]