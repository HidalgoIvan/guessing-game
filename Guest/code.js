function start() {
	console.log("Started");
	var peer = new Peer();
	peer.on("open", function (id) {
		var conn = peer.connect("vfook58cmgl00000");

		conn.on("open", function () {
			// Send messages
			conn.send("Hello!");
		});
	});
}

document.addEventListener("DOMContentLoaded", (event) => {
	var peer = new Peer();
	var conn = null;
	peer.on("open", function (id) {
		conn = peer.connect("4cug1rk9rs700000");
		conn.on("open", function () {
			console.log("Sending hello");
			// Send messages
			conn.send("Hello!");
		});
	});

	document.querySelector("input").onchange = function (event) {
		const file = event.target.files[0];
		const blob = new Blob(event.target.files, { type: file.type });

		conn.send({
			file: blob,
			filename: file.name,
			filetype: file.type,
		});
	};
});
