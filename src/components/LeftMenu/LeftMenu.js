import React, { Component } from "react";
import "./LeftMenu.css";
import GameIdContainer from "../GameIdContainer/GameIdContainer";
import PlayerName from "../PlayerName/PlayerName";
import AddCardSection from "../AddCardSection/AddCardSection";
import ScoreBoard from "../ScoreBoard/ScoreBoard";
import ChatSection from "../ChatSection/ChatSection";
class LeftMenu extends Component {
	constructor(props) {
		super(props);
	}
	render() {
		return (
			<div id="left-menu">
				<GameIdContainer showId={this.props.showId}></GameIdContainer>
				<PlayerName selfName={this.props.selfName}></PlayerName>
				<AddCardSection></AddCardSection>
				<ScoreBoard></ScoreBoard>
				<ChatSection></ChatSection>
			</div>
		);
	}
}

export default LeftMenu;
