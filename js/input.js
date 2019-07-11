class Input {
    constructor(binds = {
        //directions
        up: 'w',
        down: 's',
        left: 'a',
        right: 'd',

        //actions
        jump: ' ',
        sprint: 'shift',

        //dev
        toggleDebug: 'f',
    }) {
        this.keys = new Object;
        this.binds = binds;


        //
        //if(!onMobile) {
        document.addEventListener('keydown', (e) => {
            var pressedKey = e.key.toLowerCase();

            this.keys[pressedKey] = true
        });
        document.addEventListener('keyup', (e) => {
            var releasedKey = e.key.toLowerCase();

            this.keys[releasedKey] = false
            if (releasedKey == this.binds.toggleDebug) debug = !debug;
        });

    //} else
     if (onMobile){
        const mobileLeft= document.getElementById("mobileLeft");
        const mobileRight= document.getElementById("mobileRight");
        const mobileFastLeft= document.getElementById("mobileFastLeft");
        const mobileFastRight= document.getElementById("mobileFastRight");
        const mobileJump = document.getElementById("mobileJump");

        mobileLeft.addEventListener("touchstart", (e) => this.keys[this.binds.left] = true, {passive: true})
        mobileLeft.addEventListener("touchend", (e) => this.keys[this.binds.left] = false, {passive: true})

        mobileRight.addEventListener("touchstart", (e) => this.keys[this.binds.right] = true, {passive: true})
        mobileRight.addEventListener("touchend", (e) => this.keys[this.binds.right] = false, {passive: true})

        mobileFastLeft.addEventListener("touchstart", (e) => {
            this.keys[this.binds.sprint] = true;
            this.keys[this.binds.left] = true;
        }, {passive: true})
        mobileFastLeft.addEventListener("touchend", (e) => {
            this.keys[this.binds.sprint] = false;
            this.keys[this.binds.left] = false;
        }, {passive: true})

        mobileFastRight.addEventListener("touchstart", (e) => {
            this.keys[this.binds.sprint] = true;
            this.keys[this.binds.right] = true;
        }, {passive: true})
        mobileFastRight.addEventListener("touchend", (e) => {
            this.keys[this.binds.sprint] = false;
            this.keys[this.binds.right] = false;
        }, {passive: true})

            mobileJump.addEventListener("touchstart", (e) => this.keys[this.binds.jump] = true, {passive: true})
            mobileJump.addEventListener("touchend", (e) => this.keys[this.binds.jump] = false, {passive: true})
       }

    }

    setBinds(newBinds) {
        this.binds = newBinds;
    }
}