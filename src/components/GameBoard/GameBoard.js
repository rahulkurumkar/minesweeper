import React, { Component } from 'react';
import Header from '../Header';
import Cell from '../Cell';
import './GameBoard.css';

export class GameBoard extends Component {
	constructor(props) {
		super(props);

		const grid = this.initializeBoard(props.mines);
		this.totalCell = props.row * props.col;
		this.state = {
			grid,
			totalMine: props.mines
		};
		this.resetGame = this.resetGame.bind(this);
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.status === 'reset') {
			const grid = this.initializeBoard(nextProps.mines);

			this.totalCell = nextProps.row * nextProps.col;
			this.setState({
				grid
			});

			this.props.updateGameStatus('idle');
		}
	}

	plantMines(grid, totalMines) {
		const { row, col } = this.props;
		for (let mineCount = 0; mineCount < totalMines; mineCount++) {
			let rowIndex = Math.floor(Math.random() * row);
			let colIndex = Math.floor(Math.random() * col);

			if (grid[rowIndex][colIndex].isMine) {
				mineCount--;
			} else {
				grid[rowIndex][colIndex].isMine = true;
			}
		}
	}

	initializeBoard(mines) {
		const { row, col } = this.props;
		let grid = [];

		for (let i = 0; i < row; i++) {
			grid[i] = [];
			for (let j = 0; j < col; j++) {
				grid[i][j] = {
					row: i,
					col: j,
					isOpen: false,
					isMine: false,
					isFlag: false,
					mineCount: 0
				};
			}
		}

		this.plantMines(grid, mines);
		return grid;
	}

	updateGridData(grid, row, col, newCellData) {
		const colData = grid[row].map((rowData) => {
			if (rowData.col === col) {
				return newCellData ? newCellData : { ...rowData.col };
			}

			return { ...rowData };
		});

		const newGrid = grid.map((rowData, index) => {
			if (index === row) {
				return [...colData];
			}

			return [...rowData];
		});

		return newGrid;
	}

	getMineCount(cell) {
		let mineCount = 0;
		for (let row = -1; row <= 1; row++) {
			for (let col = -1; col <= 1; col++) {
				if (
					row + cell.row >= 0 &&
					col + cell.col >= 0 &&
					row + cell.row < this.props.row &&
					col + cell.col < this.props.col &&
					this.state.grid[row + cell.row][col + cell.col].isMine
				) {
					mineCount++;
				}
			}
		}

		return mineCount;
	}

	cloneGrid() {
		return this.state.grid.map((row) => {
			return row.map((rowColData) => ({ ...rowColData }));
		});
	}

	checkForAdjacentCells(newGrid, cellRow, cellCol) {
		for (let row = -1; row <= 1; row++) {
			for (let col = -1; col <= 1; col++) {
				if (
					row + cellRow >= 0 &&
					col + cellCol >= 0 &&
					row + cellRow < this.props.row &&
					col + cellCol < this.props.col &&
					!newGrid[row + cellRow][col + cellCol].isOpen &&
					!newGrid[row + cellRow][col + cellCol].isMine &&
					!newGrid[row + cellRow][col + cellCol].isFlag
				) {
					const cellData = newGrid[row + cellRow][col + cellCol];
					const mineCount = this.getMineCount(cellData);
					const newCellData = {
						...cellData,
						mineCount: mineCount,
						isOpen: true
					};

					this.totalCell--;
					newGrid[row + cellRow][col + cellCol] = newCellData;

					if (mineCount === 0) {
						this.checkForAdjacentCells(newGrid, row + cellRow, col + cellCol);
					}
				}
			}
		}

		return newGrid;
	}

	handleCellClick(data) {
		if (data.isOpen) {
			return;
		}

		if (this.props.status === 'idle') {
			this.props.updateGameStatus('running');
			if (data.isMine) {
				this.props.updateGameStatus('reset');
			}
		} else {
			if (this.props.status !== 'running') {
				return;
			}
		}

		if (data.isMine) {
			this.props.updateGameStatus('over');
			const newCellData = {
				...data,
				isOpen: true,
				mineCount: this.getMineCount(data),
				explosion: true
			};
			let newGrid = this.cloneGrid();
			this.setState({
				grid: this.updateGridData(newGrid, data.row, data.col, newCellData)
			});
			return;
		}

		const newCellData = {
			...data,
			isOpen: true,
			mineCount: this.getMineCount(data)
		};
		let newGrid = this.cloneGrid();

		if (!newCellData.isFlag) {
			if (newCellData.mineCount === 0) {
				newGrid = this.checkForAdjacentCells(newGrid, data.row, data.col);
			} else {
				this.totalCell--;
			}
		}

		if (newCellData.isFlag) {
			this.props.updateMineCount(this.props.mines + 1);
			newCellData.isFlag = false;
			newCellData.isOpen = false;
		}

		this.setState(
			{
				grid: this.updateGridData(newGrid, data.row, data.col, newCellData)
			},
			() => {
				if (this.totalCell === this.state.totalMine && this.props.mines <= this.state.totalMine) {
					this.props.updateGameStatus('win');
				}
			}
		);
	}

	onCellContextMenu(data) {
		const newCellData = { ...data, isFlag: data.isFlag ? false : true };
		let newGrid = this.cloneGrid();

		this.setState({
			grid: this.updateGridData(newGrid, data.row, data.col, newCellData)
		});

		let mineCount = data.isFlag ? this.props.mines + 1 : this.props.mines - 1;
		this.props.updateMineCount(mineCount);
	}

	renderBoard() {
		return this.state.grid.map((row, rowIndex) => (
			<div key={rowIndex}>
				<Cell
					row={row}
					status={this.props.status}
					onCellClick={this.handleCellClick.bind(this)}
					onCellContextMenu={this.onCellContextMenu.bind(this)}
				></Cell>
			</div>
		));
	}

	resetGame(status) {
		this.props.updateGameStatus(status);
	}

	render() {
		return (
			<>
				<Header mines={this.props.mines} reset={this.resetGame}></Header>
				{this.renderBoard()}
			</>
		);
	}
}
