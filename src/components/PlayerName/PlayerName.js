import React, { Component } from "react";
import { generateRandomName } from "../HelperFunctions/HelperFunctions";

import "./PlayerName.css";
class PlayerName extends Component {
	constructor(props) {
		super(props);
		this.state = {
			selfName: props.selfName,
		};
	}

	handleChange = (event) => {
		let newName = event.target.value
			? event.target.value
			: generateRandomName();
		this.setState({
			selfName: newName,
		});
	};

	render() {
		return (
			<div className="player-name-container">
				<div>Your name:</div>
				<div>
					<input
						id="playerNameInput"
						type="text"
						maxLength="14"
						value={this.state.selfName}
						onChange={this.handleChange}
					/>
				</div>
			</div>
		);
	}
}

export default PlayerName;
