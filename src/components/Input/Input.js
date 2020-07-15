import React, { Component } from 'react';

import './Input.css';

export class Input extends Component {
	constructor(props) {
		super(props);
		this.state = {
			row: 0,
			col: 0,
			mines: 0
		};

		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleSubmit(event) {
		event.preventDefault();
		const data = new FormData(event.target);
		let gameData = {
			row: +data.get('row'),
			col: +data.get('col'),
			mines: +data.get('mines'),
			totalMines: +data.get('mines')
		};
		this.props.onInputSubmit(gameData);
	}

	render() {
		return (
			<div className="input-container">
				<div>Enter below data to start the game</div>
				<form onSubmit={this.handleSubmit}>
					<div>
						<label htmlFor="row">Number of rows:</label>
						<input id="row" name="row" type="number" required placeholder="Enter number of rows" />
					</div>
					<div>
						<label htmlFor="col">Number of Columns:</label>
						<input
							id="col"
							name="col"
							type="number"
							required
							placeholder="Enter number of columns"
						/>
					</div>
					<div>
						<label htmlFor="mines">Number of Mines:</label>
						<input
							id="mines"
							name="mines"
							type="number"
							required
							placeholder="Enter number of mines"
						/>
					</div>
					<button>Start Game</button>
				</form>
			</div>
		);
	}
}
