
class Input {
    /**
     * 
     * @param {Object} binds Each object in binds represents a scene and is used as reference when checking if a certain keybind is being pressed.
     */
    constructor(binds = {}, touchAreas = {}) {
        this.keys = new Object;
        this.binds = binds;


        if (!onMobile) {
            document.addEventListener('keydown', (e) => {
                var pressedKey = e.code;
                if (!this.keys[pressedKey]) document.dispatchEvent(new Event(pressedKey))
                if (!this.keys[pressedKey]) document.dispatchEvent(new Event(`${pressedKey}_down`));
                this.keys[pressedKey] = true;
            });
            document.addEventListener('keyup', (e) => {
                var releasedKey = e.code;
                if (this.keys[releasedKey]) document.dispatchEvent(new Event(`${releasedKey}_up`));
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
        for (var i = 0; i < this.targetTouches.length; i++) touches.push(this.targetTouches[i]);

        this.touchAreas[activeScene].forEach(area => {
            if (touches.filter((t) => (t.clientX >= area.x
                && t.clientX <= area.x + area.width
                && t.clientY >= area.y
                && t.clientY <= area.y + area.height)).length > 0) {
                if (!this.keys[this.binds[activeScene][area.bind]]) document.dispatchEvent(new Event(this.binds[activeScene][area.bind] + '_down'));
                this.keys[this.binds[activeScene][area.bind]] = true;
            } else {
                document.dispatchEvent(new Event(this.binds[activeScene][area.bind] + '_up'));
                this.keys[this.binds[activeScene][area.bind]] = false;
            }
        })
    }

    setBinds(newBinds) {
        this.binds = newBinds;
    }

    setTouchAreas(newTouchAreas) {
        this.touchAreas = newTouchAreas;
    }
}

class InputValue {
    constructor(calc) {
        this.state = 0;
        this.value;
        this.calcValue = () => calc();
    }

    readValue() {
        this.value = this.calcValue();
        return this.value;
    };
}
class InputButton extends InputValue {
    constructor(inputBinds = []) {
        super(() => this.state);
        for (var bind of inputBinds) {
            document.addEventListener(`${bind}_down`, () => this.state = 1);
            document.addEventListener(`${bind}_up`, () => this.state = 0);
        }
    }
}

class InputDirection extends InputValue {
    constructor(negativeInput, positiveInput) {
        super(() => -negativeInput.readValue() + positiveInput.readValue());
    }
}

var testinput = new InputDirection(new InputButton(['KeyA']), new InputButton(['KeyD']));


var horizontalInput = new InputDirection(new InputButton(['KeyA']), new InputButton(['KeyD']));