class Input {
    constructor(binds = {
        //directions
        up: 'w',
        down: 's',
        left: 'a',
        right: 'd',

        //actions
        jump: ' ',
        sprint: 'shift'
    }) {
        this.keys = new Object;
        this.binds = binds;


        document.addEventListener('keydown', (e) => this.keys[e.key.toLowerCase()] = true);
        document.addEventListener('keyup', (e) => this.keys[e.key.toLowerCase()] = false);

        if(onMobile){
            mobileLRstick.addEventListener("touchend", (e) => mobileLRstick.value = 0);
            mobileJump.addEventListener("touchstart", (e) => this.keys[this.binds.jump] = true)
            mobileJump.addEventListener("touchend", (e) => this.keys[this.binds.jump] = false)
         }
       
    }

    defaultBinds() {
        this.binds = {
            up: 'w',
            down: 's',
            left: 'a',
            right: 'd',

            //actions
            jump: ' ',
            sprint: 'shift'
        }
    }

    setBinds(newBinds) {
        this.binds = newBinds;
    }
}