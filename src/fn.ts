import { Point } from "./types";

import {
	INITIAL_SIZE,
	INITIAL_SPEED,
	DEFAULT_SPLIT_COOL_TIME,
} from "./constants";
import { ScreenSize } from "./utils";

export const random = (max: number, min: number) => {
	return Math.floor(Math.random() * (max - min) + min);
};
export const generateItem = (): Point => {
	return {
		x: random(ScreenSize.Width - INITIAL_SIZE, 0),
		y: random(ScreenSize.Height - INITIAL_SIZE, 0),
		vx: Math.floor(Math.random() * INITIAL_SPEED - INITIAL_SPEED / 2),
		vy: Math.floor(Math.random() * INITIAL_SPEED - INITIAL_SPEED / 2),
		size: INITIAL_SIZE,
		rest: 20,
		splitCoolTime: DEFAULT_SPLIT_COOL_TIME,
		color: "black",
		margeCount: 0,
	};
};
export const calcVolume = (fullSize: number) => {
	return (fullSize / 2) ** 2 * Math.PI;
};
export const calcHalfSizeFromVolume = (volume: number) => {
	return Math.floor(Math.sqrt(volume / Math.PI) * 2);
};
export const calcDefBtwPs = (
	x1: number,
	y1: number,
	x2: number,
	y2: number
) => {
	return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
};
export const calcSpeed = (vx: number, vy: number) => {
	return Math.sqrt(vx ** 2 + vy ** 2);
};
