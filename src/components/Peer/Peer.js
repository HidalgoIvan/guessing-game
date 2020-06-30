import Peer from "peerjs";
import { getPlayerCount, addPlayer } from "../Host/Host.js";
import { receiveLobbyData, receivePlayerList } from "../Guest/Guest.js";
const localPeer = new Peer({
	host: "peerjs-custom-server.ih2.repl.co",
	port: "",
	key: "peerjs",
});

let selfId = "";
let onOpenCallback;
let connectedToHostCallback;
let conn;
let hostId = "";
let selfRole = "";
let guestConnections = {};
localPeer.on("open", (localPeerId) => {
	selfId = localPeerId;
	onOpenCallback(selfId);
});

localPeer.on("connection", (conn) => {
	conn.on("open", function () {
		if (selfRole === "guest") {
			connectedToHostCallback();
		}
		/*
			HOST RECEIVER
		*/
		conn.on("data", function (data) {
			if (data.type === "guestChoosing") {
				guestConnections[data.playerId] = conn;
				sendLobbyData(guestConnections[data.playerId]);
			}
			if (data.type === "playerJoined") {
				addPlayer(data.player);
			}
		});
	});
});

localPeer.on("error", (error) => {
	console.log("Peer had an error", error);
});

function sendLobbyData(conn) {
	let redCount = getPlayerCount("red");
	let blueCount = getPlayerCount("blue");
	conn.send({
		type: "lobbyData",
		redPlayerCount: redCount,
		bluePlayerCount: blueCount,
	});
}

export function onActivePeer(callback = () => {}) {
	onOpenCallback = callback;
}

export function getSelfId() {
	return selfId;
}

export function onConnectToHost(callback = () => {}) {
	connectedToHostCallback = callback;
}

export function connectToHost(hostId) {
	selfRole = "guest";
	conn = localPeer.connect(hostId);
	conn.on("open", function () {
		connectedToHostCallback();
		console.log("Connected to host!");
		conn.send({
			type: "guestChoosing",
			playerId: selfId,
		});
		/*
			GUEST RECEIVER
		*/
		conn.on("data", function (data) {
			if (data.type === "lobbyData") {
				receiveLobbyData(data);
			}
			if (data.type === "playerList") {
				receivePlayerList(data.players);
			}
		});
	});
	console.log("Trying to connect to host");
	hostId = hostId;
}

export function peerSend(data = {}) {
	if (selfRole === "guest") {
		conn.send(data);
	} else {
		for (const [id, guestConn] of Object.entries(guestConnections)) {
			guestConn.send(data);
		}
	}
}
