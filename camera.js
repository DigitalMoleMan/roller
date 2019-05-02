class Camera {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.speed = {
            x: 15,
            y: 10
        }
    }


    /**
     * 
     * @param {Object} target
     */
    follow(target) {
        if (target.x <= (this.x + render.canvas.width / 2)) {
            this.x -= (((this.x + render.canvas.width / 2) - target.x) / this.speed.x);
        }
        if (target.x >= (this.x + render.canvas.width / 2)) {
            this.x += ((target.x - (this.x + render.canvas.width / 2)) / this.speed.x);
        }
        if ((target.y - render.canvas.height / 2) <= this.y) {
            this.y -= (((this.y + render.canvas.height / 2) - target.y) / this.speed.y);
        }
        if ((target.y - render.canvas.height / 2) >= this.y) {
            this.y += ((target.y - (this.y + render.canvas.height / 2)) / this.speed.y);
        }
    }
}