import UpdaterError, { CustomErrorCode } from "../../source/ts/data/exeptions";

describe(`Exeptions`, () => {
	it(`constructor by error code`, () => {
		const err = new UpdaterError(CustomErrorCode.CONFIG);
		expect(err.code).toEqual(CustomErrorCode.CONFIG);
	});

	it(`replace method`, () => {
		const str = UpdaterError.replace(`Some {sss}`, ["text"]);
		expect(str).toEqual(`Some text`);
	});

	it(`replace method few array item`, () => {
		const str = UpdaterError.replace(`Some {sss}, {sss} {sss}`, ["text", "More", "TEXT"]);
		expect(str).toEqual(`Some text, More TEXT`);
	});

	it(`constructor with replace param`, () => {
		const err = new UpdaterError(CustomErrorCode.VALIDATE_HOST_TYPE, [1, typeof 1]);
		expect(err.code).toEqual(CustomErrorCode.VALIDATE_HOST_TYPE);
		expect(err.message).toEqual(`Config host must be a string but got '1' with type 'number'`);
	});
});
