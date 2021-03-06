class Player {
    constructor(posX = 0, posY = 0) {

        this.maxHp = 3;
        this.hp = this.maxHp;
        this.invsFrames = 0;

        this.posX = posX;
        this.posY = posY;
        this.velX = 0.00;
        this.velY = 0;
        this.hitbox = {
            paddingX: 16,
            paddingY: 16,
            x: {
                left: () => Math.round((this.posX - this.hitbox.paddingX) + (this.velX * deltaTime)),
                right: () => Math.round((this.posX + this.hitbox.paddingX) + (this.velX * deltaTime)),
                top: () => Math.round(this.posY - (this.hitbox.paddingY / 2)),
                bottom: () => Math.round(this.posY + this.hitbox.paddingY)
            },
            y: {
                left: () => Math.round(this.posX - this.hitbox.paddingX),
                right: () => Math.round(this.posX + this.hitbox.paddingX),
                top: () => Math.round((this.posY - this.hitbox.paddingY / 2) + (this.velY * deltaTime)),
                bottom: () => Math.round((this.posY + this.hitbox.paddingY) + (this.velY * deltaTime))
            }
        }
        this.acc = .4;
        this.dec = .93;

        this.jumpHeight = 0;
        this.midJump = false;

        this.colX = false;
        this.colY = false;

        this.look = 6;
        this.band = 0;

        document.addEventListener(input.binds.game.use, (e) => { if (activeScene == "game") player.activeItem.use() })
        document.addEventListener(input.binds.game.jump, (e) => { if (input.keys[input.binds.game.jump] !== true && activeScene == "game") player.jump() })

        this.activeItem = new Hookshot() //new Booster()

        this.sprite = sprites.player;
        this.sfx = sfx.player;
    }

    readInput(input) {
        let key = input.keys;
        let bind = input.binds.game;

        if (key[bind.left]) this.moveLeft();
        if (key[bind.right]) this.moveRight();

    }

    update() {
        this.colX = this.collision('x');
        this.colY = this.collision('y');

        this.activeItem.update();

        if (this.colX && this.colY) {
            this.posX -= this.velX * .5;
            this.posY -= this.velY * .5;
        }

        //decrease deceleration when in the air
        this.colY ? (this.velX *= this.dec) : (this.velX *= (this.dec + .01));

        if (this.colY && this.velY > 0) {
            if (this.velY > 24) {
                for (let i = 0; i < this.velY; i++) new MeteorParticle(
                    this.posX + ((Math.random() - .5) * 32),
                    this.hitbox.x.bottom(),
                    (Math.random() - .5) * 2.5,
                    (Math.random() - 1) * .5,
                );
            } else if (this.velY > 1) for (let i = 0; i < this.velY; i++) {
                new DustParticle(this.posX + pRandom(32), this.hitbox.x.bottom(), pRandom(this.velY / 5), -Math.random() / 5)
            }
            this.midJump = false;
        }

        //extend jump if player is holding the jump button
        if (this.velY < 0 && this.midJump && !(input.keys[input.binds.game.jump])) this.velY *= .9;

        //decrease the amount of frames until the player can take damage again.
        if (this.invsFrames) this.setInvsFrames(this.invsFrames - 1);

        //case handling
        if (this.velX < .01 && this.velX > -.01) this.velX = 0;

        //set player velocity to 0 on collision
        if (this.colX) this.velX = 0;

        this.updateSprite();

        this.updatePosition();
    }

    moveLeft() {
        this.velX -= this.acc;
    }

    moveRight() {
        this.velX += this.acc;
    }

    jump() {
        if (!this.midJump) {
            this.jumpHeight = this.calculateJumpHeight();

            (this.velY > 0) ? this.velY = -this.jumpHeight : this.velY -= this.jumpHeight;
            this.midJump = true;

            for (let i = 0; i < 10; i++) new DustParticle(this.posX + pRandom(32), this.hitbox.x.bottom(), pRandom(this.velY / 8), -Math.random() / 2);
            //playSound(this.sfx().jump);
        }
    }

    damage(amount) {
        if (this.invsFrames <= 0) {
            this.setInvsFrames(60)
            this.hp -= amount;
            // playSound(this.sfx().hurt);
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
        for (let tile of onScreenSegs.filter((tile) => (
            this.hitbox[axis].left() < tile.x + tile.width &&
            this.hitbox[axis].right() > tile.x &&
            this.hitbox[axis].top() < tile.y + tile.height &&
            this.hitbox[axis].bottom() > tile.y
        ))) {
            if (this.hitbox[axis].left() < tile.x + tile.width &&
                this.hitbox[axis].right() > tile.x &&
                this.hitbox[axis].top() < tile.y + tile.height &&
                this.hitbox[axis].bottom() > tile.y) {
                switch (tile.type) {
                    case 'barrier': return true;
                    case 'block': return true;
                    case 'platform':
                        if (this.hitbox.x.bottom() <= tile.y) return true;
                        else break;
                    case 'elevator':
                        if (this.hitbox.x.bottom() <= tile.y - tile.velY) {
                            this.posY += tile.velY * deltaTime;
                            this.posX += tile.velX * deltaTime;
                            if (this.hitbox.x.bottom() <= tile.y) return true;
                        }
                        break;
                    case 'pumpkin':
                        if (!hwQuest.started) return true;
                        else break;
                    case 'spikes': this.damage(1); return true;
                    case 'candy': tile.collect(); break;
                    case 'door':
                        world.loadLevel(level[tile.exit]);
                        gameClock = 0;
                        player.posX = tile.exitX;
                        player.posY = tile.exitY;
                        player.activeItem.reset();
                        render.camera.x = tile.exitX;
                        render.camera.y = tile.exitY;
                        return true;
                }
            };
        }
        return false;
    };

    updatePosition() {

        let rotation = Math.atan2((this.posY + this.velY) - this.posY, (this.posX + this.velX) - this.posX);

        let dist = Math.sqrt(Math.pow(this.velX, 2) + Math.pow(this.velY, 2)) * deltaTime;


        this.posX += (Math.cos(rotation) * dist)

        if (!this.colY) {
            this.posY += (Math.sin(rotation) * dist);//this.velY;
            (this.velY < 0) ? this.velY += .3 * deltaTime : this.velY += .4 * deltaTime;
        } else {
            if (this.velY > .1 || this.velY < 0) this.velY *= .1;
            if (this.velY < .1 && this.velY > -.1) this.velY = (Math.round(this.velY * 100) / 100);
            //this.posY = Math.round(this.posY)
        }
    }

    setInvsFrames(amount) {
        this.invsFrames = amount;
    }

    calculateJumpHeight() {
        let jh = Math.round((9 + (Math.abs(this.velX) * .1)) * 100) / 100;
        return jh
    }

    updateSprite() {
        if (this.velX > 0 && this.look < 12) this.look++;
        if (this.velX < 0 && this.look > 0) this.look--;
        this.band += this.velX * deltaTime;

        if (this.band < 0) this.band += 8;
    }

    draw() {

        this.activeItem.draw();
        if (!(this.invsFrames % 3)) {

            render.drawSprite(this.sprite.body, this.look, (this.posX - 16), (this.posY - 16), 1, 1);

            if (this.velY < -1) render.drawSprite(this.sprite.bandsJump, Math.round(this.band), this.posX - 16, this.posY - 14, 1, 1);
            if (this.velY > 1) render.drawSprite(this.sprite.bandsFall, Math.round(this.band), this.posX - 16, this.posY - 16, 1, 1);
            if (this.velY > 20) {
                for (let i = 0; i < this.velY; i++) new MeteorParticle(
                    this.posX,
                    this.posY,
                    (Math.random() - .5) * 5,
                    -this.velY / 5
                );
            }
        }
        if (this.velY > 24) {
            render.ctx.globalCompositeOperation = "hard-light";
            render.drawSprite(this.sprite.bandsMeteor, Math.round(gameClock), this.posX - 32, this.posY - 32, 2, 1);
            render.ctx.globalCompositeOperation = "source-over";
        }
        if (this.velY > -1 && this.velY < 1) render.drawSprite(this.sprite.bands, Math.round(this.band), this.posX - 16, this.posY - 16, 1, 1);

        if (settings.misc.debugMode) {
            render.line(this.posX - 8, this.posY, this.posX + 8, this.posY, "#fff");
            render.line(this.posX, this.posY - 8, this.posX, this.posY + 8, "#fff");
        }
    }
}

class Item {
    constructor() {
    };
}

class Hookshot extends Item {
    constructor(posX, posY) {
        super();
        this.name = "hookshot"
        this.posX = posX;
        this.posY = posY;

        this.speed = 16;
        this.returnSpeed = 32;
        this.state = "retracted";

        this.timeInAir = 0;

        this.minLength = 32;
        this.maxLength = 256;
        this.length = 0;

        this.stiffness = 2;

        this.angle = 0;

        this.target;

        this.inputBuffer = 0;
        this.sprite = sprites.items.hookshot;
        this.sfx = sfx.items.hookshot;

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
        player.dec = .93;
    }

    update() {

        let hookpoints = world.tiles.filter((tile) => (tile.type == 'hookpoint'));
        for (let point of hookpoints) {
            point.fromPlayer = Math.round(Math.sqrt(Math.pow((player.posX + player.velX) - (point.x + point.width / 2), 2) + Math.pow((player.posY + player.velY) - (point.y + point.height / 2), 2)));
        };



        switch (this.state) {
            case "retracted":
                this.posX = Math.round(player.posX);
                this.posY = Math.round(player.posY);
                this.length = 0;

                this.timeInAir = 0;

                this.target = this.getClosest();

                if (this.inputBuffer > 0) {

                    if (this.target !== undefined) {
                        this.inputBuffer = 0;
                        this.state = "shooting";

                        playSound(this.sfx.shoot);
                    } else this.inputBuffer--;
                }
                break;
            case "shooting":

                if (input.keys[input.binds.game.use]) {
                    if (this.posX > this.target.x &&
                        this.posX < (this.target.x + this.target.width) &&
                        this.posY > this.target.y &&
                        this.posY < (this.target.y + this.target.height)) {

                        playSound(this.sfx.hook, .2);
                        player.midJump = false;
                        this.state = "hooked";

                        this.posX = (this.target.x + (this.target.width / 2))
                        this.posY = (this.target.y + (this.target.height / 2))

                        this.length = Math.round(Math.sqrt(Math.pow(player.posX - this.posX, 2) + Math.pow(player.posY - this.posY, 2)));

                        for (let i = 0; i < 10; i++) {
                            let colVal = (Math.random() * 255);
                            render.particleEngine.addParticle({
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
                        let rotation = Math.atan2((this.target.y + (this.target.height / 2)) - this.posY, (this.target.x + (this.target.width / 2)) - this.posX);

                        this.posX += (Math.cos(rotation) * (this.speed)) * deltaTime
                        this.posY += (Math.sin(rotation) * (this.speed)) * deltaTime

                        this.timeInAir++;
                    }
                } else {
                    this.state = "retracting";
                }
                break;

            case "hooked": {

                this.timeInAir = 0;
                if (player.midJump) this.state = "retracting";

                if (input.keys[input.binds.game.use]) {

                    if ((input.keys[input.binds.game.up] || this.length > this.maxLength) && this.length > this.minLength) this.length -= 2
                    if ((input.keys[input.binds.game.down] || this.length < this.minLength) && this.length < this.maxLength) this.length += 2



                    let rotation = Math.atan2(this.posY - player.posY, this.posX - player.posX);
                    if (this.target.fromPlayer >= this.length) {

                        this.stiffness = (this.target.fromPlayer - this.length) / 4;

                        player.velX += (Math.cos(rotation) * this.stiffness);
                        player.velY += (Math.sin(rotation) * this.stiffness);
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
                this.timeInAir = 0;
                player.dec = .93;
                this.length = 0;

                let rotation = Math.atan2(player.posY - this.posY, player.posX - this.posX);


                this.posX += Math.cos(rotation) * (this.returnSpeed) * deltaTime;
                this.posY += Math.sin(rotation) * (this.returnSpeed) * deltaTime;

                if (this.posX > player.posX - 16 && this.posX < (player.posX + 16) && this.posY > player.posY - 16 && this.posY < (player.posY + 16)) this.state = "retracted";

                break;
        }

        this.angle = (4 + (Math.round(((Math.atan2(player.posY - this.posY, player.posX - this.posX)) * 180 / Math.PI) / 45))) % 8;
    }

    getClosest() {

        let hookpoints = onScreen.filter((tile) => (tile.type == 'hookpoint'));
        hookpoints = hookpoints.filter((point) => point.fromPlayer < this.maxLength);
        for (let point of hookpoints) point.blocked = this.checkPointBlocked(point)
        hookpoints = hookpoints.filter((point) => (point.blocked == false));


        if (hookpoints.length > 0) return hookpoints.reduce((prev, curr) => prev.fromPlayer < curr.fromPlayer ? prev : curr)
        else return undefined;
    }

    checkPointBlocked(point) {
        let nodes = []

        let rotation = Math.atan2((point.y + point.height / 2) - this.posY, (point.x + point.width / 2) - this.posX);
        for (let i = 0; i < point.fromPlayer; i += 8) {
            nodes.push({
                x: player.posX + (Math.cos(rotation) * i),
                y: player.posY + (Math.sin(rotation) * i)
            })
        }
        for (let node of nodes) {
            if (this.checkCollision(node.x, node.y, onScreenSegs)) return true;
        }

        return false;
    }

    checkCollision(x, y, area) {
        for (let tile of area) {
            if (x <= tile.x + tile.width &&
                x >= tile.x &&
                y <= tile.y + tile.height &&
                y >= tile.y) {
                if (tile.type !== 'hookpoint') return true;
            }
        }
    }

    draw() {

        //hook
        if (this.state !== "retracted") {
            render.line(player.posX, player.posY, this.posX, this.posY, "#fff")
            render.img(this.sprite.hook[this.angle], this.posX - 6, this.posY - 6);
        }

        //recticle
        if (this.target !== undefined) render.img(this.sprite.recticle, this.target.x - 8, this.target.y - 8)

        if (settings.misc.debugMode) {
            try { render.rectStroke(this.target.x - 4, this.target.y - 4, 24, 24, "#fff") }
            catch (error) { }
        }
    }
}

class Booster extends Item {
    constructor() {
        super();
        this.posX;
        this.posY;
        this.name = "booster";

        this.state = "inactive";

        this.fuel = 20;

        this.sprite = sprites.items.booster[this.state];
        this.dir = () => ((player.look - 6) / 6);

    }

    use() {
        if (this.state == "inactive" && this.fuel == 20) this.state = "active";
    }

    update() {
        this.posX = player.posX;
        this.pos
        switch (this.state) {
            case "inactive":
                this.fuel = 20;
                if (input.keys[input.binds.game.use]) this.state = "active";
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

        render.ctx.translate(player.posX, 0);
        render.ctx.scale(this.dir(), 1);

        switch (this.state) {

            case "active":

                render.img(this.sprite[Math.round(gameClock / 4) % this.sprite.length], -(player.look * 2), player.posY - 4);

                var colVal = () => (Math.random() * 128);

                for (var i = 0; i < 1; i++) {
                    render.particleEngine.addParticle({
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
            default: render.img(this.sprite, -(player.look * 2), player.posY - 4);
                break;
        }
        render.ctx.restore();
    }


}