#!/usr/bin/env node
import React from 'react';
import { render } from 'ink';
import App from './ui';
import meow from 'meow';

const cli = meow(`
	Usage
	  $ ne-country-sim

	Options
		--help, -h  Show help
		--version, -v  Show version

	Examples
	  $ ne-country-sim
`, {
	importMeta: import.meta,
	flags: {
		help: {
			type: 'boolean',
			alias: 'h',
		},
	},
});


render(<App options={cli.flags} />);
