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
