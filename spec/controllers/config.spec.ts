import { writeFileSync, renameSync } from "fs";
import { saveConfig, createFiles, removeFiles } from "./../_helpers/helper";
import { CONFIG_FILE_PATH, CONFIG_PATH, PACKAGE_FILE_PATH } from "./../../source/ts/data/constant";
import UpdaterError, { CustomErrorCode } from "./../../source/ts/data/exeptions";

import Config from "./../../source/ts/controllers/config";

describe("Configuration", () => {
	const init = Config.init.bind(Config);

	beforeAll(() => {
		createFiles();
		try {
			Config.init();
		} catch (err) {
			console.log(err.code, err.message);
		}
	});

	afterAll(() => {
		removeFiles();
	});

	it("read package.json", () => {
		const { name } = Config.config;
		expect(name).toEqual(`mf-updater`);
	});

	it("read main process config file", () => {
		const MAX_PORT: number = 65535;
		const { host, port } = Config.config;
		expect(host).toMatch(/\b((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(\.|$)){4}\b/g);
		expect(port).toBeGreaterThan(0);
		expect(port).toBeLessThan(MAX_PORT);
	});

	describe("Validation config data", () => {
		interface IConfigSpec {
			host: string | number;
			port: string | number;
		}

		const config: IConfigSpec = {
			host: `127.0.0.1`,
			port: 3000
		};

		it(`invalid host type`, async () => {
			config.host = 1;
			saveConfig(config);

			const result = await init();
			expect(result[1].message).toEqual(`Config host must be a string but got '1' with type 'number'`);
		});

		it(`invalid host format`, async () => {
			config.host = `127.259.0.1`;
			saveConfig(config);

			const result = await init();
			expect(result[1].message).toEqual(`Config host '127.259.0.1' is invalid`);
		});

		it(`invalid port type`, async () => {
			config.host = `127.0.0.1`;
			config.port = `10`;
			saveConfig(config);

			const result = await init();
			expect(result[1].message).toEqual(`Config port must be a number but got '10' with type 'string'`);
		});

		it(`invalid port format`, async () => {
			config.port = 0;
			saveConfig(config);

			const result = await init();
			expect(result[1].message).toEqual(`Config port '0' is invalid`);
		});
	});

	describe("JSON content parse error handling", () => {
		xit(`package.json content invalid`, () => {});

		it(`main.config.json content invalid`, async () => {
			writeFileSync(CONFIG_FILE_PATH, `not json`, "utf-8");

			const result = await init();
			expect(result[1].message).toEqual(`main.config.json content JSON parse error`);
		});
	});

	describe("Error handling when files is missing", () => {
		it(`package.json is missing`, async () => {
			renameSync(PACKAGE_FILE_PATH, `${PACKAGE_FILE_PATH}-test`);
			const result = await init();
			expect(result[1].message).toEqual(`Package.json is missing`);
			renameSync(`${PACKAGE_FILE_PATH}-test`, PACKAGE_FILE_PATH);
		});

		it(`main.config.json is missing`, async () => {
			removeFiles();
			const result = await init();
			expect(result[1].message).toEqual(`main.config.json is missing`);
		});
	});
});
