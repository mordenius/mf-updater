import Sequency from "./controllers/sequency";
/**
 * Entry point
 */
class Main {
	/**
	 * Programm initialization
	 */
	public static init(): void | never {
		Sequency.run()
			.then(Main.exit)
			.catch(process.exit.bind(process));
	}

	/**
	 * Process exit with code '0'
	 */
	public static exit(): void {
		process.exit(0);
	}
}

Main.init();
