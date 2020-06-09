import React, { Component } from "react";
//import { getSelfId } from "../Peer/Peer";
import "./ChatSection.css";

export default class ChatSection extends Component {
	handleSubmit = (event) => {
		event.preventDefault();
	};

	render() {
		return (
			<div className="chat-section">
				<div className="chat-container">
					<div id="chat-log"></div>
					<div id="chat-typer">
						<form className="message-form" onSubmit={this.handleSubmit}>
							<input type="text" id="message-input" />
							<label htmlFor="send-message-button" id="send-message-icon">
								<img className="send-icon" />
							</label>
							<input id="send-message-button" type="submit" value="Submit" />
						</form>
					</div>
				</div>
			</div>
		);
	}
}
