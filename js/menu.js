class Menu {
	constructor() {
		
		this.options = [
			{
				display: "Toggle Debug",
				bind: "toggleDebug",
				x: block(3.5),
				y: block(1.5),
				width: canvasWidth - block(7),
				height: block(2)
			},
			{
				display: "Settings",
				bind: "toggleDebug",
				x: block(3.5),
				y: block(4),
				width: canvasWidth - block(7),
				height: block(2)
			}
		]
		if (!onMobile) {
			this.selector = 0;
			document.addEventListener(input.binds["pauseMenu"].up, () => {
				this.selector--;
				if(this.selector < 0) this.selector = this.options.length - 1;
			});
			document.addEventListener(input.binds["pauseMenu"].down, () => {
				this.selector++;
				this.selector %= this.options.length;
			});
		}
		else this.options.forEach(option => input.touchAreas.pauseMenu.push(option));
	}

	update(){
		
		
	}

	draw() {

		var centerX = canvasWidth / 2;
		var centerY = canvasHeight / 2;
		render.rectStatic(0, 0, canvasWidth, canvasHeight, "#00000080");
		render.rectStatic(block(3), block(1), canvasWidth - block(6), canvasHeight - block(2), "#404060c0");

		this.options.forEach((option, i) => {
			render.rectStatic(option.x, option.y, option.width, option.height, "#8080f080");
			render.text(option.display, centerX - block(3), block(2.25) + (i * block(2.5)), 1);

			
		})

		if(!onMobile) {
			var o = this.options[this.selector]
			render.rectStroke(o.x - block(.25), o.y - block(.25), o.width + block(.5), o.height + block(.5),"#fff", 1, 0);
		}
	}
}