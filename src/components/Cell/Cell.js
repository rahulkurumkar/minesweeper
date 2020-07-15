import React, { Component } from 'react';

import './Cell.css';

export class Cell extends Component {
	getClassName(data) {
		let cellClassName = '';
		if (data.isOpen) {
			cellClassName = 'cell-open';
		}

		if (data.explosion) {
			cellClassName += ' cell-explosion';
		}

		if (data.isMine && this.props.status === 'over') {
			cellClassName += ' cell-mine';
		}

		if (data.isFlag) {
			cellClassName += ' cell-flag';
		}

		if (this.props.status === 'win' && data.isMine) {
			cellClassName += ' cell-flag';
		}

		return cellClassName;
	}

	onCellContextMenu(event, data) {
		event.preventDefault();

		if (data.isOpen || this.props.status === 'win') {
			return;
		}

		this.props.onCellContextMenu(data);
	}

	render() {
		return this.props.row.map((data, index) => {
			const cellClassName = this.getClassName(data);
			return (
				<div
					className="cell"
					key={index}
					onClick={() => this.props.onCellClick(data)}
					onContextMenu={(e) => this.onCellContextMenu(e, data)}
				>
					<span className={cellClassName}>
						{data.mineCount > 0 && !data.isMine && data.isOpen ? data.mineCount : ''}
					</span>
				</div>
			);
		});
	}
}
