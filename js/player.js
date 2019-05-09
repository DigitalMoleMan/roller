class Player {
    constructor() {
        this.pos = {
            x: 48,
            y: 920,
        }
        this.vel = {
            x: 0,
            y: 0
        }
        this.hitbox = {
            padding: 16,
            x: {
                left: () => (this.pos.x - this.hitbox.padding) + this.vel.x,
                right: () => (this.pos.x + this.hitbox.padding) + this.vel.x,
                top: () => this.pos.y - this.hitbox.padding / 2,
                bottom: () => this.pos.y + this.hitbox.padding
            },
            y: {
                left: () => this.pos.x - this.hitbox.padding,
                right: () => this.pos.x + this.hitbox.padding,
                top: () => (this.pos.y - this.hitbox.padding / 2) + this.vel.y,
                bottom: () => (this.pos.y + this.hitbox.padding) + this.vel.y
            }
        }
        this.acc = .3;
        this.dec = .95;
        this.jumpStats = {
            time: 0,
        }

        this.look = 6;
        this.band = 0;
        this.rotation = 0;
    }

    readInput(input) {
        //if (input.keys[input.binds.up]) this.moveUp()
        //if (input.keys[input.binds.down]) this.moveDown()
        if (input.keys[input.binds.left]) this.moveLeft();
        if (input.keys[input.binds.right]) this.moveRight();
        if (input.keys[input.binds.jump]) this.jump();
        if (input.keys[input.binds.sprint]) this.acc = .3;
        else this.acc = .2;
    }

    updatePos() {
        !this.collision('x') ? (this.pos.x += this.vel.x) : (this.vel.x = 0);

        this.collision('y') ? (this.vel.x *= this.dec) : (this.vel.x *= this.dec + .01);

        if (!this.collision('y')) {
            this.pos.y += this.vel.y;
            this.vel.y += .3;
        } else {
            this.vel.y = .1;
        }

        if (this.vel.y < 0 && !(input.keys[input.binds.jump])) {
            this.vel.y += .2;
        }

        this.band += this.vel.x;
        if (this.band < 0) this.band = 8;
        this.rotation = this.vel.x / 100;
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

    kill() {
        this.pos.x = 48;
        this.pos.y = 920;
    }

    collision(axis) {

        for (var i = 0; i < nearPlayer.length; i++) {
            var tile = nearPlayer[i];
            if (this.hitbox[axis].left() < tile.x + tile.width &&
                this.hitbox[axis].right() > tile.x &&
                this.hitbox[axis].top() < tile.y + tile.height &&
                this.hitbox[axis].bottom() > tile.y) {
                switch (tile.type) {
                    case 'X':
                        return true
                    case '-':
                        if (this.hitbox.x.bottom() <= tile.y) return true
                        else return false;
                    case '^':
                    if (this.pos.y <= tile.y - tile.velY) {
                        this.pos.y += (tile.velY / 4);
                        return true
                    }
                    break;   
                    case 'v':
                    if (this.pos.y <= tile.y - tile.velY) {
                        this.pos.y += (tile.velY / 4);
                        return true
                    }
                    break;   
                    case '<':
                        if (this.hitbox.x.bottom() <= tile.y) {
                            this.pos.x += tile.velX / 2;
                            return true;
                        }
                        break;
                    case '>':
                        if (this.hitbox.x.bottom() <= tile.y) {
                            this.pos.x += tile.velX / 2;
                            return true;
                        }
                        break;  
                    case 'M':
                        this.kill();
                        return false;
                        break;
                        case '/':
                        player.rotation = .25
                }
            };
        }
        return false;
    };
}