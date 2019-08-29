class Input {
    constructor(binds = {
        //directions
        up: 'w',
        down: 's',
        left: 'a',
        right: 'd',

        //hotkeys
        prevItem: 'arrowleft',
        nextItem: 'arrowright',

        //actions
        jump: ' ',
        sprint: 'shift',
        use: 'e',

        //dev
        toggleDebug: 'f',
    }) {
        this.keys = new Object;
        this.binds = binds;

        this.targetTouches = [];
        document.addEventListener('keydown', (e) => {
            var pressedKey = e.key.toLowerCase();
            document.dispatchEvent(new Event(pressedKey))
            this.keys[pressedKey] = true
        });
        document.addEventListener('keyup', (e) => {
            var releasedKey = e.key.toLowerCase();
            this.keys[releasedKey] = false
            if (releasedKey == this.binds.toggleDebug) debug = !debug;
        });

        //} else
        if (onMobile) {
            render.canvas.addEventListener("touchstart", (e) => this.targetTouches = e.targetTouches, { passive: true });
            render.canvas.addEventListener("touchmove", (e) => this.targetTouches = e.targetTouches, { passive: true });
            render.canvas.addEventListener("touchend", (e) => this.targetTouches = e.targetTouches, { passive: true });
        }

    }

    readMobileInput() {

        var touches = [];

        for (var i = 0; i < this.targetTouches.length; i++) touches.push(this.targetTouches[i].clientX);

        this.keys[this.binds.left] = (touches.filter((t) => t <= canvasWidth / 5).length > 0)
        this.keys[this.binds.right] = (touches.filter((t) => t >= (canvasWidth / 5) && t <= (canvasWidth / 2)).length > 0);

        if (touches.filter((t) => t >= canvasWidth - (canvasWidth / 5)).length > 0) {
            document.dispatchEvent(new Event(this.binds.jump));
            this.keys[this.binds.jump] = true;
        } else this.keys[this.binds.jump] = false;

        if (touches.filter((t) => t >= (canvasWidth / 2) && t < canvasWidth - (canvasWidth / 5)).length > 0) {
            document.dispatchEvent(new Event(this.binds.use));
            this.keys[this.binds.use] = true;
        } else this.keys[this.binds.use] = false;
    }
    setBinds(newBinds) {
        this.binds = newBinds;
    }
}