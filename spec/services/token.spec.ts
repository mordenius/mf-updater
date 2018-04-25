import { writeFileSync, unlinkSync, mkdirSync, rmdirSync, existsSync } from "fs";
import http, { Server, IncomingMessage, ServerResponse } from "http";
import { createFiles } from "./../_helpers/helper";
import Token, { IPayload } from "./../../source/ts/services/token";
import Config from "./../../source/ts/controllers/config";
import { TEMP_PATH, TOKEN_FILE_PATH } from "./../../source/ts/data/constant";

const DATA: IPayload = {
	repo: "https://127.0.0.1:3000/mf-updater/.git",
	commit: "e537bea49315d9952ad819446d00481d91bf7e10"
};

const TOKEN: string = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
	.eyJyZXBvIjoiaHR0cHM6Ly8xMjcuMC4wLjE6MzAwMC9tZi11cGRhdGVyLy5naXQiLCJ
	jb21taXQiOiJlNTM3YmVhNDkzMTVkOTk1MmFkODE5NDQ2ZDAwNDgxZDkxYmY3ZTEwIn0
	.sxoDy9lSpupV4UZZgBvNbuguICJUkwekHlMxS5bszDQ`;

const PORT: number = 3000;

const startServer: () => Promise<Server> = (): Promise<Server> =>
	new Promise((resolve: (server: Server) => void): void => {
		const server: Server = http.createServer((req: IncomingMessage, res: ServerResponse): void => {
			res.write(TOKEN);
			res.end();
		});

		server.listen(PORT, "127.0.0.1", (): void => {
			resolve(server);
		});
	});

describe("Token handling", () => {
	afterAll(async () => {
		unlinkSync(TOKEN_FILE_PATH);
		rmdirSync(TEMP_PATH);
	});

	describe("Call token from server", () => {
		let server: Server;

		beforeAll(async () => {
			server = await startServer();
			createFiles();
			Config.init();
		});
	
		afterAll(async () => {
			await server.close();
			server = null;
		});

		it(`call token`, async () => {
			await Token.callToken();
			expect(existsSync(TOKEN_FILE_PATH)).toBeTruthy();
		});
	});

	describe("Token parsing", () => {
		beforeAll(() => {
			Token.parse();
		});

		it(`token read success`, () => {
			expect(Token.getToken).toEqual(TOKEN);
		});
	
		it(`payload decode`, () => {
			const data: IPayload = Token.getData;
			expect(data.repo).toEqual(DATA.repo);
			expect(data.commit).toEqual(DATA.commit);
		});
	});
});
