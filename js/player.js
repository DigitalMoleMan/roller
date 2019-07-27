class Player {
    constructor(posX = 80, posY = 360) {

        this.posX = posX;
        this.posY = posY;
        this.velX = 0;
        this.velY = 0;
        this.extVelX = 0;
        this.extVelY = 0;
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

        this.activeEquipment = new Hookshot(0, 0);

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

        // if (input.keys[input.binds.use]) this.use();
    }

    updatePos() {

        this.extVelX = 0;
        this.extVelY = 0;

        var col = {
            x: this.collision('x'),
            y: this.collision('y')
        }

        this.colX = col.x
        this.colY = col.y

        //console.log(`col.x = ${col.x}`)
        this.activeEquipment.update();

        this.posX += this.extVelX;
        this.posY += this.extVelY;


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
            else if (this.velY < 0) this.velY *= .01;
        }



        if (col.y && this.velY >= 0) {

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
            this.velY -= .1;

        }

        if (this.velY < 0 && this.midJump && !(input.keys[input.binds.jump])) this.velY *= .9;


        if (this.velX < .01 && this.velX > -.01) {
            this.velX = 0;
            this.posX = Math.round(this.posX);
        }

        if (this.velY < .01 && this.velY > -.01) {
            this.velY = 0;
        }


        (col.y) ? this.jumpHeight = (-9 - ((Math.abs(this.velX) * .1))): this.jumpHeight = (-9 - ((Math.abs(this.velX) * .1)));

        this.band += this.velX;

        if (this.band < 0) this.band = 8;
        if (this.posY >= world.height + 128) this.kill();



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

    kill() {
        this.posX = world.spawn.x;
        this.posY = world.spawn.y;
        this.velX = 0;
        this.velY = 0;
        camera.x = world.spawn.x - render.canvas.width / 2;
        camera.y = world.spawn.y - render.canvas.width / 2;
        this.activeEquipment.state = "reset";
    }

    collision(axis) {

        for (var i = 0; i < nearPlayer.length; i++) {
            var tile = nearPlayer[i];
            if (this.hitbox[axis].left() < tile.x + tile.width &&
                this.hitbox[axis].right() > tile.x &&
                this.hitbox[axis].top() < tile.y + tile.height &&
                this.hitbox[axis].bottom() > tile.y) {
                switch (tile.type) {
                    case 'X': {
                        return true
                    }
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
                        /*
                        if (this.hitbox.x.bottom() <= tile.y + tile.height) {
                            
                            this.velY -= ((this.hitbox.x.bottom() - tile.y))

                            if (this.hitbox.x.bottom() <= tile.y) {
                                return true;
                            }

                        }
                        */
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
                        if (this.hitbox.x.bottom() <= tile.y + tile.height) {
                            this.posX += tile.velX;
                            this.velY -= ((this.hitbox.x.bottom() - tile.y))
                            return true;

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
                        
                            this.kill();
                            return false;
                        

                        break;

                    case 'W':
                        
                            this.kill();
                            return false;
                        break;
                    case '#':
                        return true;
                        break;
                    case 'E':

                        world.loadLevel(level[tile.exit]);
                        gameClock = 0;
                        player.posX = tile.exitX;
                        player.posY = tile.exitY;
                        render.camera.x = tile.exitX;
                        render.camera.y = tile.exitY;

                        return true;
                        break;
                }
            };
        }
        return false;
    };
}


class Hookshot {
    constructor(posX, posY) {
        this.posX = posX;
        this.posY = posY;
        this.name = "Hookshoot"


        this.speed = 16;
        this.state = "retracted";

        this.maxLength = 256;
        this.length = 0;

        this.angle = 0;

        this.closest;
        this.target;
    }

    update() {

        
        var hookpoints = world.tiles.filter((tile) => (tile.type == "G"));
        this.closest = undefined;
        hookpoints.forEach(point => {
            point.fromPlayer = Math.sqrt(Math.pow(player.posX - (point.x + point.width / 2), 2) + Math.pow(player.posY - (point.y + point.height / 2), 2));


            //console.log(nodes)
            //render.clear();

            point.blocked = () => {
                var nodes = []

                var rotation = Math.atan2((point.y + point.height / 2) - this.posY, (point.x + point.width / 2) - this.posX);
                for (i = 0; i < point.fromPlayer; i += 8) {
                    nodes.push({
                        x: player.posX + (Math.cos(rotation) * i),
                        y: player.posY + (Math.sin(rotation) * i)
                    })
                }
                for(i=0;i<nodes.length;i++) {
                    

                    if (this.checkCollision(nodes[i].x, nodes[i].y, onScreen)) return true;
                    
                    //render.rect(nodes[i].x, nodes[i].y, 1, 1, "#fff");
                }

                return false;
            }
        })
        hookpoints = hookpoints.filter((point) => (point.blocked() == false));
        hookpoints = hookpoints.filter((point) => (point.fromPlayer < this.maxLength * 1.75));
        if(hookpoints.length > 0) {
            this.closest = hookpoints.reduce((prev, curr) => prev.fromPlayer < curr.fromPlayer ? prev : curr)
        }
        //console.log(this.closest)
        switch (this.state) {
            case "reset":
                this.state = "retracted";
                this.length = 0;
                this.angle = 0;
                break;
            case "retracted":
                this.posX = player.posX;
                this.posY = player.posY;
                this.length = 0;
                this.nodes = [];
                try {
                    if (input.keys[input.binds.use] && this.closest != undefined) {

                        this.state = "shooting";
                        this.target = this.closest;


                        playSound(1);
                    }
                } catch {

                }
                break;
            case "shooting":


                if (this.checkCollision(this.posX, this.posY, onScreen)) this.state = "retracting";

                if (Math.sqrt(Math.pow(player.posX - this.posX, 2) + Math.pow(player.posY - this.posY, 2)) > this.maxLength) this.state = "retracting";

                if (input.keys[input.binds.use]) {
                    try {
                        if (this.posX > this.target.x && this.posX < (this.target.x + this.target.width) && this.posY > this.target.y && this.posY < (this.target.y + this.target.height)) {
                            playSound(0);
                            this.state = "hooked";

                            this.posX = (this.target.x + (this.target.width / 2))
                            this.posY = (this.target.y + (this.target.height / 2))

                            this.length = Math.sqrt(Math.pow(player.posX - this.posX, 2) + Math.pow(player.posY - this.posY, 2));


                            player.midJump = false;
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
                                    color: `rgba(255,${colVal},128,255)`
                                })
                            }

                        } else {
                            var rotation = Math.atan2((this.target.y + (this.target.height / 2)) - this.posY, (this.target.x + (this.target.width / 2)) - this.posX);

                            this.posX += Math.cos(rotation) * this.speed //(this.posX - (this.target.x + (this.target.width / 2))) / 3;
                            this.posY += Math.sin(rotation) * this.speed //(this.posY - (this.target.y + (this.target.height / 2))) / 3;



                        }
                    } catch {
                        this.state = "retracting";
                    }
                } else {
                    this.state = "retracting";
                }
                break;

            case "hooked": {

                //if(player.midJump) this.state = "retracting";

                if (input.keys[input.binds.use]) {
                    var dist = Math.sqrt(Math.pow(player.posX - this.posX, 2) + Math.pow(player.posY - this.posY, 2));
                    var rotation = Math.atan2(this.posY - player.posY, this.posX - player.posX);
                    if (this.target.fromPlayer >= this.length) {
                        player.velX += Math.cos(rotation); //(this.posX - player.posX) / 500;
                        player.velY += Math.sin(rotation); //(this.posY - player.posY) / 500;
                    }

                } else {
                    this.state = "retracting";
                }
            }
            break;
        case "retracting":
            this.length = 0;

            var rotation = Math.atan2(player.posY - this.posY, player.posX - this.posX);


            this.posX += Math.cos(rotation) * (this.speed * 2);
            this.posY += Math.sin(rotation) * (this.speed * 2);

            if (this.posX > player.posX - 16 && this.posX < (player.posX + 16) && this.posY > player.posY - 16 && this.posY < (player.posY + 16)) this.state = "retracted";

            break;
        }

        this.angle = (4 + (Math.round(((Math.atan2(player.posY - this.posY, player.posX - this.posX)) * 180 / Math.PI) / 45))) % 8;
    }

    checkCollision(x, y, area) {
        for (var i = 0; i < area.length; i++) {
            var tile = area[i];
            if (x < tile.x + tile.width &&
                x > tile.x &&
                y < tile.y + tile.height &&
                y > tile.y) {
                if (tile.type !== "G") return true;
            }
        }
    }
}