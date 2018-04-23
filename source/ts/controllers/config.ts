import { readFileSync } from "fs";
import { CONFIG_FILE_PATH, PACKAGE_FILE_PATH } from "./../data/constant";
import UpdaterError, { CustomErrorCode } from "./../data/exeptions";

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

	public init(): void {
		this.getProcessName();
		this.readMainConfig();
	}

	private getProcessName(): void {
		try {
			const content: string = readFileSync(PACKAGE_FILE_PATH, "utf-8");
			try {
				const parsed: { name: string } = JSON.parse(content);
				this.name = parsed.name;
			} catch (err) {
				throw new UpdaterError(CustomErrorCode.CONFIG_PACKAGE_PARSE);
			}
		} catch (err) {
			if (err.code === "ENOENT") throw new UpdaterError(CustomErrorCode.CONFIG_PACKAGE);
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
				throw new UpdaterError(CustomErrorCode.CONFIG_CONFIG_PARSE);
			}
			
			const { host, port }: { host: string; port: number } = parsed;
			this.validate(host, port);
			this.host = host;
			this.port = port;
		} catch (err) {
			if (err.code === "ENOENT") throw new UpdaterError(CustomErrorCode.CONFIG_CONFIG);
			else throw err;
		}
	}

	private validate(host: string, port: number): void | never {
		if (typeof host !== "string")
			throw new UpdaterError(CustomErrorCode.CONFIG_VALIDATE_HOST_TYPE, [host]);

		if (!host.match(/\b((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(\.|$)){4}\b/g))
			throw new UpdaterError(CustomErrorCode.CONFIG_VALIDATE_HOST_FORMAT, [host]);

		if (typeof port !== "number")
			throw new UpdaterError(CustomErrorCode.CONFIG_VALIDATE_PORT_TYPE, [port]);

		const MAX_PORT: number = 65535;
		if (port < 1 || port > MAX_PORT)
			throw new UpdaterError(CustomErrorCode.CONFIG_VALIDATE_PORT_FORMAT, [port]);
	}
}

export default new ConfigController();
