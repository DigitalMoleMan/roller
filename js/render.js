class Renderer {
    constructor(canvasWidth, canvasHeight) {

        //canvas
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');

       

        this.canvas.width = canvasWidth;
        this.canvas.height = canvasHeight;

        document.body.insertBefore(this.canvas, null);

        //textures
        this.sprt;

        this.init();

    }
    
    init() {
        this.ctx.imageSmoothingEnabled = false;
        //this.ctx.scale(2, 2);
        
        this.sprt = {
            player: {
                body: this.importSprite('img/player/body', 13),
                bands: this.importSprite('img/player/bands', 8),
                bandsJump: this.importSprite('img/player/bands_jump', 8),
            },
            tiles: {
                "X": this.importImage('img/tiles/block.png'),
                "-": this.importImage('img/tiles/platform.png'),
                "^": this.importImage('img/tiles/elevator.png'),
                "v": this.importImage('img/tiles/elevator.png'),
                "<": this.importImage('img/tiles/elevator.png'),
                ">": this.importImage('img/tiles/elevator.png'),
                "M": this.importImage('img/tiles/spikes.png')
            },
            enemies: {
                roamer: this.importSprite('img/npc/enemies/roamer', 4)
            }
        }
    }

    /**
     * imports an image.
     * @param {String} path directory of the image.
     */
    importImage(path) {
        var img = new Image;
        img.src = path;
        return (img);
    }

    /**
     * imports a series of images as a sprite
     * @param {String} path directory of the sprite.
     * @param {Number} length The number of frames the sprite has.
     * @returns {Array} returns an array where each index represents a frame.
     */
    importSprite(path, length) {

        var sprite = new Array;

        for (var i = 0; i < length; i++) {
            var img = this.importImage(path + '_' + i + '.png');
            sprite.push(img);
        }

        return sprite
    }

    attatchCamera(camera){
        this.camera = camera;
    }

    /**
     * @param {String} scene 
     */
    update() {
        scenes['game']();
    }

    /**
     * 
     * @param {Number} x 
     * @param {Number} y 
     * @param {Number} width 
     * @param {Number} height 
     * @param {String} color 
     */
    rect(x, y, width, height, color) {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(x - this.camera.x, y - this.camera.y, width, height);
    }

   /**
     * 
     * @param {Number} x 
     * @param {Number} y 
     * @param {Number} width 
     * @param {Number} height 
     * @param {String} color 
     */
    rectStatic(x, y, width, height, color) {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(x, y, width, height);
    }

    /**
     * 
     * @param {Image} src 
     * @param {Number} x 
     * @param {Number} y 
     */
    img(src, x, y) {
        this.ctx.drawImage(src, x - this.camera.x, y - this.camera.y);
    }

    imgStatic(src, x, y) {
        this.ctx.drawImage(src, x, y);
    }
}