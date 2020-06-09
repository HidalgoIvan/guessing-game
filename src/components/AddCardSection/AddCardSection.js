import React, { Component } from "react";
import "./AddCardSection.css";
export default class AddCardSection extends Component {
	render() {
		return (
			<form>
				<div className="form-title">Add character</div>
				<div className="new-char-name-wrapper">
					<label htmlFor="new-char-name">Name: </label>
					<input id="new-char-name" type="text" />
				</div>
				<div className="image-upload-wrapper">
					<input type="file" accept="image/*" id="new-char-image" />
					<label htmlFor="new-char-image" id="new-char-image-label">
						<img className="upload-icon" />
						<div id="file-name">Upload photo</div>
					</label>
					<input id="submit-form-button" type="submit" value="Submit" />
				</div>
			</form>
		);
	}
}
