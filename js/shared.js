var boardCards = {};
var joinedCode = "";
var flippedCardCount = 0;
var redFlipCount = 0;
var blueFlipCount = 0;
function playSound(soundName) {
	let sound = new Audio("./sound/" + soundName + ".mp3");
	sound.play();
}
document
	.getElementById("host-game-button")
	.addEventListener("click", function (event) {
		let scriptTag = document.createElement("script");
		scriptTag.setAttribute("src", "js/host.js");
		let body = document.getElementsByTagName("BODY")[0];
		body.appendChild(scriptTag);
		document.getElementById("choice-blocker").style.display = "none";
		document.getElementById("team-chooser").style.display = "none";
	});
document
	.getElementById("join-game-button")
	.addEventListener("click", function (event) {
		if (!document.getElementById("join-game-code").value) {
			alert("Please enter a game code");
			return;
		}
		joinedCode = document.getElementById("join-game-code").value;
		let scriptTag = document.createElement("script");
		scriptTag.setAttribute("src", "js/guest.js");
		let body = document.getElementsByTagName("BODY")[0];
		body.appendChild(scriptTag);
		document.getElementById("choice-blocker").style.display = "none";
	});
function renderNotification(notificationMessage) {
	let chatLog = document.getElementById("chat-log");
	let messageDiv = document.createElement("div");
	let notifSpan = document.createElement("span");
	notifSpan.className = "notification-message";
	notifSpan.innerText = notificationMessage;
	messageDiv.appendChild(notifSpan);
	chatLog.appendChild(messageDiv);
}
function generateRandomName() {
	let adjectives = [
		"Fast",
		"Quick",
		"Nice",
		"Loud",
		"Cool",
		"Yellow",
		"Orange",
		"Brave",
		"Winged",
	];
	let names = [
		"Toucan",
		"Deer",
		"Shark",
		"Pigeon",
		"Dove",
		"Camel",
		"Monkey",
		"Pangolin",
	];
	return (
		adjectives[Math.floor(Math.random() * adjectives.length)] +
		names[Math.floor(Math.random() * names.length)]
	);
}

function renderPlayerCount(redCount, blueCount) {
	document.getElementById("team-chooser-title").innerText = "Choose your team";
	document.getElementById("red-team-player-count").innerText = redCount;
	document.getElementById("blue-team-player-count").innerText = blueCount;
}

function addCharacterCard(imageString, name, cardId, flipped) {
	boardCards[cardId] = {
		image: imageString,
		name: name,
		flipped: flipped,
	};
	let frame = document.createElement("div");
	frame.classList.add("character-card");
	frame.id = cardId;
	let nameLabel = document.createElement("div");
	nameLabel.classList.add("character-name");
	nameLabel.innerText = name;
	frame.appendChild(nameLabel);
	let charPhoto = document.createElement("div");
	charPhoto.classList.add("character-photo");
	if (flipped) {
		charPhoto.style.backgroundImage = "url('./img/card-back.png')";
		flippedCardCount++;
	} else {
		charPhoto.style.backgroundImage = "url(" + imageString + ")";
	}
	frame.appendChild(charPhoto);
	let buttonsDiv = document.createElement("div");
	buttonsDiv.className = "character-buttons";
	let flipButton = document.createElement("div");
	flipButton.classList.add("char-button");
	flipButton.classList.add("flip-button");
	flipButton.setAttribute("onclick", "flipCard(event)");
	buttonsDiv.appendChild(flipButton);
	let chooseButton = document.createElement("div");
	chooseButton.classList.add("char-button");
	chooseButton.classList.add("select-button");
	chooseButton.setAttribute("onclick", "flipCard(event)");
	buttonsDiv.appendChild(chooseButton);
	frame.appendChild(buttonsDiv);
	document.getElementById("character-cards").appendChild(frame);
	updateProgressBars();
}

document
	.getElementById("submit-form-button")
	.addEventListener("click", function (event) {
		event.preventDefault();
		let nameInput = document.getElementById("new-char-name");
		let photoInput = document.getElementById("new-char-image");
		if (!nameInput.value || !photoInput.files[0]) {
			alert("Enter a name and a picture for the character!");
			return;
		}
		addCharacter(nameInput, photoInput);
	});

const toBase64 = (file) =>
	new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = () => resolve(reader.result);
		reader.onerror = (error) => reject(error);
	});

function updateProgressBars() {
	let redBar = document.getElementById("red-bar");
	let blueBar = document.getElementById("blue-bar");
	let redCounter = document.getElementById("progress-counter-red");
	let blueCounter = document.getElementById("progress-counter-blue");
	let totalCards = Object.keys(boardCards).length;
	let redProgress = (redFlipCount / totalCards) * 100;
	let blueProgress = (blueFlipCount / totalCards) * 100;

	redCounter.innerText = redFlipCount + "/" + totalCards;
	blueCounter.innerText = blueFlipCount + "/" + totalCards;
	redBar.style.width = redProgress + "%";
	blueBar.style.width = blueProgress + "%";
}
