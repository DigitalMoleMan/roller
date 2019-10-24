
class Input {
    /**
     * 
     * @param {Object} binds Each object in binds represents a scene and is used as reference when checking if a certain keybind is being pressed.
     */
    constructor(binds = {}, touchAreas = {
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
                bind: "togglePause",
                x: block(1),
                y: block(0),
                width: block(2),
                height: block(2)
            }
        ],
        gameDialogue: [
            {
                bind: "next",
                x: block(0),
                y: block(0),
                width: canvasWidth,
                height: canvasHeight
            }
        ],
        pauseMenu: [
            {
                bind: "togglePause",
                x: block(1),
                y: block(0),
                width: block(2),
                height: block(2)
            }
        ]
    }
    ) {
        this.keys = new Object;
        this.binds = binds;


        if (!onMobile) {
            document.addEventListener('keydown', (e) => {
                var pressedKey = e.code;
                if (!this.keys[pressedKey]) document.dispatchEvent(new Event(pressedKey))
                this.keys[pressedKey] = true;
            });
            document.addEventListener('keyup', (e) => {
                var releasedKey = e.code;
                this.keys[releasedKey] = false;
            });
        } else {
            this.touchAreas = touchAreas;
            this.targetTouches = [];
            this.initTouchListenersOnElement(render.canvas);
        }

    }

    initTouchListenersOnElement(element) {
        element.addEventListener("touchstart", (e) => this.targetTouches = e.targetTouches, { passive: true });
        element.addEventListener("touchmove", (e) => this.targetTouches = e.targetTouches, { passive: true });
        element.addEventListener("touchend", (e) => this.targetTouches = e.targetTouches, { passive: true });
    }

    readMobileInput() {
        var touches = [];
        for (let targetTouch of this.targetTouches) touches.push(targetTouch);

        this.touchAreas[activeScene].forEach(area => {
            if (touches.filter((t) => (t.clientX >= area.x
                && t.clientX <= area.x + area.width
                && t.clientY >= area.y
                && t.clientY <= area.y + area.height)).length > 0) {
                if (!this.keys[this.binds[activeScene][area.bind]]) document.dispatchEvent(new Event(this.binds[activeScene][area.bind]));
                this.keys[this.binds[activeScene][area.bind]] = true;
            } else this.keys[this.binds[activeScene][area.bind]] = false;
        })
    }

    setBinds(newBinds) {
        this.binds = newBinds;
    }

    setTouchAreas(newTouchAreas) {
        this.touchAreas = newTouchAreas;
    }
}