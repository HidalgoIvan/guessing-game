var joinedCode = "";
var popSound = document.getElementById("pop-sound");
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

function flipCard(event) {
	console.log(event.target);
	let card = event.target.parentElement.parentElement;

	card.children[1].style.backgroundImage = "url('./img/card-back.png')";
}

function renderPlayerCount(redCount, blueCount) {
	document.getElementById("team-chooser-title").innerText = "Choose your team";
	document.getElementById("red-team-player-count").innerText = redCount;
	document.getElementById("blue-team-player-count").innerText = blueCount;
}
