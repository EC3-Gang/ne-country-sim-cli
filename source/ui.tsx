import React, { FC } from 'react';
import { Text } from 'ink';

const App: FC<{
	options: {
		help: boolean;
	}
}> = ({ options }) => {

	if (options.help) {
		return (
			<>
				<Text>NE Country Sim</Text>
			</>
		);
	}

	return (<>
		<Text>NE Country Sim</Text>
	</>);
};

export default App;
