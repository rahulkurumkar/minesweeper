import React from 'react';

import './Status.css';

export const Status = (props) => {
	const getStatusText = () => {
		switch (props.value) {
			case 'win':
				return 'Congratulations !!! You won !!!!';
			case 'over':
				return 'You lose !!!! Try agian';
			default:
				return 'Status not matching' + props.value;
		}
	};

	return (
		<div>
			<h1>{getStatusText()}</h1>
			<button onClick={() => props.updateGameStatus('reset')}>Play again</button>
		</div>
	);
};
