#!/usr/bin/env node
import React from 'react';
import { render } from 'ink';
import App from './ui.js';
import meow from 'meow';

const cli = meow(`
	Usage
	  $ ne-country-sim

	Options
		--instructions, -i  Show instructions
		--credits, -c  Show credits

	Examples
	  $ ne-country-sim
`, {
	// importMeta: import.meta,
	flags: {
		instructions: {
			type: 'boolean',
			alias: 'i',
		},
		credits: {
			type: 'boolean',
			alias: 'c',
		},
	},
});


render(<App options={cli.flags} />);
