import { clamp, createElement, normalizeDegree, toDegree } from "./utility";
import Circle from "./Circle";
import ControlCircle from "./ControlCircle";
import { DIRECTION, DIRECTION_MAP } from "./constants";

class JoyStick {
  constructor({ selector, options, onMove }) {
    this.defaultOptions = {
      size: 300,
      padding: 0,
    };
    this.options = Object.assign({}, this.defaultOptions, options);
    this.onMove = onMove;

    this.selector = selector;
    this.containerEl = document.querySelector(this.selector);

    this.canvas = createElement("canvas", {
      props: {
        width: this.options.size,
        height: this.options.size,
        id: "canvas",
      },
    });
    this.ctx = this.canvas.getContext("2d");
    this.containerEl.appendChild(this.canvas);

    this.containerSize = this.canvas.width;
    this.padding = this.options.padding;

    this.isMouseDown = false;

    this.outerCircle = null;
    this.controlCircle = null;

    this.angle = {
      radian: 0,
      degree: 0,
    };
    this.force = 0;
  }
  get diameter() {
    return this.containerSize - this.padding * 2;
  }
  get radius() {
    return this.diameter / 2;
  }
  get controlCircleDiameter() {
    return 100;
  }
  get controlCircleRadius() {
    return this.controlCircleDiameter / 2;
  }
  get centerCoordinate() {
    return {
      x: this.diameter / 2 + this.padding,
      y: this.diameter / 2 + this.padding,
    };
  }
  init() {
    const { x, y } = this.centerCoordinate;

    this.outerCircle = new Circle({
      ctx: this.ctx,
      x: x,
      y: y,
      radius: this.radius,
    });

    this.controlCircle = new ControlCircle({
      ctx: this.ctx,
      x: x,
      y: y,
      radius: this.controlCircleRadius,
      color: "rgba(0,0,0,0.5)",
    });

    this.render();

    this.registerListener();
  }
  registerListener() {
    this.canvas.addEventListener("mousedown", this.handleMouseDown.bind(this));
    window.addEventListener("mousemove", this.handleMouseMove.bind(this));
    window.addEventListener("mouseup", this.handleMouseUp.bind(this));
  }
  handleMouseDown() {
    this.isMouseDown = true;
  }
  handleMouseMove(event) {
    if (!this.isMouseDown) return;

    const { x: centerX, y: centerY } = this.centerCoordinate;
    const { x: mouseX, y: mouseY } = this.getMouseCoordinate(event);

    const delta = {
      x: mouseX - centerX,
      y: mouseY - centerY,
    };
    const distance = Math.hypot(delta.y, delta.x);
    this.force = (distance / this.radius) * 100;

    const angle = this.getAngleByMouse({ x: mouseX, y: mouseY });
    const coordinate = this.getCoordinateByAngle(angle);

    const newPosition = {
      x: distance < this.radius ? mouseX : coordinate.x,
      y: distance < this.radius ? mouseY : coordinate.y,
    };

    this.controlCircle.x = newPosition.x;
    this.controlCircle.y = newPosition.y;

    this.angle = {
      radian: angle,
      degree: toDegree(angle),
    };

    this.onMove({
      force: this.force,
      angle: this.angle,
      direction: this.direction,
      position: {
        x: this.controlCircle.x - centerX,
        y: this.controlCircle.y - centerY,
      },
    });
  }
  async handleMouseUp(event) {
    const { x: centerX, y: centerY } = this.centerCoordinate;
    const { x: mouseX, y: mouseY } = this.getMouseCoordinate(event);

    this.isMouseDown = false;

    const angle = this.getAngleByMouse({ x: mouseX, y: mouseY });
    const velocity = {
      x: Math.cos(angle) * -1,
      y: Math.sin(angle) * -1,
    };

    await this.controlCircle.animate(velocity, this.centerCoordinate);

    this.controlCircle.x = centerX;
    this.controlCircle.y = centerY;
  }
  get direction() {
    const degree = normalizeDegree(this.angle.degree);
    for (const [direction, boundary] of Object.entries(DIRECTION_MAP)) {
      if (degree > boundary.min && degree <= boundary.max) {
        return direction;
      }
    }

    return DIRECTION.RIGHT;
  }
  getMouseCoordinate({ clientX, clientY }) {
    const { x, y } = this.canvas.getBoundingClientRect();

    return {
      x: clamp(clientX - x, 0, this.canvas.width),
      y: clamp(clientY - y, 0, this.canvas.height),
    };
  }
  getAngleByMouse({ x, y }) {
    const { x: centerX, y: centerY } = this.centerCoordinate;
    const angle = Math.atan2(y - centerY, x - centerX);

    return angle;
  }
  getCoordinateByAngle(angle) {
    const { x: centerX, y: centerY } = this.centerCoordinate;

    const x = Math.cos(angle) * this.radius + centerX;
    const y = Math.sin(angle) * this.radius + centerY;

    return { x, y };
  }
  draw() {
    this.outerCircle.draw();
    this.controlCircle.draw();

    // this.ctx.beginPath();
    // this.ctx.moveTo(this.padding, this.canvas.height / 2);
    // this.ctx.lineTo(this.canvas.width - this.padding, this.canvas.height / 2);
    // this.ctx.stroke();
    // this.ctx.closePath();

    // this.ctx.beginPath();
    // this.ctx.moveTo(this.canvas.width / 2, this.padding);
    // this.ctx.lineTo(this.canvas.width / 2, this.canvas.height - this.padding);
    // this.ctx.stroke();
    // this.ctx.closePath();
  }
  render() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.draw();

    requestAnimationFrame(this.render.bind(this));
  }
}

export default JoyStick;
