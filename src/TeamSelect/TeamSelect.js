import React, { Component } from "react";
import { onConnectToHost, connectToHost } from "../components/Peer/Peer";
import {
	setParam,
	getParam,
} from "../components/HelperFunctions/HelperFunctions.js";
import "./TeamSelect.css";
export default class TeamSelect extends Component {
	constructor(props) {
		super(props);
		this.state = {
			hostId: props.hostId,
			role: props.role,
			bluePlayerCount: props.bluePlayerCount,
			redPlayerCount: props.redPlayerCount,
		};
	}

	componentDidMount() {
		onConnectToHost(() => {
			setParam("role", "pickingTeam");
		});
		connectToHost(this.state.hostId);
	}

	static getDerivedStateFromProps(nextProps, prevState) {
		if (nextProps.bluePlayerCount !== prevState.bluePlayerCount) {
			return { bluePlayerCount: nextProps.bluePlayerCount };
		}
		if (nextProps.redPlayerCount !== prevState.redPlayerCount) {
			return { redPlayerCount: nextProps.redPlayerCount };
		}
		return null;
	}

	chooseTeam = (team = "red") => {
		console.log("choosing", team);
	};

	render() {
		let titleMessage =
			this.state.bluePlayerCount !== 0
				? "Choose your team"
				: "Connecting to host..";
		let blueCount = this.state.bluePlayerCount;
		let redCount = this.state.redPlayerCount;
		if (this.state.bluePlayerCount == 0 && this.state.redPlayerCount == 0) {
			blueCount = "...";
			redCount = "...";
		}
		return (
			<div id="team-chooser">
				<div id="team-chooser-title">{titleMessage}</div>
				<div
					className="team-chooser-button blue-team-picker"
					onClick={() => this.chooseTeam("blue")}
				>
					<div className="team-char-icon"></div>
					<div id="blue-team-player-count">{blueCount}</div>
				</div>
				<div className="team-chooser-button red-team-picker">
					<div className="team-char-icon"></div>
					<div id="red-team-player-count">{redCount}</div>
				</div>
			</div>
		);
	}
}
