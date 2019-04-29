class Renderer {
    constructor() {

        //canvas
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');

        this.canvas.width = 800;
        this.canvas.height = 450;

        document.body.insertBefore(this.canvas, null);

        //textures
        this.sprt = {
            player: {
                body: this.importSprite('player', 'body', 13),
                bands: this.importSprite('player', 'bands', 8),
                bandsJump: this.importSprite('player', 'bands_jump', 8),
            }
        }

    }

    update() {
        scenes['game'].forEach(element => element());
    }

    /**
     * @returns {Array} Returns an array containing the sprites frames.
     * @param {String} dir Path.
     * @param {String} name The filename of the sprite.
     * @param {Number} length The number of frames the sprite has.
     */
    importSprite(dir, name, length) {

        var sprite = new Array;

        for (var i = 0; i < length; i++) {
            var img = new Image;
            img.src = 'img/' + dir + '/' + name + '_' + i + '.png';
            sprite.push(img);
        }

        return sprite
    }

    rectStatic(x, y, width, height, color) {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(x, y, width, height);
    }
    rect(x, y, width, height, color) {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(x - cam.x, y - cam.y, width, height);
    }

    img(src, x, y) {
        this.ctx.drawImage(src, x - cam.x, y - cam.y);
    }
}