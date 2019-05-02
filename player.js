class Player {
    constructor() {
        this.pos = {
            x: 64,
            y: 225,
        }
        this.vel = {
            x: 0,
            y: 0
        }
        this.hitbox = {
            padding: 32,
            x: {
                left: () => (this.pos.x) + this.vel.x,
                right: () => (this.pos.x + this.hitbox.padding) + this.vel.x,
                top: () => this.pos.y,
                bottom: () => this.pos.y + this.hitbox.padding
            },
            y: {
                left: () => this.pos.x,
                right: () => this.pos.x + this.hitbox.padding,
                top: () => (this.pos.y) + this.vel.y,
                bottom: () => (this.pos.y + this.hitbox.padding) + this.vel.y
            }
        }
        this.acc = .3;
        this.dec = .95;
        this.jumpStats = {
            time: 0,
        }

        this.look = 6;

        this.activeGfx = {
            body: render.sprt.player.body,
            bands: render.sprt.player.bands,
        }
    }

    readInput(inp) {
        //if (inp.keys[inp.binds.up]) this.moveUp()
        //if (inp.keys[inp.binds.down]) this.moveDown()
        if (inp.keys[inp.binds.left]) this.moveLeft()
        if (inp.keys[inp.binds.right]) this.moveRight()
        if (inp.keys[inp.binds.jump]) this.jump()
        if (inp.keys[inp.binds.sprint]) this.acc = .3;
        else this.acc = .2;
    }

    updatePos() {
        !this.collision('x') ? this.pos.x += this.vel.x : this.vel.x = 0;

        this.collision('y') ? this.vel.x *= this.dec : this.vel.x *= this.dec + .01;

        if (!this.collision('y')) {
            this.pos.y += this.vel.y;
            this.vel.y += .3;
            this.activeGfx.bands = render.sprt.player.bandsJump;
        } else {
            this.vel.y = 0;
        }

        this.vel.y < 0 ? this.activeGfx.bands = render.sprt.player.bandsJump : this.activeGfx.bands = render.sprt.player.bands;
    }

    moveUp() {
        this.vel.y -= this.acc;
    }

    moveDown() {
        this.vel.y += this.acc;
    }

    moveLeft() {
        this.vel.x -= this.acc;
        if (this.look > 0) this.look--;
    }

    moveRight() {
        this.vel.x += this.acc;
        if (this.look < 12) this.look++;
    }

    jump() {
        if (this.collision('y')) this.vel.y = (-7 * (1 + this.acc))
    }

    collision(axis) {

        for (var i = 0; i < onScreen.length; i++) {
            var wall = onScreen[i];
            if (this.hitbox[axis].left() < wall.x + wall.width &&
                this.hitbox[axis].right() > wall.x &&
                this.hitbox[axis].top() < wall.y + wall.height &&
                this.hitbox[axis].bottom() > wall.y) {
                return true;
            };
        }
        return false;
    };
}