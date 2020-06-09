import { setParam, getParam } from "../HelperFunctions/HelperFunctions.js";
import { getSelfId } from "../Peer/Peer";
let connections = {};
let playerList = {};
let bluePlayerCount = 0;
let redPlayerCount = 0;

export function getPlayerList() {
	return playerList;
}

export function addPlayer(player) {
	playerList[player.id] = player;
	if (player.team === "blue") {
		bluePlayerCount++;
		setParam("bluePlayerCount", bluePlayerCount);
	}
	if (player.team === "red") {
		redPlayerCount++;
		setParam("redPlayerCount", redPlayerCount);
	}
	setParam("playerList", playerList);
}

export function getPlayerCount(team = "both") {
	switch (team) {
		case "blue":
			return bluePlayerCount;
		case "red":
			return redPlayerCount;
		default:
			return bluePlayerCount + redPlayerCount;
	}
}

export function initializeHost() {
	setParam("role", "host");
	let name = getParam("selfName");
	let id = getSelfId();
	addPlayer({
		name: name,
		id: id,
		team: "blue",
	});
}

export function addSetParamRef() {}
