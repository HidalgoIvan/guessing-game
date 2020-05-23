var peer;
var selfName = "";
var playerList = {};
var selfId = "";
var redPlayerCount = 0;
var bluePlayerCount = 0;
var connections = {};
var nextImgSourceId = 1;
selfName = generateRandomName();
document.getElementById("self-name-input").value = selfName;
renderNotification(selfName + " joined");
const startHostConnection = () => {
	peer = new Peer();
	peer.on("open", (id) => {
		selfId = id;
		document.getElementById("game-id").innerText = selfId;
		playerList[selfId] = {
			name: selfName,
			color: "blue",
		};
		bluePlayerCount++;
		renderPlayerTable();
	});
	peer.on("connection", (conn) => {
		conn.on("open", function () {
			// Receive messages
			conn.on("data", (data) => {
				if (data.type.includes("guestChoosing")) {
					connections[data.playerId] = { connection: conn };
					sendPlayerCount();
				}
				if (data.type.includes("guestJoined")) {
					handleNewGuest(data);
				}
				if (data.type.includes("chatMessageFromGuest")) {
					handleGuestMessage(data);
				}
				if (data.type.includes("guestChangedName")) {
					handleGuestNameChange(data);
				}
				if (data.type.includes("charCardFromGuest")) {
					handleGuestAddCard(data);
				}
				if (data.type.includes("guestCardFlip")) {
					handleGuestFlip(data);
				}
			});
			sendCardsToPlayer(conn);
		});
	});
	peer.on("error", function (err) {
		console.log("Peer had an error: ", err);
	});
};

function handleGuestFlip(cardInfo) {
	flipCard(
		{
			target: {
				parentElement: {
					parentElement: document.getElementById(cardInfo.cardId),
				},
			},
		},
		cardInfo.playerColor
	);
}

function flipCard(event, color = "blue") {
	let card = event.target.parentElement.parentElement;
	let cardFlip = !boardCards[card.id].flipped;
	// Card is facing down
	if (boardCards[card.id].flipped) {
		playSound("card-up");
		flippedCardCount--;
		boardCards[card.id].flipped = false;
		card.children[1].style.backgroundImage =
			"url(" + boardCards[card.id].image + ")";
		if (color.includes("blue")) {
			blueFlipCount--;
		} else {
			redFlipCount--;
		}
	}
	// Card is facing up
	else {
		playSound("card-down");
		flippedCardCount++;
		boardCards[card.id].flipped = true;
		card.children[1].style.backgroundImage = "url('./img/card-back.png')";
		if (color.includes("blue")) {
			blueFlipCount++;
		} else {
			redFlipCount++;
		}
	}
	for (let [playerId, playerData] of Object.entries(connections)) {
		playerData.connection.send({
			type: "cardFlip",
			cardId: card.id,
			flip: cardFlip,
			redFlipCount: redFlipCount,
			blueFlipCount: blueFlipCount,
		});
	}
	updateProgressBars();
}

function handleGuestAddCard(data) {
	addCharacterCard(
		data.imageString,
		data.cardName,
		"card-" + nextImgSourceId,
		false
	);
	sendCharacterCard(
		data.cardName,
		data.imageString,
		"card-" + nextImgSourceId,
		false
	);
	nextImgSourceId++;
}

function handleGuestNameChange(data) {
	playerList[data.playerId].name = data.newName;
	sendPlayerList();
	renderNotification(data.notifMessage);
	sendNotification(data.notifMessage);
}

function handleGuestMessage(data) {
	renderMessage({
		playerName: data.playerName,
		playerColor: data.playerColor,
		message: data.message,
	});
	for (let [playerId, playerData] of Object.entries(connections)) {
		playerData.connection.send({
			type: "chatMessage",
			playerName: data.playerName,
			playerColor: data.playerColor,
			message: data.message,
		});
	}
}

startHostConnection();

function handleNewGuest(guest) {
	playerList[guest.playerId] = {
		name: guest.playerName,
		color: guest.playerColor,
	};

	if (guest.playerColor.includes("red")) {
		redPlayerCount++;
	} else {
		bluePlayerCount++;
	}

	let notifMessage = guest.playerName + " joined";
	renderNotification(notifMessage);
	sendNotification(notifMessage);
	sendPlayerCount();
	sendPlayerList();
}

function sendPlayerCount() {
	for (let [playerId, playerData] of Object.entries(connections)) {
		playerData.connection.send({
			type: "playerCount",
			redCount: redPlayerCount,
			blueCount: bluePlayerCount,
		});
	}
}

document
	.getElementById("new-char-image")
	.addEventListener("change", function (event) {
		let input = event.target;
		let nameLabel = document.getElementById("file-name");
		if (input.files[0]) {
			nameLabel.innerText = input.files[0].name;
		} else {
			nameLabel.innerText = "Upload photo";
		}
	});

document
	.getElementById("send-message-button")
	.addEventListener("click", function (event) {
		event.preventDefault();
		let messageInput = document.getElementById("message-input");
		if (!messageInput.value) {
			return;
		}
		let messageString = messageInput.value;
		sendMessageAsHost(messageString);
		messageInput.value = "";
	});

function sendMessageAsHost(messageString, color = "blue") {
	renderMessage({
		playerName: selfName,
		playerColor: color,
		message: messageString,
	});
	for (let [playerId, playerData] of Object.entries(connections)) {
		playerData.connection.send({
			type: "chatMessage",
			playerName: selfName,
			playerColor: color,
			message: messageString,
		});
	}
	playSound("pop");
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
}

function sendCardsToPlayer(conn) {
	conn.send({
		type: "boardCards",
		cards: boardCards,
		blueFlipCount: blueFlipCount,
		redFlipCount: redFlipCount,
	});
}

function sendCharacterCard(name, imgSrc, cardId) {
	for (let [playerId, playerData] of Object.entries(connections)) {
		playerData.connection.send({
			type: "newCharCard",
			cardName: name,
			imageString: imgSrc,
			cardId: cardId,
		});
	}
}

async function addCharacter(nameInput, photoInput) {
	let imageString = await toBase64(photoInput.files[0]);
	boardCards["card-" + nextImgSourceId] = {
		image: imageString,
		name: nameInput.value,
		flipped: false,
	};
	// Send picture to players
	for (let [playerId, playerData] of Object.entries(connections)) {
		playerData.connection.send({
			type: "newCharCard",
			cardName: nameInput.value,
			imageString: imageString,
			cardId: "card-" + nextImgSourceId,
			flipped: false,
		});
	}
	addCharacterCard(
		imageString,
		nameInput.value,
		"card-" + nextImgSourceId,
		false
	);
	nextImgSourceId++;
	updateProgressBars();
}

const encode = (input) => {
	const keyStr =
		"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
	let output = "";
	let chr1, chr2, chr3, enc1, enc2, enc3, enc4;
	let i = 0;

	while (i < input.length) {
		chr1 = input[i++];
		chr2 = i < input.length ? input[i++] : Number.NaN; // Not sure if the index
		chr3 = i < input.length ? input[i++] : Number.NaN; // checks are needed here

		enc1 = chr1 >> 2;
		enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
		enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
		enc4 = chr3 & 63;

		if (isNaN(chr2)) {
			enc3 = enc4 = 64;
		} else if (isNaN(chr3)) {
			enc4 = 64;
		}
		output +=
			keyStr.charAt(enc1) +
			keyStr.charAt(enc2) +
			keyStr.charAt(enc3) +
			keyStr.charAt(enc4);
	}
	return output;
};
function getSelfInfo() {
	return {
		playerName: selfName,
		playerColor: "blue",
		playerId: selfId,
	};
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
		playerList[selfId].name = selfName;
		let notifMessage = previousName + " changed name to " + selfName;
		renderNotification(notifMessage);
		sendNotification(notifMessage);
		sendPlayerList();
	});

function sendNotification(notifMessage) {
	for (let [playerId, playerData] of Object.entries(connections)) {
		playerData.connection.send({
			type: "notification",
			message: notifMessage,
		});
	}
}

function sendPlayerList() {
	for (let [playerId, playerData] of Object.entries(connections)) {
		playerData.connection.send({
			type: "playerList",
			list: playerList,
		});
	}
	renderPlayerTable();
}

function renderPlayerTable() {
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
