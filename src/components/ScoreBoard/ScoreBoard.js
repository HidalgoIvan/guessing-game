import React, { Component } from "react";
import "./ScoreBoard.css";
export default class PlayerList extends Component {
	constructor(props) {
		super(props);
		let playerCount = Object.keys(props.playerList).length;
		this.state = {
			playerList: props.playerList,
			playerCount: playerCount,
		};
	}

	static getDerivedStateFromProps(nextProps, prevState) {
		let newPlayerCount = Object.keys(nextProps.playerList).length;
		if (newPlayerCount !== prevState.playerCount) {
			return { playerList: nextProps.playerList };
		}
		return null;
	}

	render() {
		let bluePlayers = [];
		let redPlayers = [];
		for (let [key, value] of Object.entries(this.state.playerList)) {
			if (value.team === "blue") {
				bluePlayers.push(<div key={value.id}>{value.name}</div>);
			} else {
				redPlayers.push(<div key={value.id}>{value.name}</div>);
			}
		}
		return (
			<div>
				<div className="score-board">
					<div className="score-board-titles">
						<div className="team-title blue-team-title">
							<div>BLUE</div>
							<div id="blue-win-count">0</div>
						</div>
						<div className="trophy-icon"></div>
						<div className="team-title red-team-title">
							<div>0</div>
							<div id="red-win-count">RED</div>
						</div>
					</div>
					<div className="player-list-container">
						<div className="player-list" id="blue-player-list">
							{bluePlayers}
						</div>
						<div className="player-list" id="red-player-list">
							{redPlayers}
						</div>
					</div>
				</div>
			</div>
		);
	}
}
