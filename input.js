
class Input{
    constructor(){
        this.keys = new Object;
        this.binds = {
            up: 'w',
            down: 's',
            left: 'a',
            right: 'd',

            //actions
            jump: ' ',
            sprint: 'shift'
        }

        document.addEventListener('keydown', (e) => this.keys[e.key.toLowerCase()] = true);
        document.addEventListener('keyup', (e) => this.keys[e.key.toLowerCase()] = false);
    }
}