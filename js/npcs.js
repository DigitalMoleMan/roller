
class Actor {
    constructor(posX, posY, onInteract, interactionRadius) {
        this.type = "actor";
        this.posX = posX;
        this.posY = posY;
        this.interactionRadius = interactionRadius;
        this.onInteract = () => onInteract();
    }
}

class Enemy {
    constructor(posX, posY) {
        this.posX = posX;
        this.posY = posY;
        this.type = "enemies";
    }
}

class Roamer extends Enemy {
    constructor(posX, posY) {
        super(posX + .5, posY + .5);
        this.hp = 3;
        this.velX = -1;
        this.alive = true;
        this.sprite = () => sprites.npcs.enemies.roamer;
    }

    update() {
        if (this.alive) {
            if (this.getCollision(world.segments)) this.velX -= this.velX * 2;
            this.posX += this.velX;

            this.getCollisionPlayer()
        }
    }

    getCollision(area, offsetX = 0, offsetY = 0) {
        for (let obj of area) {
            if (((this.posX - 8) + offsetX) < obj.x + obj.width &&
                ((this.posX + 8) + offsetX) > obj.x &&
                ((this.posY - 16) + offsetY) < obj.y + obj.height &&
                ((this.posY + 8) + offsetY) > obj.y) return true;
        };
        return false;
    }

    getCollisionPlayer(offsetX = 0, offsetY = 0) {
        if (((this.posX - 8) + offsetX) < player.hitbox.x.right() &&
            ((this.posX + 8) + offsetX) > player.hitbox.x.left() &&
            ((this.posY - 16) + offsetY) < player.hitbox.x.bottom() &&
            ((this.posY + 8) + offsetY) > player.hitbox.x.top()) {

            if (player.hitbox.x.bottom() > this.posY - 14 && player.velY > .1) {
                player.velY = -10;
                this.damage(1);
            } else {
                player.damage(1);
            }
        }
    }

    damage(amount) {
        this.hp -= amount;
        if (this.hp < 0) this.die();
    }

    die() {
        this.alive = false;
    }

    draw() {
        render.img(this.sprite()[Math.round(this.posX / 2) % this.sprite().length], this.posX - block(.5), this.posY - block(.5), 1, 2);

        if (settings.misc.debugMode) {
            render.rectStroke(this.posX - 8, this.posY - 8, 16, 24, "#f00");
        }
    }
}

class SpikeGuard extends Enemy {

    constructor(posX, posY) {
        super(posX, posY);
        this.originX = posX;
        this.originY = posY;
        this.velX = 0;
        this.velY = 0;
        this.width = block(1);
        this.height = block(1);
        this.name = "spikeGuard";
        this.acceleration = .3;
        this.deceleration = .9;
        this.detectionRadius = 256;
        this.sprite = () => sprites.npcs.enemies.spikeGuard;
        this.sound = () => sfx.npcs.enemies.spikeGuard;

        this.blink = 0;

        this.light = new Light(this.posX, this.posY, (this.velX * this.detectionRadius), (this.velY * this.detectionRadius), this.detectionRadius, [{
            index: 0,
            color: "#00ffff40"
        }, {
            index: 1,
            color: "#0080ff40"
        }])
    }




    update() {

        this.fromPlayer = Math.sqrt(Math.pow(player.posX - this.posX, 2) + Math.pow(player.posY - this.posY, 2));


        this.fromOrigin = Math.sqrt(Math.pow(this.originX - this.posX, 2) + Math.pow(this.originY - this.posY, 2));

        if (this.fromPlayer < this.detectionRadius) {

            var rotation = Math.atan2(player.posY - this.posY, player.posX - this.posX);
            this.velX += Math.cos(rotation) * this.acceleration
            this.velY += Math.sin(rotation) * this.acceleration

        } else {
            var rotation = Math.atan2(this.originY - this.posY, this.originX - this.posX);
            this.velX += Math.cos(rotation) * this.acceleration
            this.velY += Math.sin(rotation) * this.acceleration

            if (Math.round(this.posX) == this.originX) {

                this.posX = this.originX;
                this.velX /= 2;
            }

            if (Math.round(this.posY) == this.originY) {
                this.posY = this.originY;
                this.velY /= 2;
            }

        }


        this.posX += this.velX;
        this.posY += this.velY;



        this.velX *= this.deceleration;
        this.velY *= this.deceleration;

        if (this.checkCollision()) {
            player.damage(1);
        }

        if (this.blink > 0) this.blink += .25;
        else if ((Math.floor(Math.random() + .005) == 1)) this.blink = 1;

        if (this.blink == (this.sprite().idle.length - 1)) this.blink = 0;
        this.light = new Light(this.posX + (this.velX * 3), this.posY + (this.velY * 3), (this.velX * this.detectionRadius), (this.velY * this.detectionRadius), this.detectionRadius, [{
            index: 0,
            color: "#ffffffff"
        }, {
            index: .005,
            color: "#0095e9ff"
        }, {
            index: .01,
            color: "#0095e980"
        }, {
            index: 1,
            color: "#00000000"
        }])
    }

    checkCollision() {
        if (player.posX < this.posX + 16 &&
            player.posX > this.posX - 16 &&
            player.posY < this.posY + 16 &&
            player.posY > this.posY - 16) return true;
        else return false;
    }

    draw() {

        render.img(this.sprite().idle[Math.floor(this.blink)], this.posX - (this.width / 2), this.posY - (this.height / 2))

        if (settings.misc.halloweenMode) render.img(this.sprite().hw, this.posX - (this.width / 2), this.posY - (this.height / 2))

        render.rect((this.posX - 2) + this.velX, (this.posY - 2) + this.velY, 4, 4, "#0095e9");

        if (settings.misc.debugMode) {
            render.line(this.posX - 16, this.posY, this.posX + 16, this.posY, "#fff");
            render.line(this.posX, this.posY - 16, this.posX, this.posY + 16, "#fff");
        }
    }
}

class LaserTurret extends Enemy {
    constructor(posX, posY) {
        super(posX + block(.5), posY + block(.5))

        this.angle = 0;

        this.sprite = () => sprites.npcs.enemies.laserTurret;
    }

    update() {
        this.angle = Math.atan2(player.posY - this.posY, player.posX - this.posX) * 180 / Math.PI;
    }

    draw() {
        render.img(this.sprite().base, this.posX, this.posY);
        render.img(this.sprite().arm, this.posX, this.posY)

        render.img(this.sprite().laser, this.posX, this.posY, 32, 32, this.posX, this.posY, this.angle + 180);
    }
}

class Bogus extends Actor {
    constructor(posX, posY, onInteract) {
        super(posX, posY, onInteract, block(3));
        this.drawnSprite = 'idle';

        this.playingAnimation = false;
        this.animProgress = 0;
        this.animLength = 112;
        this.sprite = () => sprites.npcs.bogus;
        this.sfx = () => sfx.npcs.bogus;
    }

    update() {

    }

    performHalloweenTransformation() {
        dialogue.hide = true;
        this.animProgress = 0;
        playSound(this.sfx().lightning)

        this.playingAnimation = true;

    }

    draw() {
        if (!this.playingAnimation) {
            render.img(this.sprite()[this.drawnSprite][Math.round(gameClock / 8) % this.sprite().idle.length], this.posX, this.posY);
        } else {
            if (this.sfx().lightning.currentTime) {
                render.ctx.drawImage(this.sprite().hw_anim, block(3) * this.animProgress, 0, block(3), block(5), block(30.5) - camera.x, block(0) - camera.y, block(6), block(10));

                if (this.animProgress < 48 || this.sfx().startup.currentTime) {
                    if (gameClock % 5 == 0) this.animProgress++;
                } else {
                    playSound(this.sfx().startup);
                }

                if (this.animProgress >= this.animLength) {

                    this.drawnSprite = 'boogus';
                    this.onInteract = () => dialogue.playDialogue(bogusDialogues[16])
                    this.playingAnimation = false;
                    playMusic(13);
                    dialogue.playDialogue(bogusDialogues[8])
                }
            } else render.img(this.sprite()[this.drawnSprite][Math.round(gameClock / 8) % this.sprite().idle.length], this.posX, this.posY);
        }
    }
}
