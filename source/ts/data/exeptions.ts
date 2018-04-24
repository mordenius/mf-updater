import { Steps } from "./constant";

export enum CustomErrorType {
	WARN = 1,
	CRITICAL = 2
}

export enum CustomErrorCode {
	PACKAGE = "11",
	PACKAGE_PARSE = "12",
	CONFIG = "13",
	CONFIG_PARSE = "14",
	VALIDATE_HOST_TYPE = "15",
	VALIDATE_HOST_FORMAT = "16",
	VALIDATE_PORT_TYPE = "17",
	VALIDATE_PORT_FORMAT = "18",
	STEP_OVER = "19",
	TEMP_WRITE = "20",
	TEMP_MISSING = "21",
	TEMP_STEP_INVALID = "22"
}

interface IDataError {
	readonly type?: CustomErrorType;
	readonly message: string;
}

export interface IUpdaterError extends IDataError {
	readonly type: CustomErrorType;
	readonly code: CustomErrorCode;
}

type TErrConstructor = (param?: (string | number)[]) => IDataError;

const CODE = CustomErrorCode;
const TYPE = CustomErrorType;

const error: { [code in CustomErrorCode]: IDataError } = {
	[CODE.PACKAGE]: {
		message: `Package.json is missing`
	},
	[CODE.PACKAGE_PARSE]: {
		message: `Package.json content JSON parse error`
	},
	[CODE.CONFIG]: {
		message: `main.config.json is missing`
	},
	[CODE.CONFIG_PARSE]: {
		message: `main.config.json content JSON parse error`
	},
	[CODE.VALIDATE_HOST_TYPE]: {
		message: `Config host must be a string but got '{sss}' with type '{sss}'`
	},
	[CODE.VALIDATE_HOST_FORMAT]: {
		message: `Config host '{sss}' is invalid`
	},
	[CODE.VALIDATE_PORT_TYPE]: {
		message: `Config port must be a number but got '{sss}' with type '{sss}'`
	},
	[CODE.VALIDATE_PORT_FORMAT]: {
		message: `Config port '{sss}' is invalid`
	},
	[CODE.STEP_OVER]: {
		message: `Number of steps exceeded allowed value`
	},
	[CODE.TEMP_WRITE]: {
		type: TYPE.WARN,
		message: `Can't write status temp file: {sss}`
	},
	[CODE.TEMP_MISSING]: {
		type: TYPE.WARN,
		message: `Status temp file not found: {sss}`
	},
	[CODE.TEMP_STEP_INVALID]: {
		type: TYPE.WARN,
		message: `Status step from temp file invalid: {sss}`
	}
};

class UpdaterError extends Error implements IUpdaterError {
	public readonly step: Steps;
	public readonly type: CustomErrorType;
	public readonly code: CustomErrorCode;
	
	constructor(code: CustomErrorCode, param?: (string | number)[]) {
		const err = error[code];
		const mes = (param && param.length > 0) ? UpdaterError.replace(err.message, param) : err.message;
		super(mes);
		this.type = err.type || TYPE.CRITICAL;
		this.code = code;
	}

	public static replace(message: string, param: (string | number)[]): string {
		const rx = /{sss}/g;
		let i = 0;
		return message.replace(rx, () => param[i++].toString());
	}

	// public toString(): string {
	// 	return this.message;
	// }
}

export default UpdaterError;
