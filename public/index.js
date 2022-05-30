//insert client-side javascript here

function add_fact(title, text, author)
{
	if (!validate()) { return; }
	
	var new_fact = Handlebars.templates.fact({
		title: title,
		text: text,
		author: author, 
		tags: 'emply for now'
	});
	
	(async () => {
		const rawResponse = await fetch('localhost:3000/add', {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				title: title,
				text: text,
				author: author, 
				tags: 'emply for now'
			})
		});
		const content = await rawResponse.json();
		console.log(content);
	});	
	
	//console.log(new_fact);
	
	unhide_modal();
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
	document.getElementById("fact-author-input").value); 
	//document.getElementById('fact-tag-input').value);
	unhide_modal();
});
