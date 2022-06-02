//insert client-side javascript here

const post_url = window.location.protocol + '/add';

function add_fact(title, text, author, tags)
{
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
	
	post_fact('/add', new_fact)
	.then(data => {
		console.log(data);
	});
	
	//console.log(new_fact);
	
	unhide_modal();
}

async function post_fact(url, data)
{
	console.log(data);
	const response = await fetch(url, {
		method: 'POST', 
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(data)
	});
	return response.json();
}

function create_tags(tags)
{
	var hash = "#";
	for (var tag = 0; tag < tags.length; tag++) { tags[tag] = hash.concat(tags[tag]); }
	return tags; 
}

unhide_modal();

function unhide_modal()
{
	var modal = document.getElementById("add-fact-modal");
	var backdrop = document.getElementById("modal-backdrop");
	if (modal.style.display === "none" && backdrop.style.display === "none") 
	{
		modal.style.display = "block";
		backdrop.style.display = "block";
	}
	else
	{
		modal.style.display = "none";
		backdrop.style.display = "none";
		
		document.getElementById('fact-text-input').value = '';
		document.getElementById("fact-author-input").value = '';
		document.getElementById('fact-title-input').value = '';
		document.getElementById('fact-tag-input').value = '';
	}
}


//sends alert if an input field in the fact form is empty
function validate()
{
	var title = document.getElementById('fact-title-input').value;
	var content = document.getElementById('fact-text-input').value;
	var author = document.getElementById("fact-author-input").value;
	if (content === '')
	{
		alert("Content field is empty");
		return false;
	}
	else if (author === '')
	{
		alert("Author field is empty");
		return false;
	}
	else if (title === '')
	{
		alert("You must provide a valid title");
		return false;
	}
	else { return true; }
}

//on button click, open and close the fact creator
document.getElementById("add-fact-button").addEventListener("click", unhide_modal);

var close = document.querySelector('.modal-close-button');
var cancel = document.querySelector('.modal-cancel-button');

close.onclick = unhide_modal;
cancel.onclick = unhide_modal;

//on button click, create a new fact
var container = document.querySelector('.crab-container');
var create = document.querySelector('.modal-accept-button');

create.addEventListener("click", function () 
{
	console.log("hi");
	add_fact(document.getElementById('fact-title-input').value, 
	document.getElementById('fact-text-input').value, 
	document.getElementById("fact-author-input").value,
	document.getElementById('fact-tag-input').value);
	unhide_modal();
});


//trivia game functions


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
  }) 

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

function setNextQuestion(){
	resetState();
	showQuestion(shuffledQuestions[currentQuestionIndex]);
}

function showQuestion(question){
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
        {text: "Japanese Spider Crab", correct: true},
        {text: "Red King Crab", correct: false},
        {text: "Coconut Crab", correct: false},
        {text: "Florida Stone Crab", correct: false}
    ]
    },
    {
        question: "How many species of crabs are there (best answer)?",
        answers: [
            {text: "Over 8,000", correct: false},
            {text: "Over 4,500", correct: true},
            {text: "Over 2,500", correct: false},
            {text: "Over 10,000", correct: false}
        ]
    },
    {
        question: "What is a group of crabs called?",
        answers: [
            {text: "an infection", correct: false},
            {text: "a crew", correct: false},
            {text: "a cast", correct: true},
            {text: "a colony", correct: false}
        ]
    },
    {
        question: "How old is the oldest known crab species?",
        answers: [
            {text: "100 million years old", correct: false},
            {text: "250 million years old", correct: false},
            {text: "600 million years old", correct: false},
            {text: "445 million years old", correct: true}
        ]
    },
    {
        question: "Which of these “crabs” is not a true crab?",
        answers: [
            {text: "Horseshoe crab", correct: true},
            {text: "Blue crab", correct: false},
            {text: "Pea crab", correct: false},
            {text: "Red rock crab", correct: false}
        ]
    },
    {
        question: "What size is the smallest crab in the world?",
        answers: [
            {text: "1 inch", correct: false},
            {text: "½ inch", correct: true},
            {text: "1 1/2 inch", correct: false},
            {text: "1/4 inch", correct: false}
        ]
    },
    {
        question: "What is the most recently discovered crab (June 2021)?",
        answers: [
            {text: "Callichimaera perplexa", correct: false},
            {text: "Leptarma biju", correct: false},
            {text: "Mabui calculus", correct: true},
            {text: "Afrithelphusa afzelii", correct: false}
        ]
    },
    {
        question: "What is the state crustacean of Oregon?",
        answers: [
            {text: "Horseshoe crab", correct: false},
            {text: "Red rock crab", correct: false},
            {text: "King crab", correct: false},
            {text: "Dungeness crab", correct: true}
        ]
    },
    {
        question: "What is the primary material that composes the exoskeletons of a crab?",
        answers: [
            {text: "Calcium carbonate", correct: true},
            {text: "Bone", correct: false},
            {text: "Silica", correct: false},
            {text: "Periostracum", correct: false}
        ]
    },
    {
        question: "What antioxidant is responsible for the red coloring of crabs and lobster?",
        answers: [
            {text: "Red #5", correct: false},
            {text: "Astaxanthin", correct: true},
            {text: "Beta carotene", correct: false},
            {text: "Manganese", correct: false}
        ]
    },
    {
        question: "The scientific name for the common (or green) shore crab is what?",
        answers: [
            {text: "Cancer pagurus", correct: false},
            {text: "Carcinus maenas", correct: true},
            {text: "Necora puber", correct: false},
            {text: "Pagurus bernhardus", correct: false}
        ]
    },
    {
        question: "What color are the eyes of the velvet swimmer crab?",
        answers: [
            {text: "Blue", correct: false},
            {text: "Black", correct: false},
            {text: "Red", correct: true},
            {text: "Yellow", correct: false}
        ]
    },
    {
        question: "Which of these does a boxer crab use for self defense?",
        answers: [
            {text: "Shells", correct: false},
            {text: "Urchin Spines", correct: false},
            {text: "Coral", correct: false},
            {text: "Anemones", correct: true}
        ]
    },
    {
        question: "How many tons of crab are consumed annually?",
        answers: [
            {text: "1.4 million", correct: true},
            {text: "2.3 million", correct: false},
            {text: ".8 million", correct: false},
            {text: "4.2 million", correct: false}
        ]
    },
    {
        question: "What phylum are crabs in?",
        answers: [
            {text: "Crustacea", correct: false},
            {text: "Arthropod", correct: true},
            {text: "Decapod", correct: false},
            {text: "Chelicerata", correct: false}
        ]
    }
]