var peer = new Peer();
var selfId;
var selfName;
var conn;
var selfColor;
var connectedToGuest = false;
selfName = generateRandomName();
document.getElementById("self-name-input").value = selfName;

peer.on("open", (id) => {
	document.getElementById("game-id").innerText = joinedCode;
	conn = peer.connect(joinedCode);
	conn.on("open", function () {
		selfId = id;
		connectedToGuest = true;
		// Receive messages
		conn.on("data", function (data) {
			if (data.type.includes("chatMessage")) {
				renderMessage(data);
			}
			if (data.type.includes("playerList")) {
				renderPlayerTable(data.list);
			}
			if (data.type.includes("notification")) {
				renderNotification(data.message);
			}
			if (data.type.includes("playerCount")) {
				renderPlayerCount(data.redCount, data.blueCount);
			}
			if (data.type.includes("newCharCard")) {
				addCharacterCard(
					data.imageString,
					data.cardName,
					data.cardId,
					data.flipped
				);
			}
			if (data.type.includes("boardCards")) {
				receiveBoard(data.cards, data);
			}
			if (data.type.includes("cardFlip")) {
				receiveCardFlip(data);
			}
		});
		// Notify host you're in lobby
		conn.send({
			type: "guestChoosing",
			playerId: selfId,
		});
	});
});

function flipCard(event) {
	let card = event.target.parentElement.parentElement;
	let cardFlip = !boardCards[card.id].flipped;
	conn.send({
		type: "guestCardFlip",
		cardId: card.id,
		flip: cardFlip,
		playerColor: selfColor,
	});
}

function receiveCardFlip(cardInfo) {
	blueFlipCount = cardInfo.blueFlipCount;
	redFlipCount = cardInfo.redFlipCount;
	let card = document.getElementById(cardInfo.cardId);
	let cardFlip = cardInfo.flip;
	// Flip the card down
	if (cardFlip) {
		playSound("card-down");
		flippedCardCount++;
		boardCards[card.id].flipped = true;
		card.children[1].style.backgroundImage = "url('./img/card-back.png')";
		playSound("card-up");
	}
	// Flip the card up
	else {
		flippedCardCount--;
		boardCards[card.id].flipped = false;
		card.children[1].style.backgroundImage =
			"url(" + boardCards[card.id].image + ")";
	}
	updateProgressBars();
}

function receiveBoard(cards, info) {
	for (let [cardId, cardData] of Object.entries(cards)) {
		addCharacterCard(cardData.image, cardData.name, cardId, cardData.flipped);
	}
	redFlipCount = info.redFlipCount;
	blueFlipCount = info.blueFlipCount;
	updateProgressBars();
}

function renderMessage(data) {
	let chatLog = document.getElementById("chat-log");
	let messageDiv = document.createElement("div");
	let nameSpan = document.createElement("span");
	nameSpan.innerText = data.playerName + ": ";
	nameSpan.className = "blue-message";
	if (data.playerColor.includes("red")) {
		nameSpan.className = "red-message";
	}
	messageDiv.appendChild(nameSpan);
	let textSpan = document.createElement("span");
	textSpan.innerText = data.message;
	messageDiv.appendChild(textSpan);
	chatLog.appendChild(messageDiv);
	playSound("pop");
}

document
	.getElementById("send-message-button")
	.addEventListener("click", function (event) {
		event.preventDefault();
		let messageInput = document.getElementById("message-input");
		if (!messageInput.value) {
			return;
		}
		let messageString = messageInput.value;
		sendMessageAsGuest(messageString);
		messageInput.value = "";
	});

function sendMessageAsGuest(messageString) {
	conn.send({
		type: "chatMessageFromGuest",
		playerName: selfName,
		playerColor: "red",
		message: messageString,
	});
}
function renderPlayerTable(playerList) {
	let blueList = document.getElementById("blue-player-list");
	let redList = document.getElementById("red-player-list");
	blueList.innerHTML = "";
	redList.innerHTML = "";
	for (let [key, data] of Object.entries(playerList)) {
		let playerDiv = document.createElement("div");
		playerDiv.innerText = data.name;
		if (data.color.includes("red")) {
			redList.appendChild(playerDiv);
		} else {
			blueList.appendChild(playerDiv);
		}
	}
}

function chooseTeam(teamColor) {
	if (!connectedToGuest) {
		return;
	}
	if (teamColor.includes("red")) {
		selfColor = "red";
	} else {
		selfColor = "blue";
	}
	// Notify host you connected
	conn.send({
		type: "guestJoined",
		playerName: selfName,
		playerColor: selfColor,
		playerId: selfId,
	});
	document.getElementById("team-chooser").style.display = "none";
}

document
	.getElementById("self-name-input")
	.addEventListener("focusout", function (event) {
		if (event.target.value === selfName) {
			return;
		}
		if (!event.target.value) {
			selfName = generateRandomName();
			event.target.value = selfName;
		}
		let previousName = selfName;
		selfName = event.target.value;
		let notifMessage = previousName + " changed name to " + selfName;
		conn.send({
			type: "guestChangedName",
			playerId: selfId,
			notifMessage: notifMessage,
			newName: selfName,
		});
	});

async function addCharacter(nameInput, photoInput) {
	let imageString = await toBase64(photoInput.files[0]);
	/* Send image to host to be resent to other guests */
	conn.send({
		type: "charCardFromGuest",
		cardName: nameInput.value,
		imageString: imageString,
	});
}
