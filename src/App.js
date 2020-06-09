import React, { Component } from "react";
import { onActivePeer } from "./components/Peer/Peer";
import {
	generateRandomName,
	addSetParamRef,
	addGetParamRef,
} from "./components/HelperFunctions/HelperFunctions";
import "./General.css";
import LeftMenu from "./components/LeftMenu/LeftMenu.js";
import StartScreen from "./components/StartScreen/StartScreen";
import TeamSelect from "./TeamSelect/TeamSelect";

class App extends Component {
	constructor(props) {
		super(props);

		this.state = {
			selfId: "?",
			showId: "?",
			selfName: generateRandomName(),
			role: "menu",
			team: "",
			hostId: "",
			bluePlayerCount: 0,
			redPlayerCount: 0,
		};
	}

	componentDidMount() {
		onActivePeer((selfId) => {
			this.setState({
				selfId: selfId,
				showId: selfId,
			});
		});
		addSetParamRef(this.setParam);
		addGetParamRef(this.getParam);
	}

	setParam = (key, value) => {
		this.setState({
			[key]: value,
		});
	};

	getParam = (key) => {
		return this.state[key];
	};

	setPlayerRole = (role) => {
		this.setState({
			role: role,
		});
	};

	render = () => {
		let choiceScreen;
		switch (this.state.role) {
			case "menu":
				choiceScreen = <StartScreen setParam={this.setParam}></StartScreen>;
				break;
			case "pickingTeam":
				choiceScreen = (
					<TeamSelect
						hostId={this.state.hostId}
						role={this.state.role}
						bluePlayerCount={this.state.bluePlayerCount}
						redPlayerCount={this.state.redPlayerCount}
					></TeamSelect>
				);
				break;
			default:
				choiceScreen = "";
				break;
		}
		return (
			<div className="App">
				{choiceScreen}
				<LeftMenu
					showId={this.state.showId}
					selfName={this.state.selfName}
				></LeftMenu>
			</div>
		);
	};
}

export default App;
