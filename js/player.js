class Player {
    constructor(posX = 0, posY = 0) {

        this.maxHp = 3;
        this.hp = this.maxHp;
        this.invsFrames = 0;

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
        this.acc = .4;
        this.dec = .93;


        this.jumpHeight = 0;
        this.midJump = false;

        this.fallDisable = false;

        this.colX = false;
        this.colY = false;

        this.look = 6;
        this.band = 0;

        document.addEventListener(input.binds.use, (e) => player.activeItem.use())
        document.addEventListener(input.binds.jump, (e) => {
            if (input.keys[input.binds.jump] !== true) player.jump()
        })

        this.activeItem = new Hookshot() //new Booster()

        this.sprite = () => sprites.player;
        this.sfx = () => sfx.player;


    }

    readInput(input) {
        //if (input.keys[input.binds.up]) this.moveUp()
        //if (input.keys[input.binds.down]) this.moveDown()
        if (input.keys[input.binds.left]) this.moveLeft();
        if (input.keys[input.binds.right]) this.moveRight();
        //if (input.keys[input.binds.jump]) this.jump();
        if (input.keys[input.binds.sprint]) this.acc = .4;
        //else this.acc = .16;

        /** 
        if((input.keys[input.binds.prevItem])) this.activeIndex--;
        if((input.keys[input.binds.nextItem])) this.activeIndex++;

        this.activeIndex %= this.items.length;
        if(this.activeIndex <= 0) this.activeIndex = this.items.length - 1;

        */

        // if (input.keys[input.binds.use]) this.use();
    }

    updatePos() {
        this.colX = this.collision('x');
        this.colY = this.collision('y');


        //console.log(`this.colX = ${this.colX}`)
        this.activeItem.update();


        if (this.colX && this.colY) {
            this.posX -= this.velX;
            this.posY -= this.velY;
        }

        var rotation = Math.atan2((this.posY + this.velY) - this.posY, (this.posX + this.velX) - this.posX);

        var dist = Math.sqrt(Math.pow(this.velX, 2) + Math.pow(this.velY, 2));

                    
                          //  this.posY += Math.sin(rotation)  //(this.posY - (this.target.y + (this.target.height / 2))) / 3;

        (!this.colX) ? this.posX += Math.cos(rotation) * dist: this.velX = 0;

        this.colY ? (this.velX *= this.dec) : (this.velX *= (this.dec + .01));

        if (!this.colY) {
            this.posY += Math.sin(rotation) * dist;//this.velY;
            (this.velY < 0) ? this.velY += .3: this.velY += .4;
        } else {
            if (this.velY > .1) this.velY *= .1;
            if (this.velY < 0) this.velY *= .1;
            if (this.velY < .1 && this.velY > -.1) this.velY = Math.round(this.velY * 100) / 100
            //this.posY = Math.round(this.posY)
        }



        if (this.colY && this.velY > 0) {

            if (this.midJump) {
                for (var i = 0; i < 25; i++) {
                    var colVal = 192 + Math.random() * 64;
                    render.pe.addParticle({
                        x: player.posX + ((Math.random() - .5) * 16),
                        y: (player.posY + 18),
                        velX: (Math.random() - .5) * 2.5,
                        velY: (Math.random()) / 5,
                        lifetime: (Math.random() * 25),
                        size: 1 + (Math.random() * 3),
                        color: `rgba(${colVal},${colVal},${colVal},128)`
                    })
                }
            }
            this.midJump = false;
            //this.velY -= .1;

        }

        if (this.velY < 0 && this.midJump && !(input.keys[input.binds.jump])) this.velY *= .9;


        this.jumpHeight = Math.round((-9 - ((Math.abs(this.velX) * .1))) * 100) / 100;


        this.band += this.velX;

        if (this.band < 0) this.band = sprites.player.bands.length * 100;
        if (this.posY >= world.height + 128) this.kill();

        if (this.invsFrames > 0) this.invsFrames--;


        //case handling
        if (this.velX < .01 && this.velX > -.01) this.velX = 0;

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
            (this.velY > 0) ? this.velY = this.jumpHeight: this.velY += this.jumpHeight;
            this.midJump = true;

            for (var i = 0; i < 50; i++) {
                var colVal = 192 + Math.random() * 64;
                render.pe.addParticle({
                    x: player.posX + Math.random(),
                    y: (player.posY + 12),
                    velX: (Math.random() - .5) * 1.5,
                    velY: (Math.random() - .5) / 4,
                    lifetime: (Math.random() * 20),
                    size: 1 + (Math.random() * 3),
                    color: `rgba(${colVal},${colVal},${colVal},128)`
                })
            }
        }
    }

    damage(amount) {
        if (this.invsFrames <= 0) {
            this.invsFrames = 60;
            this.hp -= amount;

            playSound(this.sfx().hurt);
            if (this.hp <= 0) this.kill();
        }
    }

    kill() {

        this.posX = world.spawn.x;
        this.posY = world.spawn.y;
        this.velX = 0;
        this.velY = 0;

        this.hp = this.maxHp;
        this.invsFrames = 0;
        camera.x = world.spawn.x - render.canvas.width / 2;
        camera.y = world.spawn.y - render.canvas.height / 2;
        this.activeItem.reset();

    }

    collision(axis) {

        for (var i = 0; i < nearPlayer.length; i++) {
            var tile = (nearPlayer[i]);
            if (this.hitbox[axis].left() < tile.x + tile.width &&
                this.hitbox[axis].right() > tile.x &&
                this.hitbox[axis].top() < tile.y + tile.height &&
                this.hitbox[axis].bottom() > tile.y) {
                switch (tile.type) {
                    case 'X':
                        return true;
                    case '-':
                        if (this.hitbox.x.bottom() <= tile.y) return true;
                        else break;
                    case '^':
                        if (this.hitbox.x.bottom() <= tile.y - tile.velY) {
                            this.midJump = false;
                            this.velY = tile.velY;
                            this.velY -= .1;
                        } else {
                            this.posY -= .1
                        }
                        break;

                        if (this.hitbox.x.bottom() <= tile.y + tile.height) {
                            this.velX += tile.velX
                            this.velY += tile.velY;
                        }

                        //}

                        break;
                    case 'v':
                        if (this.hitbox.x.bottom() <= tile.y - tile.velY) {
                            this.midJump = false;
                            this.velY = tile.velY;
                            this.velY -= .1;
                        } else {
                            this.posY -= .1
                        }
                        break;
                    case '<':

                        if (this.hitbox.x.bottom() <= tile.y + tile.height) {
                            this.midJump = false;
                            this.posX += tile.velX;
                            this.velY = 0;
                            if(axis == "x") return true;
                        }
                        break;
                    case '>':
                        if (this.hitbox.x.bottom() <= tile.y + tile.height) {
                            this.midJump = false;
                            this.posX += tile.velX;
                            this.velY = 0;
                            if(axis == "x") return true;
                        }
                        break;
                    case 'M':

                        this.damage(1);
                        return true;


                        break;

                    case 'W':

                        this.damage(1);
                        return true;
                        break;
                    case '#':
                        return true;
                        break;
                    case 'E':

                        world.loadLevel(level[tile.exit]);
                        gameClock = 0;
                        player.posX = tile.exitX;
                        player.posY = tile.exitY;
                        player.activeItem.reset();
                        render.camera.x = tile.exitX;
                        render.camera.y = tile.exitY;
                        return true;
                        break;
                }
            };
        }
        return false;
    };

    draw() {
        if (!(this.invsFrames % 3)) {

            this.activeItem.draw();
            render.img(this.sprite().body[this.look], (this.posX - 16), (this.posY - 16), 1);



            if (this.midJump) render.img(this.sprite().bandsJump[Math.floor(this.band) % this.sprite().bandsJump.length], (this.posX - 16), (this.posY - 16) + 2);
            else render.img(this.sprite().bands[Math.floor((this.band) % this.sprite().bands.length)], (this.posX - 16), (this.posY - 16));


            if (debug) {
                //render.line(this.posX - 8, this.posY, this.posX + 8, this.posY, "#fff");
               //render.line(this.posX, this.posY - 8, this.posX, this.posY + 8, "#fff");
            }
        }
    }
}

class Item {
    constructor(item = {
        unlockStatus: false
    }) {
        this.unlockStatus = item.unlockStatus;
    };
}

class Hookshot extends Item {
    constructor(posX, posY) {

        super();
        this.name = "hookshot"
        this.posX = posX;
        this.posY = posY;

        this.speed = 16;
        this.state = "retracted";

        this.maxLength = 256;
        this.length = 0;

        this.stiffness = 2;

        this.momentum = {
            x: 0,
            y: 0
        };

        this.angle = 0;

        this.closest;
        this.target;

        this.inputBuffer = 0;
        this.sprite = () => sprites.player.hookshot;
        this.sound = () => sfx.items.hookshot;
    }


    use() {
        if (this.state == "retracted") {
            this.inputBuffer = 20;
        }
    }

    reset() {
        this.posX = player.posX;
        this.posY = player.posY;
        this.state = "retracted";
        this.length = 0;
        this.angle = 0;
    }

    update() {

        var hookpoints = world.tiles.filter((tile) => (tile.type == "G"));
        this.closest = undefined;
        hookpoints.forEach(point => {
            point.fromPlayer = Math.sqrt(Math.pow((player.posX + (player.velX)) - (point.x + point.width / 2), 2) + Math.pow((player.posY + (player.velY)) - (point.y + point.height / 2), 2));


        });


        //this.closest = this.getClosest();
        //console.log(this.closest)
        switch (this.state) {
            case "retracted":
                this.posX = player.posX;
                this.posY = player.posY;
                this.length = 0;
                this.nodes = [];

                if (this.inputBuffer > 0) {
                    this.target = this.getClosest();
                    if (this.target !== undefined) {
                        this.inputBuffer = 0;
                        this.state = "shooting";
                        playSound(this.sound().shoot);
                    } else this.inputBuffer--;
                }
                break;
            case "shooting":


                //if (this.checkCollision(this.posX, this.posY, onScreen)) this.state = "retracting";

                if (Math.sqrt(Math.pow(player.posX - this.posX, 2) + Math.pow(player.posY - this.posY, 2)) > this.maxLength) this.state = "retracting";

                if (input.keys[input.binds.use]) {
                    try {
                        if (this.posX > this.target.x && this.posX < (this.target.x + this.target.width) &&
                            this.posY > this.target.y && this.posY < (this.target.y + this.target.height)) {
                            playSound(this.sound().hook);
                            player.midJump = false;
                            this.state = "hooked";

                            this.posX = (this.target.x + (this.target.width / 2))
                            this.posY = (this.target.y + (this.target.height / 2))

                            this.length = Math.sqrt(Math.pow(player.posX - this.posX, 2) + Math.pow(player.posY - this.posY, 2));



                            var rotation = Math.atan2(this.posY - player.posY, this.posX - player.posX);


                            //player.velY += Math.sin(rotation) * 5;
                            for (var i = 0; i < 10; i++) {
                                var colVal = (Math.random() * 255);
                                render.pe.addParticle({
                                    x: this.posX + (Math.random() - .5) * 12,
                                    y: this.posY + (Math.random() - .5) * 12,
                                    velX: (Math.random() - .5) * 3,
                                    velY: (Math.random() - .5) * 3,
                                    lifetime: 5 + (Math.random() * 10),
                                    size: 2 + (Math.random() - .5) * 2,
                                    color: `rgba(255,${colVal},0,255)`,
                                    glow: true
                                })

                            }
                           

                        } else {
                            var rotation = Math.atan2((this.target.y + (this.target.height / 2)) - this.posY, (this.target.x + (this.target.width / 2)) - this.posX);

                            this.posX += Math.cos(rotation) * this.speed //(this.posX - (this.target.x + (this.target.width / 2))) / 3;
                            this.posY += Math.sin(rotation) * this.speed //(this.posY - (this.target.y + (this.target.height / 2))) / 3;



                        }
                    } catch (error) {
                        this.state = "retracting";
                    }
                } else {
                    this.state = "retracting";
                }
                break;

            case "hooked": {

                if (player.midJump) this.state = "retracting";

                if (input.keys[input.binds.use]) {



                    var rotation = Math.atan2(this.posY - player.posY, this.posX - player.posX);
                    if (this.target.fromPlayer >= this.length) {

                        this.stiffness = (this.target.fromPlayer - this.length) / 4;

                        player.velX += (Math.cos(rotation) * this.stiffness) //+ this.momentum.x;
                        player.velY += (Math.sin(rotation) * this.stiffness) //+ this.momentum.y;



                    }
                    if (this.target.fromPlayer <= this.length + 8 && this.target.fromPlayer >= this.length - 32) {
                        player.dec = .96;
                    } else {
                        player.dec = .93;
                    }



                } else {
                    player.dec = .93;
                    player.midJump = true;
                    this.state = "retracting";
                }
            }
            break;
        case "retracting":
            player.dec = .93;
            this.length = 0;

            var rotation = Math.atan2(player.posY - this.posY, player.posX - this.posX);


            this.posX += Math.cos(rotation) * (this.speed * 2);
            this.posY += Math.sin(rotation) * (this.speed * 2);

            if (this.posX > player.posX - 16 && this.posX < (player.posX + 16) && this.posY > player.posY - 16 && this.posY < (player.posY + 16)) this.state = "retracted";

            break;
        }

        //this.momentum.x *= .9;
        //this.momentum.y *= .9;

        this.angle = (4 + (Math.round(((Math.atan2(player.posY - this.posY, player.posX - this.posX)) * 180 / Math.PI) / 45))) % 8;
    }

    getClosest() {

        var hookpoints = world.tiles.filter((tile) => (tile.type == "G"));
        hookpoints = hookpoints.filter((point) => point.fromPlayer < this.maxLength);
        hookpoints.forEach(point => {

            point.blocked = () => {
                var nodes = []

                var rotation = Math.atan2((point.y + point.height / 2) - this.posY, (point.x + point.width / 2) - this.posX);
                for (var i = 0; i < point.fromPlayer; i += 8) {
                    nodes.push({
                        x: player.posX + (Math.cos(rotation) * i),
                        y: player.posY + (Math.sin(rotation) * i)
                    })
                }
                for (var i = 0; i < nodes.length; i++) {


                    if (this.checkCollision(nodes[i].x, nodes[i].y, onScreen)) return true;
                }

                return false;
            }
        })
        hookpoints = hookpoints.filter((point) => (point.blocked() == false));


        if (hookpoints.length > 0) return hookpoints.reduce((prev, curr) => prev.fromPlayer < curr.fromPlayer ? prev : curr)
        else return undefined;
    }

    checkCollision(x, y, area) {
        for (var i = 0; i < area.length; i++) {
            var tile = area[i];
            if (x <= tile.x + tile.width &&
                x >= tile.x &&
                y <= tile.y + tile.height &&
                y >= tile.y) {
                if (tile.type !== "G") return true;
            }
        }
    }

    draw() {
        if (this.state !== "retracted") {
            render.line(player.posX, player.posY, this.posX, this.posY, "#fff")
            render.img(this.sprite()[this.angle], this.posX - 6, this.posY - 6);
        }

        if (debug) {
            try {
                render.rectStroke(this.target.x - 4, this.target.y - 4, 24, 24, "#fff")
            } catch (error) {}
        }
    }
}

class Booster extends Item {
    constructor() {
        super();
        this.name = "booster";

        this.state = "active";

        this.fuel = 20;


        this.sprite = () => sprites.player.equipment.booster[this.state];
        this.dir = () => ((player.look - 6) / 6);

    }

    update() {
        switch (this.state) {
            case "inactive":
                this.fuel = 20;
                if (input.keys[input.binds.use]) this.state = "active";
                break;
            case "active":
                player.velX += this.dir() / 2;
                this.fuel--;
                if (this.fuel <= 0) {
                    this.state = "cooldown"
                    this.cooldown = 100;
                }
                break;
            case "cooldown":
                this.cooldown--;
                if (this.cooldown <= 0) {
                    this.fuel = 20;
                    this.state = "inactive";
                }
                break;
        }
    }

    draw() {


        render.ctx.save();



        render.ctx.scale(this.dir(), 1)

        switch (this.state) {
            case "inactive":
                render.img(this.sprite(), ((player.posX) - (32 * this.dir())), player.posY - 32)

                break;
            case "active":

                render.img(this.sprite()[Math.round(gameClock / 4) % this.sprite().length], (player.posX) - (32 * this.dir()), player.posY - 32);

                var colVal = () => (Math.random() * 128);

                for (var i = 0; i < 1; i++) {
                    render.pe.addParticle({
                        x: (player.posX - (22 * this.dir())) + (Math.random() - .5) * 4,
                        y: (player.posY + 3) + (Math.random() - .5) * 4,
                        velX: (Math.random()) * (-this.dir()),
                        velY: (Math.random() - .5) * 1,
                        lifetime: 10 + (Math.random() * 10),
                        size: 4 + (Math.random() - .5) * 4,
                        color: `rgba(255,${128 + colVal()},0,255)`
                    })
                }

                break;
            case "cooldown":
                render.img(this.sprite(), ((player.posX) - (32 * this.dir())), player.posY - 32)
                break;
        }
        render.ctx.restore();
    }


}