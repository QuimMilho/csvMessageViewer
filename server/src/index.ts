import fs from 'fs';
import { createConfigFile } from './config';
import Server from './server';
import { ConfigFile } from './types';

function start() {
	let err: number;
	let exit = false;
	// Creates the config file of the project!
	if (!fs.existsSync(process.cwd() + '/config.json')) {
		err = createConfigFile();
		if (err !== 0) {
			exit = true;
		}
	}

	// Creates public directory
	if (!fs.existsSync(process.cwd() + '/public')) {
		try {
			fs.mkdirSync(process.cwd() + '/public');
			console.log('Public directory created!');
		} catch (error) {
			console.log('Error creating directory public!');
			exit = true;
		}
	}

	// Exits the program if an error happens
	if (exit) {
		process.exit(1);
	}

	//Reads the config file

	const config: ConfigFile = JSON.parse(
		fs.readFileSync(process.cwd() + '/config.json').toString()
	);

	//Creates and starts the server instance!

	const server = new Server(config);
	server.start();
}

start();
