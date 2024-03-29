(function(u) {
    "object" === typeof module && module.exports ? (u["default"] = u, module.exports = u) : "function" === typeof define && define.amd ? define("Mychart/Mychart-more", ["Mychart"], function(B) {
        u(B);
        u.Mychart = B;
        return u
    }) : u("undefined" !== typeof Mychart ? Mychart : void 0)
})(function(u) {
    function B(b, a, h, g) {
        b.hasOwnProperty(a) || (b[a] = g.apply(null, h))
    }
    u = u ? u._modules : {};
    B(u, "parts-more/Pane.js", [u["parts/Globals.js"], u["parts/Utilities.js"]], function(b, a) {
        function h(e, c) {
            this.init(e, c)
        }
        var g = a.extend,
            m = a.splat,
            n = b.CenteredSeriesMixin,
            q = b.merge;
        g(h.prototype, {
            coll: "pane",
            init: function(e, c) {
                this.chart = c;
                this.background = [];
                c.pane.push(this);
                this.setOptions(e)
            },
            setOptions: function(e) {
                this.options = q(this.defaultOptions, this.chart.angular ? {
                    background: {}
                } : void 0, e)
            },
            render: function() {
                var e = this.options,
                    c = this.options.background,
                    a = this.chart.renderer;
                this.group || (this.group = a.g("pane-group").attr({
                    zIndex: e.zIndex || 0
                }).add());
                this.updateCenter();
                if (c)
                    for (c = m(c), e = Math.max(c.length, this.background.length ||
                            0), a = 0; a < e; a++) c[a] && this.axis ? this.renderBackground(q(this.defaultBackgroundOptions, c[a]), a) : this.background[a] && (this.background[a] = this.background[a].destroy(), this.background.splice(a, 1))
            },
            renderBackground: function(a, c) {
                var e = "animate",
                    v = {
                        "class": "Mychart-pane " + (a.className || "")
                    };
                this.chart.styledMode || g(v, {
                    fill: a.backgroundColor,
                    stroke: a.borderColor,
                    "stroke-width": a.borderWidth
                });
                this.background[c] || (this.background[c] = this.chart.renderer.path().add(this.group), e = "attr");
                this.background[c][e]({
                    d: this.axis.getPlotBandPath(a.from,
                        a.to, a)
                }).attr(v)
            },
            defaultOptions: {
                center: ["50%", "50%"],
                size: "85%",
                startAngle: 0
            },
            defaultBackgroundOptions: {
                shape: "circle",
                borderWidth: 1,
                borderColor: "#cccccc",
                backgroundColor: {
                    linearGradient: {
                        x1: 0,
                        y1: 0,
                        x2: 0,
                        y2: 1
                    },
                    stops: [
                        [0, "#ffffff"],
                        [1, "#e6e6e6"]
                    ]
                },
                from: -Number.MAX_VALUE,
                innerRadius: 0,
                to: Number.MAX_VALUE,
                outerRadius: "105%"
            },
            updateCenter: function(a) {
                this.center = (a || this.axis || {}).center = n.getCenter.call(this)
            },
            update: function(a, c) {
                q(!0, this.options, a);
                q(!0, this.chart.options.pane, a);
                this.setOptions(this.options);
                this.render();
                this.chart.axes.forEach(function(a) {
                    a.pane === this && (a.pane = null, a.update({}, c))
                }, this)
            }
        });
        b.Pane = h
    });
    B(u, "parts-more/RadialAxis.js", [u["parts/Globals.js"], u["parts/Utilities.js"]], function(b, a) {
        var h = a.extend,
            g = a.pick,
            m = a.pInt;
        a = b.addEvent;
        var n = b.Axis,
            q = b.merge,
            e = b.noop,
            c = b.Tick,
            f = b.wrap,
            v = b.correctFloat,
            t = n.prototype,
            p = c.prototype;
        var x = {
            getOffset: e,
            redraw: function() {
                this.isDirty = !1
            },
            render: function() {
                this.isDirty = !1
            },
            createLabelCollector: function() {
                return !1
            },
            setScale: e,
            setCategories: e,
            setTitle: e
        };
        var z = {
            defaultRadialGaugeOptions: {
                labels: {
                    align: "center",
                    x: 0,
                    y: null
                },
                minorGridLineWidth: 0,
                minorTickInterval: "auto",
                minorTickLength: 10,
                minorTickPosition: "inside",
                minorTickWidth: 1,
                tickLength: 10,
                tickPosition: "inside",
                tickWidth: 2,
                title: {
                    rotation: 0
                },
                zIndex: 2
            },
            defaultRadialXOptions: {
                gridLineWidth: 1,
                labels: {
                    align: null,
                    distance: 15,
                    x: 0,
                    y: null,
                    style: {
                        textOverflow: "none"
                    }
                },
                maxPadding: 0,
                minPadding: 0,
                showLastLabel: !1,
                tickLength: 0
            },
            defaultRadialYOptions: {
                gridLineInterpolation: "circle",
                labels: {
                    align: "right",
                    x: -3,
                    y: -2
                },
                showLastLabel: !1,
                title: {
                    x: 4,
                    text: null,
                    rotation: 90
                }
            },
            setOptions: function(l) {
                l = this.options = q(this.defaultOptions, this.defaultRadialOptions, l);
                l.plotBands || (l.plotBands = []);
                b.fireEvent(this, "afterSetOptions")
            },
            getOffset: function() {
                t.getOffset.call(this);
                this.chart.axisOffset[this.side] = 0
            },
            getLinePath: function(l, d) {
                l = this.center;
                var k = this.chart,
                    r = g(d, l[2] / 2 - this.offset);
                this.isCircular || void 0 !== d ? (d = this.chart.renderer.symbols.arc(this.left + l[0], this.top + l[1], r, r, {
                    start: this.startAngleRad,
                    end: this.endAngleRad,
                    open: !0,
                    innerR: 0
                }), d.xBounds = [this.left + l[0]], d.yBounds = [this.top + l[1] - r]) : (d = this.postTranslate(this.angleRad, r), d = ["M", l[0] + k.plotLeft, l[1] + k.plotTop, "L", d.x, d.y]);
                return d
            },
            setAxisTranslation: function() {
                t.setAxisTranslation.call(this);
                this.center && (this.transA = this.isCircular ? (this.endAngleRad - this.startAngleRad) / (this.max - this.min || 1) : this.center[2] / 2 / (this.max - this.min || 1), this.minPixelPadding = this.isXAxis ? this.transA * this.minPointOffset : 0)
            },
            beforeSetTickPositions: function() {
                if (this.autoConnect =
                    this.isCircular && void 0 === g(this.userMax, this.options.max) && v(this.endAngleRad - this.startAngleRad) === v(2 * Math.PI)) this.max += this.categories && 1 || this.pointRange || this.closestPointRange || 0
            },
            setAxisSize: function() {
                t.setAxisSize.call(this);
                this.isRadial && (this.pane.updateCenter(this), this.isCircular && (this.sector = this.endAngleRad - this.startAngleRad), this.len = this.width = this.height = this.center[2] * g(this.sector, 1) / 2)
            },
            getPosition: function(l, d) {
                return this.postTranslate(this.isCircular ? this.translate(l) :
                    this.angleRad, g(this.isCircular ? d : this.translate(l), this.center[2] / 2) - this.offset)
            },
            postTranslate: function(l, d) {
                var k = this.chart,
                    r = this.center;
                l = this.startAngleRad + l;
                return {
                    x: k.plotLeft + r[0] + Math.cos(l) * d,
                    y: k.plotTop + r[1] + Math.sin(l) * d
                }
            },
            getPlotBandPath: function(l, d, k) {
                var r = this.center,
                    w = this.startAngleRad,
                    c = r[2] / 2,
                    a = [g(k.outerRadius, "100%"), k.innerRadius, g(k.thickness, 10)],
                    e = Math.min(this.offset, 0),
                    v = /%$/;
                var p = this.isCircular;
                if ("polygon" === this.options.gridLineInterpolation) a = this.getPlotLinePath({
                    value: l
                }).concat(this.getPlotLinePath({
                    value: d,
                    reverse: !0
                }));
                else {
                    l = Math.max(l, this.min);
                    d = Math.min(d, this.max);
                    p || (a[0] = this.translate(l), a[1] = this.translate(d));
                    a = a.map(function(d) {
                        v.test(d) && (d = m(d, 10) * c / 100);
                        return d
                    });
                    if ("circle" !== k.shape && p) l = w + this.translate(l), d = w + this.translate(d);
                    else {
                        l = -Math.PI / 2;
                        d = 1.5 * Math.PI;
                        var t = !0
                    }
                    a[0] -= e;
                    a[2] -= e;
                    a = this.chart.renderer.symbols.arc(this.left + r[0], this.top + r[1], a[0], a[0], {
                        start: Math.min(l, d),
                        end: Math.max(l, d),
                        innerR: g(a[1], a[0] - a[2]),
                        open: t
                    });
                    p && (p = (d + l) / 2, e = this.left + r[0] + r[2] / 2 * Math.cos(p), a.xBounds =
                        p > -Math.PI / 2 && p < Math.PI / 2 ? [e, this.chart.plotWidth] : [0, e], a.yBounds = [this.top + r[1] + r[2] / 2 * Math.sin(p)], a.yBounds[0] += p > -Math.PI && 0 > p || p > Math.PI ? -10 : 10)
                }
                return a
            },
            getPlotLinePath: function(c) {
                var d = this,
                    k = d.center,
                    r = d.chart,
                    w = c.value;
                c = c.reverse;
                var l = d.getPosition(w),
                    a = d.pane.options.background ? d.pane.options.background[0] || d.pane.options.background : {},
                    e = a.innerRadius || "0%",
                    p = a.outerRadius || "100%";
                a = k[0] + r.plotLeft;
                k = k[1] + r.plotTop;
                var v = l.x;
                l = l.y;
                var t, f;
                if (d.isCircular) {
                    r = "string" === typeof e ? b.relativeLength(e,
                        1) : e / Math.sqrt(Math.pow(v - a, 2) + Math.pow(l - k, 2));
                    c = "string" === typeof p ? b.relativeLength(p, 1) : p / Math.sqrt(Math.pow(v - a, 2) + Math.pow(l - k, 2));
                    var g = ["M", a + r * (v - a), k - r * (k - l), "L", v - (1 - c) * (v - a), l + (1 - c) * (k - l)]
                } else "circle" === d.options.gridLineInterpolation ? (w = d.translate(w), g = d.getLinePath(0, w)) : (r.xAxis.forEach(function(k) {
                    k.pane === d.pane && (t = k)
                }), g = [], w = d.translate(w), r = t.tickPositions, t.autoConnect && (r = r.concat([r[0]])), c && (r = [].concat(r).reverse()), r.forEach(function(d, k) {
                    f = t.getPosition(d, w);
                    g.push(k ?
                        "L" : "M", f.x, f.y)
                }));
                return g
            },
            getTitlePosition: function() {
                var c = this.center,
                    d = this.chart,
                    k = this.options.title;
                return {
                    x: d.plotLeft + c[0] + (k.x || 0),
                    y: d.plotTop + c[1] - {
                        high: .5,
                        middle: .25,
                        low: 0
                    }[k.align] * c[2] + (k.y || 0)
                }
            },
            createLabelCollector: function() {
                var c = this;
                return function() {
                    if (c.isRadial && c.tickPositions && !0 !== c.options.labels.allowOverlap) return c.tickPositions.map(function(d) {
                        return c.ticks[d] && c.ticks[d].label
                    }).filter(function(d) {
                        return !!d
                    })
                }
            }
        };
        a(n, "init", function(c) {
            var d = this.chart,
                k = d.angular,
                r = d.polar,
                w = this.isXAxis,
                a = k && w,
                l, e = d.options;
            c = c.userOptions.pane || 0;
            c = this.pane = d.pane && d.pane[c];
            if ("colorAxis" === this.coll) this.isRadial = !1;
            else {
                if (k) {
                    if (h(this, a ? x : z), l = !w) this.defaultRadialOptions = this.defaultRadialGaugeOptions
                } else r && (h(this, z), this.defaultRadialOptions = (l = w) ? this.defaultRadialXOptions : q(this.defaultYAxisOptions, this.defaultRadialYOptions));
                k || r ? (this.isRadial = !0, d.inverted = !1, e.chart.zoomType = null, this.labelCollector || (this.labelCollector = this.createLabelCollector()), this.labelCollector &&
                    d.labelCollectors.push(this.labelCollector)) : this.isRadial = !1;
                c && l && (c.axis = this);
                this.isCircular = l
            }
        });
        a(n, "afterInit", function() {
            var c = this.chart,
                d = this.options,
                k = this.pane,
                r = k && k.options;
            c.angular && this.isXAxis || !k || !c.angular && !c.polar || (this.angleRad = (d.angle || 0) * Math.PI / 180, this.startAngleRad = (r.startAngle - 90) * Math.PI / 180, this.endAngleRad = (g(r.endAngle, r.startAngle + 360) - 90) * Math.PI / 180, this.offset = d.offset || 0)
        });
        a(n, "autoLabelAlign", function(c) {
            this.isRadial && (c.align = void 0, c.preventDefault())
        });
        a(n, "destroy", function() {
            if (this.chart && this.chart.labelCollectors) {
                var c = this.chart.labelCollectors.indexOf(this.labelCollector);
                0 <= c && this.chart.labelCollectors.splice(c, 1)
            }
        });
        a(c, "afterGetPosition", function(c) {
            this.axis.getPosition && h(c.pos, this.axis.getPosition(this.pos))
        });
        a(c, "afterGetLabelPosition", function(c) {
            var d = this.axis,
                k = this.label,
                r = k.getBBox(),
                w = d.options.labels,
                a = w.y,
                l = 20,
                e = w.align,
                v = (d.translate(this.pos) + d.startAngleRad + Math.PI / 2) / Math.PI * 180 % 360,
                p = Math.round(v),
                t = "end",
                f = 0 > p ? p +
                360 : p,
                m = f,
                h = 0,
                n = 0,
                z = null === w.y ? .3 * -r.height : 0;
            if (d.isRadial) {
                var x = d.getPosition(this.pos, d.center[2] / 2 + b.relativeLength(g(w.distance, -25), d.center[2] / 2, -d.center[2] / 2));
                "auto" === w.rotation ? k.attr({
                    rotation: v
                }) : null === a && (a = d.chart.renderer.fontMetrics(k.styles && k.styles.fontSize).b - r.height / 2);
                null === e && (d.isCircular ? (r.width > d.len * d.tickInterval / (d.max - d.min) && (l = 0), e = v > l && v < 180 - l ? "left" : v > 180 + l && v < 360 - l ? "right" : "center") : e = "center", k.attr({
                    align: e
                }));
                if ("auto" === e && 2 === d.tickPositions.length &&
                    d.isCircular) {
                    90 < f && 180 > f ? f = 180 - f : 270 < f && 360 >= f && (f = 540 - f);
                    180 < m && 360 >= m && (m = 360 - m);
                    if (d.pane.options.startAngle === p || d.pane.options.startAngle === p + 360 || d.pane.options.startAngle === p - 360) t = "start";
                    e = -90 <= p && 90 >= p || -360 <= p && -270 >= p || 270 <= p && 360 >= p ? "start" === t ? "right" : "left" : "start" === t ? "left" : "right";
                    70 < m && 110 > m && (e = "center");
                    15 > f || 180 <= f && 195 > f ? h = .3 * r.height : 15 <= f && 35 >= f ? h = "start" === t ? 0 : .75 * r.height : 195 <= f && 215 >= f ? h = "start" === t ? .75 * r.height : 0 : 35 < f && 90 >= f ? h = "start" === t ? .25 * -r.height : r.height : 215 < f &&
                        270 >= f && (h = "start" === t ? r.height : .25 * -r.height);
                    15 > m ? n = "start" === t ? .15 * -r.height : .15 * r.height : 165 < m && 180 >= m && (n = "start" === t ? .15 * r.height : .15 * -r.height);
                    k.attr({
                        align: e
                    });
                    k.translate(n, h + z)
                }
                c.pos.x = x.x + w.x;
                c.pos.y = x.y + a
            }
        });
        f(p, "getMarkPath", function(c, d, k, r, w, a, e) {
            var l = this.axis;
            l.isRadial ? (c = l.getPosition(this.pos, l.center[2] / 2 + r), d = ["M", d, k, "L", c.x, c.y]) : d = c.call(this, d, k, r, w, a, e);
            return d
        })
    });
    B(u, "parts-more/AreaRangeSeries.js", [u["parts/Globals.js"], u["parts/Utilities.js"]], function(b, a) {
        var h =
            a.defined,
            g = a.extend,
            m = a.isArray,
            n = a.isNumber,
            q = a.pick;
        a = b.seriesType;
        var e = b.seriesTypes,
            c = b.Series.prototype,
            f = b.Point.prototype;
        a("arearange", "area", {
            lineWidth: 1,
            threshold: null,
            tooltip: {
                pointFormat: '<span style="color:{series.color}">\u25cf</span> {series.name}: <b>{point.low}</b> - <b>{point.high}</b><br/>'
            },
            trackByArea: !0,
            dataLabels: {
                align: null,
                verticalAlign: null,
                xLow: 0,
                xHigh: 0,
                yLow: 0,
                yHigh: 0
            }
        }, {
            pointArrayMap: ["low", "high"],
            pointValKey: "low",
            deferTranslatePolar: !0,
            toYData: function(c) {
                return [c.low,
                    c.high
                ]
            },
            highToXY: function(c) {
                var a = this.chart,
                    e = this.xAxis.postTranslate(c.rectPlotX, this.yAxis.len - c.plotHigh);
                c.plotHighX = e.x - a.plotLeft;
                c.plotHigh = e.y - a.plotTop;
                c.plotLowX = c.plotX
            },
            translate: function() {
                var c = this,
                    a = c.yAxis,
                    p = !!c.modifyValue;
                e.area.prototype.translate.apply(c);
                c.points.forEach(function(e) {
                    var f = e.high,
                        l = e.plotY;
                    e.isNull ? e.plotY = null : (e.plotLow = l, e.plotHigh = a.translate(p ? c.modifyValue(f, e) : f, 0, 1, 0, 1), p && (e.yBottom = e.plotHigh))
                });
                this.chart.polar && this.points.forEach(function(a) {
                    c.highToXY(a);
                    a.tooltipPos = [(a.plotHighX + a.plotLowX) / 2, (a.plotHigh + a.plotLow) / 2]
                })
            },
            getGraphPath: function(c) {
                var a = [],
                    p = [],
                    f, g = e.area.prototype.getGraphPath;
                var l = this.options;
                var d = this.chart.polar && !1 !== l.connectEnds,
                    k = l.connectNulls,
                    r = l.step;
                c = c || this.points;
                for (f = c.length; f--;) {
                    var w = c[f];
                    w.isNull || d || k || c[f + 1] && !c[f + 1].isNull || p.push({
                        plotX: w.plotX,
                        plotY: w.plotY,
                        doCurve: !1
                    });
                    var F = {
                        polarPlotY: w.polarPlotY,
                        rectPlotX: w.rectPlotX,
                        yBottom: w.yBottom,
                        plotX: q(w.plotHighX, w.plotX),
                        plotY: w.plotHigh,
                        isNull: w.isNull
                    };
                    p.push(F);
                    a.push(F);
                    w.isNull || d || k || c[f - 1] && !c[f - 1].isNull || p.push({
                        plotX: w.plotX,
                        plotY: w.plotY,
                        doCurve: !1
                    })
                }
                c = g.call(this, c);
                r && (!0 === r && (r = "left"), l.step = {
                    left: "right",
                    center: "center",
                    right: "left"
                }[r]);
                a = g.call(this, a);
                p = g.call(this, p);
                l.step = r;
                l = [].concat(c, a);
                this.chart.polar || "M" !== p[0] || (p[0] = "L");
                this.graphPath = l;
                this.areaPath = c.concat(p);
                l.isArea = !0;
                l.xMap = c.xMap;
                this.areaPath.xMap = c.xMap;
                return l
            },
            drawDataLabels: function() {
                var a = this.points,
                    e = a.length,
                    f, b = [],
                    h = this.options.dataLabels,
                    l, d =
                    this.chart.inverted;
                if (m(h))
                    if (1 < h.length) {
                        var k = h[0];
                        var r = h[1]
                    } else k = h[0], r = {
                        enabled: !1
                    };
                else k = g({}, h), k.x = h.xHigh, k.y = h.yHigh, r = g({}, h), r.x = h.xLow, r.y = h.yLow;
                if (k.enabled || this._hasPointLabels) {
                    for (f = e; f--;)
                        if (l = a[f]) {
                            var w = k.inside ? l.plotHigh < l.plotLow : l.plotHigh > l.plotLow;
                            l.y = l.high;
                            l._plotY = l.plotY;
                            l.plotY = l.plotHigh;
                            b[f] = l.dataLabel;
                            l.dataLabel = l.dataLabelUpper;
                            l.below = w;
                            d ? k.align || (k.align = w ? "right" : "left") : k.verticalAlign || (k.verticalAlign = w ? "top" : "bottom")
                        }
                    this.options.dataLabels = k;
                    c.drawDataLabels &&
                        c.drawDataLabels.apply(this, arguments);
                    for (f = e; f--;)
                        if (l = a[f]) l.dataLabelUpper = l.dataLabel, l.dataLabel = b[f], delete l.dataLabels, l.y = l.low, l.plotY = l._plotY
                }
                if (r.enabled || this._hasPointLabels) {
                    for (f = e; f--;)
                        if (l = a[f]) w = r.inside ? l.plotHigh < l.plotLow : l.plotHigh > l.plotLow, l.below = !w, d ? r.align || (r.align = w ? "left" : "right") : r.verticalAlign || (r.verticalAlign = w ? "bottom" : "top");
                    this.options.dataLabels = r;
                    c.drawDataLabels && c.drawDataLabels.apply(this, arguments)
                }
                if (k.enabled)
                    for (f = e; f--;)
                        if (l = a[f]) l.dataLabels = [l.dataLabelUpper,
                            l.dataLabel
                        ].filter(function(d) {
                            return !!d
                        });
                this.options.dataLabels = h
            },
            alignDataLabel: function() {
                e.column.prototype.alignDataLabel.apply(this, arguments)
            },
            drawPoints: function() {
                var a = this.points.length,
                    e;
                c.drawPoints.apply(this, arguments);
                for (e = 0; e < a;) {
                    var f = this.points[e];
                    f.origProps = {
                        plotY: f.plotY,
                        plotX: f.plotX,
                        isInside: f.isInside,
                        negative: f.negative,
                        zone: f.zone,
                        y: f.y
                    };
                    f.lowerGraphic = f.graphic;
                    f.graphic = f.upperGraphic;
                    f.plotY = f.plotHigh;
                    h(f.plotHighX) && (f.plotX = f.plotHighX);
                    f.y = f.high;
                    f.negative =
                        f.high < (this.options.threshold || 0);
                    f.zone = this.zones.length && f.getZone();
                    this.chart.polar || (f.isInside = f.isTopInside = void 0 !== f.plotY && 0 <= f.plotY && f.plotY <= this.yAxis.len && 0 <= f.plotX && f.plotX <= this.xAxis.len);
                    e++
                }
                c.drawPoints.apply(this, arguments);
                for (e = 0; e < a;) f = this.points[e], f.upperGraphic = f.graphic, f.graphic = f.lowerGraphic, g(f, f.origProps), delete f.origProps, e++
            },
            setStackedPoints: b.noop
        }, {
            setState: function() {
                var c = this.state,
                    a = this.series,
                    e = a.chart.polar;
                h(this.plotHigh) || (this.plotHigh = a.yAxis.toPixels(this.high, !0));
                h(this.plotLow) || (this.plotLow = this.plotY = a.yAxis.toPixels(this.low, !0));
                a.stateMarkerGraphic && (a.lowerStateMarkerGraphic = a.stateMarkerGraphic, a.stateMarkerGraphic = a.upperStateMarkerGraphic);
                this.graphic = this.upperGraphic;
                this.plotY = this.plotHigh;
                e && (this.plotX = this.plotHighX);
                f.setState.apply(this, arguments);
                this.state = c;
                this.plotY = this.plotLow;
                this.graphic = this.lowerGraphic;
                e && (this.plotX = this.plotLowX);
                a.stateMarkerGraphic && (a.upperStateMarkerGraphic = a.stateMarkerGraphic, a.stateMarkerGraphic =
                    a.lowerStateMarkerGraphic, a.lowerStateMarkerGraphic = void 0);
                f.setState.apply(this, arguments)
            },
            haloPath: function() {
                var c = this.series.chart.polar,
                    a = [];
                this.plotY = this.plotLow;
                c && (this.plotX = this.plotLowX);
                this.isInside && (a = f.haloPath.apply(this, arguments));
                this.plotY = this.plotHigh;
                c && (this.plotX = this.plotHighX);
                this.isTopInside && (a = a.concat(f.haloPath.apply(this, arguments)));
                return a
            },
            destroyElements: function() {
                ["lowerGraphic", "upperGraphic"].forEach(function(c) {
                        this[c] && (this[c] = this[c].destroy())
                    },
                    this);
                this.graphic = null;
                return f.destroyElements.apply(this, arguments)
            },
            isValid: function() {
                return n(this.low) && n(this.high)
            }
        });
        ""
    });
    B(u, "parts-more/AreaSplineRangeSeries.js", [u["parts/Globals.js"]], function(b) {
        var a = b.seriesType;
        a("areasplinerange", "arearange", null, {
            getPointSpline: b.seriesTypes.spline.prototype.getPointSpline
        });
        ""
    });
    B(u, "parts-more/ColumnRangeSeries.js", [u["parts/Globals.js"], u["parts/Utilities.js"]], function(b, a) {
        var h = a.pick;
        a = b.defaultPlotOptions;
        var g = b.merge,
            m = b.noop,
            n = b.seriesType,
            q = b.seriesTypes.column.prototype;
        n("columnrange", "arearange", g(a.column, a.arearange, {
            pointRange: null,
            marker: null,
            states: {
                hover: {
                    halo: !1
                }
            }
        }), {
            translate: function() {
                var a = this,
                    c = a.yAxis,
                    f = a.xAxis,
                    g = f.startAngleRad,
                    m, b = a.chart,
                    n = a.xAxis.isRadial,
                    z = Math.max(b.chartWidth, b.chartHeight) + 999,
                    l;
                q.translate.apply(a);
                a.points.forEach(function(d) {
                    var k = d.shapeArgs,
                        r = a.options.minPointLength;
                    d.plotHigh = l = Math.min(Math.max(-z, c.translate(d.high, 0, 1, 0, 1)), z);
                    d.plotLow = Math.min(Math.max(-z, d.plotY), z);
                    var w = l;
                    var e =
                        h(d.rectPlotY, d.plotY) - l;
                    Math.abs(e) < r ? (r -= e, e += r, w -= r / 2) : 0 > e && (e *= -1, w -= e);
                    n ? (m = d.barX + g, d.shapeType = "path", d.shapeArgs = {
                        d: a.polarArc(w + e, w, m, m + d.pointWidth)
                    }) : (k.height = e, k.y = w, d.tooltipPos = b.inverted ? [c.len + c.pos - b.plotLeft - w - e / 2, f.len + f.pos - b.plotTop - k.x - k.width / 2, e] : [f.left - b.plotLeft + k.x + k.width / 2, c.pos - b.plotTop + w + e / 2, e])
                })
            },
            directTouch: !0,
            trackerGroups: ["group", "dataLabelsGroup"],
            drawGraph: m,
            getSymbol: m,
            crispCol: function() {
                return q.crispCol.apply(this, arguments)
            },
            drawPoints: function() {
                return q.drawPoints.apply(this,
                    arguments)
            },
            drawTracker: function() {
                return q.drawTracker.apply(this, arguments)
            },
            getColumnMetrics: function() {
                return q.getColumnMetrics.apply(this, arguments)
            },
            pointAttribs: function() {
                return q.pointAttribs.apply(this, arguments)
            },
            animate: function() {
                return q.animate.apply(this, arguments)
            },
            polarArc: function() {
                return q.polarArc.apply(this, arguments)
            },
            translate3dPoints: function() {
                return q.translate3dPoints.apply(this, arguments)
            },
            translate3dShapes: function() {
                return q.translate3dShapes.apply(this, arguments)
            }
        }, {
            setState: q.pointClass.prototype.setState
        });
        ""
    });
    B(u, "parts-more/ColumnPyramidSeries.js", [u["parts/Globals.js"], u["parts/Utilities.js"]], function(b, a) {
        var h = a.pick;
        a = b.seriesType;
        var g = b.seriesTypes.column.prototype;
        a("columnpyramid", "column", {}, {
            translate: function() {
                var a = this,
                    b = a.chart,
                    q = a.options,
                    e = a.dense = 2 > a.closestPointRange * a.xAxis.transA;
                e = a.borderWidth = h(q.borderWidth, e ? 0 : 1);
                var c = a.yAxis,
                    f = q.threshold,
                    v = a.translatedThreshold = c.getThreshold(f),
                    t = h(q.minPointLength, 5),
                    p = a.getColumnMetrics(),
                    x = p.width,
                    z = a.barW = Math.max(x, 1 + 2 * e),
                    l = a.pointXOffset = p.offset;
                b.inverted && (v -= .5);
                q.pointPadding && (z = Math.ceil(z));
                g.translate.apply(a);
                a.points.forEach(function(d) {
                    var k = h(d.yBottom, v),
                        r = 999 + Math.abs(k),
                        w = Math.min(Math.max(-r, d.plotY), c.len + r);
                    r = d.plotX + l;
                    var e = z / 2,
                        C = Math.min(w, k);
                    k = Math.max(w, k) - C;
                    d.barX = r;
                    d.pointWidth = x;
                    d.tooltipPos = b.inverted ? [c.len + c.pos - b.plotLeft - w, a.xAxis.len - r - e, k] : [r + e, w + c.pos - b.plotTop, k];
                    w = f + (d.total || d.y);
                    "percent" === q.stacking && (w = f + (0 > d.y) ? -100 : 100);
                    w = c.toPixels(w, !0);
                    var g = b.plotHeight - w - (b.plotHeight - v);
                    var m = e * (C - w) / g;
                    var p = e * (C + k - w) / g;
                    g = r - m + e;
                    m = r + m + e;
                    var n = r + p + e;
                    p = r - p + e;
                    var E = C - t;
                    var D = C + k;
                    0 > d.y && (E = C, D = C + k + t);
                    b.inverted && (n = b.plotWidth - C, g = w - (b.plotWidth - v), m = e * (w - n) / g, p = e * (w - (n - k)) / g, g = r + e + m, m = g - 2 * m, n = r - p + e, p = r + p + e, E = C, D = C + k - t, 0 > d.y && (D = C + k + t));
                    d.shapeType = "path";
                    d.shapeArgs = {
                        x: g,
                        y: E,
                        width: m - g,
                        height: k,
                        d: ["M", g, E, "L", m, E, n, D, p, D, "Z"]
                    }
                })
            }
        });
        ""
    });
    B(u, "parts-more/GaugeSeries.js", [u["parts/Globals.js"], u["parts/Utilities.js"]], function(b, a) {
        var h = a.isNumber,
            g = a.pick,
            m = a.pInt,
            n = b.merge,
            q = b.Series;
        a = b.seriesType;
        var e = b.TrackerMixin;
        a("gauge", "line", {
            dataLabels: {
                borderColor: "#cccccc",
                borderRadius: 3,
                borderWidth: 1,
                crop: !1,
                defer: !1,
                enabled: !0,
                verticalAlign: "top",
                y: 15,
                zIndex: 2
            },
            dial: {},
            pivot: {},
            tooltip: {
                headerFormat: ""
            },
            showInLegend: !1
        }, {
            angular: !0,
            directTouch: !0,
            drawGraph: b.noop,
            fixedBox: !0,
            forceDL: !0,
            noSharedTooltip: !0,
            trackerGroups: ["group", "dataLabelsGroup"],
            translate: function() {
                var c = this.yAxis,
                    a = this.options,
                    e = c.center;
                this.generatePoints();
                this.points.forEach(function(f) {
                    var b =
                        n(a.dial, f.dial),
                        v = m(g(b.radius, "80%")) * e[2] / 200,
                        t = m(g(b.baseLength, "70%")) * v / 100,
                        l = m(g(b.rearLength, "10%")) * v / 100,
                        d = b.baseWidth || 3,
                        k = b.topWidth || 1,
                        r = a.overshoot,
                        w = c.startAngleRad + c.translate(f.y, null, null, null, !0);
                    h(r) ? (r = r / 180 * Math.PI, w = Math.max(c.startAngleRad - r, Math.min(c.endAngleRad + r, w))) : !1 === a.wrap && (w = Math.max(c.startAngleRad, Math.min(c.endAngleRad, w)));
                    w = 180 * w / Math.PI;
                    f.shapeType = "path";
                    f.shapeArgs = {
                        d: b.path || ["M", -l, -d / 2, "L", t, -d / 2, v, -k / 2, v, k / 2, t, d / 2, -l, d / 2, "z"],
                        translateX: e[0],
                        translateY: e[1],
                        rotation: w
                    };
                    f.plotX = e[0];
                    f.plotY = e[1]
                })
            },
            drawPoints: function() {
                var c = this,
                    a = c.chart,
                    e = c.yAxis.center,
                    b = c.pivot,
                    m = c.options,
                    h = m.pivot,
                    q = a.renderer;
                c.points.forEach(function(e) {
                    var d = e.graphic,
                        k = e.shapeArgs,
                        r = k.d,
                        w = n(m.dial, e.dial);
                    d ? (d.animate(k), k.d = r) : e.graphic = q[e.shapeType](k).attr({
                        rotation: k.rotation,
                        zIndex: 1
                    }).addClass("Mychart-dial").add(c.group);
                    if (!a.styledMode) e.graphic[d ? "animate" : "attr"]({
                        stroke: w.borderColor || "none",
                        "stroke-width": w.borderWidth || 0,
                        fill: w.backgroundColor || "#000000"
                    })
                });
                b ? b.animate({
                    translateX: e[0],
                    translateY: e[1]
                }) : (c.pivot = q.circle(0, 0, g(h.radius, 5)).attr({
                    zIndex: 2
                }).addClass("Mychart-pivot").translate(e[0], e[1]).add(c.group), a.styledMode || c.pivot.attr({
                    "stroke-width": h.borderWidth || 0,
                    stroke: h.borderColor || "#cccccc",
                    fill: h.backgroundColor || "#000000"
                }))
            },
            animate: function(c) {
                var a = this;
                c || (a.points.forEach(function(c) {
                        var e = c.graphic;
                        e && (e.attr({
                            rotation: 180 * a.yAxis.startAngleRad / Math.PI
                        }), e.animate({
                            rotation: c.shapeArgs.rotation
                        }, a.options.animation))
                    }), a.animate =
                    null)
            },
            render: function() {
                this.group = this.plotGroup("group", "series", this.visible ? "visible" : "hidden", this.options.zIndex, this.chart.seriesGroup);
                q.prototype.render.call(this);
                this.group.clip(this.chart.clipRect)
            },
            setData: function(c, a) {
                q.prototype.setData.call(this, c, !1);
                this.processData();
                this.generatePoints();
                g(a, !0) && this.chart.redraw()
            },
            hasData: function() {
                return !!this.points.length
            },
            drawTracker: e && e.drawTrackerPoint
        }, {
            setState: function(c) {
                this.state = c
            }
        });
        ""
    });
    B(u, "parts-more/BoxPlotSeries.js", [u["parts/Globals.js"],
        u["parts/Utilities.js"]
    ], function(b, a) {
        var h = a.pick;
        a = b.noop;
        var g = b.seriesType,
            m = b.seriesTypes;
        g("boxplot", "column", {
            threshold: null,
            tooltip: {
                pointFormat: '<span style="color:{point.color}">\u25cf</span> <b> {series.name}</b><br/>Maximum: {point.high}<br/>Upper quartile: {point.q3}<br/>Median: {point.median}<br/>Lower quartile: {point.q1}<br/>Minimum: {point.low}<br/>'
            },
            whiskerLength: "50%",
            fillColor: "#ffffff",
            lineWidth: 1,
            medianWidth: 2,
            whiskerWidth: 2
        }, {
            pointArrayMap: ["low", "q1", "median", "q3", "high"],
            toYData: function(a) {
                return [a.low, a.q1, a.median, a.q3, a.high]
            },
            pointValKey: "high",
            pointAttribs: function() {
                return {}
            },
            drawDataLabels: a,
            translate: function() {
                var a = this.yAxis,
                    b = this.pointArrayMap;
                m.column.prototype.translate.apply(this);
                this.points.forEach(function(e) {
                    b.forEach(function(c) {
                        null !== e[c] && (e[c + "Plot"] = a.translate(e[c], 0, 1, 0, 1))
                    })
                })
            },
            drawPoints: function() {
                var a = this,
                    b = a.options,
                    e = a.chart,
                    c = e.renderer,
                    f, g, m, p, x, z, l = 0,
                    d, k, r, w, F = !1 !== a.doQuartiles,
                    C, H = a.options.whiskerLength;
                a.points.forEach(function(A) {
                    var v =
                        A.graphic,
                        t = v ? "animate" : "attr",
                        n = A.shapeArgs,
                        q = {},
                        G = {},
                        y = {},
                        I = {},
                        u = A.color || a.color;
                    void 0 !== A.plotY && (d = n.width, k = Math.floor(n.x), r = k + d, w = Math.round(d / 2), f = Math.floor(F ? A.q1Plot : A.lowPlot), g = Math.floor(F ? A.q3Plot : A.lowPlot), m = Math.floor(A.highPlot), p = Math.floor(A.lowPlot), v || (A.graphic = v = c.g("point").add(a.group), A.stem = c.path().addClass("Mychart-boxplot-stem").add(v), H && (A.whiskers = c.path().addClass("Mychart-boxplot-whisker").add(v)), F && (A.box = c.path(void 0).addClass("Mychart-boxplot-box").add(v)),
                            A.medianShape = c.path(void 0).addClass("Mychart-boxplot-median").add(v)), e.styledMode || (G.stroke = A.stemColor || b.stemColor || u, G["stroke-width"] = h(A.stemWidth, b.stemWidth, b.lineWidth), G.dashstyle = A.stemDashStyle || b.stemDashStyle, A.stem.attr(G), H && (y.stroke = A.whiskerColor || b.whiskerColor || u, y["stroke-width"] = h(A.whiskerWidth, b.whiskerWidth, b.lineWidth), A.whiskers.attr(y)), F && (q.fill = A.fillColor || b.fillColor || u, q.stroke = b.lineColor || u, q["stroke-width"] = b.lineWidth || 0, A.box.attr(q)), I.stroke = A.medianColor ||
                            b.medianColor || u, I["stroke-width"] = h(A.medianWidth, b.medianWidth, b.lineWidth), A.medianShape.attr(I)), z = A.stem.strokeWidth() % 2 / 2, l = k + w + z, A.stem[t]({
                            d: ["M", l, g, "L", l, m, "M", l, f, "L", l, p]
                        }), F && (z = A.box.strokeWidth() % 2 / 2, f = Math.floor(f) + z, g = Math.floor(g) + z, k += z, r += z, A.box[t]({
                            d: ["M", k, g, "L", k, f, "L", r, f, "L", r, g, "L", k, g, "z"]
                        })), H && (z = A.whiskers.strokeWidth() % 2 / 2, m += z, p += z, C = /%$/.test(H) ? w * parseFloat(H) / 100 : H / 2, A.whiskers[t]({
                            d: ["M", l - C, m, "L", l + C, m, "M", l - C, p, "L", l + C, p]
                        })), x = Math.round(A.medianPlot), z = A.medianShape.strokeWidth() %
                        2 / 2, x += z, A.medianShape[t]({
                            d: ["M", k, x, "L", r, x]
                        }))
                })
            },
            setStackedPoints: a
        });
        ""
    });
    B(u, "parts-more/ErrorBarSeries.js", [u["parts/Globals.js"]], function(b) {
        var a = b.noop,
            h = b.seriesType,
            g = b.seriesTypes;
        h("errorbar", "boxplot", {
            color: "#000000",
            grouping: !1,
            linkedTo: ":previous",
            tooltip: {
                pointFormat: '<span style="color:{point.color}">\u25cf</span> {series.name}: <b>{point.low}</b> - <b>{point.high}</b><br/>'
            },
            whiskerWidth: null
        }, {
            type: "errorbar",
            pointArrayMap: ["low", "high"],
            toYData: function(a) {
                return [a.low, a.high]
            },
            pointValKey: "high",
            doQuartiles: !1,
            drawDataLabels: g.arearange ? function() {
                var a = this.pointValKey;
                g.arearange.prototype.drawDataLabels.call(this);
                this.data.forEach(function(b) {
                    b.y = b[a]
                })
            } : a,
            getColumnMetrics: function() {
                return this.linkedParent && this.linkedParent.columnMetrics || g.column.prototype.getColumnMetrics.call(this)
            }
        });
        ""
    });
    B(u, "parts-more/WaterfallSeries.js", [u["parts/Globals.js"], u["parts/Utilities.js"]], function(b, a) {
        var h = a.arrayMax,
            g = a.arrayMin,
            m = a.isNumber,
            n = a.objectEach,
            q = a.pick,
            e = b.correctFloat;
        a = b.addEvent;
        var c = b.Axis,
            f = b.Chart,
            v = b.Point,
            t = b.Series,
            p = b.StackItem,
            x = b.seriesType,
            z = b.seriesTypes;
        a(c, "afterInit", function() {
            this.isXAxis || (this.waterfallStacks = {
                changed: !1
            })
        });
        a(f, "beforeRedraw", function() {
            for (var a = this.axes, d = this.series, k = d.length; k--;) d[k].options.stacking && (a.forEach(function(d) {
                d.isXAxis || (d.waterfallStacks.changed = !0)
            }), k = 0)
        });
        a(c, "afterRender", function() {
            var a = this.options.stackLabels;
            a && a.enabled && this.waterfallStacks && this.renderWaterfallStackTotals()
        });
        c.prototype.renderWaterfallStackTotals =
            function() {
                var a = this.waterfallStacks,
                    d = this.stackTotalGroup,
                    k = new p(this, this.options.stackLabels, !1, 0, void 0);
                this.dummyStackItem = k;
                n(a, function(a) {
                    n(a, function(a) {
                        k.total = a.stackTotal;
                        a.label && (k.label = a.label);
                        p.prototype.render.call(k, d);
                        a.label = k.label;
                        delete k.label
                    })
                });
                k.total = null
            };
        x("waterfall", "column", {
            dataLabels: {
                inside: !0
            },
            lineWidth: 1,
            lineColor: "#333333",
            dashStyle: "Dot",
            borderColor: "#333333",
            states: {
                hover: {
                    lineWidthPlus: 0
                }
            }
        }, {
            pointValKey: "y",
            showLine: !0,
            generatePoints: function() {
                var a;
                z.column.prototype.generatePoints.apply(this);
                var d = 0;
                for (a = this.points.length; d < a; d++) {
                    var k = this.points[d];
                    var c = this.processedYData[d];
                    if (k.isIntermediateSum || k.isSum) k.y = e(c)
                }
            },
            translate: function() {
                var a = this.options,
                    d = this.yAxis,
                    k, c = q(a.minPointLength, 5),
                    e = c / 2,
                    f = a.threshold,
                    b = a.stacking,
                    g = d.waterfallStacks[this.stackKey];
                z.column.prototype.translate.apply(this);
                var m = k = f;
                var h = this.points;
                var v = 0;
                for (a = h.length; v < a; v++) {
                    var p = h[v];
                    var t = this.processedYData[v];
                    var n = p.shapeArgs;
                    var y = [0, t];
                    var x =
                        p.y;
                    if (b) {
                        if (g) {
                            y = g[v];
                            if ("overlap" === b) {
                                var u = y.stackState[y.stateIndex--];
                                u = 0 <= x ? u : u - x;
                                Object.hasOwnProperty.call(y, "absolutePos") && delete y.absolutePos;
                                Object.hasOwnProperty.call(y, "absoluteNeg") && delete y.absoluteNeg
                            } else 0 <= x ? (u = y.threshold + y.posTotal, y.posTotal -= x) : (u = y.threshold + y.negTotal, y.negTotal -= x, u -= x), !y.posTotal && Object.hasOwnProperty.call(y, "absolutePos") && (y.posTotal = y.absolutePos, delete y.absolutePos), !y.negTotal && Object.hasOwnProperty.call(y, "absoluteNeg") && (y.negTotal = y.absoluteNeg,
                                delete y.absoluteNeg);
                            p.isSum || (y.connectorThreshold = y.threshold + y.stackTotal);
                            d.reversed ? (t = 0 <= x ? u - x : u + x, x = u) : (t = u, x = u - x);
                            p.below = t <= q(f, 0);
                            n.y = d.translate(t, 0, 1, 0, 1);
                            n.height = Math.abs(n.y - d.translate(x, 0, 1, 0, 1))
                        }
                        if (x = d.dummyStackItem) x.x = v, x.label = g[v].label, x.setOffset(this.pointXOffset || 0, this.barW || 0, this.stackedYNeg[v], this.stackedYPos[v])
                    } else u = Math.max(m, m + x) + y[0], n.y = d.translate(u, 0, 1, 0, 1), p.isSum ? (n.y = d.translate(y[1], 0, 1, 0, 1), n.height = Math.min(d.translate(y[0], 0, 1, 0, 1), d.len) - n.y) : p.isIntermediateSum ?
                        (0 <= x ? (t = y[1] + k, x = k) : (t = k, x = y[1] + k), d.reversed && (t ^= x, x ^= t, t ^= x), n.y = d.translate(t, 0, 1, 0, 1), n.height = Math.abs(n.y - Math.min(d.translate(x, 0, 1, 0, 1), d.len)), k += y[1]) : (n.height = 0 < t ? d.translate(m, 0, 1, 0, 1) - n.y : d.translate(m, 0, 1, 0, 1) - d.translate(m - t, 0, 1, 0, 1), m += t, p.below = m < q(f, 0)), 0 > n.height && (n.y += n.height, n.height *= -1);
                    p.plotY = n.y = Math.round(n.y) - this.borderWidth % 2 / 2;
                    n.height = Math.max(Math.round(n.height), .001);
                    p.yBottom = n.y + n.height;
                    n.height <= c && !p.isNull ? (n.height = c, n.y -= e, p.plotY = n.y, p.minPointLengthOffset =
                        0 > p.y ? -e : e) : (p.isNull && (n.width = 0), p.minPointLengthOffset = 0);
                    n = p.plotY + (p.negative ? n.height : 0);
                    this.chart.inverted ? p.tooltipPos[0] = d.len - n : p.tooltipPos[1] = n
                }
            },
            processData: function(a) {
                var d = this.options,
                    k = this.yData,
                    c = d.data,
                    w = k.length,
                    f = d.threshold || 0,
                    l, b, g, m, h;
                for (h = b = l = g = m = 0; h < w; h++) {
                    var p = k[h];
                    var v = c && c[h] ? c[h] : {};
                    "sum" === p || v.isSum ? k[h] = e(b) : "intermediateSum" === p || v.isIntermediateSum ? (k[h] = e(l), l = 0) : (b += p, l += p);
                    g = Math.min(b, g);
                    m = Math.max(b, m)
                }
                t.prototype.processData.call(this, a);
                d.stacking ||
                    (this.dataMin = g + f, this.dataMax = m)
            },
            toYData: function(a) {
                return a.isSum ? "sum" : a.isIntermediateSum ? "intermediateSum" : a.y
            },
            updateParallelArrays: function(a, d) {
                t.prototype.updateParallelArrays.call(this, a, d);
                if ("sum" === this.yData[0] || "intermediateSum" === this.yData[0]) this.yData[0] = null
            },
            pointAttribs: function(a, d) {
                var k = this.options.upColor;
                k && !a.options.color && (a.color = 0 < a.y ? k : null);
                a = z.column.prototype.pointAttribs.call(this, a, d);
                delete a.dashstyle;
                return a
            },
            getGraphPath: function() {
                return ["M", 0, 0]
            },
            getCrispPath: function() {
                var a =
                    this.data,
                    d = this.yAxis,
                    k = a.length,
                    c = Math.round(this.graph.strokeWidth()) % 2 / 2,
                    e = Math.round(this.borderWidth) % 2 / 2,
                    f = this.xAxis.reversed,
                    b = this.yAxis.reversed,
                    g = this.options.stacking,
                    m = [],
                    h;
                for (h = 1; h < k; h++) {
                    var p = a[h].shapeArgs;
                    var v = a[h - 1];
                    var n = a[h - 1].shapeArgs;
                    var t = d.waterfallStacks[this.stackKey];
                    var y = 0 < v.y ? -n.height : 0;
                    if (t) {
                        t = t[h - 1];
                        g ? (t = t.connectorThreshold, y = Math.round(d.translate(t, 0, 1, 0, 1) + (b ? y : 0)) - c) : y = n.y + v.minPointLengthOffset + e - c;
                        var q = ["M", n.x + (f ? 0 : n.width), y, "L", p.x + (f ? p.width : 0), y]
                    }
                    if (!g &&
                        0 > v.y && !b || 0 < v.y && b) q[2] += n.height, q[5] += n.height;
                    m = m.concat(q)
                }
                return m
            },
            drawGraph: function() {
                t.prototype.drawGraph.call(this);
                this.graph.attr({
                    d: this.getCrispPath()
                })
            },
            setStackedPoints: function() {
                function a(d, a, k, c) {
                    if (B)
                        for (k; k < B; k++) q.stackState[k] += c;
                    else q.stackState[0] = d, B = q.stackState.length;
                    q.stackState.push(q.stackState[B - 1] + a)
                }
                var d = this.options,
                    k = this.yAxis.waterfallStacks,
                    c = d.threshold,
                    e = c || 0,
                    f = e,
                    b = this.stackKey,
                    g = this.xData,
                    m = g.length,
                    h, p;
                this.yAxis.usePercentage = !1;
                var v = h = p = e;
                if (this.visible ||
                    !this.chart.options.chart.ignoreHiddenSeries) {
                    k[b] || (k[b] = {});
                    b = k[b];
                    for (var n = 0; n < m; n++) {
                        var t = g[n];
                        if (!b[t] || k.changed) b[t] = {
                            negTotal: 0,
                            posTotal: 0,
                            stackTotal: 0,
                            threshold: 0,
                            stateIndex: 0,
                            stackState: [],
                            label: k.changed && b[t] ? b[t].label : void 0
                        };
                        var q = b[t];
                        var x = this.yData[n];
                        0 <= x ? q.posTotal += x : q.negTotal += x;
                        var z = d.data[n];
                        t = q.absolutePos = q.posTotal;
                        var u = q.absoluteNeg = q.negTotal;
                        q.stackTotal = t + u;
                        var B = q.stackState.length;
                        z && z.isIntermediateSum ? (a(p, h, 0, p), p = h, h = c, e ^= f, f ^= e, e ^= f) : z && z.isSum ? (a(c, v, B),
                            e = c) : (a(e, x, 0, v), z && (v += x, h += x));
                        q.stateIndex++;
                        q.threshold = e;
                        e += q.stackTotal
                    }
                    k.changed = !1
                }
            },
            getExtremes: function() {
                var a = this.options.stacking;
                if (a) {
                    var d = this.yAxis;
                    d = d.waterfallStacks;
                    var k = this.stackedYNeg = [];
                    var c = this.stackedYPos = [];
                    "overlap" === a ? n(d[this.stackKey], function(d) {
                        k.push(g(d.stackState));
                        c.push(h(d.stackState))
                    }) : n(d[this.stackKey], function(d) {
                        k.push(d.negTotal + d.threshold);
                        c.push(d.posTotal + d.threshold)
                    });
                    this.dataMin = g(k);
                    this.dataMax = h(c)
                }
            }
        }, {
            getClassName: function() {
                var a = v.prototype.getClassName.call(this);
                this.isSum ? a += " Mychart-sum" : this.isIntermediateSum && (a += " Mychart-intermediate-sum");
                return a
            },
            isValid: function() {
                return m(this.y) || this.isSum || this.isIntermediateSum
            }
        });
        ""
    });
    B(u, "parts-more/PolygonSeries.js", [u["parts/Globals.js"]], function(b) {
        var a = b.Series,
            h = b.seriesType,
            g = b.seriesTypes;
        h("polygon", "scatter", {
            marker: {
                enabled: !1,
                states: {
                    hover: {
                        enabled: !1
                    }
                }
            },
            stickyTracking: !1,
            tooltip: {
                followPointer: !0,
                pointFormat: ""
            },
            trackByArea: !0
        }, {
            type: "polygon",
            getGraphPath: function() {
                for (var b = a.prototype.getGraphPath.call(this),
                        g = b.length + 1; g--;)(g === b.length || "M" === b[g]) && 0 < g && b.splice(g, 0, "z");
                return this.areaPath = b
            },
            drawGraph: function() {
                this.options.fillColor = this.color;
                g.area.prototype.drawGraph.call(this)
            },
            drawLegendSymbol: b.LegendSymbolMixin.drawRectangle,
            drawTracker: a.prototype.drawTracker,
            setStackedPoints: b.noop
        });
        ""
    });
    B(u, "parts-more/BubbleLegend.js", [u["parts/Globals.js"], u["parts/Utilities.js"]], function(b, a) {
        var h = a.arrayMax,
            g = a.arrayMin,
            m = a.isNumber,
            n = a.objectEach,
            q = a.pick;
        a = b.Series;
        var e = b.Legend,
            c = b.Chart,
            f = b.addEvent,
            v = b.wrap,
            t = b.color,
            p = b.numberFormat,
            x = b.merge,
            z = b.noop,
            l = b.stableSort,
            d = b.setOptions;
        d({
            legend: {
                bubbleLegend: {
                    borderColor: void 0,
                    borderWidth: 2,
                    className: void 0,
                    color: void 0,
                    connectorClassName: void 0,
                    connectorColor: void 0,
                    connectorDistance: 60,
                    connectorWidth: 1,
                    enabled: !1,
                    labels: {
                        className: void 0,
                        allowOverlap: !1,
                        format: "",
                        formatter: void 0,
                        align: "right",
                        style: {
                            fontSize: 10,
                            color: void 0
                        },
                        x: 0,
                        y: 0
                    },
                    maxSize: 60,
                    minSize: 10,
                    legendIndex: 0,
                    ranges: {
                        value: void 0,
                        borderColor: void 0,
                        color: void 0,
                        connectorColor: void 0
                    },
                    sizeBy: "area",
                    sizeByAbsoluteValue: !1,
                    zIndex: 1,
                    zThreshold: 0
                }
            }
        });
        b.BubbleLegend = function(d, a) {
            this.init(d, a)
        };
        b.BubbleLegend.prototype = {
            init: function(d, a) {
                this.options = d;
                this.visible = !0;
                this.chart = a.chart;
                this.legend = a
            },
            setState: z,
            addToLegend: function(d) {
                d.splice(this.options.legendIndex, 0, this)
            },
            drawLegendSymbol: function(d) {
                var a = this.chart,
                    c = this.options,
                    k = q(d.options.itemDistance, 20),
                    e = c.ranges;
                var f = c.connectorDistance;
                this.fontMetrics = a.renderer.fontMetrics(c.labels.style.fontSize.toString() + "px");
                e && e.length && m(e[0].value) ? (l(e, function(d, a) {
                    return a.value - d.value
                }), this.ranges = e, this.setOptions(), this.render(), a = this.getMaxLabelSize(), e = this.ranges[0].radius, d = 2 * e, f = f - e + a.width, f = 0 < f ? f : 0, this.maxLabel = a, this.movementX = "left" === c.labels.align ? f : 0, this.legendItemWidth = d + f + k, this.legendItemHeight = d + this.fontMetrics.h / 2) : d.options.bubbleLegend.autoRanges = !0
            },
            setOptions: function() {
                var d = this.ranges,
                    a = this.options,
                    c = this.chart.series[a.seriesIndex],
                    e = this.legend.baseline,
                    f = {
                        "z-index": a.zIndex,
                        "stroke-width": a.borderWidth
                    },
                    b = {
                        "z-index": a.zIndex,
                        "stroke-width": a.connectorWidth
                    },
                    g = this.getLabelStyles(),
                    l = c.options.marker.fillOpacity,
                    h = this.chart.styledMode;
                d.forEach(function(k, r) {
                    h || (f.stroke = q(k.borderColor, a.borderColor, c.color), f.fill = q(k.color, a.color, 1 !== l ? t(c.color).setOpacity(l).get("rgba") : c.color), b.stroke = q(k.connectorColor, a.connectorColor, c.color));
                    d[r].radius = this.getRangeRadius(k.value);
                    d[r] = x(d[r], {
                        center: d[0].radius - d[r].radius + e
                    });
                    h || x(!0, d[r], {
                        bubbleStyle: x(!1, f),
                        connectorStyle: x(!1,
                            b),
                        labelStyle: g
                    })
                }, this)
            },
            getLabelStyles: function() {
                var d = this.options,
                    a = {},
                    c = "left" === d.labels.align,
                    e = this.legend.options.rtl;
                n(d.labels.style, function(d, c) {
                    "color" !== c && "fontSize" !== c && "z-index" !== c && (a[c] = d)
                });
                return x(!1, a, {
                    "font-size": d.labels.style.fontSize,
                    fill: q(d.labels.style.color, "#000000"),
                    "z-index": d.zIndex,
                    align: e || c ? "right" : "left"
                })
            },
            getRangeRadius: function(d) {
                var a = this.options;
                return this.chart.series[this.options.seriesIndex].getRadius.call(this, a.ranges[a.ranges.length - 1].value,
                    a.ranges[0].value, a.minSize, a.maxSize, d)
            },
            render: function() {
                var d = this.chart.renderer,
                    a = this.options.zThreshold;
                this.symbols || (this.symbols = {
                    connectors: [],
                    bubbleItems: [],
                    labels: []
                });
                this.legendSymbol = d.g("bubble-legend");
                this.legendItem = d.g("bubble-legend-item");
                this.legendSymbol.translateX = 0;
                this.legendSymbol.translateY = 0;
                this.ranges.forEach(function(d) {
                    d.value >= a && this.renderRange(d)
                }, this);
                this.legendSymbol.add(this.legendItem);
                this.legendItem.add(this.legendGroup);
                this.hideOverlappingLabels()
            },
            renderRange: function(d) {
                var a = this.options,
                    c = a.labels,
                    k = this.chart.renderer,
                    e = this.symbols,
                    f = e.labels,
                    b = d.center,
                    g = Math.abs(d.radius),
                    l = a.connectorDistance,
                    h = c.align,
                    m = c.style.fontSize;
                l = this.legend.options.rtl || "left" === h ? -l : l;
                c = a.connectorWidth;
                var p = this.ranges[0].radius,
                    v = b - g - a.borderWidth / 2 + c / 2;
                m = m / 2 - (this.fontMetrics.h - m) / 2;
                var t = k.styledMode;
                "center" === h && (l = 0, a.connectorDistance = 0, d.labelStyle.align = "center");
                h = v + a.labels.y;
                var n = p + l + a.labels.x;
                e.bubbleItems.push(k.circle(p, b + ((v % 1 ? 1 : .5) -
                    (c % 2 ? 0 : .5)), g).attr(t ? {} : d.bubbleStyle).addClass((t ? "Mychart-color-" + this.options.seriesIndex + " " : "") + "Mychart-bubble-legend-symbol " + (a.className || "")).add(this.legendSymbol));
                e.connectors.push(k.path(k.crispLine(["M", p, v, "L", p + l, v], a.connectorWidth)).attr(t ? {} : d.connectorStyle).addClass((t ? "Mychart-color-" + this.options.seriesIndex + " " : "") + "Mychart-bubble-legend-connectors " + (a.connectorClassName || "")).add(this.legendSymbol));
                d = k.text(this.formatLabel(d), n, h + m).attr(t ? {} : d.labelStyle).addClass("Mychart-bubble-legend-labels " +
                    (a.labels.className || "")).add(this.legendSymbol);
                f.push(d);
                d.placed = !0;
                d.alignAttr = {
                    x: n,
                    y: h + m
                }
            },
            getMaxLabelSize: function() {
                var d, a;
                this.symbols.labels.forEach(function(c) {
                    a = c.getBBox(!0);
                    d = d ? a.width > d.width ? a : d : a
                });
                return d || {}
            },
            formatLabel: function(d) {
                var a = this.options,
                    c = a.labels.formatter;
                return (a = a.labels.format) ? b.format(a, d) : c ? c.call(d) : p(d.value, 1)
            },
            hideOverlappingLabels: function() {
                var d = this.chart,
                    a = this.symbols;
                !this.options.labels.allowOverlap && a && (d.hideOverlappingLabels(a.labels), a.labels.forEach(function(d,
                    c) {
                    d.newOpacity ? d.newOpacity !== d.oldOpacity && a.connectors[c].show() : a.connectors[c].hide()
                }))
            },
            getRanges: function() {
                var d = this.legend.bubbleLegend,
                    a = d.options.ranges,
                    c, e = Number.MAX_VALUE,
                    f = -Number.MAX_VALUE;
                d.chart.series.forEach(function(d) {
                    d.isBubble && !d.ignoreSeries && (c = d.zData.filter(m), c.length && (e = q(d.options.zMin, Math.min(e, Math.max(g(c), !1 === d.options.displayNegative ? d.options.zThreshold : -Number.MAX_VALUE))), f = q(d.options.zMax, Math.max(f, h(c)))))
                });
                var b = e === f ? [{
                    value: f
                }] : [{
                    value: e
                }, {
                    value: (e +
                        f) / 2
                }, {
                    value: f,
                    autoRanges: !0
                }];
                a.length && a[0].radius && b.reverse();
                b.forEach(function(d, c) {
                    a && a[c] && (b[c] = x(!1, a[c], d))
                });
                return b
            },
            predictBubbleSizes: function() {
                var d = this.chart,
                    a = this.fontMetrics,
                    c = d.legend.options,
                    e = "horizontal" === c.layout,
                    f = e ? d.legend.lastLineHeight : 0,
                    b = d.plotSizeX,
                    g = d.plotSizeY,
                    l = d.series[this.options.seriesIndex];
                d = Math.ceil(l.minPxSize);
                var h = Math.ceil(l.maxPxSize);
                l = l.options.maxSize;
                var m = Math.min(g, b);
                if (c.floating || !/%$/.test(l)) a = h;
                else if (l = parseFloat(l), a = (m + f - a.h / 2) *
                    l / 100 / (l / 100 + 1), e && g - a >= b || !e && b - a >= g) a = h;
                return [d, Math.ceil(a)]
            },
            updateRanges: function(d, a) {
                var c = this.legend.options.bubbleLegend;
                c.minSize = d;
                c.maxSize = a;
                c.ranges = this.getRanges()
            },
            correctSizes: function() {
                var d = this.legend,
                    a = this.chart.series[this.options.seriesIndex];
                1 < Math.abs(Math.ceil(a.maxPxSize) - this.options.maxSize) && (this.updateRanges(this.options.minSize, a.maxPxSize), d.render())
            }
        };
        f(b.Legend, "afterGetAllItems", function(d) {
            var a = this.bubbleLegend,
                c = this.options,
                e = c.bubbleLegend,
                k = this.chart.getVisibleBubbleSeriesIndex();
            a && a.ranges && a.ranges.length && (e.ranges.length && (e.autoRanges = !!e.ranges[0].autoRanges), this.destroyItem(a));
            0 <= k && c.enabled && e.enabled && (e.seriesIndex = k, this.bubbleLegend = new b.BubbleLegend(e, this), this.bubbleLegend.addToLegend(d.allItems))
        });
        c.prototype.getVisibleBubbleSeriesIndex = function() {
            for (var d = this.series, a = 0; a < d.length;) {
                if (d[a] && d[a].isBubble && d[a].visible && d[a].zData.length) return a;
                a++
            }
            return -1
        };
        e.prototype.getLinesHeights = function() {
            var d = this.allItems,
                a = [],
                c = d.length,
                e, f = 0;
            for (e = 0; e <
                c; e++)
                if (d[e].legendItemHeight && (d[e].itemHeight = d[e].legendItemHeight), d[e] === d[c - 1] || d[e + 1] && d[e]._legendItemPos[1] !== d[e + 1]._legendItemPos[1]) {
                    a.push({
                        height: 0
                    });
                    var b = a[a.length - 1];
                    for (f; f <= e; f++) d[f].itemHeight > b.height && (b.height = d[f].itemHeight);
                    b.step = e
                }
            return a
        };
        e.prototype.retranslateItems = function(d) {
            var a, c, e, k = this.options.rtl,
                f = 0;
            this.allItems.forEach(function(b, r) {
                a = b.legendGroup.translateX;
                c = b._legendItemPos[1];
                if ((e = b.movementX) || k && b.ranges) e = k ? a - b.options.maxSize / 2 : a + e, b.legendGroup.attr({
                    translateX: e
                });
                r > d[f].step && f++;
                b.legendGroup.attr({
                    translateY: Math.round(c + d[f].height / 2)
                });
                b._legendItemPos[1] = c + d[f].height / 2
            })
        };
        f(a, "legendItemClick", function() {
            var d = this.chart,
                a = this.visible,
                c = this.chart.legend;
            c && c.bubbleLegend && (this.visible = !a, this.ignoreSeries = a, d = 0 <= d.getVisibleBubbleSeriesIndex(), c.bubbleLegend.visible !== d && (c.update({
                bubbleLegend: {
                    enabled: d
                }
            }), c.bubbleLegend.visible = d), this.visible = a)
        });
        v(c.prototype, "drawChartBox", function(d, a, c) {
            var e = this.legend,
                k = 0 <= this.getVisibleBubbleSeriesIndex();
            if (e && e.options.enabled && e.bubbleLegend && e.options.bubbleLegend.autoRanges && k) {
                var f = e.bubbleLegend.options;
                k = e.bubbleLegend.predictBubbleSizes();
                e.bubbleLegend.updateRanges(k[0], k[1]);
                f.placed || (e.group.placed = !1, e.allItems.forEach(function(d) {
                    d.legendGroup.translateY = null
                }));
                e.render();
                this.getMargins();
                this.axes.forEach(function(d) {
                    d.visible && d.render();
                    f.placed || (d.setScale(), d.updateNames(), n(d.ticks, function(d) {
                        d.isNew = !0;
                        d.isNewLabel = !0
                    }))
                });
                f.placed = !0;
                this.getMargins();
                d.call(this, a, c);
                e.bubbleLegend.correctSizes();
                e.retranslateItems(e.getLinesHeights())
            } else d.call(this, a, c), e && e.options.enabled && e.bubbleLegend && (e.render(), e.retranslateItems(e.getLinesHeights()))
        })
    });
    B(u, "parts-more/BubbleSeries.js", [u["parts/Globals.js"], u["parts/Utilities.js"]], function(b, a) {
        var h = a.arrayMax,
            g = a.arrayMin,
            m = a.extend,
            n = a.isNumber,
            q = a.pick,
            e = a.pInt;
        a = b.Axis;
        var c = b.color,
            f = b.noop,
            v = b.Point,
            t = b.Series,
            p = b.seriesType,
            x = b.seriesTypes;
        p("bubble", "scatter", {
            dataLabels: {
                formatter: function() {
                    return this.point.z
                },
                inside: !0,
                verticalAlign: "middle"
            },
            animationLimit: 250,
            marker: {
                lineColor: null,
                lineWidth: 1,
                fillOpacity: .5,
                radius: null,
                states: {
                    hover: {
                        radiusPlus: 0
                    }
                },
                symbol: "circle"
            },
            minSize: 8,
            maxSize: "20%",
            softThreshold: !1,
            states: {
                hover: {
                    halo: {
                        size: 5
                    }
                }
            },
            tooltip: {
                pointFormat: "({point.x}, {point.y}), Size: {point.z}"
            },
            turboThreshold: 0,
            zThreshold: 0,
            zoneAxis: "z"
        }, {
            pointArrayMap: ["y", "z"],
            parallelArrays: ["x", "y", "z"],
            trackerGroups: ["group", "dataLabelsGroup"],
            specialGroup: "group",
            bubblePadding: !0,
            zoneAxis: "z",
            directTouch: !0,
            isBubble: !0,
            pointAttribs: function(a,
                e) {
                var d = this.options.marker.fillOpacity;
                a = t.prototype.pointAttribs.call(this, a, e);
                1 !== d && (a.fill = c(a.fill).setOpacity(d).get("rgba"));
                return a
            },
            getRadii: function(a, c, d) {
                var e = this.zData,
                    f = this.yData,
                    b = d.minPxSize,
                    g = d.maxPxSize,
                    l = [];
                var h = 0;
                for (d = e.length; h < d; h++) {
                    var m = e[h];
                    l.push(this.getRadius(a, c, b, g, m, f[h]))
                }
                this.radii = l
            },
            getRadius: function(a, c, d, e, f, b) {
                var k = this.options,
                    r = "width" !== k.sizeBy,
                    g = k.zThreshold,
                    l = c - a,
                    h = .5;
                if (null === b || null === f) return null;
                if (n(f)) {
                    k.sizeByAbsoluteValue && (f = Math.abs(f -
                        g), l = Math.max(c - g, Math.abs(a - g)), a = 0);
                    if (f < a) return d / 2 - 1;
                    0 < l && (h = (f - a) / l)
                }
                r && 0 <= h && (h = Math.sqrt(h));
                return Math.ceil(d + h * (e - d)) / 2
            },
            animate: function(a) {
                !a && this.points.length < this.options.animationLimit && (this.points.forEach(function(a) {
                    var d = a.graphic;
                    if (d && d.width) {
                        var c = {
                            x: d.x,
                            y: d.y,
                            width: d.width,
                            height: d.height
                        };
                        d.attr({
                            x: a.plotX,
                            y: a.plotY,
                            width: 1,
                            height: 1
                        });
                        d.animate(c, this.options.animation)
                    }
                }, this), this.animate = null)
            },
            hasData: function() {
                return !!this.processedXData.length
            },
            translate: function() {
                var a,
                    c = this.data,
                    d = this.radii;
                x.scatter.prototype.translate.call(this);
                for (a = c.length; a--;) {
                    var e = c[a];
                    var f = d ? d[a] : 0;
                    n(f) && f >= this.minPxSize / 2 ? (e.marker = m(e.marker, {
                        radius: f,
                        width: 2 * f,
                        height: 2 * f
                    }), e.dlBox = {
                        x: e.plotX - f,
                        y: e.plotY - f,
                        width: 2 * f,
                        height: 2 * f
                    }) : e.shapeArgs = e.plotY = e.dlBox = void 0
                }
            },
            alignDataLabel: x.column.prototype.alignDataLabel,
            buildKDTree: f,
            applyZones: f
        }, {
            haloPath: function(a) {
                return v.prototype.haloPath.call(this, 0 === a ? 0 : (this.marker ? this.marker.radius || 0 : 0) + a)
            },
            ttBelow: !1
        });
        a.prototype.beforePadding =
            function() {
                var a = this,
                    c = this.len,
                    d = this.chart,
                    f = 0,
                    b = c,
                    m = this.isXAxis,
                    p = m ? "xData" : "yData",
                    t = this.min,
                    v = {},
                    x = Math.min(d.plotWidth, d.plotHeight),
                    u = Number.MAX_VALUE,
                    B = -Number.MAX_VALUE,
                    E = this.max - t,
                    D = c / E,
                    G = [];
                this.series.forEach(function(c) {
                    var f = c.options;
                    !c.bubblePadding || !c.visible && d.options.chart.ignoreHiddenSeries || (a.allowZoomOutside = !0, G.push(c), m && (["minSize", "maxSize"].forEach(function(d) {
                        var a = f[d],
                            c = /%$/.test(a);
                        a = e(a);
                        v[d] = c ? x * a / 100 : a
                    }), c.minPxSize = v.minSize, c.maxPxSize = Math.max(v.maxSize,
                        v.minSize), c = c.zData.filter(n), c.length && (u = q(f.zMin, Math.min(u, Math.max(g(c), !1 === f.displayNegative ? f.zThreshold : -Number.MAX_VALUE))), B = q(f.zMax, Math.max(B, h(c))))))
                });
                G.forEach(function(d) {
                    var c = d[p],
                        e = c.length;
                    m && d.getRadii(u, B, d);
                    if (0 < E)
                        for (; e--;)
                            if (n(c[e]) && a.dataMin <= c[e] && c[e] <= a.dataMax) {
                                var k = d.radii ? d.radii[e] : 0;
                                f = Math.min((c[e] - t) * D - k, f);
                                b = Math.max((c[e] - t) * D + k, b)
                            }
                });
                G.length && 0 < E && !this.isLog && (b -= c, D *= (c + Math.max(0, f) - Math.min(b, c)) / c, [
                    ["min", "userMin", f],
                    ["max", "userMax", b]
                ].forEach(function(d) {
                    void 0 ===
                        q(a.options[d[0]], a[d[1]]) && (a[d[0]] += d[2] / D)
                }))
            };
        ""
    });
    B(u, "modules/networkgraph/integrations.js", [u["parts/Globals.js"]], function(b) {
        b.networkgraphIntegrations = {
            verlet: {
                attractiveForceFunction: function(a, b) {
                    return (b - a) / a
                },
                repulsiveForceFunction: function(a, b) {
                    return (b - a) / a * (b > a ? 1 : 0)
                },
                barycenter: function() {
                    var a = this.options.gravitationalConstant,
                        b = this.barycenter.xFactor,
                        g = this.barycenter.yFactor;
                    b = (b - (this.box.left + this.box.width) / 2) * a;
                    g = (g - (this.box.top + this.box.height) / 2) * a;
                    this.nodes.forEach(function(a) {
                        a.fixedPosition ||
                            (a.plotX -= b / a.mass / a.degree, a.plotY -= g / a.mass / a.degree)
                    })
                },
                repulsive: function(a, b, g) {
                    b = b * this.diffTemperature / a.mass / a.degree;
                    a.fixedPosition || (a.plotX += g.x * b, a.plotY += g.y * b)
                },
                attractive: function(a, b, g) {
                    var h = a.getMass(),
                        n = -g.x * b * this.diffTemperature;
                    b = -g.y * b * this.diffTemperature;
                    a.fromNode.fixedPosition || (a.fromNode.plotX -= n * h.fromNode / a.fromNode.degree, a.fromNode.plotY -= b * h.fromNode / a.fromNode.degree);
                    a.toNode.fixedPosition || (a.toNode.plotX += n * h.toNode / a.toNode.degree, a.toNode.plotY += b * h.toNode /
                        a.toNode.degree)
                },
                integrate: function(a, b) {
                    var g = -a.options.friction,
                        m = a.options.maxSpeed,
                        h = (b.plotX + b.dispX - b.prevX) * g;
                    g *= b.plotY + b.dispY - b.prevY;
                    var q = Math.abs,
                        e = q(h) / (h || 1);
                    q = q(g) / (g || 1);
                    h = e * Math.min(m, Math.abs(h));
                    g = q * Math.min(m, Math.abs(g));
                    b.prevX = b.plotX + b.dispX;
                    b.prevY = b.plotY + b.dispY;
                    b.plotX += h;
                    b.plotY += g;
                    b.temperature = a.vectorLength({
                        x: h,
                        y: g
                    })
                },
                getK: function(a) {
                    return Math.pow(a.box.width * a.box.height / a.nodes.length, .5)
                }
            },
            euler: {
                attractiveForceFunction: function(a, b) {
                    return a * a / b
                },
                repulsiveForceFunction: function(a,
                    b) {
                    return b * b / a
                },
                barycenter: function() {
                    var a = this.options.gravitationalConstant,
                        b = this.barycenter.xFactor,
                        g = this.barycenter.yFactor;
                    this.nodes.forEach(function(m) {
                        if (!m.fixedPosition) {
                            var h = m.getDegree();
                            h *= 1 + h / 2;
                            m.dispX += (b - m.plotX) * a * h / m.degree;
                            m.dispY += (g - m.plotY) * a * h / m.degree
                        }
                    })
                },
                repulsive: function(a, b, g, m) {
                    a.dispX += g.x / m * b / a.degree;
                    a.dispY += g.y / m * b / a.degree
                },
                attractive: function(a, b, g, m) {
                    var h = a.getMass(),
                        q = g.x / m * b;
                    b *= g.y / m;
                    a.fromNode.fixedPosition || (a.fromNode.dispX -= q * h.fromNode / a.fromNode.degree,
                        a.fromNode.dispY -= b * h.fromNode / a.fromNode.degree);
                    a.toNode.fixedPosition || (a.toNode.dispX += q * h.toNode / a.toNode.degree, a.toNode.dispY += b * h.toNode / a.toNode.degree)
                },
                integrate: function(a, b) {
                    b.dispX += b.dispX * a.options.friction;
                    b.dispY += b.dispY * a.options.friction;
                    var g = b.temperature = a.vectorLength({
                        x: b.dispX,
                        y: b.dispY
                    });
                    0 !== g && (b.plotX += b.dispX / g * Math.min(Math.abs(b.dispX), a.temperature), b.plotY += b.dispY / g * Math.min(Math.abs(b.dispY), a.temperature))
                },
                getK: function(a) {
                    return Math.pow(a.box.width * a.box.height /
                        a.nodes.length, .3)
                }
            }
        }
    });
    B(u, "modules/networkgraph/QuadTree.js", [u["parts/Globals.js"], u["parts/Utilities.js"]], function(b, a) {
        a = a.extend;
        var h = b.QuadTreeNode = function(a) {
            this.box = a;
            this.boxSize = Math.min(a.width, a.height);
            this.nodes = [];
            this.body = this.isInternal = !1;
            this.isEmpty = !0
        };
        a(h.prototype, {
            insert: function(a, b) {
                this.isInternal ? this.nodes[this.getBoxPosition(a)].insert(a, b - 1) : (this.isEmpty = !1, this.body ? b ? (this.isInternal = !0, this.divideBox(), !0 !== this.body && (this.nodes[this.getBoxPosition(this.body)].insert(this.body,
                    b - 1), this.body = !0), this.nodes[this.getBoxPosition(a)].insert(a, b - 1)) : (b = new h({
                    top: a.plotX,
                    left: a.plotY,
                    width: .1,
                    height: .1
                }), b.body = a, b.isInternal = !1, this.nodes.push(b)) : (this.isInternal = !1, this.body = a))
            },
            updateMassAndCenter: function() {
                var a = 0,
                    b = 0,
                    h = 0;
                this.isInternal ? (this.nodes.forEach(function(g) {
                    g.isEmpty || (a += g.mass, b += g.plotX * g.mass, h += g.plotY * g.mass)
                }), b /= a, h /= a) : this.body && (a = this.body.mass, b = this.body.plotX, h = this.body.plotY);
                this.mass = a;
                this.plotX = b;
                this.plotY = h
            },
            divideBox: function() {
                var a =
                    this.box.width / 2,
                    b = this.box.height / 2;
                this.nodes[0] = new h({
                    left: this.box.left,
                    top: this.box.top,
                    width: a,
                    height: b
                });
                this.nodes[1] = new h({
                    left: this.box.left + a,
                    top: this.box.top,
                    width: a,
                    height: b
                });
                this.nodes[2] = new h({
                    left: this.box.left + a,
                    top: this.box.top + b,
                    width: a,
                    height: b
                });
                this.nodes[3] = new h({
                    left: this.box.left,
                    top: this.box.top + b,
                    width: a,
                    height: b
                })
            },
            getBoxPosition: function(a) {
                var b = a.plotY < this.box.top + this.box.height / 2;
                return a.plotX < this.box.left + this.box.width / 2 ? b ? 0 : 3 : b ? 1 : 2
            }
        });
        b = b.QuadTree = function(a,
            b, n, q) {
            this.box = {
                left: a,
                top: b,
                width: n,
                height: q
            };
            this.maxDepth = 25;
            this.root = new h(this.box, "0");
            this.root.isInternal = !0;
            this.root.isRoot = !0;
            this.root.divideBox()
        };
        a(b.prototype, {
            insertNodes: function(a) {
                a.forEach(function(a) {
                    this.root.insert(a, this.maxDepth)
                }, this)
            },
            visitNodeRecursive: function(a, b, h) {
                var g;
                a || (a = this.root);
                a === this.root && b && (g = b(a));
                !1 !== g && (a.nodes.forEach(function(a) {
                        if (a.isInternal) {
                            b && (g = b(a));
                            if (!1 === g) return;
                            this.visitNodeRecursive(a, b, h)
                        } else a.body && b && b(a.body);
                        h && h(a)
                    }, this),
                    a === this.root && h && h(a))
            },
            calculateMassAndCenter: function() {
                this.visitNodeRecursive(null, null, function(a) {
                    a.updateMassAndCenter()
                })
            }
        })
    });
    B(u, "modules/networkgraph/layouts.js", [u["parts/Globals.js"], u["parts/Utilities.js"]], function(b, a) {
        var h = a.defined,
            g = a.extend,
            m = a.pick,
            n = a.setAnimation;
        a = b.addEvent;
        var q = b.Chart;
        b.layouts = {
            "reingold-fruchterman": function() {}
        };
        g(b.layouts["reingold-fruchterman"].prototype, {
            init: function(a) {
                this.options = a;
                this.nodes = [];
                this.links = [];
                this.series = [];
                this.box = {
                    x: 0,
                    y: 0,
                    width: 0,
                    height: 0
                };
                this.setInitialRendering(!0);
                this.integration = b.networkgraphIntegrations[a.integration];
                this.attractiveForce = m(a.attractiveForce, this.integration.attractiveForceFunction);
                this.repulsiveForce = m(a.repulsiveForce, this.integration.repulsiveForceFunction);
                this.approximation = a.approximation
            },
            start: function() {
                var a = this.series,
                    c = this.options;
                this.currentStep = 0;
                this.forces = a[0] && a[0].forces || [];
                this.initialRendering && (this.initPositions(), a.forEach(function(a) {
                    a.render()
                }));
                this.setK();
                this.resetSimulation(c);
                c.enableSimulation && this.step()
            },
            step: function() {
                var a = this,
                    c = this.series,
                    f = this.options;
                a.currentStep++;
                "barnes-hut" === a.approximation && (a.createQuadTree(), a.quadTree.calculateMassAndCenter());
                a.forces.forEach(function(c) {
                    a[c + "Forces"](a.temperature)
                });
                a.applyLimits(a.temperature);
                a.temperature = a.coolDown(a.startTemperature, a.diffTemperature, a.currentStep);
                a.prevSystemTemperature = a.systemTemperature;
                a.systemTemperature = a.getSystemTemperature();
                f.enableSimulation && (c.forEach(function(a) {
                    a.chart &&
                        a.render()
                }), a.maxIterations-- && isFinite(a.temperature) && !a.isStable() ? (a.simulation && b.win.cancelAnimationFrame(a.simulation), a.simulation = b.win.requestAnimationFrame(function() {
                    a.step()
                })) : a.simulation = !1)
            },
            stop: function() {
                this.simulation && b.win.cancelAnimationFrame(this.simulation)
            },
            setArea: function(a, c, b, g) {
                this.box = {
                    left: a,
                    top: c,
                    width: b,
                    height: g
                }
            },
            setK: function() {
                this.k = this.options.linkLength || this.integration.getK(this)
            },
            addElementsToCollection: function(a, c) {
                a.forEach(function(a) {
                    -1 === c.indexOf(a) &&
                        c.push(a)
                })
            },
            removeElementFromCollection: function(a, c) {
                a = c.indexOf(a); - 1 !== a && c.splice(a, 1)
            },
            clear: function() {
                this.nodes.length = 0;
                this.links.length = 0;
                this.series.length = 0;
                this.resetSimulation()
            },
            resetSimulation: function() {
                this.forcedStop = !1;
                this.systemTemperature = 0;
                this.setMaxIterations();
                this.setTemperature();
                this.setDiffTemperature()
            },
            setMaxIterations: function(a) {
                this.maxIterations = m(a, this.options.maxIterations)
            },
            setTemperature: function() {
                this.temperature = this.startTemperature = Math.sqrt(this.nodes.length)
            },
            setDiffTemperature: function() {
                this.diffTemperature = this.startTemperature / (this.options.maxIterations + 1)
            },
            setInitialRendering: function(a) {
                this.initialRendering = a
            },
            createQuadTree: function() {
                this.quadTree = new b.QuadTree(this.box.left, this.box.top, this.box.width, this.box.height);
                this.quadTree.insertNodes(this.nodes)
            },
            initPositions: function() {
                var a = this.options.initialPositions;
                b.isFunction(a) ? (a.call(this), this.nodes.forEach(function(a) {
                    h(a.prevX) || (a.prevX = a.plotX);
                    h(a.prevY) || (a.prevY = a.plotY);
                    a.dispX =
                        0;
                    a.dispY = 0
                })) : "circle" === a ? this.setCircularPositions() : this.setRandomPositions()
            },
            setCircularPositions: function() {
                function a(c) {
                    c.linksFrom.forEach(function(d) {
                        n[d.toNode.id] || (n[d.toNode.id] = !0, p.push(d.toNode), a(d.toNode))
                    })
                }
                var c = this.box,
                    b = this.nodes,
                    g = 2 * Math.PI / (b.length + 1),
                    h = b.filter(function(a) {
                        return 0 === a.linksTo.length
                    }),
                    p = [],
                    n = {},
                    q = this.options.initialPositionRadius;
                h.forEach(function(c) {
                    p.push(c);
                    a(c)
                });
                p.length ? b.forEach(function(a) {
                    -1 === p.indexOf(a) && p.push(a)
                }) : p = b;
                p.forEach(function(a,
                    d) {
                    a.plotX = a.prevX = m(a.plotX, c.width / 2 + q * Math.cos(d * g));
                    a.plotY = a.prevY = m(a.plotY, c.height / 2 + q * Math.sin(d * g));
                    a.dispX = 0;
                    a.dispY = 0
                })
            },
            setRandomPositions: function() {
                function a(a) {
                    a = a * a / Math.PI;
                    return a -= Math.floor(a)
                }
                var c = this.box,
                    b = this.nodes,
                    g = b.length + 1;
                b.forEach(function(b, e) {
                    b.plotX = b.prevX = m(b.plotX, c.width * a(e));
                    b.plotY = b.prevY = m(b.plotY, c.height * a(g + e));
                    b.dispX = 0;
                    b.dispY = 0
                })
            },
            force: function(a) {
                this.integration[a].apply(this, Array.prototype.slice.call(arguments, 1))
            },
            barycenterForces: function() {
                this.getBarycenter();
                this.force("barycenter")
            },
            getBarycenter: function() {
                var a = 0,
                    c = 0,
                    b = 0;
                this.nodes.forEach(function(e) {
                    c += e.plotX * e.mass;
                    b += e.plotY * e.mass;
                    a += e.mass
                });
                return this.barycenter = {
                    x: c,
                    y: b,
                    xFactor: c / a,
                    yFactor: b / a
                }
            },
            barnesHutApproximation: function(a, c) {
                var b = this.getDistXY(a, c),
                    e = this.vectorLength(b);
                if (a !== c && 0 !== e)
                    if (c.isInternal)
                        if (c.boxSize / e < this.options.theta && 0 !== e) {
                            var g = this.repulsiveForce(e, this.k);
                            this.force("repulsive", a, g * c.mass, b, e);
                            var h = !1
                        } else h = !0;
                else g = this.repulsiveForce(e, this.k), this.force("repulsive",
                    a, g * c.mass, b, e);
                return h
            },
            repulsiveForces: function() {
                var a = this;
                "barnes-hut" === a.approximation ? a.nodes.forEach(function(c) {
                    a.quadTree.visitNodeRecursive(null, function(b) {
                        return a.barnesHutApproximation(c, b)
                    })
                }) : a.nodes.forEach(function(c) {
                    a.nodes.forEach(function(b) {
                        if (c !== b && !c.fixedPosition) {
                            var e = a.getDistXY(c, b);
                            var f = a.vectorLength(e);
                            if (0 !== f) {
                                var g = a.repulsiveForce(f, a.k);
                                a.force("repulsive", c, g * b.mass, e, f)
                            }
                        }
                    })
                })
            },
            attractiveForces: function() {
                var a = this,
                    c, b, g;
                a.links.forEach(function(e) {
                    e.fromNode &&
                        e.toNode && (c = a.getDistXY(e.fromNode, e.toNode), b = a.vectorLength(c), 0 !== b && (g = a.attractiveForce(b, a.k), a.force("attractive", e, g, c, b)))
                })
            },
            applyLimits: function() {
                var a = this;
                a.nodes.forEach(function(c) {
                    c.fixedPosition || (a.integration.integrate(a, c), a.applyLimitBox(c, a.box), c.dispX = 0, c.dispY = 0)
                })
            },
            applyLimitBox: function(a, c) {
                var b = a.radius;
                a.plotX = Math.max(Math.min(a.plotX, c.width - b), c.left + b);
                a.plotY = Math.max(Math.min(a.plotY, c.height - b), c.top + b)
            },
            coolDown: function(a, c, b) {
                return a - c * b
            },
            isStable: function() {
                return .00001 >
                    Math.abs(this.systemTemperature - this.prevSystemTemperature) || 0 >= this.temperature
            },
            getSystemTemperature: function() {
                return this.nodes.reduce(function(a, c) {
                    return a + c.temperature
                }, 0)
            },
            vectorLength: function(a) {
                return Math.sqrt(a.x * a.x + a.y * a.y)
            },
            getDistR: function(a, c) {
                a = this.getDistXY(a, c);
                return this.vectorLength(a)
            },
            getDistXY: function(a, c) {
                var b = a.plotX - c.plotX;
                a = a.plotY - c.plotY;
                return {
                    x: b,
                    y: a,
                    absX: Math.abs(b),
                    absY: Math.abs(a)
                }
            }
        });
        a(q, "predraw", function() {
            this.graphLayoutsLookup && this.graphLayoutsLookup.forEach(function(a) {
                a.stop()
            })
        });
        a(q, "render", function() {
            function a(a) {
                a.maxIterations-- && isFinite(a.temperature) && !a.isStable() && !a.options.enableSimulation && (a.beforeStep && a.beforeStep(), a.step(), b = !1, c = !0)
            }
            var c = !1;
            if (this.graphLayoutsLookup) {
                n(!1, this);
                for (this.graphLayoutsLookup.forEach(function(a) {
                        a.start()
                    }); !b;) {
                    var b = !0;
                    this.graphLayoutsLookup.forEach(a)
                }
                c && this.series.forEach(function(a) {
                    a && a.layout && a.render()
                })
            }
        })
    });
    B(u, "modules/networkgraph/draggable-nodes.js", [u["parts/Globals.js"]], function(b) {
        var a = b.Chart,
            h = b.addEvent;
        b.dragNodesMixin = {
            onMouseDown: function(a, b) {
                b = this.chart.pointer.normalize(b);
                a.fixedPosition = {
                    chartX: b.chartX,
                    chartY: b.chartY,
                    plotX: a.plotX,
                    plotY: a.plotY
                };
                a.inDragMode = !0
            },
            onMouseMove: function(a, b) {
                if (a.fixedPosition && a.inDragMode) {
                    var g = this.chart,
                        h = g.pointer.normalize(b);
                    b = a.fixedPosition.chartX - h.chartX;
                    h = a.fixedPosition.chartY - h.chartY;
                    if (5 < Math.abs(b) || 5 < Math.abs(h)) b = a.fixedPosition.plotX - b, h = a.fixedPosition.plotY - h, g.isInsidePlot(b, h) && (a.plotX = b, a.plotY = h, a.hasDragged = !0, this.redrawHalo(a),
                        this.layout.simulation ? this.layout.resetSimulation() : (this.layout.setInitialRendering(!1), this.layout.enableSimulation ? this.layout.start() : this.layout.setMaxIterations(1), this.chart.redraw(), this.layout.setInitialRendering(!0)))
                }
            },
            onMouseUp: function(a, b) {
                a.fixedPosition && a.hasDragged && (this.layout.enableSimulation ? this.layout.start() : this.chart.redraw(), a.inDragMode = a.hasDragged = !1, this.options.fixedDraggable || delete a.fixedPosition)
            },
            redrawHalo: function(a) {
                a && this.halo && this.halo.attr({
                    d: a.haloPath(this.options.states.hover.halo.size)
                })
            }
        };
        h(a, "load", function() {
            var a = this,
                b, n, q;
            a.container && (b = h(a.container, "mousedown", function(b) {
                var c = a.hoverPoint;
                c && c.series && c.series.hasDraggableNodes && c.series.options.draggable && (c.series.onMouseDown(c, b), n = h(a.container, "mousemove", function(a) {
                    return c && c.series && c.series.onMouseMove(c, a)
                }), q = h(a.container.ownerDocument, "mouseup", function(a) {
                    n();
                    q();
                    return c && c.series && c.series.onMouseUp(c, a)
                }))
            }));
            h(a, "destroy", function() {
                b()
            })
        })
    });
    B(u, "parts-more/PackedBubbleSeries.js", [u["parts/Globals.js"],
        u["parts/Utilities.js"]
    ], function(b, a) {
        var h = a.defined,
            g = a.extend,
            m = a.isArray,
            n = a.isNumber,
            q = a.pick;
        a = b.seriesType;
        var e = b.Series,
            c = b.Point,
            f = b.addEvent,
            v = b.fireEvent,
            t = b.Chart,
            p = b.Color,
            x = b.layouts["reingold-fruchterman"],
            u = b.seriesTypes.bubble.prototype.pointClass,
            l = b.dragNodesMixin;
        b.networkgraphIntegrations.packedbubble = {
            repulsiveForceFunction: function(a, c, b, e) {
                return Math.min(a, (b.marker.radius + e.marker.radius) / 2)
            },
            barycenter: function() {
                var a = this,
                    c = a.options.gravitationalConstant,
                    b = a.box,
                    e =
                    a.nodes,
                    f, h;
                e.forEach(function(d) {
                    a.options.splitSeries && !d.isParentNode ? (f = d.series.parentNode.plotX, h = d.series.parentNode.plotY) : (f = b.width / 2, h = b.height / 2);
                    d.fixedPosition || (d.plotX -= (d.plotX - f) * c / (d.mass * Math.sqrt(e.length)), d.plotY -= (d.plotY - h) * c / (d.mass * Math.sqrt(e.length)))
                })
            },
            repulsive: function(a, c, b, e) {
                var d = c * this.diffTemperature / a.mass / a.degree;
                c = b.x * d;
                b = b.y * d;
                a.fixedPosition || (a.plotX += c, a.plotY += b);
                e.fixedPosition || (e.plotX -= c, e.plotY -= b)
            },
            integrate: b.networkgraphIntegrations.verlet.integrate,
            getK: b.noop
        };
        b.layouts.packedbubble = b.extendClass(x, {
            beforeStep: function() {
                this.options.marker && this.series.forEach(function(a) {
                    a && a.calculateParentRadius()
                })
            },
            setCircularPositions: function() {
                var a = this,
                    c = a.box,
                    b = a.nodes,
                    e = 2 * Math.PI / (b.length + 1),
                    f, h, g = a.options.initialPositionRadius;
                b.forEach(function(d, b) {
                    a.options.splitSeries && !d.isParentNode ? (f = d.series.parentNode.plotX, h = d.series.parentNode.plotY) : (f = c.width / 2, h = c.height / 2);
                    d.plotX = d.prevX = q(d.plotX, f + g * Math.cos(d.index || b * e));
                    d.plotY = d.prevY =
                        q(d.plotY, h + g * Math.sin(d.index || b * e));
                    d.dispX = 0;
                    d.dispY = 0
                })
            },
            repulsiveForces: function() {
                var a = this,
                    c, b, e, f = a.options.bubblePadding;
                a.nodes.forEach(function(d) {
                    d.degree = d.mass;
                    d.neighbours = 0;
                    a.nodes.forEach(function(k) {
                        c = 0;
                        d === k || d.fixedPosition || !a.options.seriesInteraction && d.series !== k.series || (e = a.getDistXY(d, k), b = a.vectorLength(e) - (d.marker.radius + k.marker.radius + f), 0 > b && (d.degree += .01, d.neighbours++, c = a.repulsiveForce(-b / Math.sqrt(d.neighbours), a.k, d, k)), a.force("repulsive", d, c * k.mass, e, k, b))
                    })
                })
            },
            applyLimitBox: function(a) {
                if (this.options.splitSeries && !a.isParentNode && this.options.parentNodeLimit) {
                    var d = this.getDistXY(a, a.series.parentNode);
                    var c = a.series.parentNodeRadius - a.marker.radius - this.vectorLength(d);
                    0 > c && c > -2 * a.marker.radius && (a.plotX -= .01 * d.x, a.plotY -= .01 * d.y)
                }
                x.prototype.applyLimitBox.apply(this, arguments)
            },
            isStable: function() {
                return .00001 > Math.abs(this.systemTemperature - this.prevSystemTemperature) || 0 >= this.temperature || 0 < this.systemTemperature && .02 > this.systemTemperature / this.nodes.length &&
                    this.enableSimulation
            }
        });
        a("packedbubble", "bubble", {
            minSize: "10%",
            maxSize: "50%",
            sizeBy: "area",
            zoneAxis: "y",
            tooltip: {
                pointFormat: "Value: {point.value}"
            },
            draggable: !0,
            useSimulation: !0,
            dataLabels: {
                formatter: function() {
                    return this.point.value
                },
                parentNodeFormatter: function() {
                    return this.name
                },
                parentNodeTextPath: {
                    enabled: !0
                },
                padding: 0
            },
            layoutAlgorithm: {
                initialPositions: "circle",
                initialPositionRadius: 20,
                bubblePadding: 5,
                parentNodeLimit: !1,
                seriesInteraction: !0,
                dragBetweenSeries: !1,
                parentNodeOptions: {
                    maxIterations: 400,
                    gravitationalConstant: .03,
                    maxSpeed: 50,
                    initialPositionRadius: 100,
                    seriesInteraction: !0,
                    marker: {
                        fillColor: null,
                        fillOpacity: 1,
                        lineWidth: 1,
                        lineColor: null,
                        symbol: "circle"
                    }
                },
                enableSimulation: !0,
                type: "packedbubble",
                integration: "packedbubble",
                maxIterations: 1E3,
                splitSeries: !1,
                maxSpeed: 5,
                gravitationalConstant: .01,
                friction: -.981
            }
        }, {
            hasDraggableNodes: !0,
            forces: ["barycenter", "repulsive"],
            pointArrayMap: ["value"],
            pointValKey: "value",
            isCartesian: !1,
            axisTypes: [],
            noSharedTooltip: !0,
            accumulateAllPoints: function(a) {
                var d =
                    a.chart,
                    c = [],
                    b, e;
                for (b = 0; b < d.series.length; b++)
                    if (a = d.series[b], a.visible || !d.options.chart.ignoreHiddenSeries)
                        for (e = 0; e < a.yData.length; e++) c.push([null, null, a.yData[e], a.index, e, {
                            id: e,
                            marker: {
                                radius: 0
                            }
                        }]);
                return c
            },
            init: function() {
                e.prototype.init.apply(this, arguments);
                f(this, "updatedData", function() {
                    this.chart.series.forEach(function(a) {
                        a.type === this.type && (a.isDirty = !0)
                    }, this)
                });
                return this
            },
            render: function() {
                var a = [];
                e.prototype.render.apply(this, arguments);
                this.options.dataLabels.allowOverlap ||
                    (this.data.forEach(function(d) {
                        m(d.dataLabels) && d.dataLabels.forEach(function(d) {
                            a.push(d)
                        })
                    }), this.chart.hideOverlappingLabels(a))
            },
            setVisible: function() {
                var a = this;
                e.prototype.setVisible.apply(a, arguments);
                a.parentNodeLayout && a.graph ? a.visible ? (a.graph.show(), a.parentNode.dataLabel && a.parentNode.dataLabel.show()) : (a.graph.hide(), a.parentNodeLayout.removeElementFromCollection(a.parentNode, a.parentNodeLayout.nodes), a.parentNode.dataLabel && a.parentNode.dataLabel.hide()) : a.layout && (a.visible ? a.layout.addElementsToCollection(a.points,
                    a.layout.nodes) : a.points.forEach(function(d) {
                    a.layout.removeElementFromCollection(d, a.layout.nodes)
                }))
            },
            drawDataLabels: function() {
                var a = this.options.dataLabels.textPath,
                    c = this.points;
                e.prototype.drawDataLabels.apply(this, arguments);
                this.parentNode && (this.parentNode.formatPrefix = "parentNode", this.points = [this.parentNode], this.options.dataLabels.textPath = this.options.dataLabels.parentNodeTextPath, e.prototype.drawDataLabels.apply(this, arguments), this.points = c, this.options.dataLabels.textPath = a)
            },
            seriesBox: function() {
                var a =
                    this.chart,
                    c = Math.max,
                    b = Math.min,
                    e, f = [a.plotLeft, a.plotLeft + a.plotWidth, a.plotTop, a.plotTop + a.plotHeight];
                this.data.forEach(function(a) {
                    h(a.plotX) && h(a.plotY) && a.marker.radius && (e = a.marker.radius, f[0] = b(f[0], a.plotX - e), f[1] = c(f[1], a.plotX + e), f[2] = b(f[2], a.plotY - e), f[3] = c(f[3], a.plotY + e))
                });
                return n(f.width / f.height) ? f : null
            },
            calculateParentRadius: function() {
                var a = this.seriesBox();
                this.parentNodeRadius = Math.min(Math.max(Math.sqrt(2 * this.parentNodeMass / Math.PI) + 20, 20), a ? Math.max(Math.sqrt(Math.pow(a.width,
                    2) + Math.pow(a.height, 2)) / 2 + 20, 20) : Math.sqrt(2 * this.parentNodeMass / Math.PI) + 20);
                this.parentNode && (this.parentNode.marker.radius = this.parentNode.radius = this.parentNodeRadius)
            },
            drawGraph: function() {
                if (this.layout && this.layout.options.splitSeries) {
                    var a = this.chart,
                        c = this.layout.options.parentNodeOptions.marker;
                    c = {
                        fill: c.fillColor || p(this.color).brighten(.4).get(),
                        opacity: c.fillOpacity,
                        stroke: c.lineColor || this.color,
                        "stroke-width": c.lineWidth
                    };
                    var e = this.visible ? "inherit" : "hidden";
                    this.parentNodesGroup ||
                        (this.parentNodesGroup = this.plotGroup("parentNodesGroup", "parentNode", e, .1, a.seriesGroup), this.group.attr({
                            zIndex: 2
                        }));
                    this.calculateParentRadius();
                    e = b.merge({
                        x: this.parentNode.plotX - this.parentNodeRadius,
                        y: this.parentNode.plotY - this.parentNodeRadius,
                        width: 2 * this.parentNodeRadius,
                        height: 2 * this.parentNodeRadius
                    }, c);
                    this.parentNode.graphic || (this.graph = this.parentNode.graphic = a.renderer.symbol(c.symbol).add(this.parentNodesGroup));
                    this.parentNode.graphic.attr(e)
                }
            },
            createParentNodes: function() {
                var a =
                    this,
                    c = a.chart,
                    b = a.parentNodeLayout,
                    e, f = a.parentNode;
                a.parentNodeMass = 0;
                a.points.forEach(function(d) {
                    a.parentNodeMass += Math.PI * Math.pow(d.marker.radius, 2)
                });
                a.calculateParentRadius();
                b.nodes.forEach(function(d) {
                    d.seriesIndex === a.index && (e = !0)
                });
                b.setArea(0, 0, c.plotWidth, c.plotHeight);
                e || (f || (f = (new u).init(this, {
                    mass: a.parentNodeRadius / 2,
                    marker: {
                        radius: a.parentNodeRadius
                    },
                    dataLabels: {
                        inside: !1
                    },
                    dataLabelOnNull: !0,
                    degree: a.parentNodeRadius,
                    isParentNode: !0,
                    seriesIndex: a.index
                })), a.parentNode && (f.plotX =
                    a.parentNode.plotX, f.plotY = a.parentNode.plotY), a.parentNode = f, b.addElementsToCollection([a], b.series), b.addElementsToCollection([f], b.nodes))
            },
            addSeriesLayout: function() {
                var a = this.options.layoutAlgorithm,
                    c = this.chart.graphLayoutsStorage,
                    e = this.chart.graphLayoutsLookup,
                    f = b.merge(a, a.parentNodeOptions, {
                        enableSimulation: this.layout.options.enableSimulation
                    });
                var h = c[a.type + "-series"];
                h || (c[a.type + "-series"] = h = new b.layouts[a.type], h.init(f), e.splice(h.index, 0, h));
                this.parentNodeLayout = h;
                this.createParentNodes()
            },
            addLayout: function() {
                var a = this.options.layoutAlgorithm,
                    c = this.chart.graphLayoutsStorage,
                    e = this.chart.graphLayoutsLookup,
                    f = this.chart.options.chart;
                c || (this.chart.graphLayoutsStorage = c = {}, this.chart.graphLayoutsLookup = e = []);
                var g = c[a.type];
                g || (a.enableSimulation = h(f.forExport) ? !f.forExport : a.enableSimulation, c[a.type] = g = new b.layouts[a.type], g.init(a), e.splice(g.index, 0, g));
                this.layout = g;
                this.points.forEach(function(a) {
                    a.mass = 2;
                    a.degree = 1;
                    a.collisionNmb = 1
                });
                g.setArea(0, 0, this.chart.plotWidth, this.chart.plotHeight);
                g.addElementsToCollection([this], g.series);
                g.addElementsToCollection(this.points, g.nodes)
            },
            deferLayout: function() {
                var a = this.options.layoutAlgorithm;
                this.visible && (this.addLayout(), a.splitSeries && this.addSeriesLayout())
            },
            translate: function() {
                var a = this.chart,
                    c = this.data,
                    b = this.index,
                    e, f = this.options.useSimulation;
                this.processedXData = this.xData;
                this.generatePoints();
                h(a.allDataPoints) || (a.allDataPoints = this.accumulateAllPoints(this), this.getPointRadius());
                if (f) var l = a.allDataPoints;
                else l = this.placeBubbles(a.allDataPoints),
                    this.options.draggable = !1;
                for (e = 0; e < l.length; e++)
                    if (l[e][3] === b) {
                        var p = c[l[e][4]];
                        var t = l[e][2];
                        f || (p.plotX = l[e][0] - a.plotLeft + a.diffX, p.plotY = l[e][1] - a.plotTop + a.diffY);
                        p.marker = g(p.marker, {
                            radius: t,
                            width: 2 * t,
                            height: 2 * t
                        });
                        p.radius = t
                    }
                f && this.deferLayout();
                v(this, "afterTranslate")
            },
            checkOverlap: function(a, c) {
                var d = a[0] - c[0],
                    b = a[1] - c[1];
                return -.001 > Math.sqrt(d * d + b * b) - Math.abs(a[2] + c[2])
            },
            positionBubble: function(a, c, b) {
                var d = Math.sqrt,
                    e = Math.asin,
                    f = Math.acos,
                    k = Math.pow,
                    h = Math.abs;
                d = d(k(a[0] - c[0], 2) +
                    k(a[1] - c[1], 2));
                f = f((k(d, 2) + k(b[2] + c[2], 2) - k(b[2] + a[2], 2)) / (2 * (b[2] + c[2]) * d));
                e = e(h(a[0] - c[0]) / d);
                a = (0 > a[1] - c[1] ? 0 : Math.PI) + f + e * (0 > (a[0] - c[0]) * (a[1] - c[1]) ? 1 : -1);
                return [c[0] + (c[2] + b[2]) * Math.sin(a), c[1] - (c[2] + b[2]) * Math.cos(a), b[2], b[3], b[4]]
            },
            placeBubbles: function(a) {
                var c = this.checkOverlap,
                    d = this.positionBubble,
                    b = [],
                    e = 1,
                    f = 0,
                    h = 0;
                var g = [];
                var l;
                a = a.sort(function(a, c) {
                    return c[2] - a[2]
                });
                if (a.length) {
                    b.push([
                        [0, 0, a[0][2], a[0][3], a[0][4]]
                    ]);
                    if (1 < a.length)
                        for (b.push([
                                [0, 0 - a[1][2] - a[0][2], a[1][2], a[1][3],
                                    a[1][4]
                                ]
                            ]), l = 2; l < a.length; l++) a[l][2] = a[l][2] || 1, g = d(b[e][f], b[e - 1][h], a[l]), c(g, b[e][0]) ? (b.push([]), h = 0, b[e + 1].push(d(b[e][f], b[e][0], a[l])), e++, f = 0) : 1 < e && b[e - 1][h + 1] && c(g, b[e - 1][h + 1]) ? (h++, b[e].push(d(b[e][f], b[e - 1][h], a[l])), f++) : (f++, b[e].push(g));
                    this.chart.stages = b;
                    this.chart.rawPositions = [].concat.apply([], b);
                    this.resizeRadius();
                    g = this.chart.rawPositions
                }
                return g
            },
            resizeRadius: function() {
                var a = this.chart,
                    c = a.rawPositions,
                    b = Math.min,
                    e = Math.max,
                    f = a.plotLeft,
                    h = a.plotTop,
                    g = a.plotHeight,
                    l = a.plotWidth,
                    p, t, m;
                var n = p = Number.POSITIVE_INFINITY;
                var v = t = Number.NEGATIVE_INFINITY;
                for (m = 0; m < c.length; m++) {
                    var q = c[m][2];
                    n = b(n, c[m][0] - q);
                    v = e(v, c[m][0] + q);
                    p = b(p, c[m][1] - q);
                    t = e(t, c[m][1] + q)
                }
                m = [v - n, t - p];
                b = b.apply([], [(l - f) / m[0], (g - h) / m[1]]);
                if (1e-10 < Math.abs(b - 1)) {
                    for (m = 0; m < c.length; m++) c[m][2] *= b;
                    this.placeBubbles(c)
                } else a.diffY = g / 2 + h - p - (t - p) / 2, a.diffX = l / 2 + f - n - (v - n) / 2
            },
            calculateZExtremes: function() {
                var a = this.options.zMin,
                    c = this.options.zMax,
                    b = Infinity,
                    e = -Infinity;
                if (a && c) return [a, c];
                this.chart.series.forEach(function(a) {
                    a.yData.forEach(function(a) {
                        h(a) &&
                            (a > e && (e = a), a < b && (b = a))
                    })
                });
                a = q(a, b);
                c = q(c, e);
                return [a, c]
            },
            getPointRadius: function() {
                var a = this,
                    c = a.chart,
                    b = a.options,
                    e = b.useSimulation,
                    f = Math.min(c.plotWidth, c.plotHeight),
                    h = {},
                    g = [],
                    l = c.allDataPoints,
                    p, t, m, n;
                ["minSize", "maxSize"].forEach(function(a) {
                    var c = parseInt(b[a], 10),
                        d = /%$/.test(b[a]);
                    h[a] = d ? f * c / 100 : c * Math.sqrt(l.length)
                });
                c.minRadius = p = h.minSize / Math.sqrt(l.length);
                c.maxRadius = t = h.maxSize / Math.sqrt(l.length);
                var v = e ? a.calculateZExtremes() : [p, t];
                (l || []).forEach(function(c, b) {
                    m = e ? Math.max(Math.min(c[2],
                        v[1]), v[0]) : c[2];
                    n = a.getRadius(v[0], v[1], p, t, m);
                    0 === n && (n = null);
                    l[b][2] = n;
                    g.push(n)
                });
                a.radii = g
            },
            redrawHalo: l.redrawHalo,
            onMouseDown: l.onMouseDown,
            onMouseMove: l.onMouseMove,
            onMouseUp: function(a) {
                if (a.fixedPosition && !a.removed) {
                    var c, d, e = this.layout,
                        f = this.parentNodeLayout;
                    f && e.options.dragBetweenSeries && f.nodes.forEach(function(f) {
                        a && a.marker && f !== a.series.parentNode && (c = e.getDistXY(a, f), d = e.vectorLength(c) - f.marker.radius - a.marker.radius, 0 > d && (f.series.addPoint(b.merge(a.options, {
                            plotX: a.plotX,
                            plotY: a.plotY
                        }), !1), e.removeElementFromCollection(a, e.nodes), a.remove()))
                    });
                    l.onMouseUp.apply(this, arguments)
                }
            },
            destroy: function() {
                this.chart.graphLayoutsLookup && this.chart.graphLayoutsLookup.forEach(function(a) {
                    a.removeElementFromCollection(this, a.series)
                }, this);
                this.parentNode && (this.parentNodeLayout.removeElementFromCollection(this.parentNode, this.parentNodeLayout.nodes), this.parentNode.dataLabel && (this.parentNode.dataLabel = this.parentNode.dataLabel.destroy()));
                b.Series.prototype.destroy.apply(this, arguments)
            },
            alignDataLabel: b.Series.prototype.alignDataLabel
        }, {
            destroy: function() {
                this.series.layout && this.series.layout.removeElementFromCollection(this, this.series.layout.nodes);
                return c.prototype.destroy.apply(this, arguments)
            }
        });
        f(t, "beforeRedraw", function() {
            this.allDataPoints && delete this.allDataPoints
        });
        ""
    });
    B(u, "parts-more/Polar.js", [u["parts/Globals.js"], u["parts/Utilities.js"]], function(b, a) {
        var h = a.pick,
            g = a.splat,
            m = b.Series,
            n = b.seriesTypes;
        a = b.wrap;
        var q = m.prototype,
            e = b.Pointer.prototype;
        q.searchPointByAngle =
            function(a) {
                var c = this.chart,
                    b = this.xAxis.pane.center;
                return this.searchKDTree({
                    clientX: 180 + -180 / Math.PI * Math.atan2(a.chartX - b[0] - c.plotLeft, a.chartY - b[1] - c.plotTop)
                })
            };
        q.getConnectors = function(a, b, e, h) {
            var c = h ? 1 : 0;
            var f = 0 <= b && b <= a.length - 1 ? b : 0 > b ? a.length - 1 + b : 0;
            b = 0 > f - 1 ? a.length - (1 + c) : f - 1;
            c = f + 1 > a.length - 1 ? c : f + 1;
            var g = a[b];
            c = a[c];
            var l = g.plotX;
            g = g.plotY;
            var d = c.plotX;
            var k = c.plotY;
            c = a[f].plotX;
            f = a[f].plotY;
            l = (1.5 * c + l) / 2.5;
            g = (1.5 * f + g) / 2.5;
            d = (1.5 * c + d) / 2.5;
            var t = (1.5 * f + k) / 2.5;
            k = Math.sqrt(Math.pow(l - c,
                2) + Math.pow(g - f, 2));
            var m = Math.sqrt(Math.pow(d - c, 2) + Math.pow(t - f, 2));
            l = Math.atan2(g - f, l - c);
            t = Math.PI / 2 + (l + Math.atan2(t - f, d - c)) / 2;
            Math.abs(l - t) > Math.PI / 2 && (t -= Math.PI);
            l = c + Math.cos(t) * k;
            g = f + Math.sin(t) * k;
            d = c + Math.cos(Math.PI + t) * m;
            t = f + Math.sin(Math.PI + t) * m;
            c = {
                rightContX: d,
                rightContY: t,
                leftContX: l,
                leftContY: g,
                plotX: c,
                plotY: f
            };
            e && (c.prevPointCont = this.getConnectors(a, b, !1, h));
            return c
        };
        q.toXY = function(a) {
            var c = this.chart,
                b = a.plotX;
            var e = a.plotY;
            a.rectPlotX = b;
            a.rectPlotY = e;
            e = this.xAxis.postTranslate(a.plotX,
                this.yAxis.len - e);
            a.plotX = a.polarPlotX = e.x - c.plotLeft;
            a.plotY = a.polarPlotY = e.y - c.plotTop;
            this.kdByAngle ? (c = (b / Math.PI * 180 + this.xAxis.pane.options.startAngle) % 360, 0 > c && (c += 360), a.clientX = c) : a.clientX = a.plotX
        };
        n.spline && (a(n.spline.prototype, "getPointSpline", function(a, b, e, g) {
                this.chart.polar ? g ? (a = this.getConnectors(b, g, !0, this.connectEnds), a = ["C", a.prevPointCont.rightContX, a.prevPointCont.rightContY, a.leftContX, a.leftContY, a.plotX, a.plotY]) : a = ["M", e.plotX, e.plotY] : a = a.call(this, b, e, g);
                return a
            }), n.areasplinerange &&
            (n.areasplinerange.prototype.getPointSpline = n.spline.prototype.getPointSpline));
        b.addEvent(m, "afterTranslate", function() {
            var a = this.chart,
                e;
            if (a.polar && this.xAxis) {
                (this.kdByAngle = a.tooltip && a.tooltip.shared) ? this.searchPoint = this.searchPointByAngle: this.options.findNearestPointBy = "xy";
                if (!this.preventPostTranslate) {
                    var g = this.points;
                    for (e = g.length; e--;) this.toXY(g[e]), !a.hasParallelCoordinates && !this.yAxis.reversed && g[e].y < this.yAxis.min && (g[e].isNull = !0)
                }
                this.hasClipCircleSetter || (this.hasClipCircleSetter = !!b.addEvent(this, "afterRender", function() {
                    if (a.polar) {
                        var c = this.yAxis.center;
                        this.group.clip(a.renderer.clipCircle(c[0], c[1], c[2] / 2));
                        this.setClip = b.noop
                    }
                }))
            }
        }, {
            order: 2
        });
        a(q, "getGraphPath", function(a, b) {
            var c = this,
                e;
            if (this.chart.polar) {
                b = b || this.points;
                for (e = 0; e < b.length; e++)
                    if (!b[e].isNull) {
                        var f = e;
                        break
                    }
                if (!1 !== this.options.connectEnds && void 0 !== f) {
                    this.connectEnds = !0;
                    b.splice(b.length, 0, b[f]);
                    var g = !0
                }
                b.forEach(function(a) {
                    void 0 === a.polarPlotY && c.toXY(a)
                })
            }
            e = a.apply(this, [].slice.call(arguments,
                1));
            g && b.pop();
            return e
        });
        m = function(a, b) {
            var c = this.chart,
                e = this.options.animation,
                f = this.group,
                g = this.markerGroup,
                h = this.xAxis.center,
                l = c.plotLeft,
                d = c.plotTop;
            c.polar ? c.renderer.isSVG && (!0 === e && (e = {}), b ? (a = {
                translateX: h[0] + l,
                translateY: h[1] + d,
                scaleX: .001,
                scaleY: .001
            }, f.attr(a), g && g.attr(a)) : (a = {
                translateX: l,
                translateY: d,
                scaleX: 1,
                scaleY: 1
            }, f.animate(a, e), g && g.animate(a, e), this.animate = null)) : a.call(this, b)
        };
        a(q, "animate", m);
        n.column && (n = n.column.prototype, n.polarArc = function(a, b, e, g) {
            var c = this.xAxis.center,
                f = this.yAxis.len;
            return this.chart.renderer.symbols.arc(c[0], c[1], f - b, null, {
                start: e,
                end: g,
                innerR: f - h(a, f)
            })
        }, a(n, "animate", m), a(n, "translate", function(a) {
            var b = this.xAxis,
                c = b.startAngleRad,
                e;
            this.preventPostTranslate = !0;
            a.call(this);
            if (b.isRadial) {
                var g = this.points;
                for (e = g.length; e--;) {
                    var h = g[e];
                    a = h.barX + c;
                    h.shapeType = "path";
                    h.shapeArgs = {
                        d: this.polarArc(h.yBottom, h.plotY, a, a + h.pointWidth)
                    };
                    this.toXY(h);
                    h.tooltipPos = [h.plotX, h.plotY];
                    h.ttBelow = h.plotY > b.center[1]
                }
            }
        }), a(n, "alignDataLabel", function(a,
            b, e, g, h, m) {
            this.chart.polar ? (a = b.rectPlotX / Math.PI * 180, null === g.align && (g.align = 20 < a && 160 > a ? "left" : 200 < a && 340 > a ? "right" : "center"), null === g.verticalAlign && (g.verticalAlign = 45 > a || 315 < a ? "bottom" : 135 < a && 225 > a ? "top" : "middle"), q.alignDataLabel.call(this, b, e, g, h, m)) : a.call(this, b, e, g, h, m)
        }));
        a(e, "getCoordinates", function(a, b) {
            var c = this.chart,
                e = {
                    xAxis: [],
                    yAxis: []
                };
            c.polar ? c.axes.forEach(function(a) {
                var f = a.isXAxis,
                    g = a.center;
                if ("colorAxis" !== a.coll) {
                    var h = b.chartX - g[0] - c.plotLeft;
                    g = b.chartY - g[1] - c.plotTop;
                    e[f ? "xAxis" : "yAxis"].push({
                        axis: a,
                        value: a.translate(f ? Math.PI - Math.atan2(h, g) : Math.sqrt(Math.pow(h, 2) + Math.pow(g, 2)), !0)
                    })
                }
            }) : e = a.call(this, b);
            return e
        });
        b.SVGRenderer.prototype.clipCircle = function(a, e, g) {
            var c = b.uniqueKey(),
                f = this.createElement("clipPath").attr({
                    id: c
                }).add(this.defs);
            a = this.circle(a, e, g).add(f);
            a.id = c;
            a.clipPath = f;
            return a
        };
        b.addEvent(b.Chart, "getAxes", function() {
            this.pane || (this.pane = []);
            g(this.options.pane).forEach(function(a) {
                new b.Pane(a, this)
            }, this)
        });
        b.addEvent(b.Chart, "afterDrawChartBox",
            function() {
                this.pane.forEach(function(a) {
                    a.render()
                })
            });
        a(b.Chart.prototype, "get", function(a, e) {
            return b.find(this.pane, function(a) {
                return a.options.id === e
            }) || a.call(this, e)
        })
    });
    B(u, "masters/Mychart-more.src.js", [], function() {})
});