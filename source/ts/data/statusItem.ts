import { Steps } from "./constant";
import UpdaterError, { CustomErrorCode } from "./exeptions";

// Codes of Status Items
// >10 - Rejected
// >20 - Warning
// >30 - Success
export enum StatusItemCode {
	LAUNCH = 30,

	CONFIG_ERROR = 11,
	CONFIG_SUCCESS = 31,

	TEMP_WARN = 22,
	TEMP_SUCCESS = 32,

	TOKEN_ERROR = 13,
	TOKEN_SUCCESS = 33
}

export interface IStatusItem {
	readonly code: StatusItemCode;
	readonly step: Steps;
	readonly isNext: boolean;
	readonly reason?: UpdaterError;
}

const OVER_CODE_ERROR: number = 10;
const OVER_CODE_WARN: number = 20;
const OVER_CODE_SUCCESS: number = 30;

class StatusItem implements IStatusItem {
	public readonly code: StatusItemCode;
	public readonly step: Steps;
	public readonly isNext: boolean;
	public readonly reason?: UpdaterError;

	constructor(code: StatusItemCode, errorCode?: UpdaterError) {
		this.code = code;
		this.isNext = code > OVER_CODE_WARN;
		this.step = this.calcStep();
		this.reason = errorCode || undefined;
	}

	private calcStep(): Steps {
		const scode = this.code.toString();
		const step = scode.substr(scode.length - 1);
		return Steps[step];
	}
}

export default StatusItem;
