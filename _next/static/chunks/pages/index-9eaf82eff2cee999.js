(self.webpackChunk_N_E = self.webpackChunk_N_E || []).push([
  [405],
  {
    5301: function (e, o, t) {
      (window.__NEXT_P = window.__NEXT_P || []).push([
        "/",
        function () {
          return t(5075);
        },
      ]);
    },
    5075: function (e, o, t) {
      "use strict";
      t.r(o);
      var r = t(5893),
        i = t(5792),
        n = t.n(i),
        l = t(7294);
      function c(e, o, t) {
        return (
          o in e
            ? Object.defineProperty(e, o, {
                value: t,
                enumerable: !0,
                configurable: !0,
                writable: !0,
              })
            : (e[o] = t),
          e
        );
      }
      function s(e) {
        for (var o = 1; o < arguments.length; o++) {
          var t = null != arguments[o] ? arguments[o] : {},
            r = Object.keys(t);
          "function" === typeof Object.getOwnPropertySymbols &&
            (r = r.concat(
              Object.getOwnPropertySymbols(t).filter(function (e) {
                return Object.getOwnPropertyDescriptor(t, e).enumerable;
              }),
            )),
            r.forEach(function (o) {
              c(e, o, t[o]);
            });
        }
        return e;
      }
      o.default = function () {
        var e = 100,
          o = (0, l.useState)([]),
          t = o[0],
          i = o[1],
          c = (0, l.useState)(!1),
          u = c[0],
          v = c[1],
          a = (0, l.useState)(null),
          f = a[0],
          h = a[1],
          y = (0, l.useRef)(t),
          x = function (e, o) {
            return Math.floor(Math.random() * (e - o) + o);
          },
          d = function (e) {
            return Math.pow(e / 2, 2) * Math.PI;
          },
          p = function (e) {
            return Math.floor(2 * Math.sqrt(e / Math.PI));
          },
          b = function (e, o, t, r, i, n) {
            return Math.sqrt(Math.pow(t + n - e + i, 2) + Math.pow(r + n - o + i, 2));
          },
          z = function (e, o) {
            return Math.sqrt(Math.pow(e, 2) + Math.pow(o, 2));
          };
        return (
          (0, l.useEffect)(
            function () {
              y.current = t;
              for (var e = 0, o = 0; o < t.length; o++) e += t[o].size;
              console.log("^_^ Log \n file: index.tsx \n line 335 \n n", d(e));
            },
            [t],
          ),
          (0, l.useEffect)(function () {
            for (var e = [], o = 0; o < 50; o++)
              e.push({
                x: x(document.body.clientWidth - 60, 0),
                y: x(document.body.clientHeight - 60, 0),
                vx: Math.floor(15 * Math.random() - 7.5),
                vy: Math.floor(15 * Math.random() - 7.5),
                size: 60,
                rest: 0,
                splitCoolTime: 0,
                color: "black",
              });
            i(e);
          }, []),
          (0, l.useEffect)(
            function () {
              t.length && u && !f
                ? h(
                    setInterval(function () {
                      return (function (o) {
                        if (u) {
                          for (
                            var t = function (e) {
                                var t = p(d(o[e].size) / 2),
                                  r = t > 10 ? t : 10;
                                o[e].size,
                                  o[e].size < r && o[e].rest,
                                  o[e].rest > 0 && (o[e].rest -= 1),
                                  o[e].splitCoolTime > 0 && (o[e].splitCoolTime -= 1);
                                var i = function (i) {
                                  var n = "v".concat(i),
                                    l =
                                      "x" === i
                                        ? document.body.clientWidth
                                        : document.body.clientHeight,
                                    c = "black" === o[e].color,
                                    u = "white" === o[e].color;
                                  if (l > o[e][i] + o[e].size && 0 < o[e][i])
                                    0 === o[e].vx && 0 === o[e].vy && (o[e][n] += 10),
                                      (o[e][i] += o[e][n]);
                                  else {
                                    var a = function () {
                                      if (
                                        (t > 10 || "black" === o[e].color) &&
                                        o[e].size < 80 &&
                                        0 === o[e].splitCoolTime
                                      ) {
                                        (o[e].size = r), (o[e].splitCoolTime += 100);
                                        var i = x(1, 0);
                                        v.push(
                                          s({}, o[e], {
                                            vx: o[e].vx + 1 - i,
                                            vy: c ? o[e][n] : o[e][n] - i,
                                          }),
                                        ),
                                          (o[e].vx -= c ? 0 : i),
                                          (o[e][n] += 1 - i),
                                          (o[e].color = u ? "blue" : o[e].color);
                                      }
                                    };
                                    l < o[e][i] + o[e].size
                                      ? ((o[e][n] = -o[e][n] + x(5, -5) / 10),
                                        (o[e][i] = l - o[e].size - o[e][n]),
                                        a())
                                      : 0 > o[e][i]
                                      ? ((o[e][n] = -o[e][n] + x(5, -5) / 10),
                                        (o[e][i] = o[e][n]),
                                        a())
                                      : ((o[e][n] = -o[e][n] + x(5, -5) / 10),
                                        (o[e][i] += o[e][n]),
                                        (o[e].color = c ? "black" : "red"));
                                  }
                                  z(o[e].vx, o[e].vy) > 15 &&
                                    ((o[e].vx -= 0.1), (o[e].vy -= 0.1), (o[e].color = "black"));
                                };
                                i("x"), i("y");
                              },
                              r = function (e) {
                                o = o.filter(function (o, t) {
                                  return l[e] !== t;
                                });
                              },
                              l = [],
                              c = [],
                              v = [],
                              a = [],
                              f = 0;
                            f < o.length;
                            f++
                          )
                            t(f);
                          for (var h = 0; h < o.length; h++)
                            for (var y = 0; y < o.length; y++)
                              if (h !== y) {
                                var m = o[h].size / 2,
                                  g = o[y].size / 2,
                                  w = o[h].x,
                                  k = o[h].y,
                                  M = o[y].x,
                                  j = o[y].y,
                                  C = o[h].size,
                                  T = o[y].size;
                                if (
                                  w + m > M - g &&
                                  w - m < M + g &&
                                  k + m > j - g &&
                                  k - m < j + g &&
                                  b(w, k, M, j, m, g) < m + g &&
                                  !l.includes(h) &&
                                  !l.includes(y)
                                )
                                  if (
                                    !o[h].rest &&
                                    !o[y].rest &&
                                    document.body.clientWidth - C - e >= w &&
                                    e <= w &&
                                    document.body.clientHeight - C - e >= k &&
                                    e <= k &&
                                    document.body.clientWidth - T - e >= M &&
                                    e <= M &&
                                    document.body.clientHeight - T - e >= j &&
                                    e <= j
                                  )
                                    l.push(h),
                                      l.push(y),
                                      a.push({ i: s({}, o[h]), j: s({}, o[y]) });
                                  else if (c.includes(h) || c.includes(y))
                                    o[y].color = n().random();
                                  else if (o[h].splitCoolTime || o[y].splitCoolTime)
                                    if (o[h].color == o[y].color && "white" == o[h].color) {
                                      var _ = 1 * Math.sign(o[h].vx);
                                      (o[h].vx += _),
                                        (o[h].vy += _),
                                        (o[y].vx += _),
                                        (o[y].vy += _),
                                        (o[h].color = "#ffff00"),
                                        (o[y].color = "#ffff00");
                                    } else if (o[h].color !== o[y].color) {
                                      var O = n().scale([o[h].color, o[y].color])(0.5).hex();
                                      (o[h].color = "black" === o[h].color ? "black" : O),
                                        (o[y].color = "black" === o[y].color ? "black" : O);
                                    } else (o[h].color = o[y].color), (o[y].color = o[h].color);
                                  else {
                                    var E = void 0,
                                      P = o[y].x - o[h].x,
                                      N = o[y].y - o[h].y;
                                    E = -(P * o[h].vx + N * o[h].vy) / (P * P + N * N);
                                    var S = o[h].vx + P * E,
                                      H = o[h].vy + N * E;
                                    E = -(-N * o[h].vx + P * o[h].vy) / (N * N + P * P);
                                    var W = o[h].vx - N * E,
                                      q = o[h].vy + P * E;
                                    E = -(P * o[y].vx + N * o[y].vy) / (P * P + N * N);
                                    var I = o[y].vx + P * E,
                                      X = o[y].vy + N * E;
                                    E = -(-N * o[y].vx + P * o[y].vy) / (N * N + P * P);
                                    var D = o[y].vx - N * E,
                                      L = o[y].vy + P * E,
                                      R =
                                        (o[h].size * W +
                                          o[y].size * D +
                                          1 * D * o[y].size -
                                          1 * W * o[y].size) /
                                        (o[h].size + o[y].size),
                                      A = -1 * (D - W) + R,
                                      B =
                                        (o[h].size * q +
                                          o[y].size * L +
                                          1 * L * o[y].size -
                                          1 * q * o[y].size) /
                                        (o[h].size + o[y].size),
                                      F = -1 * (L - q) + B;
                                    (o[h].vx = R + S),
                                      (o[h].vy = B + H),
                                      (o[y].vx = A + I),
                                      (o[y].vy = F + X),
                                      c.push(h),
                                      c.push(y);
                                  }
                              }
                          l.sort(function (e, o) {
                            return o - e;
                          });
                          for (var G = 0; G < l.length; G++) r(G);
                          for (var J = 0; J < v.length; J++) o.push(v[J]);
                          for (
                            var K = function (e, o) {
                                return (a[e].i[o] + a[e].j[o]) / 2;
                              },
                              Q = function (e, o) {
                                return (a[e].i[o] + a[e].j[o]) / 2;
                              },
                              U = function (e) {
                                return p(d(a[e].i.size) + d(a[e].j.size));
                              },
                              V = function (e, o) {
                                return a[e].i.size > a[e].j.size ? a[e].i[o] : a[e].j[o];
                              },
                              Y = 0;
                            Y < a.length;
                            Y++
                          ) {
                            var Z = U(Y),
                              $ = Q(Y, "vx"),
                              ee = Q(Y, "vy");
                            Z > 120 || z($, ee) > 15
                              ? (o.push({
                                  x: a[Y].i.x,
                                  y: a[Y].i.y,
                                  vx: -a[Y].i.vx - 5,
                                  vy: -a[Y].i.vy - 5,
                                  size: Z / 3,
                                  rest: 50,
                                  splitCoolTime: 100,
                                  color: "black",
                                }),
                                o.push({
                                  x: a[Y].j.x,
                                  y: a[Y].j.y,
                                  vx: 5 - a[Y].j.vx,
                                  vy: 5 - a[Y].j.vy,
                                  size: Z / 3,
                                  rest: 50,
                                  splitCoolTime: 100,
                                  color: "black",
                                }),
                                o.push({
                                  x: K(Y, "x"),
                                  y: K(Y, "y"),
                                  vx: K(Y, "vx"),
                                  vy: K(Y, "vy"),
                                  size: Z / 3,
                                  rest: 50,
                                  splitCoolTime: 100,
                                  color: "black",
                                }))
                              : o.push({
                                  x: V(Y, "x"),
                                  y: V(Y, "y"),
                                  vx: Q(Y, "vx"),
                                  vy: Q(Y, "vy"),
                                  size: U(Y),
                                  rest: 20,
                                  splitCoolTime: 0,
                                  color: "white",
                                });
                          }
                          i(o);
                        }
                      })(y.current.concat());
                    }, 20),
                  )
                : !u && f && (clearTimeout(f), h(null));
            },
            [t, u],
          ),
          (0, r.jsx)("div", {
            className: "p-[100px] w-screen h-screen bg-[black]",
            onClick: function () {
              return v(!u);
            },
            children: t.map(function (e, o) {
              var t = n().scale([e.color, "white"])(0.5).hex();
              return (0,
              r.jsx)("div", { style: { position: "fixed", top: e.y, left: e.x, width: e.size, height: e.size, backgroundColor: e.color, borderColor: t }, className: "rounded-full border-2" }, String(o));
            }),
          })
        );
      };
    },
  },
  function (e) {
    e.O(0, [792, 774, 888, 179], function () {
      return (o = 5301), e((e.s = o));
    });
    var o = e.O();
    _N_E = o;
  },
]);
