export const DIRECTION = {
  UP: "UP",
  BOTTOM: "BOTTOM",
  LEFT: "LEFT",
  RIGHT: "RIGHT",
};

export const DIRECTION_MAP = {
  [DIRECTION.UP]: {
    min: 225,
    max: 315,
  },
  [DIRECTION.BOTTOM]: {
    min: 45,
    max: 135,
  },
  [DIRECTION.LEFT]: {
    min: 135,
    max: 225,
  },
  [DIRECTION.RIGHT]: {
    min: 315,
    max: 45,
  },
};
