let setParamFun = () => {};
let getParamFun = () => {};
export function generateRandomName() {
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

export function addSetParamRef(ref = () => {}) {
	setParamFun = ref;
}

export function setParam(key = "key", value = "value") {
	setParamFun(key, value);
}

export function addGetParamRef(ref = () => {}) {
	getParamFun = ref;
}

export function getParam(key = "key") {
	return getParamFun(key);
}

export function addPlayerToList(key = "", player = {}) {
	let playerList = getParam("playerList");
	playerList[key] = player;
	setParam("playerList", playerList);
}
