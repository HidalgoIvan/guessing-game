var joinedCode = "";
document
	.getElementById("host-game-button")
	.addEventListener("click", function (event) {
		let scriptTag = document.createElement("script");
		scriptTag.setAttribute("src", "js/host.js");
		let body = document.getElementsByTagName("BODY")[0];
		body.appendChild(scriptTag);
		document.getElementById("choice-blocker").style.display = "none";
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

function generateRandomName() {
	let adjectives = [
		"Fast",
		"Quick",
		"Awesome",
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
		"Elephant",
		"Monkey",
		"Pangolin",
	];
	return (
		adjectives[Math.floor(Math.random() * adjectives.length)] +
		names[Math.floor(Math.random() * names.length)]
	);
}
