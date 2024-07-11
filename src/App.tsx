import chroma from "chroma-js";
import React, { useEffect, useRef, useState } from "react";
import {
	DEFAULT_SPLIT_COOL_TIME,
	MIN_SIZE,
	ENABLE_BOUND_AND_SMALLER,
	MAX_SIZE,
	ITEM_LIMIT,
	MAX_SPEED,
	SDAFW,
	MARGE_COUNT_THRESHOLD,
	ENABLE_HIT_AND_DELETE,
	ENABLE_BOUND_AND_SPLIT,
	ENABLE_HIT_AND_FUSION,
	GEN_COUNT,
	DELTA,
} from "./constants";
import { ScreenSize } from "./utils";
import {
	calcHalfSizeFromVolume,
	calcVolume,
	random,
	calcSpeed,
	calcDefBtwPs,
	generateItem,
} from "./fn";
import { Point } from "./types";

export default function App() {
	const [points, setPoints] = useState<Array<Point>>([]);
	const [isEnable, setIsEnable] = useState(true);
	const [timeoutId, setTimeoutId] = useState<number | null>(null);
	const refPoints = useRef(points);

	const update = (array: Array<Point>) => {
		if (isEnable) {
			const deleteList: number[] = [];
			const boundList: number[] = [];
			const addListA: Array<Point> = [];
			const addListB: Array<{ i: Point; j: Point }> = [];
			for (let i = 0; i < array.length; i++) {
				const halfSize = calcHalfSizeFromVolume(calcVolume(array[i].size) / 2);

				const changeSize = halfSize > MIN_SIZE ? halfSize : MIN_SIZE;
				// const sizeDef = changeSize - array[i].size;
				// const isBigger = array[i].size < changeSize && array[i].rest === 0;
				if (array[i].rest > 0) array[i].rest -= 1;
				if (array[i].splitCoolTime > 0) array[i].splitCoolTime -= 1;
				if (array[i].margeCount > 0) array[i].margeCount -= 1;
				// console.log("^_^ Log \n file: index.tsx \n line 44 \n array[i].rest", array[i].rest);

				const onWall = (type: "x" | "y") => {
					const v = `v${type}` as "vx" | "vy";
					const client = type === "x" ? ScreenSize.Width() : ScreenSize.Height();
					const item = array[i];
					if (client > item[type] + item.size && 0 < item[type]) {
						//壁にぶつかっていない場合
						// if (array[i]?.[v] && array[i].vx === 0 && array[i].vy === 0) {
						// 	array[i][v] += 10;
						// }
						item[type] += item[v];
					} else {
						//壁にぶつかっている場合
						const isBlack = item.color === "black";
						const isWhite = item.color === "white";
						const isRed = item.color === "red";

						const boundFunc = () => {
							if (
								ENABLE_BOUND_AND_SMALLER &&
								(halfSize > MIN_SIZE || item.color === "black") &&
								item.size < MAX_SIZE * (2 / 3) &&
								array.length < ITEM_LIMIT
							) {
								if (item.splitCoolTime <= 0) {
									item.size = changeSize;
									item.splitCoolTime += DEFAULT_SPLIT_COOL_TIME;
									item.rest += 50;
									const cv = random(1, 0);
									addListA.push({
										...item,
										vx: item.vx + 1 - cv,
										vy: item.vy - cv,
										rest: isBlack ? item.rest + 200 : item.rest,
									});
									item.vx -= isBlack ? 0 : isRed ? -1 : cv;
									item.vy += 1 - cv;
									item.color = isWhite ? "blue" : item.color;
								}
							}
						};
						if (client < item[type] + item.size) {
							// console.log("MAX!!");
							item[v] = -item[v] + random(5, -5) / 10;
							// array[i][type] += isBigger ? array[i][v] + sizeDef * Math.sign(array[i][v]) : array[i][v];
							item[type] = client - item.size - item[v];
							boundFunc();
						} else if (0 > item[type]) {
							// console.log("MIN!!");
							item[v] = -item[v] + random(5, -5) / 10;
							// array[i][type] += isBigger ? array[i][v] + sizeDef * Math.sign(array[i][v]) : array[i][v];
							item[type] = item[v];
							boundFunc();
						} else {
							// console.log("Bound!!");
							item[v] = -item[v] + random(5, -5) / 10;
							item[type] += item[v];
							item.color = isBlack ? "black" : "red";
						}
					}
					if (calcSpeed(item.vx, item.vy) > MAX_SPEED) {
						item.vx -= 0.1;
						item.vy -= 0.1;
						item.color = "black";
					}
				};
				onWall("x");
				onWall("y");
			}

			for (let a = 0; a < array.length; a++) {
				const itemA = array[a];
				for (let b = 0; b < array.length; b++) {
					const itemB = array[b];
					if (a !== b) {
						const ni = itemA.size / 2;
						const nj = itemB.size / 2;
						const x1 = itemA.x + ni;
						const y1 = itemA.y + ni;
						const x2 = itemB.x + nj;
						const y2 = itemB.y + nj;
						const size1 = itemA.size;
						const size2 = itemB.size;
						const speed1 = calcSpeed(itemA.vx, itemA.vy);
						const speed2 = calcSpeed(itemB.vx, itemB.vy);

						if (calcDefBtwPs(x1, y1, x2, y2) <= ni + nj) {
							// 衝突時
							if (
								!deleteList.includes(a) &&
								!deleteList.includes(b) &&
								!boundList.includes(a) &&
								!boundList.includes(b)
							) {
								if (
									//衝突無効化エリア外かどうか
									((ScreenSize.Width() - size1 - SDAFW >= x1 &&
										SDAFW <= x1 &&
										ScreenSize.Height() - size1 - SDAFW >= y1 &&
										SDAFW <= y1 &&
										ScreenSize.Width() - size2 - SDAFW >= x2 &&
										SDAFW <= x2 &&
										ScreenSize.Height() - size2 - SDAFW >= y2 &&
										SDAFW <= y2 &&
										//splitCoolTimeチェック
										itemA.splitCoolTime <= 0 &&
										itemB.splitCoolTime <= 0) ||
										(itemA.margeCount > MARGE_COUNT_THRESHOLD &&
											itemB.margeCount > MARGE_COUNT_THRESHOLD)) &&
									!!ENABLE_HIT_AND_DELETE
								) {
									//削除&合成して追加するリストに追加
									deleteList.push(a);
									deleteList.push(b);
									addListB.push({ i: { ...itemA }, j: { ...itemB } });
								} else if (
									itemA.splitCoolTime <= 0 &&
									itemB.splitCoolTime <= 0 &&
									itemA.rest <= 0 &&
									itemB.rest <= 0
								) {
									itemA.margeCount += 2;
									itemB.margeCount += 2;
									//   let dx = itemA.x - itemB.x;
									//   let dy = itemA.y - itemB.y;
									//   const len = Math.sqrt(dx ** 2 + dy ** 2);
									//   let distance = ni + nj - len;
									//   if (len > 0) {
									//     len = 1 / len;
									//   }
									//   dx *= len;
									//   dy *= len;

									//   const small = size1 > size2 ? j : i;
									//   array[small].x += dx * distance;
									//   array[small].y += dy * distance;

									//反射
									let t;
									const VX = itemB.x - itemA.x;
									const VY = itemB.y - itemA.y;

									t = -(VX * itemA.vx + VY * itemA.vy) / (VX * VX + VY * VY);
									const AR_X = itemA.vx + VX * t;
									const AR_Y = itemA.vy + VY * t;

									t = -(-VY * itemA.vx + VX * itemA.vy) / (VY * VY + VX * VX);
									const AM_X = itemA.vx - VY * t;
									const AM_Y = itemA.vy + VX * t;

									t = -(VX * itemB.vx + VY * itemB.vy) / (VX * VX + VY * VY);
									const BR_X = itemB.vx + VX * t;
									const BR_Y = itemB.vy + VY * t;

									t = -(-VY * itemB.vx + VX * itemB.vy) / (VY * VY + VX * VX);
									const BM_X = itemB.vx - VY * t;
									const BM_Y = itemB.vy + VX * t;
									const E = 1.0;
									const AD_X =
										(ni * AM_X + nj * BM_X + BM_X * E * nj - AM_X * E * nj) /
										(ni + nj);
									const BD_X = -E * (BM_X - AM_X) + AD_X;
									const AD_Y =
										(ni * AM_Y + nj * BM_Y + BM_Y * E * nj - AM_Y * E * nj) /
										(ni + nj);
									const BD_Y = -E * (BM_Y - AM_Y) + AD_Y;
									itemA.vx = AD_X + AR_X;
									itemA.vy = AD_Y + AR_Y;
									itemB.vx = BD_X + BR_X;
									itemB.vy = BD_Y + BR_Y;

									boundList.push(a);
									boundList.push(b);
								} else {
									if (
										itemA.color == itemB.color &&
										(itemA.color == "green" || itemA.color == "yellow")
									) {
										// const boost = 1 * Math.sign(itemA.vx);
										// itemA.vx += boost;
										// itemA.vy += boost;
										// itemB.vx += boost;
										// itemB.vy += boost;
										// itemA.color = "yellow";
										// itemB.color = "yellow";
										itemA.color = chroma.random().hex();
										itemB.color = chroma.random().hex();
									} else if (itemA.color !== itemB.color) {
										const scale = chroma.scale([itemA.color, itemB.color]);
										// const newColor = scale(0.5).hex();
										const newColor =
											itemA.color === "black" &&
											speed1 < speed2 * 2 &&
											speed2 < speed1 * 2
												? "black"
												: scale(0.5).hex();

										itemA.color = newColor;
										itemB.color = newColor;
									} else if (
										itemA.color !== "white" &&
										itemA.color !== "yellow" &&
										itemA.color !== "red" &&
										itemA.color !== "green"
									) {
										itemB.color = itemA.color;
									} else if (
										itemB.color !== "white" &&
										itemB.color !== "yellow" &&
										itemB.color !== "red" &&
										itemB.color !== "green"
									) {
										itemA.color = itemB.color;
									}
								}
							} else {
								itemA.color = size1 > size2 ? "green" : "yellow";
								// itemB.color = chroma.random();
							}
						}
					}
				}
			}

			deleteList.sort((a, b) => b - a);
			for (let i = 0; i < deleteList.length; i++) {
				array = array.filter((x, index) => deleteList[i] !== index);
			}
			if (ENABLE_BOUND_AND_SPLIT) {
				for (let i = 0; i < addListA.length; i++) {
					array.push(addListA[i]);
				}
			}
			// const addListSUM = function (i, type) {
			// 	const result = addListB[i].i[type] + addListB[i].j[type];
			// 	return result > 5 ? 5 : result;
			// };
			const addListAverage = function (
				i: number,
				type: "x" | "y" | "vx" | "vy"
			) {
				return (addListB[i].i[type] + addListB[i].j[type]) / 2;
			};
			const addListComposition = function (
				i: number,
				type: "x" | "y" | "vx" | "vy"
			) {
				return (addListB[i].i[type] + addListB[i].j[type]) / 2;
			};

			const addListSize = function (i: number) {
				return calcHalfSizeFromVolume(
					calcVolume(addListB[i].i.size) + calcVolume(addListB[i].j.size)
				);
			};
			const AddListChooseLarger = function (
				i: number,
				type: "x" | "y" | "vx" | "vy"
			) {
				return addListB[i].i.size > addListB[i].j.size
					? addListB[i].i[type]
					: addListB[i].j[type];
			};
			for (let i = 0; i < addListB.length; i++) {
				const size = addListSize(i);
				const vx = addListComposition(i, "vx");
				const vy = addListComposition(i, "vy");
				if (size > MAX_SIZE || calcSpeed(vx, vy) > MAX_SPEED) {
					array.push({
						x: addListB[i].i.x,
						y: addListB[i].i.y,
						vx: -addListB[i].i.vx - 5,
						vy: -addListB[i].i.vy - 5,
						size: size / 3,
						rest: 50,
						splitCoolTime: 100,
						color: "black",
						margeCount: 0,
					});
					array.push({
						x: addListB[i].j.x,
						y: addListB[i].j.y,
						vx: -addListB[i].j.vx + 5,
						vy: -addListB[i].j.vy + 5,
						size: size / 3,
						rest: 50,
						splitCoolTime: 100,
						color: "black",
						margeCount: 0,
					});
					array.push({
						x: addListAverage(i, "x"),
						y: addListAverage(i, "y"),
						vx: addListAverage(i, "vx"),
						vy: addListAverage(i, "vy"),
						size: size / 3,
						rest: 50,
						splitCoolTime: 100,
						color: "black",
						margeCount: 0,
					});
				} else if (ENABLE_HIT_AND_FUSION) {
					array.push({
						x: AddListChooseLarger(i, "x"),
						y: AddListChooseLarger(i, "y"),
						vx: addListComposition(i, "vx"),
						vy: addListComposition(i, "vy"),
						size: addListSize(i),
						rest: 20,
						splitCoolTime: 0,
						color:
							// addListB[i].i.color === "black" || addListB[i].j.color === "black"
							//   ? "black"
							//   :
							"white",
						margeCount: 0,
					});
				}
			}

			// console.log("^_^ Log \n file: index.tsx \n line 79 \n array", array);
			setPoints(array);
		}
	};
	const start = () => {
		const array = [];
		for (
			let i = 0;
			ScreenSize.Width() > 700 ? i < GEN_COUNT : i < Math.floor(GEN_COUNT / 2);
			i++
		) {
			array.push(generateItem());
		}
		setPoints(array);
	};
	useEffect(() => {
		refPoints.current = points;
		// console.log("^_^ Log \n file: index.tsx \n line 178 \n points", points);
		let n = 0;

		for (let i = 0; i < points.length; i++) {
			n += points[i].size;
		}
		// calcVolume(n) > 10000000 && start();
		// console.log("^_^ Log \n file: index.tsx \n line 335 \n n", calcVolume(n));
		if (points.length == 1) {
			const array = points.concat();
			array.push({
				x: points[0].x,
				y: points[0].y,
				vx: -points[0].vx - 5,
				vy: points[0].vy - 5,
				size: MAX_SIZE / 2,
				rest: 100,
				splitCoolTime: 100,
				color: "black",
				margeCount: 0,
			});
			array.push({
				x: points[0].x,
				y: points[0].y,
				vx: points[0].vx + 5,
				vy: -points[0].vy + 5,
				size: MAX_SIZE / 2,
				rest: 100,
				splitCoolTime: 100,
				color: "black",
				margeCount: 0,
			});
			array.push({
				x: points[0].x,
				y: points[0].y,
				vx: -points[0].vx,
				vy: -points[0].vy,
				size: MAX_SIZE / 2,
				rest: 100,
				splitCoolTime: 100,
				color: "black",
				margeCount: 0,
			});
			refPoints.current = array;
		}
		// console.log(
		// 	"^_^ Log \n file: index.js \n line 368 \n points.length",
		// 	points.length
		// );

		if (points.length > 500) {
			start();
		}
	}, [points]);

	useEffect(() => {
		start();
		// addEventListener(
		// 	"focus",
		// 	() => {
		// 		console.log("focus");
		// 		setIsEnable(true);
		// 	},
		// 	false
		// );
		// window.addEventListener("blur", () => setIsEnable(false), false);
	}, []);
	useEffect(() => {
		if (points.length && isEnable && !timeoutId) {
			setTimeoutId(
				setInterval(() => update(refPoints.current.concat()), DELTA)
			);
		} else if (!isEnable && timeoutId) {
			clearTimeout(timeoutId);
			setTimeoutId(null);
		}
		// points, isEnable
	}, [points, isEnable]);
	return (
		<div
			style={{ width: "100vw", height: "100vh", backgroundColor: "black" }}
			onClick={() => setIsEnable(!isEnable)}
			onDoubleClick={() => start()}
		>
			{points.map((point, i) => {
				const scale = chroma.scale([point.color, "white"]);
				const newColor = scale(0.5).hex();
				return (
					<div
						key={String(i)}
						style={{
							position: "fixed",
							top: point.y,
							left: point.x,
							width: point.size,
							height: point.size,
							backgroundColor: point.color,
							borderRadius: 9999,
							border: `2px solid ${newColor}`,
						}}
					></div>
				);
			})}
		</div>
	);
}
