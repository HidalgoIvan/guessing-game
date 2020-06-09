import React, { Component } from "react";
import "./LeftMenu.css";
import GameIdContainer from "../GameIdContainer/GameIdContainer";
import PlayerName from "../PlayerName/PlayerName";
import AddCardSection from "../AddCardSection/AddCardSection";
import ScoreBoard from "../ScoreBoard/ScoreBoard";
import ChatSection from "../ChatSection/ChatSection";
import { setParam, getParam } from "../HelperFunctions/HelperFunctions.js";
class LeftMenu extends Component {
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
		return (
			<div id="left-menu">
				<GameIdContainer showId={this.props.showId}></GameIdContainer>
				<PlayerName selfName={this.props.selfName}></PlayerName>
				<AddCardSection></AddCardSection>
				<ScoreBoard playerList={this.state.playerList}></ScoreBoard>
				<ChatSection></ChatSection>
			</div>
		);
	}
}

export default LeftMenu;
