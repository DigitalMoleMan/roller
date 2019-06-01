class Player {
    constructor(posX = 80, posY = 360) {
        this.pos = {
            x: posX,
            y: posY,
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
                top: () => this.pos.y - (this.hitbox.padding / 2),
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

        this.col;
        this.jumpStats = {
            time: 0,
        }

        this.look = 6;
        this.band = 0;
        this.midJump = false;
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
        console.log(this.vel.x);
        var col = {
                x: this.collision('x'),
                y: this.collision('y')
            }

            !col.x ? (this.pos.x += this.vel.x) : (this.vel.x = 0);

        col.y ? (this.vel.x *= this.dec) : (this.vel.x *= this.dec + .01);

        if (!col.y) {
            this.pos.y += this.vel.y;
            this.vel.y += .3;
        } else {
            this.vel.y /= 1.5;
            if (this.vel.y < 0) this.vel.y = 0;
        }


        if (col.y && this.vel.y > 0) this.midJump = false;

        if (this.vel.y < 0 && !(input.keys[input.binds.jump])) {
            this.vel.y += .2;
        }

        this.band += this.vel.x;
        if (this.band < 0) this.band = 8;

        if (this.pos.y >= world.height) this.kill();
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
        if (!this.midJump) {
            this.vel.y = (-7 * (1 + this.acc))
            this.midJump = true;
        }
    }

    kill() {
        this.pos.x = world.spawn.x;
        this.pos.y = world.spawn.y;
        this.vel.x = 0;
        this.vel.y = 0;
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
                    case '^':
                        if (this.hitbox.x.bottom() <= tile.y - tile.velY) {
                            this.midJump = false;
                            this.vel.y = tile.velY;
                            this.vel.y -= .1;
                            return false;
                        }
                        break;
                    case 'v':
                        if (this.hitbox.x.bottom() <= tile.y - tile.velY) {
                            this.midJump = false;
                            this.vel.y = tile.velY;
                            this.vel.y -= .1;
                            return false;
                        }
                        break;
                    case '<':
                        if (this.hitbox.x.bottom() <= tile.y) {
                            this.pos.x += tile.velX;
                            return true;
                        }
                        break;
                    case '>':
                        if (this.hitbox.x.bottom() <= tile.y) {
                            this.pos.x += tile.velX;
                            return true;
                        }
                        break;
                    case 'M':
                        this.kill();
                        return false;
                    case '#':
                        return true;
                }
            };
        }
        return false;
    };
}