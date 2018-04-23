import { writeFileSync, mkdirSync, unlinkSync, rmdirSync } from "fs";
import http, { Server } from "http";
import { CONFIG_FILE_PATH, CONFIG_PATH } from "../../source/ts/data/constant";
import Config from "./../../source/ts/controllers/config";

const INDENT: number = 2;

export const saveConfig: (data: {}) => void = (data: {}): void => {
	const content: string = JSON.stringify(data, null, INDENT);
	writeFileSync(CONFIG_FILE_PATH, content, "utf-8");
};

export const createFiles: () => void | never = (): void | never => {
	try {
		mkdirSync(CONFIG_PATH);
		saveConfig({ host: `127.0.0.1`, port: 3000 });
	} catch (err) {
		if (err.code === `EEXIST`) {
			removeFiles();
			createFiles();
		} else throw err;
	}
};

export const removeFiles: () => void = (): void => {
	try {
		unlinkSync(CONFIG_FILE_PATH);
		rmdirSync(CONFIG_PATH);
	} catch (err) {
		if (err.code === `ENOENT`) return;
		else throw err;
	}
};

export const startServer: () => Promise<Server> = (): Promise<Server> =>
	new Promise((resolve: (server: Server) => void): void => {
		const server: Server = http.createServer();

		server.listen(Config.config.port, Config.config.host, (): void => {
			resolve(server);
		});
	});
