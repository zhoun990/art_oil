// const React = require("react");
// const ReactDOM = require("react-dom");
// const chroma = require("chroma-js");
// const { useEffect, useRef, useState } = React;
import chroma from "chroma-js";
import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
const App = () => {
	const interval = 20;
	const size = 50;
	const gen = 100;
	const minSize = 10;
	const maxSize = 120;
	const initSpeed = 15;
	const maxSpeed = 15;
	const wall = 100;
	const boundAndSmaller = true;
	const boundAndSplit = true;
	const hitAndDelete = true;
	const hitAndFusion = true;
	const [points, setPoints] = useState([]);
	const [isEnable, setIsEnable] = useState(true);
	const [timeoutId, setTimeoutId] = useState(null);
	const refPoints = useRef(points);
	const random = (max, min) => {
	  return Math.floor(Math.random() * (max - min) + min);
	};
	const generateItem = () => {
	  return {
		x: random(document.body.clientWidth - size, 0),
		y: random(document.body.clientHeight - size, 0),
		vx: Math.floor(Math.random() * initSpeed - initSpeed / 2),
		vy: Math.floor(Math.random() * initSpeed - initSpeed / 2),
		size: size,
		rest: 0,
		splitCoolTime: 0,
		color: "black",
	  };
	};
	const calcVolume = (fullSize) => {
	  return (fullSize / 2) ** 2 * Math.PI;
	};
	const calcHalfSizeFromVolume = (volume) => {
	  return Math.floor(Math.sqrt(volume / Math.PI) * 2);
	};
	const calcDefBtwPs = (x1, y1, x2, y2, radius1, radius2) => {
	  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
	};
	const calcSpeed = (vx, vy) => {
	  return Math.sqrt(vx ** 2 + vy ** 2);
	};

	const update = (array) => {
	  if (isEnable) {
		const deleteList = [];
		const boundList = [];
		const addListA = [];
		const addListB = [];
		for (let i = 0; i < array.length; i++) {
		  const halfSize = calcHalfSizeFromVolume(calcVolume(array[i].size) / 2);

		  const changeSize = halfSize > minSize ? halfSize : minSize;
		  const sizeDef = changeSize - array[i].size;
		  const isBigger = array[i].size < changeSize && array[i].rest === 0;
		  if (array[i].rest > 0) array[i].rest -= 1;
		  if (array[i].splitCoolTime > 0) array[i].splitCoolTime -= 1;
		  // console.log("^_^ Log \n file: index.tsx \n line 44 \n array[i].rest", array[i].rest);

		  const onWall = (type) => {
			const v = `v${type}`;
			const client = type === "x" ? document.body.clientWidth : document.body.clientHeight;
			const isBlack = array[i].color === "black";
			const isWhite = array[i].color === "white";
			const isRed = array[i].color === "red";
			if (client > array[i][type] + array[i].size && 0 < array[i][type]) {
			  if (array[i].vx === 0 && array[i].vy === 0) {
				array[i][v] += 10;
			  }
			  array[i][type] += array[i][v];
			} else {
			  const boundFunc = () => {
				if (
				  boundAndSmaller &&
				  (halfSize > minSize || array[i].color === "black") &&
				  array[i].size < maxSize * (2 / 3) &&
				  array.length < 300
				) {
				  if (array[i].splitCoolTime === 0) {
					array[i].size = changeSize;
					array[i].splitCoolTime += 100;
					array[i].rest += 100;
					const cv = random(1, 0);
					addListA.push({
					  ...array[i],
					  vx: array[i].vx + 1 - cv,
					  vy: array[i].vy - cv,
					  rest: isBlack ? array[i].rest + 200 : array[i].rest,
					});
					array[i].vx -= isBlack ? 0 : isRed ? -1 : cv;
					array[i].vy += 1 - cv;
					array[i].color = isWhite ? "blue" : array[i].color;
				  }
				}
			  };
			  if (client < array[i][type] + array[i].size) {
				// console.log("MAX!!");
				array[i][v] = -array[i][v] + random(5, -5) / 10;
				// array[i][type] += isBigger ? array[i][v] + sizeDef * Math.sign(array[i][v]) : array[i][v];
				array[i][type] = client - array[i].size - array[i][v];
				boundFunc();
			  } else if (0 > array[i][type]) {
				// console.log("MIN!!");
				array[i][v] = -array[i][v] + random(5, -5) / 10;
				// array[i][type] += isBigger ? array[i][v] + sizeDef * Math.sign(array[i][v]) : array[i][v];
				array[i][type] = array[i][v];
				boundFunc();
			  } else {
				// console.log("Bound!!");
				array[i][v] = -array[i][v] + random(5, -5) / 10;
				array[i][type] += array[i][v];
				array[i].color = isBlack ? "black" : "red";
			  }
			}
			if (calcSpeed(array[i].vx, array[i].vy) > maxSpeed) {
			  array[i].vx -= 0.1;
			  array[i].vy -= 0.1;
			  array[i].color = "black";
			}
		  };
		  onWall("x");
		  onWall("y");
		}

		for (let i = 0; i < array.length; i++) {
		  for (let j = 0; j < array.length; j++) {
			if (i !== j) {
			  const ni = array[i].size / 2;
			  const nj = array[j].size / 2;
			  const x1 = array[i].x + ni;
			  const y1 = array[i].y + ni;
			  const x2 = array[j].x + nj;
			  const y2 = array[j].y + nj;
			  const size1 = array[i].size;
			  const size2 = array[j].size;
			  const speed1 = calcSpeed(array[i].vx, array[i].vy);
			  const speed2 = calcSpeed(array[j].vx, array[j].vy);

			  if (calcDefBtwPs(x1, y1, x2, y2, ni, nj) < ni + nj) {
				// 当たり判定クリア
				if (
				  !deleteList.includes(i) &&
				  !deleteList.includes(j) &&
				  !boundList.includes(i) &&
				  !boundList.includes(j)
				) {
				  if (
					document.body.clientWidth - size1 - wall >= x1 &&
					wall <= x1 &&
					document.body.clientHeight - size1 - wall >= y1 &&
					wall <= y1 &&
					document.body.clientWidth - size2 - wall >= x2 &&
					wall <= x2 &&
					document.body.clientHeight - size2 - wall >= y2 &&
					wall <= y2 &&
					!array[i].splitCoolTime &&
					!array[j].splitCoolTime &&
					hitAndDelete
				  ) {
					// console.log("HIT!!");
					deleteList.push(i);
					deleteList.push(j);
					addListB.push({ i: { ...array[i] }, j: { ...array[j] } });
				  } else if (
					!array[i].splitCoolTime &&
					!array[j].splitCoolTime &&
					!array[i].rest &&
					!array[j].rest
				  ) {
					//   let dx = array[i].x - array[j].x;
					//   let dy = array[i].y - array[j].y;
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

					let t;
					const vx = array[j].x - array[i].x;
					const vy = array[j].y - array[i].y;

					t = -(vx * array[i].vx + vy * array[i].vy) / (vx * vx + vy * vy);
					const arx = array[i].vx + vx * t;
					const ary = array[i].vy + vy * t;

					t = -(-vy * array[i].vx + vx * array[i].vy) / (vy * vy + vx * vx);
					const amx = array[i].vx - vy * t;
					const amy = array[i].vy + vx * t;

					t = -(vx * array[j].vx + vy * array[j].vy) / (vx * vx + vy * vy);
					const brx = array[j].vx + vx * t;
					const bry = array[j].vy + vy * t;

					t = -(-vy * array[j].vx + vx * array[j].vy) / (vy * vy + vx * vx);
					const bmx = array[j].vx - vy * t;
					const bmy = array[j].vy + vx * t;
					const e = 1.0;
					const adx = (ni * amx + nj * bmx + bmx * e * nj - amx * e * nj) / (ni + nj);
					const bdx = -e * (bmx - amx) + adx;
					const ady = (ni * amy + nj * bmy + bmy * e * nj - amy * e * nj) / (ni + nj);
					const bdy = -e * (bmy - amy) + ady;
					array[i].vx = adx + arx;
					array[i].vy = ady + ary;
					array[j].vx = bdx + brx;
					array[j].vy = bdy + bry;

					boundList.push(i);
					boundList.push(j);
				  } else {
					if (
					  array[i].color == array[j].color &&
					  (array[i].color == "green" || array[i].color == "yellow")
					) {
					  // const boost = 1 * Math.sign(array[i].vx);
					  // array[i].vx += boost;
					  // array[i].vy += boost;
					  // array[j].vx += boost;
					  // array[j].vy += boost;
					  // array[i].color = "yellow";
					  // array[j].color = "yellow";
					  array[i].color = chroma.random();
					  array[j].color = chroma.random();
					} else if (array[i].color !== array[j].color) {
					  const scale = chroma.scale([array[i].color, array[j].color]);
					  // const newColor = scale(0.5).hex();
					  const newColor =
						array[i].color === "black" && speed1 < speed2 * 2 && speed2 < speed1 * 2
						  ? "black"
						  : scale(0.5).hex();

					  array[i].color = newColor;
					  array[j].color = newColor;
					} else if (
					  array[i].color !== "white" &&
					  array[i].color !== "yellow" &&
					  array[i].color !== "red" &&
					  array[i].color !== "green"
					) {
					  array[j].color = array[i].color;
					} else if (
					  array[j].color !== "white" &&
					  array[j].color !== "yellow" &&
					  array[j].color !== "red" &&
					  array[j].color !== "green"
					) {
					  array[i].color = array[j].color;
					}
				  }
				} else {
				  array[i].color = size1 > size2 ? "green" : "yellow";
				  // array[j].color = chroma.random();
				}
			  }
			}
		  }
		}

		deleteList.sort((a, b) => b - a);
		for (let i = 0; i < deleteList.length; i++) {
		  array = array.filter((x, index) => deleteList[i] !== index);
		}
		if (boundAndSplit) {
		  for (let i = 0; i < addListA.length; i++) {
			array.push(addListA[i]);
		  }
		}
		const addListSUM = function (i, type) {
		  const result = addListB[i].i[type] + addListB[i].j[type];
		  return result > 5 ? 5 : result;
		};
		const addListAverage = function (i, type) {
		  return (addListB[i].i[type] + addListB[i].j[type]) / 2;
		};
		const addListComposition = function (i, type) {
		  return (addListB[i].i[type] + addListB[i].j[type]) / 2;
		};

		const addListSize = function (i) {
		  return calcHalfSizeFromVolume(
			calcVolume(addListB[i].i.size) + calcVolume(addListB[i].j.size),
		  );
		};
		const AddListChooseLarger = function (i, type) {
		  return addListB[i].i.size > addListB[i].j.size ? addListB[i].i[type] : addListB[i].j[type];
		};
		for (let i = 0; i < addListB.length; i++) {
		  const size = addListSize(i);
		  const vx = addListComposition(i, "vx");
		  const vy = addListComposition(i, "vy");
		  if (size > maxSize || calcSpeed(vx, vy) > maxSpeed) {
			array.push({
			  x: addListB[i].i.x,
			  y: addListB[i].i.y,
			  vx: -addListB[i].i.vx - 5,
			  vy: -addListB[i].i.vy - 5,
			  size: size / 3,
			  rest: 50,
			  splitCoolTime: 100,
			  color: "black",
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
			});
		  } else if (hitAndFusion) {
			array.push({
			  x: AddListChooseLarger(i, "x"),
			  y: AddListChooseLarger(i, "y"),
			  vx: addListComposition(i, "vx"),
			  vy: addListComposition(i, "vy"),
			  size: addListSize(i),
			  rest: 20,
			  splitCoolTime: 0,
			  color:
				addListB[i].i.color === "black" || addListB[i].j.color === "black"
				  ? "black"
				  : "white",
			});
		  }
		}

		// console.log("^_^ Log \n file: index.tsx \n line 79 \n array", array);
		setPoints(array);
	  }
	};
	const start = () => {
	  const array = [];
	  for (let i = 0; document.body.clientWidth > 700 ? i < gen : i < Math.floor(gen / 2); i++) {
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
		points[0].size = maxSize + 1;
	  }
	  console.log("^_^ Log \n file: index.js \n line 368 \n points.length", points.length);

	  if (points.length > 500) {
		start();
	  }
	}, [points]);

	useEffect(() => {
	  start();
	  window.addEventListener(
		"focus",
		() => {
		  console.log("focus");
		  setIsEnable(true);
		},
		false,
	  );
	  window.addEventListener("blur", () => setIsEnable(false), false);
	}, []);
	useEffect(() => {
	  if (points.length && isEnable && !timeoutId) {
		setTimeoutId(setInterval(() => update(refPoints.current.concat()), interval));
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
  };
ReactDOM.render(<App />, document.getElementById("content"));
