import React, { FC, Fragment, useEffect, useState } from 'react';
import { Box, Newline, Spacer, Text, useApp, useInput } from 'ink';

const App: FC<{
	options: {
		instructions: boolean | undefined;
		credits: boolean | undefined;
	}
}> = ({ options }) => {
	const { exit } = useApp();
	const valueMap: {
		[key: number]: {
			GDP: number;
			revenue: number;
			expenses: number;
		}
	} = {
		2019: {
			GDP: 514.1,
			revenue: 74.7,
			expenses: 78.2,
		},
		2020: {
			GDP: 480.7,
			revenue: 64.6,
			expenses: 94.1,
		},
		2021: {
			GDP: 569.4,
			revenue: 80.4,
			expenses: 98.4,
		},
		2022: {
			GDP: 645.3,
			revenue: 90.28,
			expenses: 104.15,
		},
		2023: {
			GDP: 700.1,
			revenue: 96.7,
			expenses: 104.15,
		},
	};
	const [GDP, setGDP] = useState(0); // in billion
	const [revenue, setRevenue] = useState(0); // in billion
	const [expenses, setExpenses] = useState(0); // in billion
	const [happiness, rawSetHappiness] = useState(1000);
	const [infrastructureExpenses, setInfrastructureExpenses] = useState(0); // in billion
	// wrapper for setHappiness to prevent it from going either below 0 or over 1000
	// take note of the fact that some pass in functions
	const setHappiness = (newHappiness: number | ((preHappiness: number) => number)) => {
		if (typeof newHappiness === 'number') {
			if (newHappiness < 0) {
				rawSetHappiness(0);
			}
			else if (newHappiness > 1000) {
				rawSetHappiness(1000);
			}
			else {
				rawSetHappiness(newHappiness);
			}
		}
		else {
			const newHappinessNumber = newHappiness(happiness);
			if (newHappinessNumber < 0) {
				rawSetHappiness(0);
			}
			else if (newHappinessNumber > 1000) {
				rawSetHappiness(1000);
			}
			else {
				rawSetHappiness(newHappinessNumber);
			}
		}
	};

	const [actions, setActions] = useState([] as string[]);
	const [events, setEvents] = useState([] as string[]);
	const [activityLog, setActivityLog] = useState([
		'Game started!',
	] as string[]); // in points
	const [gameOverStatus, setGameOverStatus] = useState(false);
	const [has2BeenChosen, setHas2BeenChosen] = useState(false);

	const gameOver = () => {
		setGameOverStatus(true);
		console.log('You won! You have successfully managed Singapore for 5 years!');
		console.log(`Score: ${
			Math.round(happiness / 10 + GDP / 10 + revenue / 10 - expenses / 10 - infrastructureExpenses / 10)
		}`);
		exit();
	};
	const govtOverthrown = () => {
		setGameOverStatus(true);
		console.log('You lost! Your happiness level is too low!');
		exit();
	};

	const setGDPAndRevenue = (year: Date) => {
		// only run on the first day of the year

		/* eslint-disable @typescript-eslint/no-non-null-assertion */
		if (year.getDate() === 1 && year.getMonth() === 0) {
			setGDP(valueMap[year.getFullYear()]!.GDP);
			setRevenue(prevRevenue => prevRevenue + valueMap[year.getFullYear()]!.revenue);
			setExpenses(prevExpenses => prevExpenses + valueMap[year.getFullYear()]!.expenses);
		}
		/* eslint-enable @typescript-eslint/no-non-null-assertion */
	};

	const decreaseNumberbyXPercent = (number: number, percent: number) => {
		return number * (1 - (percent / 100));
	};
	const increaseNumberbyXPercent = (number: number, percent: number) => {
		return number * (1 + (percent / 100));
	};

	// start date: 2019-01-01
	const [date, setDate] = useState(new Date(2019, 0, 1));

	const buildInfrastructure = () => {
		setActivityLog((preActivityLog) => ['Built infrastructure!', ...preActivityLog]);
		setInfrastructureExpenses((preExpenses) => preExpenses + 1);
		setHappiness((preHappiness) => preHappiness + 12);
	};

	const giveReliefFunds = () => {
		if ((date.getFullYear() === 2020 && date.getMonth() >= 1) || date.getFullYear() === 2021) {
			// give 100 billion in relief funds
			setActivityLog((preActivityLog) => ['Gave 100 billion in relief funds!', ...preActivityLog]);
			// increase happiness by 20%
			setHappiness((preHappiness) => increaseNumberbyXPercent(preHappiness, 22));

			// increase infrastructure expenses by 100 billion
			setInfrastructureExpenses((preExpenses) => preExpenses + 100);

			setHas2BeenChosen(true);
		}
	};

	useInput((input: string) => {
		if (input === 'q') {
			exit();
		}
		if (input === '1') {
			buildInfrastructure();
		}
		if (input === '2' && !has2BeenChosen) {
			giveReliefFunds();
		}
	});

	// increase day by one every 300ms
	useEffect(() => {
		const interval = setInterval(() => {
			if (happiness < 500) {
				govtOverthrown();
			}

			setGDPAndRevenue(date);

			// budget deficit event on 2019-06-26, decrease happiness by a random 12-15%
			if (date.getFullYear() === 2019 && date.getMonth() === 5 && date.getDate() === 26) {
				setActivityLog((preActivityLog) => ['Budget deficit!', ...preActivityLog]);
				// decrease happiness by a random 12-15%
				setHappiness((preHappiness) => decreaseNumberbyXPercent(preHappiness, Math.floor(Math.random() * 4 + 6)));
			}

			// tap into reserves on 2019-08-09, happiness increases by a random 10-12%
			if (date.getFullYear() === 2019 && date.getMonth() === 7 && date.getDate() === 9) {
				setActivityLog((preActivityLog) => ['Tapped into reserves!', ...preActivityLog]);
				// decrease happiness by a random 12-15%

				setHappiness((preHappiness) => increaseNumberbyXPercent(preHappiness, Math.floor(Math.random() * 4 + 2)));
			}

			// covid strikes on 2020-01-23, happiness decreases by a random 18-24%
			if (date.getFullYear() === 2020 && date.getMonth() === 0 && date.getDate() === 23) {
				setActivityLog((preActivityLog) => ['Covid strikes!', ...preActivityLog]);
				// decrease happiness by 26-32%
				setHappiness((preHappiness) => decreaseNumberbyXPercent(preHappiness, Math.floor(Math.random() * 6 + 22)));
				// decrease GDP by 10%
				setGDP((preGDP) => decreaseNumberbyXPercent(preGDP, 10));
				// decrease revenue by 5%
				setRevenue((preRevenue) => decreaseNumberbyXPercent(preRevenue, 5));
			}

			// decrease happiness and revenue by a small random amount on the first day of 2021
			if (date.getFullYear() === 2021 && date.getMonth() === 0 && date.getDate() === 1) {
				setActivityLog((preActivityLog) => ['New year!', ...preActivityLog]);
				// decrease happiness by a random 0-3%
				setHappiness((preHappiness) => decreaseNumberbyXPercent(preHappiness, Math.floor(Math.random() * 4 + 5)));
				// decrease revenue by a random 0-3%
				setRevenue((preRevenue) => decreaseNumberbyXPercent(preRevenue, Math.floor(Math.random() * 4 + 15)));

				setHas2BeenChosen(false);
			}

			// decrease happiness by a small amount at the start of 2022
			if (date.getFullYear() === 2022 && date.getMonth() === 0 && date.getDate() === 1) {
				setActivityLog((preActivityLog) => ['New year!', ...preActivityLog]);
				// decrease happiness by a random 5-7%
				setHappiness((preHappiness) => decreaseNumberbyXPercent(preHappiness, Math.floor(Math.random() * 3 + 15)));
			}


			// russia invades ukraine on 24 feb 2022, happiness decreases by a random 13-17%
			if (date.getFullYear() === 2022 && date.getMonth() === 1 && date.getDate() === 24) {
				setActivityLog((preActivityLog) => ['Russia invades Ukraine!', ...preActivityLog]);
				// decrease happiness by a random 13-17%
				setHappiness((preHappiness) => decreaseNumberbyXPercent(preHappiness, Math.floor(Math.random() * 5 + 13)));
			}


			// end on 12/31/2023
			if (date.getFullYear() === 2023 && date.getMonth() === 11 && date.getDate() === 31) {
				gameOver();
			}

			// eslint-disable-next-line no-shadow
			setDate((date) => {
				const newDate = new Date(date);
				newDate.setDate(newDate.getDate() + 1);
				return newDate;
			});
		}, 100);
		return () => clearInterval(interval);
	});


	if (options.instructions) {
		return (
			<>
				<Text>Game Instructions</Text>
				{/* eslint-disable-next-line react/no-unescaped-entities */}
				<Text>You will be managing Singapore from 2019 - 2023. Your country's happiness level will start at 1000, and you will lose if it goes under 500. You will also lose if your economy or budget becomes too low.</Text>
				<Text>Certain events, like COVID, are predetermined for you.</Text>
			</>
		);

	}

	if (options.credits) {
		return (
			<>
				<Text>Credits</Text>
				<Text>Game by: HCI EC3</Text>
				<Text>Frameworks & Libraries used: Ink & React</Text>
				{/* eslint-disable-next-line react/no-unescaped-entities */}
				<Text>P.S. We didn't really feel like doing this</Text>
			</>
		);
	}

	const daysSinceStartOfYear = (+new Date(date) - +new Date(date.getFullYear(), 0, 1)) / (1000 * 60 * 60 * 24);

	return (
		<>
			{
				!gameOverStatus && <>
					<Box>
						<Text>
							NE Country Sim

							<Newline />

							Date: {date.toLocaleString('en-us', {
								month: 'long',
								day: 'numeric',
								year: 'numeric',
							})}

							<Newline />

							Happiness: {
								happiness > 700 ? (
									<Text color="green">[{
										'#'.repeat(Math.floor(happiness / 10)) + ' '.repeat(100 - Math.floor(happiness / 10))
									}] {Math.floor(happiness)}/1000</Text>
								) : (
									<Text color="red">[{
										'#'.repeat(Math.floor(happiness / 10)) + ' '.repeat(100 - Math.floor(happiness / 10))
									}] {Math.floor(happiness)}/1000</Text>
								)
							}

							<Newline />

							GDP: {GDP} billion
						</Text>
						<Spacer />
						<Text>
							Budget (accumulated over the 5 years):
							<Newline />
							Revenue: {(+(revenue / 365 * daysSinceStartOfYear).toFixed(2)).toFixed(2)} billion
							<Newline />
							Expenses: {(+(expenses / 365 * daysSinceStartOfYear).toFixed(2) + infrastructureExpenses).toFixed((2))} billion
							<Newline />
							Net: {(+((revenue - expenses) / 365 * daysSinceStartOfYear).toFixed(2) - infrastructureExpenses)
								.toFixed(2)} billion
							<Newline />
							Days since start of year: {daysSinceStartOfYear}
						</Text>
					</Box>
					<Box>
						<Text>
							<Newline />
							Choose your action:
							<Newline />
							1. Build infrastructure (e.g. schools, hospitals) for your country (cost: 100 million)
							{/* show only in 2020 Feb */}
							{(((date.getFullYear() === 2020 && date.getMonth() >= 1) || date.getFullYear() === 2021) && !has2BeenChosen) && (
								<>
									<Newline />
								2. Provide relief measures like relief funds, GST vouchers and worker wage subsidies (cost: 100 billion)
								</>
							)}
						</Text>
						<Spacer />
						<Text>
							<Newline />
							Events/Activity logs
							<Newline />
							{activityLog.map((log, index) => (
								<Fragment key={index}>
									{log}
									<Newline />
								</Fragment>
							))}
						</Text>
					</Box>

				</>
			}
		</>
	);
};

export default App;
