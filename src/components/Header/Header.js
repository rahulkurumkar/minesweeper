import React from 'react';
import './Header.css';

export const Header = (props) => {
	return (
		<div className="header-container">
			<div>Number of mines: {props.mines}</div>
			<button className="reset-button" onClick={() => props.reset('reset')}>
				Reset Game
			</button>
			<button className="reset-button" onClick={() => props.reset('init')}>
				Change Level
			</button>
		</div>
	);
};
