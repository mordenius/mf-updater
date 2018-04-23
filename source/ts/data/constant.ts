import { resolve } from "path";
import { RequestOptions } from "http";

export const PROGRAM_NAME: string = "TEST";
export const PACKAGE_FILE_PATH: string = resolve(`./package.json`);
export const TEMP_PATH: string = resolve(`./temp`);
export const TEMP_FILE_PATH: string = resolve(`${TEMP_PATH}/updater.txt`);
export const TOKEN_FILE_PATH: string = resolve(`${TEMP_PATH}/updater.token`);
export const CONFIG_PATH: string = resolve("./config");
export const CONFIG_FILE_PATH: string = resolve(`${CONFIG_PATH}/main.config.json`);

export const SEND_OPTIONS: RequestOptions = {
	hostname: "127.0.0.1",
	port: 3000,
	path: "/api/update",
	method: "POST",
	timeout: 500
};

export enum Steps {
	LAUNCH,
	CONFIG, // -- 1. Get config
	TEMP, // -- 2. Read temp file - Checking whether the update process was interrupted earlier
	TOKEN, // -- 3. Get token from server
	STOP, // -- 4. Stop main program process
	GIT, // -- 5. Git launch
	NPM, // -- 6. Npm Launch
	START, // -- 7. Start main program process
	EXIT // -- 8. Exit
}
