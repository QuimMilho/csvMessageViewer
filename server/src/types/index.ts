export interface ConfigFile {
	mysql: boolean;
	mysqldb: MySQLConfig;
	server: ServerConfig;
}

export interface MySQLConfig {
	host: string;
	database: string;
	user: string;
	password: string;
	port: string;
}

export interface ServerConfig {
	port: number | 80 | 443;
	https: boolean;
	secret: string;
	callbackURL: string | 'http://localhost' | 'https://localhost';
	cookieDuration: number;
}
