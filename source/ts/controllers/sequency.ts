import { mkdirSync, writeFileSync, readFileSync } from "fs";
import Config from "./config";
import Proccess from "./process";
import Token from "./../services/token";
import Sender from "./../services/sender";

import { Steps, TEMP_PATH, TEMP_FILE_PATH } from "./../data/constant";
import StatusItem, { StatusItemCode } from "../data/statusItem";
import UpdaterError, { CustomErrorCode as ErrCode } from "../data/exeptions";

export type TProcessResult = [StatusItemCode] | [StatusItemCode, UpdaterError];
export type TProcess = () => TProcessResult;
export type TProcessAsync = () => Promise<TProcessResult>;

type TDummy = (code: StatusItemCode) => TProcessResult;

const dummy: TDummy = (code: StatusItemCode): TProcessResult => [code];

class SequencyController {
	private PROCESS: (TProcess | TProcessAsync)[] = [
		dummy.bind(null, StatusItemCode.LAUNCH) as TProcess,
		Config.init.bind(Config) as TProcess,
		this.checkTempFile.bind(this) as TProcess,
		Token.init.bind(Token) as TProcess
		// Proccess.stopMainProgramm.bind(Proccess) as () => Promise<StatusItem>,
		// dummy.bind(null, Steps.GIT) as () => StatusItem,
		// dummy.bind(null, Steps.NPM) as () => StatusItem,
		// Proccess.startMainProgramm.bind(Proccess) as () => Promise<StatusItem>,
		// Proccess.exit.bind(Proccess) as () => StatusItem
	];

	/**
	 * Current step of update process
	 */
	private step: Steps = Steps.LAUNCH;

	/**
	 * Current Status Item
	 */
	private item: StatusItem;

	/**
	 * Linear Step Switching
	 */
	public next(): void | never {
		if (this.step >= Steps.EXIT) throw new UpdaterError(ErrCode.STEP_OVER);
		this.step += 1;

		this.writeTempFile();
	}

	public async run(): Promise<void | never> {
		await this.runStep();
	}

	public async runStep(): Promise<void | never> {
		const codes: TProcessResult = await this.PROCESS[this.step]();

		const WITH_EX = 2;
		const err = codes.length === WITH_EX ? codes[1] : undefined;
		const item: StatusItem = new StatusItem(codes[0], err);

		if (item.reason) await Sender.send(item.reason.code);
		if (!item.isNext) throw item.reason;
		await Sender.send(item.code.toString());

		if (this.step === Steps.EXIT) return;
		this.next();
		await this.runStep();
	}

	/**
	 *  Checking whether the update process was interrupted earlier.
	 *  NaN or over step number will be ignored
	 */
	private checkTempFile(): TProcessResult {
		let content: string | Buffer;

		try {
			content = readFileSync(TEMP_FILE_PATH);
		} catch (err) {
			const error = new UpdaterError(ErrCode.TEMP_MISSING, [err.errno]);
			return [StatusItemCode.TEMP_WARN, error];
		}

		const step: number = Number(content);
		if (isNaN(step) || step > Steps.EXIT) {
			const error = new UpdaterError(ErrCode.TEMP_STEP_INVALID, [content.toString()]);
			return [StatusItemCode.TEMP_WARN, error];
		}

		this.step = step;
		return [StatusItemCode.TEMP_SUCCESS];
	}

	/**
	 * Write current step into temp file.
	 * Errors associated with working with the file system will be ignored
	 */
	private writeTempFile(): void {
		try {
			mkdirSync(TEMP_PATH);
		} catch (err) {
			const error = new UpdaterError(ErrCode.TEMP_WRITE, [err.errno]);
			Sender.send(error.code);
		}

		try {
			writeFileSync(TEMP_FILE_PATH, this.step);
		} catch (err) {
			const error = new UpdaterError(ErrCode.TEMP_WRITE, [err.errno]);
			Sender.send(error.code);
		}
	}
}

export default new SequencyController();
