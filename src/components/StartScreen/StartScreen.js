import React, { Component } from "react";
import { initializeHost } from "../Host/Host.js";
import "./StartScreen.css";
export default class StartScreen extends Component {
	constructor(props) {
		super(props);
		this.state = {
			setParam: props.setParam,
			gameCodeInput: "",
		};
	}

	setRoleHost = () => {
		initializeHost();
	};

	setRoleGuest = () => {
		if (this.state.gameCodeInput.length == 0) {
			alert("Please enter your game code");
			return;
		}
		this.state.setParam("hostId", this.state.gameCodeInput);
		this.state.setParam("role", "pickingTeam");
	};

	handleGameIdChange = (e) => {
		this.setState({
			gameCodeInput: e.target.value,
		});
	};

	render() {
		return (
			<div id="choice-blocker">
				<button
					className="pretty-button"
					id="host-game-button"
					role="host"
					onClick={this.setRoleHost}
				>
					Host a game
				</button>
				<div id="start-divider">--- OR ---</div>
				<input
					type="text"
					placeholder="Code"
					id="join-game-code"
					value={this.state.gameCodeInput}
					onChange={this.handleGameIdChange}
				/>
				<button
					className="pretty-button"
					id="join-game-button"
					onClick={this.setRoleGuest}
				>
					Join with code
				</button>
				<div id="version">V 0.0.12</div>
			</div>
		);
	}
}
