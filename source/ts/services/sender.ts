import { request, ClientRequest, OutgoingHttpHeaders, ServerResponse, IncomingMessage } from "http";
import { SEND_OPTIONS } from "./../data/constant";
import Config from "./../controllers/config";

class SenderService {
	public async send(data: string): Promise<void | string | Error> {
		const headers: OutgoingHttpHeaders = {
			"Content-Type": "application/x-www-form-urlencoded",
			"Content-Length": Buffer.byteLength(data)
		};

		const server: { hostname: string; port: number } = {
			hostname: Config.config.host,
			port: Config.config.port
		};

		const OPTIONS = Object.assign(SEND_OPTIONS, headers, server);

		return new Promise((resolve: (reason?: string | Error) => void): void => {
			const req: ClientRequest = request(OPTIONS, (res: IncomingMessage) => {
				/* Headers
				 console.log(`STATUS: ${res.statusCode}`);
				 console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
				*/
				res.setEncoding("utf8");

				let result: string = ``;
				res.on("data", (chunk: ServerResponse) => {
					result += chunk;
				});
				res.on("end", (): void => {
					resolve(result);
				});
			});
	
			req.on("error", resolve);
	
			if (data) req.write(data);
			req.end();
		});
	}
}

export default new SenderService();
