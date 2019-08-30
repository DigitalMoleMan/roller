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

        this.ctx.font = "8px pixelMono";
        this.ctx.textBaseline = "top";


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

    toPattern(img) {

        var pat = this.ctx.createPattern(img, "repeat");
        return pat;
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
        scenes[activeScene]();
        if(debug) drawDebug();
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
    rect(x, y, width, height, color, scrollFactor = 1) {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(x - (this.camera.x * scrollFactor), y - (this.camera.y * scrollFactor), width, height);
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

    rectStroke(x, y, width, height, color, lineWidth = 1, scrollFactor = 1) {
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = lineWidth;
        this.ctx.strokeRect(x - (this.camera.x * scrollFactor), y - (this.camera.y * scrollFactor), width, height);
    }

    line(x1, y1, x2, y2, color) {
        this.ctx.strokeStyle = color;
        this.ctx.beginPath();
        this.ctx.moveTo(x1 - (this.camera.x), y1 - (this.camera.y));
        this.ctx.lineTo(x2 - (this.camera.x), y2 - (this.camera.y));
        this.ctx.stroke();
        this.ctx.restore();
    }

    /**
     * 
     * @param {Image} src 
     * @param {Number} x 
     * @param {Number} y 
     */
    img(src, x, y, scrollFactor = 1, scale = 1) {

        try {
            if(scale !== 1) {
                render.ctx.save();
                render.ctx.scale(scale, scale);
            }
            this.ctx.drawImage(src, (x - (this.camera.x * scrollFactor)) / scale, (y - (this.camera.y * scrollFactor)) / scale);
            if(scale !== 1) {
                render.ctx.restore();
            }
        } catch (error) {
            this.rect(x, y, 32, 32, "#f00");
            this.rectStroke(x, y, 32, 32, "#fff")
            this.text(src, x, y, 32, "#fff")
        }
    }

    imgScaled(src, x, y, scale, scrollFactor = 1) {


        this.ctx.drawImage(src, (x - (this.camera.x * scrollFactor)) / scale, (y - (this.camera.y * scrollFactor)) / scale);


    }



    text(text, x, y, scrollFactor, color) {
        this.ctx.fillStyle = color;

        this.ctx.fillText(text, (x - (this.camera.x * scrollFactor)), (y - (this.camera.y * scrollFactor)));
    }


    rotate(originX, originY, angle) {
        this.ctx.save();
        this.ctx.translate(originX, originY);
        this.ctx.rotate(angle);

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
        this.sources = [];
        this.tempSources = [];
        this.segments = [];
        this.polygons = [];
    }

    update() {
        this.sources = onScreenLights.concat(this.tempSources);

        this.tempSources.forEach(source => source.lifetime--);

        this.tempSources = this.tempSources.filter(source => source.lifetime > 0);

        var playerPoints = [{
            x: player.posX - 3,
            y: player.posY - 10
        }, {
            x: player.posX + 3,
            y: player.posY - 10
        }, {
            x: player.posX + 9,
            y: player.posY - 4
        }, {
            x: player.posX + 9,
            y: player.posY + 4
        }, {
            x: player.posX + 14,
            y: player.posY + 4,
        }, {
            x: player.posX + 16,
            y: player.posY + 6,
        }, {
            x: player.posX + 16,
            y: player.posY + 14,
        }, {
            x: player.posX + 14,
            y: player.posY + 16,
        }, {
            x: player.posX - 14,
            y: player.posY + 16,
        }, {
            x: player.posX - 16,
            y: player.posY + 14,
        }, {
            x: player.posX - 16,
            y: player.posY + 6,
        }, {
            x: player.posX - 14,
            y: player.posY + 4,
        }, {
            x: player.posX - 9,
            y: player.posY + 4
        }, {
            x: player.posX - 9,
            y: player.posY - 4,
        }]


        this.segments = this.toSegments(playerPoints)

        onScreenSegs.forEach(seg => {
            var segPoints = [{
                x: seg.x,
                y: seg.y
            }, {
                x: seg.x + seg.width,
                y: seg.y
            }, {
                x: seg.x + seg.width,
                y: seg.y + seg.height
            }, {
                x: seg.x,
                y: seg.y + seg.height
            }]
            this.segments.push(...this.toSegments(segPoints))
        })


        this.polygons = [];
        this.sources.forEach(source => this.polygons.push(this.getSightPolygon(source.x, source.y, source.radiusBorder())));


    }

    /**
     * 
     * @param {Array} points 
     */
    toSegments(points) {
        var pSegments = []
        for (var i = 0; i < points.length; i++) {
            if (i !== points.length - 1) {
                pSegments.push({
                    a: {
                        x: points[i].x,
                        y: points[i].y
                    },
                    b: {
                        x: points[i + 1].x,
                        y: points[i + 1].y
                    }
                })
            } else {
                pSegments.push({
                    a: {
                        x: points[i].x,
                        y: points[i].y
                    },
                    b: {
                        x: points[0].x,
                        y: points[0].y
                    }
                })
            }
        }

        return pSegments;
    }

    getSightPolygon(sightX, sightY, radiusBorder) {
        var segmentsBorder = radiusBorder.concat(this.segments);

        var points = ((segments) => {
            var a = [];
            segments.forEach((seg) => {
                a.push(seg.a, seg.b);
            });
            return a;
        })(segmentsBorder);

        var uniquePoints = ((points) => {
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

        var uniqueAngles = [];
        for (var j = 0; j < uniquePoints.length; j++) {
            var uniquePoint = uniquePoints[j];
            var angle = Math.atan2(uniquePoint.y - sightY, uniquePoint.x - sightX);
            uniquePoint.angle = angle;
            uniqueAngles.push(angle - 0.00001, angle, angle + 0.00001);
        }



        var intersects = [];
        for (var j = 0; j < uniqueAngles.length; j++) {
            var angle = uniqueAngles[j];

            var dx = Math.cos(angle);
            var dy = Math.sin(angle);

            var ray = {
                a: {
                    x: sightX,
                    y: sightY
                },
                b: {
                    x: sightX + dx,
                    y: sightY + dy
                }
            };

            var closestIntersect = null;
            for (var i = 0; i < segmentsBorder.length; i++) {
                var intersect = this.getIntersection(ray, segmentsBorder[i]);
                if (!intersect) continue;
                if (!closestIntersect || intersect.param < closestIntersect.param) {
                    closestIntersect = intersect;
                }
            }

            if (!closestIntersect) continue;
            closestIntersect.angle = angle;

            intersects.push(closestIntersect);
        }

        intersects = intersects.sort((a, b) => {
            return a.angle - b.angle;
        });

        return intersects;
    }

    getIntersection(ray, segment) {

        var r_px = ray.a.x;
        var r_py = ray.a.y;
        var r_dx = ray.b.x - ray.a.x;
        var r_dy = ray.b.y - ray.a.y;

        var s_px = segment.a.x;
        var s_py = segment.a.y;
        var s_dx = segment.b.x - segment.a.x;
        var s_dy = segment.b.y - segment.a.y;

        var r_mag = Math.sqrt(r_dx * r_dx + r_dy * r_dy);
        var s_mag = Math.sqrt(s_dx * s_dx + s_dy * s_dy);
        if (r_dx / r_mag == s_dx / s_mag && r_dy / r_mag == s_dy / s_mag) {
            return null;
        }

        var T2 = (r_dx * (s_py - r_py) + r_dy * (r_px - s_px)) / (s_dx * r_dy - s_dy * r_dx);
        var T1 = (s_px + s_dx * T2 - r_px) / r_dx;

        if (T1 < 0) return null;
        if (T2 < 0 || T2 > 1) return null;

        return {
            x: r_px + r_dx * T1,
            y: r_py + r_dy * T1,
            param: T1
        };
    }

    draw() {



        render.ctx.globalCompositeOperation = "lighter";


        for (var i = 0; i < this.polygons.length; i++) {
            this.drawPolygon(this.polygons[i], render.ctx, this.sources[i].gradient());
        }


        //render.rect(0,0,canvasWidth, canvasHeight, "#000000")

        render.ctx.globalCompositeOperation = "source-over";

        if (debug && !debug) {
            for (var i = 0; i < this.polygons.length; i++) {
                var polygon = this.polygons[i];
                render.ctx.strokeStyle = "#fff";
                render.ctx.moveTo(polygon[0].x - camera.x, polygon[0].y - camera.y);
                for (var i = 1; i < polygon.length; i++) {
                    var intersect = polygon[i];

                    render.ctx.lineTo(intersect.x - camera.x, intersect.y - camera.y);
                }
            }
            render.ctx.stroke();
            this.segments.forEach(seg => {
                render.line(seg.a.x, seg.a.y, seg.b.x, seg.b.y, "#f00");
                //render.rect(seg.a.x - 2, seg.a.y - 2, 4, 4, "#fff");
                //render.rect(seg.b.x - 2, seg.b.y - 2, 4, 4, "#fff");
            })
        }

    }

    drawPolygon(polygon, ctx, fillStyle) {

        ctx.fillStyle = fillStyle;
        ctx.beginPath();
        ctx.moveTo(polygon[0].x - camera.x, polygon[0].y - camera.y);
        for (var i = 1; i < polygon.length; i++) {
            var intersect = polygon[i];

            ctx.lineTo(intersect.x - camera.x, intersect.y - camera.y);
        }
        ctx.closePath();
        ctx.fill();
    }
}

class Light {
    constructor(x, y, offsetX, offsetY, radius, colorStops, options = {
        lifetime: 0
    }) {
        this.x = x;
        this.y = y;
        this.offsetX = offsetX;
        this.offsetY = offsetY;
        this.radius = radius;
        this.colorStops = colorStops;
        this.lifetime = options.lifetime;
        this.gradient = () => {
            var grd = render.ctx.createRadialGradient(this.x - camera.x, this.y - camera.y, 0, this.x - camera.x + this.offsetX, this.y - camera.y + this.offsetY, this.radius);
            this.colorStops.forEach(stop => grd.addColorStop(stop.index, stop.color));
            return grd;
        }

        this.radiusBorder = () => [{
            a: {
                x: this.x - this.radius + this.offsetX,
                y: this.y - this.radius + this.offsetY
            },
            b: {
                x: this.x + this.radius + this.offsetX,
                y: this.y - this.radius + this.offsetY
            }
        }, {
            a: {
                x: this.x + this.radius + this.offsetX,
                y: this.y - this.radius + this.offsetY
            },
            b: {
                x: this.x + this.radius + this.offsetX,
                y: this.y + this.radius + this.offsetY
            }
        }, {
            a: {
                x: this.x + this.radius + this.offsetX,
                y: this.y + this.radius + this.offsetY
            },
            b: {
                x: this.x - this.radius + this.offsetX,
                y: this.y + this.radius + this.offsetY
            }
        }, {
            a: {
                x: this.x - this.radius + this.offsetX,
                y: this.y + this.radius + this.offsetY
            },
            b: {
                x: this.x - this.radius + this.offsetX,
                y: this.y - this.radius + this.offsetY
            }
        }]
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
        glow: false
    }) {
        
        this.particles.push(particle);
        
    }
}