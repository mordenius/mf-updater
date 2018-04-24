import { readFileSync } from "fs";
import { Steps, CONFIG_FILE_PATH, PACKAGE_FILE_PATH } from "./../data/constant";
import StatusItem, { StatusItemCode } from "../data/statusItem";
import UpdaterError, { CustomErrorCode as ErrCode } from "./../data/exeptions";
import { TProcessResult } from "./sequency";

export interface IConfig {
	name: string;
	host: string;
	port: number;
}

class ConfigController {
	private name: string;
	private host: string;
	private port: number;

	public get config(): IConfig {
		const { name, host, port } = this;
		return { name, host, port };
	}

	public init(): TProcessResult {
		try {
			this.getProcessName();
			this.readMainConfig();
			return [StatusItemCode.CONFIG_SUCCESS];
		} catch (err) {
			return [StatusItemCode.CONFIG_ERROR, err];
		}
	}

	private getProcessName(): void {
		try {
			const content: string = readFileSync(PACKAGE_FILE_PATH, "utf-8");
			try {
				const parsed: { name: string } = JSON.parse(content);
				this.name = parsed.name;
			} catch (err) {
				throw new UpdaterError(ErrCode.PACKAGE_PARSE);
			}
		} catch (err) {
			if (err.code === "ENOENT") throw new UpdaterError(ErrCode.PACKAGE);
			else throw err;
		}
	}

	private readMainConfig(): void {
		try {
			const content: string = readFileSync(CONFIG_FILE_PATH, "utf-8");

			let parsed: { host: string; port: number };
			try {
				parsed = JSON.parse(content);
			} catch (err) {
				throw new UpdaterError(ErrCode.CONFIG_PARSE);
			}

			const { host, port }: { host: string; port: number } = parsed;
			this.validate(host, port);
			this.host = host;
			this.port = port;
		} catch (err) {
			if (err.code === "ENOENT") throw new UpdaterError(ErrCode.CONFIG);
			else throw err;
		}
	}

	private validate(host: string, port: number): void | never {
		if (typeof host !== "string") throw new UpdaterError(ErrCode.VALIDATE_HOST_TYPE, [host, typeof host]);

		if (!host.match(/\b((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(\.|$)){4}\b/g))
			throw new UpdaterError(ErrCode.VALIDATE_HOST_FORMAT, [host]);

		if (typeof port !== "number") throw new UpdaterError(ErrCode.VALIDATE_PORT_TYPE, [port, typeof port]);

		const MAX_PORT: number = 65535;
		if (port < 1 || port > MAX_PORT) throw new UpdaterError(ErrCode.VALIDATE_PORT_FORMAT, [port]);
	}
}

export default new ConfigController();
