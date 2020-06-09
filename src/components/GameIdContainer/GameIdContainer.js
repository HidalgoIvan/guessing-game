import React, { Component } from "react";

class GameIdContainer extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className="game-id-container">
				<div className="game-id-label">
					Game ID:
					<div>{this.props.showId}</div>
				</div>
			</div>
		);
	}
}

export default GameIdContainer;
