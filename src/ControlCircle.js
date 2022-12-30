import Circle from "./Circle";
import { easeAnimation } from "./utility";

class ControlCircle extends Circle {
  constructor({ ctx, x, y, radius, color }) {
    super({ ctx, x, y, radius, color });

    this.animateBackSpeed = 10;

    this.currentFrame = 0;
    this.step = 30;
  }
  movePosition({ x, y }) {
    this.y += y;
    this.x += x;
  }
  async animate(velocity, target) {
    const distance = {
      x: target.x - this.x,
      y: target.y - this.y,
    };

    const start = {
      x: this.x,
      y: this.y,
    };

    return new Promise((resolve) => {
      const animate = () => {
        if (this.currentFrame > this.step) {
          this.currentFrame = 0;
          return resolve();
        }

        // this.x = start.x + (distance.x / this.step) * this.currentFrame;
        // this.y = start.y + (distance.y / this.step) * this.currentFrame;

        this.x =
          start.x + easeAnimation(distance.x, this.currentFrame, this.step);
        this.y =
          start.y + easeAnimation(distance.y, this.currentFrame, this.step);

        this.currentFrame++;

        requestAnimationFrame(animate);
      };

      animate();
    });
  }
  /**
   * @deprecated
   * Probably will not be used anymore
   */
  async animateV1(velocity, target) {
    const direction = {
      x: Math.sign(velocity.x),
      y: Math.sign(velocity.y),
    };

    const moveAxisByTarget = (axis) => {
      if (
        (this[axis] <= target[axis] && direction[axis] === -1) ||
        (this[axis] >= target[axis] && direction[axis] === 1)
      ) {
        this[axis] = target[axis];
        return true;
      }

      this[axis] += velocity[axis] * this.animateBackSpeed;
      return false;
    };

    return new Promise((resolve) => {
      const animate = () => {
        const isXInTarget = moveAxisByTarget("x");
        const isYInTarget = moveAxisByTarget("y");

        if (isXInTarget && isYInTarget) {
          return resolve();
        }

        requestAnimationFrame(animate);
      };

      animate();
    });
  }
}

export default ControlCircle;
