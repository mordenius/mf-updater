import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";

import Sender from "./sender";
import { TProcessResult } from "../controllers/sequency";
import { TOKEN_FILE_PATH, TEMP_PATH } from "./../data/constant";
import { StatusItemCode } from "../data/statusItem";
import UpdaterError, { CustomErrorCode as ErrCode } from "../data/exeptions";

export interface IPayload {
	repo: string;
	commit: string;
}

class TokenParser {
	private token: string;
	private payload: string;
	private data: IPayload;

	public get getToken(): string {
		return this.token;
	}

	public get getData(): IPayload {
		return this.data;
	}

	public async init(): Promise<TProcessResult> {
		try {
			await this.callToken();
			return [StatusItemCode.TOKEN_SUCCESS];
		} catch (err) {
			try {
				this.parse();
				return [StatusItemCode.TOKEN_WARN, err];
			} catch (err) {
				return [StatusItemCode.CONFIG_ERROR, err];
			}
		}
	}

	public parse(): void {
		try {
			this.token = readFileSync(TOKEN_FILE_PATH, "utf-8");
		} catch (err) {
			throw new UpdaterError(ErrCode.TOKEN_READ, [err.message]);
		}
		
		const parsed: string[] = this.token.split(`.`);
		this.payload = parsed[1];

		try {
			const decode: string = new Buffer(this.payload, "base64").toString();
			this.data = JSON.parse(decode);
		} catch (err) {
			throw new UpdaterError(ErrCode.TOKEN_PARSE, [err.message]);
		}
	}

	public async callToken(): Promise<void | never> {
		const data: string = `token`;

		const result: void | string | Error = await Sender.send(data);

		if (result instanceof Error) throw new UpdaterError(ErrCode.TOKEN_REQUEST, [result.message]);

		try {
			if (!existsSync(TEMP_PATH)) mkdirSync(TEMP_PATH);
			writeFileSync(TOKEN_FILE_PATH, result, "utf-8");
		} catch (err) {
			throw new UpdaterError(ErrCode.TOKEN_SAVE, [err.message]);
		}
	}
}

export default new TokenParser();
