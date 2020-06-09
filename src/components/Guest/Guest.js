import { setParam, getParam } from "../HelperFunctions/HelperFunctions.js";

export function receiveLobbyData(data) {
	setParam("redPlayerCount", data.redPlayerCount);
	setParam("bluePlayerCount", data.bluePlayerCount);
}

export function chooseTeam() {}
