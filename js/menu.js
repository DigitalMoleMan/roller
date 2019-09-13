class Menu {
	constructor() {
		this.selector = 0;

		addEventListener(input.binds.pauseMenu.up, () => {});
	}

	readInput(input) {
	}

	draw() {

		var centerX = canvasWidth / 2;
		var centerY = canvasHeight / 2;
		render.rectStatic(centerX - 128, centerY - 128, 256, 256, "#404060c0");
	}
}