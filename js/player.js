class Player {
    constructor(posX = 80, posY = 360) {

        this.posX = posX;
        this.posY = posY;
        this.velX = 0;
        this.velY = 0;
        this.hitbox = {
            padding: 15.5,
            x: {
                left: () => (this.posX - this.hitbox.padding) + this.velX,
                right: () => (this.posX + this.hitbox.padding) + this.velX,
                top: () => this.posY - (this.hitbox.padding / 2),
                bottom: () => this.posY + this.hitbox.padding
            },
            y: {
                left: () => this.posX - this.hitbox.padding,
                right: () => this.posX + this.hitbox.padding,
                top: () => (this.posY - this.hitbox.padding / 2) + this.velY,
                bottom: () => (this.posY + this.hitbox.padding) + this.velY
            }
        }
        this.acc = .2;
        this.dec = .93;

        this.jumpHeight = 0;
        this.midJump = false;

        this.colX = false;
        this.colY = false;

        this.look = 6;
        this.band = 0;


    }

    readInput(input) {
        //if (input.keys[input.binds.up]) this.moveUp()
        //if (input.keys[input.binds.down]) this.moveDown()
        if (input.keys[input.binds.left]) this.moveLeft();
        if (input.keys[input.binds.right]) this.moveRight();
        if (input.keys[input.binds.jump]) this.jump();
        if (input.keys[input.binds.sprint]) this.acc = .4;
        else this.acc = .16;


    }

    updatePos() {
        var col = {
            x: this.collision('x'),
            y: this.collision('y')
        }

        this.colX = col.x
        this.colY = col.y

        //console.log(`col.x = ${col.x}`)


        if (col.x && col.y) {
            this.posX -= this.velX;
            this.posY -= this.velY;
        }

        !col.x ? (this.posX += this.velX) : (this.velX = 0);

        col.y ? (this.velX *= this.dec) : (this.velX *= this.dec + .01);




        if (!col.y) {
            this.posY += this.velY;
            (this.velY <= 0) ? this.velY += .3: this.velY += .4;
        } else {
            if (!this.midJump) this.velY = 0;
            else this.velY *= .01;
        }



        if (col.y && this.velY >= 0) {
            this.midJump = false;
            this.velY = 0;
        }

        if (this.velY < 0 && this.midJump && !(input.keys[input.binds.jump])) this.velY *= .9;


        if (this.velX < .01 && this.velX > -.01) {
            this.velX = 0;
            this.posX = Math.round(this.posX);
        }

        if (this.velY < .01 && this.velY > -.01) {
            this.velY = 0;
        }


        (col.y) ? this.jumpHeight = (-9 - ((Math.abs(this.velX) * .1))) : this.jumpHeight = (-9 - ((Math.abs(this.velX) * .1)));

        this.band += this.velX;

        if (this.band < 0) this.band = 8;
        if (this.posY >= world.height) this.kill();
    }

    moveLeft() {
        this.velX -= this.acc;
        if (this.look > 0) this.look--;
    }

    moveRight() {
        this.velX += this.acc;
        if (this.look < 12) this.look++;
    }

    jump() {
        if (!this.midJump) {
            (this.velY > 0) ? this.velY = this.jumpHeight : this.velY += this.jumpHeight;
            this.midJump = true;

            for (var i = 0; i < 100; i++) {
                var colVal = 192 + Math.random() * 64;
                render.pe.addParticle({
                    x: player.posX,
                    y: (player.posY + 12),
                    velX: (Math.random() - .5) * 1.5,
                    velY: .2 +(Math.random() + .5) / 4,
                    lifetime: (Math.random() * 25),
                    size: 1 + (Math.random() * 3),
                    color: `rgba(${colVal},${colVal},${colVal})`
                })
            }
        }
    }

    kill() {
        this.posX = world.spawn.x;
        this.posY = world.spawn.y;
        this.velX = 0;
        this.velY = 0;
        camera.x = world.spawn.x - render.canvas.width / 2;
        camera.y = world.spawn.y - render.canvas.width / 2;
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
                            this.velY = tile.velY;
                            this.velY -= .1;
                            return false;
                        } else {
                            this.posY -= .1
                        }
                        break;
                    case 'v':
                        if (this.hitbox.x.bottom() <= tile.y - tile.velY) {
                            this.midJump = false;
                            this.velY = tile.velY;
                            this.velY -= .1;
                            return false;
                        } else {
                            this.posY -= .1
                        }
                        break;
                    case '<':
                        if (this.hitbox.x.bottom() <= tile.y) {
                            this.midJump = false;

                            this.posX += tile.velX;

                            this.velY = 0;
                            return false;
                        }

                        break;
                    case '>':
                        if (this.hitbox.x.bottom() <= tile.y + tile.height) {
                            this.midJump = false;
                            this.posX += tile.velX;
                            this.velY = 0;
                            return false;
                        }
                        break;
                    case 'M':
                        if (this.hitbox.x.bottom() <= tile.y) {
                            this.kill();
                            return false;
                        }

                        

                    case 'W':
                        if (this.hitbox.x.top() >= (tile.y + tile.height)) {
                            this.kill();
                            return false;
                        }                        

                    case '#':
                        return true;
                }
            };
        }
        return false;
    };
}