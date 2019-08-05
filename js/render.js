class Renderer {
    constructor(canvasWidth, canvasHeight) {

        //canvas
        this.canvas = document.createElement('canvas');

        this.canvas.width = canvasWidth;
        this.canvas.height = canvasHeight;

        this.ctx = this.canvas.getContext('2d', {
            alpha: false
        });

        this.ctx.imageSmoothingEnabled = false;


        //text
        this.ctx.font = "8px monospace";
        this.ctx.textBaseline = "top";
        // this.ctx.scale(2, 2);


        canvasContainer.appendChild(this.canvas);


        this.activeScene //= 'game';

        this.pe = new ParticleEngine();

        //textures
        this.sprt;

    }

    refreshCanvas() {
        this.canvas.remove();
        canvasContainer.appendChild(this.canvas);
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

    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
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

    rectStroke(x, y, width, height, color, lineWidth = 1) {
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = lineWidth;
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
    img(src, x, y, width, height, originX, originY, rotation) {
        this.ctx.save();

        this.ctx.translate(originX - this.camera.x, originY - this.camera.y);
        this.ctx.rotate(rotation * (Math.PI / 180));
        this.ctx.translate(-(originX - this.camera.x), -(originY - this.camera.y));



        try {
            this.ctx.drawImage(src, (x - this.camera.x), (y - this.camera.y));
        } catch {
            this.rect(x, y, width, height, "#f00");
            this.rectStroke(x, y, width, height, "#fff")
            this.text(src, x, y, width, "#fff")
        }

        this.ctx.restore();
    }

    imgStatic(src, x, y) {
        this.ctx.drawImage(src, x, y);
    }

    text(text, x, y, scrollFactor, color) {
        this.ctx.fillStyle = color;

        this.ctx.fillText(text, (x - (this.camera.x * scrollFactor)), (y - (this.camera.y * scrollFactor)));
    }
}

class Camera {
    constructor(startX = 0, startY = 0, xSpeed = 15, ySpeed = 10) {
        this.x = startX;
        this.y = startY;
        this.speed = {
            x: xSpeed,
            y: ySpeed
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

class LightingEngine {
    constructor() {


        this.sources = []

    }

    update() {
        this.draw();
    }


    draw() {
        var segments = [];
        onScreen.forEach(block => {

            var tile = {
                x: block.x - camera.x,
                y: block.y - camera.y,
                width: block.width,
                height: block.height
            }
            segments.push({
                a: {
                    x: tile.x,
                    y: tile.y
                },
                b: {
                    x: tile.x + tile.width,
                    y: tile.y
                }
            }, {
                a: {
                    x: tile.x + tile.width,
                    y: tile.y
                },
                b: {
                    x: tile.x + tile.width,
                    y: tile.y + tile.height
                }
            }, {
                a: {
                    x: tile.x + tile.width,
                    y: tile.y + tile.height
                },
                b: {
                    x: tile.x,
                    y: tile.y + tile.height
                }
            }, {
                a: {
                    x: tile.x,
                    y: tile.y + tile.height
                },
                b: {
                    x: tile.x,
                    y: tile.y
                }
            }, )
        })
        for (var i = 0; i < segments.length; i++) {
            var seg = segments[i];
            render.ctx.beginPath();
            render.ctx.moveTo(seg.a.x, seg.a.y);
            render.ctx.lineTo(seg.b.x, seg.b.y);
            render.ctx.stroke();
        }

        var points = ((segments) => {
            var a = [];
            segments.forEach((seg) => {
                a.push(seg.a, seg.b);
            });
            return a;
        })(segments);
        var uniquePoints = ((p) => {
            var set = {};
            return points.filter((p) => {
                var key = p.x + "," + p.y;
                if (key in set) {
                    return false;
                } else {
                    set[key] = true;
                    return true;
                }
            });
        })(points);
    }

    getIntersection(ray,segment){

        // RAY in parametric: Point + Delta*T1
        var r_px = ray.a.x;
        var r_py = ray.a.y;
        var r_dx = ray.b.x-ray.a.x;
        var r_dy = ray.b.y-ray.a.y;
    
        // SEGMENT in parametric: Point + Delta*T2
        var s_px = segment.a.x;
        var s_py = segment.a.y;
        var s_dx = segment.b.x-segment.a.x;
        var s_dy = segment.b.y-segment.a.y;
    
        // Are they parallel? If so, no intersect
        var r_mag = Math.sqrt(r_dx*r_dx+r_dy*r_dy);
        var s_mag = Math.sqrt(s_dx*s_dx+s_dy*s_dy);
        if(r_dx/r_mag==s_dx/s_mag && r_dy/r_mag==s_dy/s_mag){
            // Unit vectors are the same.
            return null;
        }
    
        // SOLVE FOR T1 & T2
        // r_px+r_dx*T1 = s_px+s_dx*T2 && r_py+r_dy*T1 = s_py+s_dy*T2
        // ==> T1 = (s_px+s_dx*T2-r_px)/r_dx = (s_py+s_dy*T2-r_py)/r_dy
        // ==> s_px*r_dy + s_dx*T2*r_dy - r_px*r_dy = s_py*r_dx + s_dy*T2*r_dx - r_py*r_dx
        // ==> T2 = (r_dx*(s_py-r_py) + r_dy*(r_px-s_px))/(s_dx*r_dy - s_dy*r_dx)
        var T2 = (r_dx*(s_py-r_py) + r_dy*(r_px-s_px))/(s_dx*r_dy - s_dy*r_dx);
        var T1 = (s_px+s_dx*T2-r_px)/r_dx;
    
        // Must be within parametic whatevers for RAY/SEGMENT
        if(T1<0) return null;
        if(T2<0 || T2>1) return null;
    
        // Return the POINT OF INTERSECTION
        return {
            x: r_px+r_dx*T1,
            y: r_py+r_dy*T1,
            param: T1
        };
    
    }
}


class ParticleEngine {
    constructor() {
        this.particles = [];
    }

    tick() {

        this.particles.forEach((particle, index) => {
            render.rect(particle.x - (particle.size / 2), particle.y - (particle.size / 2), particle.size, particle.size, particle.color);
            particle.x += particle.velX;
            particle.y += particle.velY;
            particle.size -= .05;
            (particle.lifetime > 0) ? particle.lifetime--: this.particles.splice(index, 1);
        })


    }


    addParticle(particle = {
        x: 0,
        y: 0,
        velX: 0,
        vely: 0,
        lifetime: 10,
        size: 10,
        color: "#fff",
    }) {
        this.particles.push(particle);
    }
}