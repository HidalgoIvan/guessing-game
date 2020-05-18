var peer = new Peer();
var selfId;
var selfName;
var conn;
selfName = generateRandomName();
document.getElementById("self-name-input").value = selfName;

peer.on("open", (id) => {
	selfId = id;
	document.getElementById("game-id").innerText = joinedCode;
	conn = peer.connect(joinedCode);
	conn.on("open", function () {
		// Receive messages
		conn.on("data", function (data) {
			if (data.type.includes("chatMessage")) {
				renderMessage(data);
			}
			if (data.type.includes("playerList")) {
				renderPlayerTable(data.list);
			}
		});
		// Notify host you connected
		conn.send({
			type: "guestJoined",
			playerName: selfName,
			playerColor: "red",
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
	for (let [key, data] of Object.entries(playerList)) {
		let playerDiv = document.createElement("div");
		playerDiv.innerText = data.name;
		let blueList = document.getElementById("blue-player-list");
		let redList = document.getElementById("red-player-list");
		blueList.innerHTML = "";
		redList.innerHTML = "";
		if (data.color.includes("red")) {
			redList.appendChild(playerDiv);
		} else {
			blueList.appendChild(playerDiv);
		}
	}
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
