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
        //this.ctx.font = "8px Roboto Mono;";
        this.ctx.textBaseline = "top";

        document.body.appendChild(this.canvas);

        this.particleEngine = new ParticleEngine();
    }

    renewCanvas() {
        this.canvas.remove();
        this.canvas = document.createElement('canvas');
        this.canvas.width = canvasWidth;
        this.canvas.height = canvasHeight;
        this.ctx = this.canvas.getContext('2d', {
            alpha: false
        });
        this.ctx.imageSmoothingEnabled = false;
        this.ctx.textBaseline = "top";
        document.body.appendChild(this.canvas);
    }



    attatchCamera(camera) {
        this.camera = camera;
    }

    /**
     * @param {String} scene 
     */

    update() {
        //requestAnimationFrame(render.update)
        scenes[activeScene].draw();

        if (settings.misc.debugMode) drawDebug();
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
        let usesScale = (scale !== 1);


        this.ctx.drawImage(src,
            (x - (this.camera.x * scrollFactor)),
            (y - (this.camera.y * scrollFactor)),
            src.width * scale,
            src.height * scale
        );
    }

    drawSprite(spriteSheet, celIndex, x, y, scale, scrollFactor) {

        let sourceX = (spriteSheet.sourceWidth * Math.abs(celIndex)) % spriteSheet.source.width;
        this.ctx.drawImage(
            //source
            spriteSheet.source,
            sourceX,
            0,
            spriteSheet.sourceWidth,
            spriteSheet.sourceHeight,

            //destination
            (x - (this.camera.x * scrollFactor)),
            (y - (this.camera.y * scrollFactor)),
            spriteSheet.sourceWidth * scale,
            spriteSheet.sourceHeight * scale
        )
    }

    /**
     * 
     * @param {String} text 
     * @param {Number} x 
     * @param {Number} y 
     * @param {Number} size 
     * @param {Number} scrollFactor 
     */
    text(text, x, y, size = 2, scrollFactor = 0) {
        for (let i = 0; i < text.length; i++) {
            let dx = x + (i * (fontFile.sourceWidth * size));
            this.drawSprite(fontFile, text.charCodeAt(i), dx, y, size, scrollFactor);
        }
    }

}


class Camera {
    constructor(startX = 0, startY = 0, xSpeed = 15, ySpeed = 10) {
        this.x = startX;
        this.y = startY;
        this.speedX = xSpeed;
        this.speedY = ySpeed;
    }

    /**
     * 
     * @param {Object} target
     */
    follow(targetX, targetY) {
        /*
                let rotation = Math.atan2(targetY - this.posY, targetX - this.posX);
        
                this.posX += Math.cos(rotation) * this.speedX
                this.posY += Math.sin(rotation) * this.speedY
                */
        if (targetX <= (this.x + render.canvas.width / 2) && (this.x > 0)) {
            this.x -= (((this.x + render.canvas.width / 2) - targetX) / this.speedX);

        }

        if (targetX >= (this.x + render.canvas.width / 2) && (this.x + render.canvas.width) < world.width) {
            this.x += ((targetX - (this.x + render.canvas.width / 2)) / this.speedX);
        }

        if ((targetY - render.canvas.height / 2) <= this.y && (this.y > 0)) {
            this.y -= Math.round(((this.y + render.canvas.height / 2) - targetY) / this.speedY);
        }
        if ((targetY - (render.canvas.height / 2)) >= this.y && (this.y + render.canvas.height) < world.height) {
            this.y += Math.round((targetY - (this.y + render.canvas.height / 2)) / this.speedY);
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
        if (settings.graphics.enableLighting) {

            this.sources = world.lightSources.filter((tile) => (
                (camera.x - (canvasWidth)) < tile.x + tile.radius &&
                (camera.x + canvasWidth + (canvasWidth)) > tile.x - tile.radius &&
                (camera.y - (canvasHeight)) < tile.y + tile.radius &&
                (camera.y + canvasHeight + (canvasHeight)) > tile.y - tile.radius
            ));

            let playerPoints = [{
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

            for (let seg of onScreenSegs) {
                let segPoints = [{
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
            }


            this.polygons = [];
            for (let source of this.sources) this.polygons.push(this.getSightPolygon(source.x, source.y, source.radiusBorder()));

        }
    }

    /**
     * 
     * @param {Array} points 
     */
    toSegments(points) {
        let pSegments = []
        for (let i = 0; i < points.length; i++) {
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
        let segmentsBorder = radiusBorder.concat(this.segments);

        let points = ((segments) => {
            let a = [];
            for (let seg of segments) a.push(seg.a, seg.b);
            return a;
        })(segmentsBorder);

        let uniquePoints = ((points) => {
            let set = {};
            return points.filter((p) => {
                let key = p.x + "," + p.y;
                if (key in set) {
                    return false;
                } else {
                    set[key] = true;
                    return true;
                }
            });
        })(points);

        let uniqueAngles = [];
        for (let j = 0; j < uniquePoints.length; j++) {
            let uniquePoint = uniquePoints[j];
            let angle = Math.atan2(uniquePoint.y - sightY, uniquePoint.x - sightX);
            uniquePoint.angle = angle;
            uniqueAngles.push(angle - 0.00001, angle, angle + 0.00001);
        }



        let intersects = [];
        for (let j = 0; j < uniqueAngles.length; j++) {
            let angle = uniqueAngles[j];

            let dx = Math.cos(angle);
            let dy = Math.sin(angle);

            let ray = {
                a: {
                    x: sightX,
                    y: sightY
                },
                b: {
                    x: sightX + dx,
                    y: sightY + dy
                }
            };

            let closestIntersect = null;
            for (let point of segmentsBorder) {
                let intersect = this.getIntersection(ray, point);
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

        let r_px = ray.a.x;
        let r_py = ray.a.y;
        let r_dx = ray.b.x - ray.a.x;
        let r_dy = ray.b.y - ray.a.y;

        let s_px = segment.a.x;
        let s_py = segment.a.y;
        let s_dx = segment.b.x - segment.a.x;
        let s_dy = segment.b.y - segment.a.y;

        let r_mag = Math.sqrt(r_dx * r_dx + r_dy * r_dy);
        let s_mag = Math.sqrt(s_dx * s_dx + s_dy * s_dy);
        if (r_dx / r_mag == s_dx / s_mag && r_dy / r_mag == s_dy / s_mag) return null;

        let T2 = (r_dx * (s_py - r_py) + r_dy * (r_px - s_px)) / (s_dx * r_dy - s_dy * r_dx);
        let T1 = (s_px + s_dx * T2 - r_px) / r_dx;

        if (T1 < 0) return null;
        if (T2 < 0 || T2 > 1) return null;

        return {
            x: r_px + r_dx * T1,
            y: r_py + r_dy * T1,
            param: T1
        };
    }

    draw() {
        if (settings.graphics.enableLighting) {

            render.ctx.save();

            render.ctx.globalCompositeOperation = "lighter";
            render.ctx.filter = 'blur(6px)';

            for (let i = 0; i < this.polygons.length; i++) this.drawPolygon(this.polygons[i], render.ctx, this.sources[i].gradient());

            render.ctx.restore();


            if (settings.misc.debugMode) {
                for (let polygon of this.polygons) {
                    render.ctx.strokeStyle = "#fff";
                    render.ctx.moveTo(polygon[0].x - camera.x, polygon[0].y - camera.y);
                    for (let i = 1; i < polygon.length; i++) {
                        let intersect = polygon[i];
                        render.ctx.lineTo(intersect.x - camera.x, intersect.y - camera.y);
                    }
                }
                render.ctx.stroke();
                for (let seg of this.segments) render.line(seg.a.x, seg.a.y, seg.b.x, seg.b.y, "#f00");
            }
        }
    }

    drawPolygon(polygon, ctx, fillStyle) {

        ctx.fillStyle = fillStyle;
        ctx.beginPath();
        ctx.moveTo(polygon[0].x - camera.x, polygon[0].y - camera.y);
        for (let i = 1; i < polygon.length; i++) {
            let intersect = polygon[i];

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
            let grd = render.ctx.createRadialGradient(this.x - camera.x, this.y - camera.y, 0, this.x - camera.x + this.offsetX, this.y - camera.y + this.offsetY, this.radius);
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

    update() {

        this.particles.forEach((particle, index) => {
            if (particle.lifetime > 0) {
                particle.lifetime -= deltaTime
                render.rect(particle.x - (particle.size / 2), particle.y - (particle.size / 2), particle.size, particle.size, particle.color);
                particle.x += particle.velX * deltaTime;
                particle.y += particle.velY * deltaTime;
                particle.size -= .05;
            } else {
                this.particles.splice(index, 1);
            }

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

let pRandom = (n = 1) => (Math.random() - .5) * n;

class Particle {
    constructor(params) {
        for (let param in params) this[param] = params[param];
        render.particleEngine.particles.push(this);
    }
}

class DustParticle extends Particle {
    constructor(x, y, velX = 0, velY = 0) {
        let colorVal = 192 + Math.random() * 64;
        super({
            x: x,
            y: y,
            lifetime: (Math.random() * 25),
            velX: velX,
            velY: velY,
            size: 1 + (Math.random() * 3),
            color: `rgba(${colorVal},${colorVal},${colorVal},128)`
        })
    }
}

class MeteorParticle extends Particle {
    constructor(x, y, velX, velY) {
        let colorVal = 192 + Math.random() * 64;
        super({
            x: x + ((Math.random() - .5) * 32),
            y: y + ((Math.random() - .5) * 32),
            lifetime: (Math.random() * 25),
            velX: velX,
            velY: velY,
            size: 1 + (Math.random() * 1),
            color: `rgba(${colorVal},${colorVal / 2},0,128)`
        })
    }
}