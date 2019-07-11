class Renderer {
    constructor(canvasWidth, canvasHeight) {

        //canvas
        this.canvas = document.createElement('canvas');

        this.canvas.width = canvasWidth;
        this.canvas.height = canvasHeight;

        this.ctx = this.canvas.getContext('2d');

        this.ctx.imageSmoothingEnabled = false;


        //text
        this.ctx.font = "8px monospace";
        this.ctx.textBaseline = "top";
        //this.ctx.scale(2, 2);


        canvasContainer.appendChild(this.canvas);


        this.activeScene = 'game';

        //textures
        this.sprt;

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

    attatchCamera(camera) {
        this.camera = camera;
    }

    /**
     * @param {String} scene 
     */
    update() {
        requestAnimationFrame(render.update)
        scenes[render.activeScene]();
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
        this.ctx.fillRect(x - (this.camera.x), y - (this.camera.y), width, height);
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

    rectStroke(x, y, width, height, color) {
        this.ctx.strokeStyle = color;
        this.ctx.strokeRect(x - (this.camera.x), y - (this.camera.y), width, height);
    }

    line(x1, y1, x2, y2, color) {
        this.ctx.strokeStyle = color;
        this.ctx.beginPath();
        this.ctx.moveTo(x1 - (this.camera.x), y1 - (this.camera.y));
        this.ctx.lineTo(x2 - (this.camera.x), y2 - (this.camera.y));
        this.ctx.stroke();
    }

    /**
     * 
     * @param {Image} src 
     * @param {Number} x 
     * @param {Number} y 
     */
    img(src, x, y, width, height) {
        try {
            this.ctx.drawImage(src, (x - this.camera.x), (y - this.camera.y));
        } catch {
           this.rect(x, y, width, height, "#f00");
           this.rectStroke(x, y, width, height, "#fff")
            this.text(src, x, y, width, "#fff")
        }
    }

    imgStatic(src, x, y) {
        this.ctx.drawImage(src, x, y);
    }

    text(text, x, y, scrollFactor, color) {
        this.ctx.fillStyle = color;
        
        this.ctx.fillText(text, (x - (this.camera.x * scrollFactor)) , (y - (this.camera.y * scrollFactor)));
    }
}

class Camera {
    constructor(startX = 0, startY = 0) {
        this.x = startX;
        this.y = startY;
        this.speed = {
            x: 15,
            y: 10
        }
    }

    /**
     * 
     * @param {Object} target
     */
    follow(targetX, targetY) {
        if (targetX <= (this.x + render.canvas.width / 2) && (this.x > 0)) {
            this.x -= (((this.x + render.canvas.width / 2) - targetX) / this.speed.x);

        }

        if (targetX >= (this.x + render.canvas.width / 2) && (this.x + render.canvas.width) < world.width) {
            this.x += ((targetX - (this.x + render.canvas.width / 2)) / this.speed.x);
        }

        if ((targetY - render.canvas.height / 2) <= this.y && (this.y > 0)) {
            this.y -= Math.round(((this.y + render.canvas.height / 2) - targetY) / this.speed.y);
        }
        if ((targetY - (render.canvas.height / 2)) >= this.y && (this.y + render.canvas.height) < world.height) {
            this.y += Math.round((targetY - (this.y + render.canvas.height / 2)) / this.speed.y);
        }

        if (this.x < 0) {
            this.x = 0;
        }
        if ((this.x + render.canvas.width) > world.width) {
            this.x = world.width - render.canvas.width;
        }

        if ((this.y + render.canvas.height) > world.height) {
            this.y = world.height - render.canvas.height;
        }
        //console.log(this)
    }

}