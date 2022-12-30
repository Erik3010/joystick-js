export const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

export const toDegree = (radian) => radian * (180 / Math.PI);

export const easeAnimation = (distance, frame, step) => {
  frame /= step / 2;

  if (frame < 1) {
    return (distance / 2) * Math.pow(frame, 3);
  }
  frame -= 2;
  return (distance / 2) * (Math.pow(frame, 3) + 2);
};

export const normalizeDegree = (degree) =>
  Math.sign(degree) === -1 ? 360 + degree : degree;

export const createElement = (
  tagName,
  { props = {}, classList = [], textContent = null }
) => {
  const el = document.createElement(tagName);

  for (const key in props) {
    el.setAttribute(key, props[key]);
  }

  for (const key in classList) {
    el.classList.add(classList[key]);
  }

  textContent && (el.textContent = textContent);

  return el;
};
