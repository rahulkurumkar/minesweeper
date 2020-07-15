import React, { Component } from 'react';
import Input from './components/Input';
import GameBoard from './components/GameBoard';

import './Minesweeper.css';
import Status from './components/Status';

export class Minesweeper extends Component {
	constructor(props) {
		super(props);
		this.state = {
			row: 10,
			col: 10,
			mines: 10,
			status: 'init',
			reset: true
		};

		this.updateGameStatus = this.updateGameStatus.bind(this);
		this.updateMineCount = this.updateMineCount.bind(this);
		this.onInputSubmit = this.onInputSubmit.bind(this);
	}

	updateGameStatus = (status) => {
		let newState = { status };
		if (status === 'reset') {
			newState = { ...newState, mines: this.state.totalMines };
		}

		this.setState({ ...newState });
	};

	updateMineCount = (count) => this.setState({ mines: count });

	onInputSubmit(data) {
		this.setState({ ...data, status: 'idle' });
	}

	render() {
		const { row, col, mines, status, isReset } = this.state;

		return (
			<div className="app-container">
				<h1>Minesweeper game</h1>
				{status === 'init' && <Input onInputSubmit={this.onInputSubmit}></Input>}
				{status !== 'init' && (
					<GameBoard
						row={row}
						col={col}
						mines={mines}
						status={status}
						isReset={isReset}
						updateGameStatus={this.updateGameStatus}
						updateMineCount={this.updateMineCount}
					></GameBoard>
				)}
				{(status === 'over' || status === 'win') && (
					<Status value={status} updateGameStatus={this.updateGameStatus}></Status>
				)}
			</div>
		);
	}
}

export default Minesweeper;
