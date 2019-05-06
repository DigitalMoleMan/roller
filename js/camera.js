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
        
        //console.log('x: ' + this.x + ' y: ' + this.y);
    }
}