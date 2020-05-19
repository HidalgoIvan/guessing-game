var peer = new Peer();
var selfId;
var selfName;
var conn;
var selfColor;
var connectedToGuest = false;
selfName = generateRandomName();
document.getElementById("self-name-input").value = selfName;

peer.on("open", (id) => {
	selfId = id;
	document.getElementById("game-id").innerText = joinedCode;
	conn = peer.connect(joinedCode);
	conn.on("open", function () {
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
		});
		// Notify host you're in lobby
		conn.send({
			type: "guestChoosing",
		});
	});
});

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
