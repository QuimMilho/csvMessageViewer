import { ConfigFile } from './types';
import fs from 'fs';
import { generateRandomId } from './utils';

export function createConfigFile(): number {
	console.log('Generating a new config file!');

	const config: ConfigFile = {
		mysql: false,
		mysqldb: { database: '', host: '', password: '', port: '', user: '' },
		server: {
			callbackURL: 'http://localhost',
			https: false,
			port: 80,
			secret: generateRandomId(64),
			cookieDuration: 60 * 60 * 1,
		},
	};

	try {
		fs.writeFileSync('config.json', JSON.stringify(config, null, 4));
	} catch (err) {
		console.log(err);
		return -1;
	}

	console.log('New config file created!');
	return 0;
}

createConfigFile();
