import React, { Component } from "react";
import "./ScoreBoard.css";
export default class PlayerList extends Component {
	render() {
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
						<div className="player-list" id="blue-player-list"></div>
						<div className="player-list" id="red-player-list"></div>
					</div>
				</div>
			</div>
		);
	}
}
