export interface Point {
	x: number;
	y: number;
	vx: number;
	vy: number;
	size: number;
	rest: number;
	splitCoolTime: number;
	color: string;
	/**合成可能になるまでのカウンター */
	margeCount: number;
}
