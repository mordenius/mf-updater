import http, { Server, IncomingMessage, ServerResponse } from "http";
import { writeFileSync, mkdirSync, unlinkSync, rmdirSync } from "fs";
import { startServer, createFiles, removeFiles } from "./../_helpers/helper";
import { CONFIG_FILE_PATH, CONFIG_PATH } from "./../../source/ts/data/constant";
import Config from "./../../source/ts/controllers/config";

import Sender from "./../../source/ts/services/sender";

describe("Services Sender", () => {
	let server: Server;

	beforeAll(async () => {
		createFiles();
		Config.init();
		server = await startServer();
	});

	afterAll(async () => {
		await server.close();
		server = null;
		removeFiles();
	});

	it("send message", (done: () => void): void => {
		server.once("request", (req: IncomingMessage, res: ServerResponse) => {
			let data = "";
			req.on("data", (chunk: string) => (data += chunk));
			req.on("end", () => {
				expect(data).toEqual("12");
				res.end();
				done();
			});
		});

		Sender.send("12");
	});

	it("send error", (done: () => void): void => {
		server.once("request", (req: IncomingMessage, res: ServerResponse) => {
			let data = "";
			req.on("data", (chunk: string) => (data += chunk));
			req.on("end", () => {
				expect(data).toEqual(`custom error`);
				res.end();
				done();
			});
		});

		const err: Error = new Error(`custom error`);
		Sender.send(err.message);
	});

	xit("path check");
});
