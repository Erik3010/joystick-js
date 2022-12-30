class Circle {
  constructor({ ctx, x, y, radius, color = null }) {
    this.ctx = ctx;
    this.x = x;
    this.y = y;
    this.radius = radius;

    this.color = color;
  }
  draw() {
    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    this.ctx.closePath();

    if (this.color) {
      this.ctx.fillStyle = this.color;
      this.ctx.fill();
    }

    this.ctx.stroke();
    this.ctx.restore();
  }
}

export default Circle;
