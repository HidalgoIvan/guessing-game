var peer;
var selfName = "";
var playerList = {};
var selfId = "";
var redPlayerCount = 0;
var bluePlayerCount = 0;
var connections = [];
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
		connections.push(conn);

		conn.on("open", function () {
			// Receive messages
			conn.on("data", (data) => {
				if (data.type.includes("guestChoosing")) {
					sendPlayerCount();
				}
				if (data.type.includes("guestJoined")) {
					handleNewGuest(data);
				}
				if (data.type.includes("chatMessageFromGuest")) {
					handleGuestMessage(data);
				}
			});
		});
	});
	peer.on("error", function (err) {
		console.log("Peer had an error: ", err);
	});
};

function handleGuestMessage(data) {
	renderMessage({
		playerName: data.playerName,
		playerColor: data.playerColor,
		message: data.message,
	});
	connections.forEach((conn) => {
		conn.send({
			type: "chatMessage",
			playerName: data.playerName,
			playerColor: data.playerColor,
			message: data.message,
		});
	});
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
	connections.forEach((conn) => {
		conn.send({
			type: "playerCount",
			redCount: redPlayerCount,
			blueCount: bluePlayerCount,
		});
	});
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
	connections.forEach((conn) => {
		conn.send({
			type: "chatMessage",
			playerName: selfName,
			playerColor: color,
			message: messageString,
		});
	});
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

async function addCharacter(nameInput, photoInput) {
	let file = photoInput.files[0];
	let blob = new Blob(photoInput.files, { type: file.type });
	connections.forEach((conn) => {
		conn.send({
			file: blob,
			filename: file.name,
			filetype: file.type,
			name: nameInput.value,
		});
	});
	/* send to players */
	let imageString = await toBase64(photoInput.files[0]);
	addCharacterCard(imageString, nameInput.value);
}

async function addCharacterCard(imageString, name) {
	let frame = document.createElement("div");
	frame.classList.add("character-card");
	let nameLabel = document.createElement("div");
	nameLabel.classList.add("character-name");
	nameLabel.innerText = name;
	frame.appendChild(nameLabel);
	let charPhoto = document.createElement("div");
	charPhoto.classList.add("character-photo");
	charPhoto.style.backgroundImage = "url(" + imageString + ")";
	frame.appendChild(charPhoto);
	document.getElementById("character-cards").appendChild(frame);
}

const toBase64 = (file) =>
	new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = () => resolve(reader.result);
		reader.onerror = (error) => reject(error);
	});

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
		let previousName = selfName;
		if (!event.target.value) {
			selfName = generateRandomName();
			event.target.value = selfName;
		}
		selfName = event.target.value;
		playerList[selfId].name = selfName;
		let notifMessage = previousName + " changed name to " + selfName;
		renderNotification(notifMessage);
		sendNotification(notifMessage);
		sendPlayerList();
	});

function sendNotification(notifMessage) {
	connections.forEach((conn) => {
		conn.send({
			type: "notification",
			message: notifMessage,
		});
	});
}

function sendPlayerList() {
	connections.forEach((conn) => {
		conn.send({
			type: "playerList",
			list: playerList,
		});
	});
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
/* guest code */
/*peer.on("connection", (conn) => {
	conn.on("open", function () {
		console.log("Connection opened!");
		// Receive messages
		conn.on("data", (data) => {
			console.log("Received something", data);
			if (data.filetype.includes("image")) {
				const bytes = new Uint8Array(data.file);
				let imageString = "data:image/png;base64," + encode(bytes);
				addCharacterCard(imageString, data.name);
			}
		});
	});
});*/
