import { Steps } from "./constant";

export enum CustomErrorType {
	WARN = 1,
	CRITICAL = 2
}

export enum CustomErrorCode {
	CONFIG_PACKAGE = "11",
	CONFIG_PACKAGE_PARSE = "12",
	CONFIG_CONFIG = "13",
	CONFIG_CONFIG_PARSE = "14",
	CONFIG_VALIDATE_HOST_TYPE = "15",
	CONFIG_VALIDATE_HOST_FORMAT = "16",
	CONFIG_VALIDATE_PORT_TYPE = "17",
	CONFIG_VALIDATE_PORT_FORMAT = "18"
}

interface IDataError {
	readonly type: CustomErrorType;
	readonly message: string;
	readonly step: Steps;
}

export interface IUpdaterError extends IDataError {
	readonly code: CustomErrorCode;
}

type TErrConstructor = (param?: (string | number)[]) => IDataError;

const CODE = CustomErrorCode;
const TYPE = CustomErrorType;

const error: { [code in CustomErrorCode]: TErrConstructor } = {
	[CODE.CONFIG_PACKAGE]: (): IDataError => ({
		type: TYPE.CRITICAL,
		message: `Package.json is missing`,
		step: Steps.CONFIG
	}),
	[CODE.CONFIG_PACKAGE_PARSE]: (): IDataError => ({
		type: TYPE.CRITICAL,
		message: `Package.json content JSON parse error`,
		step: Steps.CONFIG
	}),
	[CODE.CONFIG_CONFIG]: (): IDataError => ({
		type: TYPE.CRITICAL,
		message: `main.config.json is missing`,
		step: Steps.CONFIG
	}),
	[CODE.CONFIG_CONFIG_PARSE]: (): IDataError => ({
		type: TYPE.CRITICAL,
		message: `main.config.json content JSON parse error`,
		step: Steps.CONFIG
	}),
	[CODE.CONFIG_VALIDATE_HOST_TYPE]: (param: string[]): IDataError => ({
		type: TYPE.CRITICAL,
		message: `Config host must be a string but got '${param[0]}' with type '${typeof param[0]}'`,
		step: Steps.CONFIG
	}),
	[CODE.CONFIG_VALIDATE_HOST_FORMAT]: (param: string[]): IDataError => ({
		type: TYPE.CRITICAL,
		message: `Config host '${param[0]}' is invalid`,
		step: Steps.CONFIG
	}),
	[CODE.CONFIG_VALIDATE_PORT_TYPE]: (param: number[]): IDataError => ({
		type: TYPE.CRITICAL,
		message: `Config port must be a number but got '${param[0]}' with type '${typeof param[0]}'`,
		step: Steps.CONFIG
	}),
	[CODE.CONFIG_VALIDATE_PORT_FORMAT]: (param: number[]): IDataError => ({
		type: TYPE.CRITICAL,
		message: `Config port '${param[0]}' is invalid`,
		step: Steps.CONFIG
	})
};

class UpdaterError extends Error implements IUpdaterError {
	public readonly step: Steps;
	public readonly type: CustomErrorType;
	public readonly code: CustomErrorCode;
	
	constructor(code: CustomErrorCode, param?: (string | number)[]) {
		const err = error[code](param);
		super(err.message);
		this.step = err.step;
		this.type = err.type;
		this.code = code;
	}
}

export default UpdaterError;
