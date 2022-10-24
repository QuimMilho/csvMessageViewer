import { ConfigFile } from '../types';
import { Express } from 'express-serve-static-core';
import express, { Request, Response } from 'express';
import passport, { PassportStatic } from 'passport';
import MySQLStore from 'express-mysql-session';
import * as session from 'express-session';
import fs from 'fs';
import https from 'https';
import apiRouter from './api';

export default class Server {
	private config: ConfigFile;
	private app: Express;
	private passport: PassportStatic;
	private port: number;

	constructor(config: ConfigFile) {
		this.config = config;
	}

	start() {
		this.app = express();

		this.app.use(express.json());
		this.app.use(express.urlencoded({ extended: true }));

		const MySQLSessionStore = MySQLStore(session);
		let sessionStore: any;

		if (this.config.mysql) {
			sessionStore = new MySQLSessionStore(
				{
					schema: {
						tableName: 'sessions',
						columnNames: {
							session_id: 'sessionId',
							data: 'data',
							expires: 'expires',
						},
					},
				},
				this.config.mysqldb
			);
		}

		this.app.use(
			session.default({
				secret: this.config.server.secret,
				saveUninitialized: true,
				resave: false,
				cookie: { maxAge: this.config.server.cookieDuration },
				store: sessionStore,
			})
		);

		this.passport = passport;

		this.app.use(passport.initialize());
		this.app.use(passport.session());

		this.port = this.config.server.port || 3000;

		this.app.use('/api', apiRouter);
		this.app.get('/', this.sendIndexHTML);
		this.app.get('*', this.sendPublicFiles, this.sendIndexHTML);

		this.config.server.https ? this.startHTTPS() : this.startHTTP();
	}

	private startHTTPS() {
		console.log(this.port);
		const certPath = process.cwd() + '/certs/ssl.pem';
		const keyPath = process.cwd() + '/certs/key.pem';
		if (!(fs.existsSync(certPath) && fs.existsSync(keyPath))) {
			console.log(
				'Os ficheiros dos certificados nao existem!',
				'Os certificados devem estar numa pasta chamada certs e devem ter o nome ssl.pem e key.pem!'
			);
			process.exit(-1);
		}
		const certs = {
			cert: fs.readFileSync(certPath),
			key: fs.readFileSync(keyPath),
		};
		https.createServer(certs, this.app).listen(this.port, () => {
			console.log(`Server listening to https://localhost:${this.port}!`);
		});
	}

	private startHTTP() {
		this.app.listen(this.port, () =>
			console.log(`Server listening to http://localhost:${this.port}`)
		);
	}

	private sendPublicFiles(req: Request, res: Response, next: Function) {
		const path = process.cwd() + `/public/${req.params[0]}`;
		if (!fs.existsSync(path)) return next();
		res.status(200).sendFile(path);
	}

	private sendIndexHTML(req: Request, res: Response) {
		res.sendFile(process.cwd() + `/public/index.html`);
	}
}
