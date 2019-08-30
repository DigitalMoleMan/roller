class Input {
    constructor(binds = {
        game: {
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

            //misc
            togglePause: 'p',

            //dev
            toggleDebug: 'f',
        },
        pauseMenu: {
            togglePause: 'p'
        }
    }) {
        this.keys = new Object;
        this.binds = binds;


        if (onMobile) {
            this.touchAreas = {
                game: [
                    {
                        bind: "left",
                        x: block(0),
                        y: block(2),
                        width: block(5),
                        height: canvasHeight - block(2)
                    },
                    {
                        bind: "right",
                        x: block(5),
                        y: block(2),
                        width: block(5),
                        height: canvasHeight - block(2)
                    },
                    {
                        bind: "jump",
                        x: canvasWidth - block(5),
                        y: block(0),
                        width: block(5),
                        height: canvasHeight
                    },
                    {
                        bind: "use",
                        x: canvasWidth - block(10),
                        y: block(0),
                        width: block(5),
                        height: canvasHeight
                    },
                    {
                        bind: "pause",
                        x: block(1),
                        y: block(0),
                        width: block(2),
                        height: block(2)
                    }
                ],
                pauseMenu: [
                    {
                        bind: "unpause",
                        x: block(1),
                        y: block(0),
                        width: block(2),
                        height: block(2)
                    }
                ]
            }
            this.targetTouches = [];
        }

        document.addEventListener('keydown', (e) => {
            var pressedKey = e.key.toLowerCase();
            document.dispatchEvent(new Event(pressedKey))
            this.keys[pressedKey] = true
        });
        document.addEventListener('keyup', (e) => {
            var releasedKey = e.key.toLowerCase();
            this.keys[releasedKey] = false
            if (releasedKey == this.binds[activeScene].toggleDebug) debug = !debug;
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

        for (var i = 0; i < this.targetTouches.length; i++) touches.push(this.targetTouches[i]);

        this.touchAreas[activeScene].forEach(area => {
            if (touches.filter((t) => (t.clientX >= area.x && t.clientX <= area.x + area.width && t.clientY >= area.y && t.clientY <= area.y + area.height)).length) {
                document.dispatchEvent(new Event(this.binds[activeScene][area.bind]));
                this.keys[this.binds[activeScene][area.bind]] = true;
            } else this.keys[this.binds[activeScene][area.bind]] = false;
        })
    }

    setBinds(newBinds) {
        this.binds = newBinds;
    }
}