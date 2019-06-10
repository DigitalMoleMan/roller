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
            var mobileButtons = [
                '^',
                'v',
                '<',
                '>'
            ]
            mobileButtons.forEach(input => {
                var button = document.createElement('button');
                
                button.onclick = console.log(input);
                button.innerHTML = input;

                mainDOM.appendChild(button);
            })
        }
    }

    mobileInput(input){
        console.log(input)
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