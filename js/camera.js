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
            if (target.x <= (this.x + render.canvas.width / 2) && (this.x > 0)) {
                this.x -= Math.round(((this.x + render.canvas.width / 2) - target.x) / this.speed.x);
            }
            if (target.x >= (this.x + render.canvas.width / 2) && (this.x + render.canvas.width) < world.width) {
                this.x += Math.round((target.x - (this.x + render.canvas.width / 2)) / this.speed.x);
            } 
            if ((target.y - render.canvas.height / 2) <= this.y && (this.y > 0)) {
                this.y -= Math.round(((this.y + render.canvas.height / 2) - target.y) / this.speed.y);
            }
            if ((target.y - render.canvas.height / 2) >= this.y && (this.y + render.canvas.height) < world.height) {
                this.y += Math.round((target.y - (this.y + render.canvas.height / 2)) / this.speed.y);
            }
            console.log('x: ' + this.x + ' y: ' + this.y);
    }
    
}