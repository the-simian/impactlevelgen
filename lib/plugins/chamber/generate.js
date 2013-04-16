ig.
    module(
        'plugins.chamber.generate'
    )
    .requires(
        'impact.game'
    )
    .defines(function(global) {


        //console.log(arguments);

        ig.Chamber = ig.Class.extend({
            yourAttributes: "nice!",

            init: function(o, target) {

                this.create(o, target);
            },

            create: function(o) {

                o.floorTile = o.floorTile || 1;
                o.voidTile = o.voidTile || 0;
                o.wallTile = o.wallTile || 2;

                var leaves = [];

                var populateNothingness = function() {
                    var level = [];
                    for (var i = 0; i < o.height; i++) {
                        var tr = [];
                        for (var j = 0; j < o.width; j++) {
                            tr.push(o.voidTile);
                        }
                        level.push(tr);
                    }
                    return level;
                };

                var makeRoomSquare = function(node, tile) {
                    var height = node.h + node.y;
                    var width = node.w + node.x;
                    for (var i = node.y; i < height; i++) {
                        for (var j = node.x; j < width; j++) {
                            level[i][j] = tile || node.rgba;
                        }
                    }
                };

                var colorCentroid = function(node, tile) {
                    level[node.centroid.y][node.centroid.x] = tile;
                };

                var colorCorners = function(node, tile) {
                    level[node.corner.tl.y][node.corner.tl.x] = tile;
                    level[node.corner.tr.y][node.corner.tr.x] = tile;
                    level[node.corner.bl.y][node.corner.bl.x] = tile;
                    level[node.corner.br.y][node.corner.br.x] = tile;
                };

                var processLeaf = function(node) {
                    var count = 0;
                    do {

                        var _w = Math.floor((Math.random() * node.w * o.randomRoomSizeRandomToFixedRatio[0]) + node.w * o.randomRoomSizeRandomToFixedRatio[1]);
                        var _h = Math.floor((Math.random() * node.h * o.randomRoomSizeRandomToFixedRatio[0]) + node.h * o.randomRoomSizeRandomToFixedRatio[1]);
                        count++;

                    } while (((_w / _h) > o.porportionTolerance || (_h / _w) > o.porportionTolerance) && count < o.porportionTriesUntilBreakSafety);

                    var _remaindH = Math.floor((node.h - _h) / 2);
                    var _remaindW = Math.floor((node.w - _w) / 2);

                    node.subspace = {
                        w: _w,
                        h: _h,
                        x: node.x + _remaindW,
                        y: node.y + _remaindH,
                    };

                    //centroid
                    node.subspace.centroid = {
                        x: Math.floor(node.subspace.x + (_w / 2)),
                        y: Math.floor(node.subspace.y + (_h / 2))
                    };

                    //corner
                    node.subspace.corner = {
                        tl: {
                            x: node.subspace.x,
                            y: node.subspace.y
                        },
                        tr: {
                            x: (node.subspace.x + node.subspace.w) - 1,
                            y: node.subspace.y
                        },
                        bl: {
                            x: node.subspace.x,
                            y: (node.subspace.y + node.subspace.h) - 1
                        },
                        br: {
                            x: (node.subspace.x + node.subspace.w) - 1,
                            y: (node.subspace.y + node.subspace.h) - 1
                        }
                    };

                    leaves.push(node);
                };

                var level = populateNothingness();
                var getRandomColor = function() {
                    var r = Math.floor(Math.random() * 255);
                    var g = Math.floor(Math.random() * 255);
                    var b = Math.floor(Math.random() * 255);
                    return 'rgba(' + r + ',' + g + ',' + b + ', 0.4)';
                };

                var getConstrainedRandomNumber = function(seed) {
                    var num = Math.floor(Math.random() * (seed));
                    if ((num >= o.minSubdivideAmt) && (num <= (seed - o.minSubdivideAmt))) {
                        return num;
                    }
                    return getConstrainedRandomNumber(seed);
                };

                //can replace with different subdivisions
                var bisectNode = function(_divDir, _parent, _depth) {
                    var children = [];

                    var startx = _parent.x;
                    var starty = _parent.y;
                    var width = _parent.w;
                    var height = _parent.h;

                    var randomNumber;
                    var remainder;

                    if (_divDir) {
                        randomNumber = getConstrainedRandomNumber(width);
                        remainder = width - randomNumber;
                        children.push({
                            x: startx,
                            y: starty,
                            w: randomNumber,
                            h: height,
                            rgba: getRandomColor()
                        });
                        children.push({
                            x: startx + randomNumber,
                            y: starty,
                            w: remainder,
                            h: height,
                            rgba: getRandomColor()
                        });

                    } else {
                        randomNumber = getConstrainedRandomNumber(height);
                        remainder = height - randomNumber;
                        children.push({
                            x: startx,
                            y: starty,
                            w: width,
                            h: randomNumber,
                            rgba: getRandomColor()
                        });
                        children.push({
                            x: startx,
                            y: starty + randomNumber,
                            w: width,
                            h: remainder,
                            rgba: getRandomColor()
                        });
                    }
                    return children;
                };

                var parentmostNode = {};

                function generateTree(pnode, pheight) {

                    var node = $.extend(pnode, {
                        x: 0,
                        y: 0,
                        w: o.width,
                        h: o.height,
                        rgba: getRandomColor()
                    });

                    var height = pheight;
                    var generateLeaf = function(node, height) {

                        if (height === 0 || node.w <= o.minParentWidth || node.h <= o.minParentWidth) {
                            processLeaf(node);
                            return node;
                        }
                        var temp = node;
                        var childLength = temp.children ? temp.children.length : 0;
                        if (!childLength) {
                            temp.children = bisectNode(height % 2, temp);
                            generateLeaf(temp, height);
                        }
                        for (var i = 0; i < childLength; i++) {
                            generateLeaf(temp.children[i], height - 1);
                        }
                    };
                    generateLeaf(pnode, pheight);
                    return pnode;
                }

                var depth = o.divisions;
                var tree = generateTree(parentmostNode, depth);

                var traverseTree = function(_tree, singleCallback, batchCallback, d) {
                    var traverseLeaf = function(node, dep) {
                        singleCallback.call(this, node, dep);

                        var childLength = node.children ? node.children.length : 0;
                        if (childLength) {
                            dep--;
                            var batch = [];
                            for (var i = 0; i < childLength; i++) {
                                traverseLeaf(node.children[i], dep);
                                batch.push(node.children[i]);
                            }
                            batchCallback.call(this, batch);
                        }
                    };

                    traverseLeaf(tree, d);
                };

                var singleCallback = function(node, d) {

                    if (!node.subspace) {
                        //console.log('parent', d, node);
                    }

                    if (node.subspace) {
                        makeRoomSquare(node.subspace, o.floorTile);
                        colorCentroid(node.subspace, o.wallTile);
                        if (o.corners) {
                            colorCorners(node.subspace, o.voidTile);
                        }
                    }
                };

                var drawRightAngle = function(x1, x2, y1, y2, c) {

                    var thickness = Math.floor(Math.random() * o.pathThickness[1]) + o.pathThickness[0];

                    if (x1 > x2) {
                        for (var i = x2; i <= x1; i++) {
                            for (var k = 0; k < thickness; k++) {
                                level[y2 + k][i] = o.floorTile;
                            }
                        }
                    } else {
                        for (var i = x1; i <= x2; i++) {
                            for (var k = 0; k < thickness; k++) {
                                level[y2 - k][i] = o.floorTile;
                            }
                        }
                    }

                    if (y1 > y2) {
                        for (var j = y2; j <= y1; j++) {
                            for (var k = 0; k < thickness; k++) {
                                level[j][x1 + k] = o.floorTile;
                            }
                        }
                    } else {
                        for (var j = y1; j <= y2; j++) {
                            for (var k = 0; k < thickness; k++) {
                                level[j][x1 - k] = o.floorTile;
                            }
                        }
                    }
                };

                var batchCallback = function(children) {

                    while (children[0].children) {
                        children[0] = children[0].children[Math.floor(Math.random() * 2)];
                    }

                    while (children[1].children) {
                        children[1] = children[1].children[Math.floor(Math.random() * 2)];
                    }

                    //connect room stuff
                    if (children[0].subspace && children[1].subspace) {
                        var y0 = children[0].subspace.centroid.y;
                        var y1 = children[1].subspace.centroid.y;
                        var x0 = children[0].subspace.centroid.x;
                        var x1 = children[1].subspace.centroid.x;
                        var c0 = '#00CCFF';
                        var c1 = '#FFcc00';
                        drawRightAngle(x0, x1, y0, y1, c0);

                    }

                };

                traverseTree(tree, singleCallback, batchCallback, depth);

                var processLevel = function(l, callback) {
                    var Levellength = l.length;
                    for (var i = 0; i < Levellength; i++) {
                        var rowLength = l[i].length;
                        for (var j = 0; j < rowLength; j++) {

                            var c = l[i][j];

                            var c_tl = undefined;
                            var c_t = undefined;
                            var c_tr = undefined;

                            var c_l = undefined;
                            var c_r = undefined;

                            var c_bl = undefined;
                            var c_b = undefined;
                            var c_br = undefined;


                            if (typeof l[i - 1] != 'undefined') {
                                if (typeof l[i - 1][j - 1] != 'undefined') {
                                    c_tl = l[i - 1][j - 1];
                                }
                                if (typeof l[i - 1][j] != 'undefined') {
                                    c_t = l[i - 1][j];
                                }
                                if (typeof l[i - 1][j + 1] != 'undefined') {
                                    c_tr = l[i - 1][j + 1];
                                }
                            }

                            if (typeof l[i + 1] != 'undefined') {
                                if (typeof l[i + 1][j - 1] != 'undefined') {
                                    c_bl = l[i + 1][j - 1];
                                }
                                if (typeof l[i + 1][j] != 'undefined') {
                                    c_b = l[i + 1][j];
                                }
                                if (typeof l[i + 1][j + 1] != 'undefined') {
                                    c_br = l[i + 1][j + 1];
                                }
                            }

                            if (typeof l[i][j - 1] != 'undefined') {
                                c_l = l[i][j - 1];
                            }
                            if (typeof l[i][j + 1] != 'undefined') {
                                c_r = l[i][j + 1];
                            }

                            var obj = {
                                tl: c_tl,
                                t: c_t,
                                tr: c_tr,
                                cl: c_l,
                                c: c,
                                cr: c_r,
                                bl: c_bl,
                                b: c_b,
                                br: c_br
                            };
                            callback(i, j, obj);
                        }
                    }
                };

                var generateWalls = function(c, x, y) {
                    var floor = o.floorTile;
                    var blank = o.voidTile;
                    var wall = o.wallTile;
                    if (c.c === blank) {
                        if (c.tl === floor ||
                            c.t === floor ||
                            c.tr === floor ||
                            c.cl === floor ||
                            c.cr === floor ||
                            c.bl === floor ||
                            c.b === floor ||
                            c.br === floor) {

                            level[x][y] = wall;
                        }
                    }
                };

                var modulateFloor = function(c, x, y) {
                    var floor = o.floorTile;
                    var blank = o.voidTile;
                    var wall = o.wallTile;
                    if (c.c === floor) {
                        var rand = Math.floor(Math.random() * 25);
                        if (rand === 1) {
                            level[x][y] = 6;
                        }
                    }
                };

                var cellcallback1 = function(x, y, cellmatrix) {
                    generateWalls(cellmatrix, x, y);
                };

                var cellcallback2 = function(x, y, cellmatrix) {
                    modulateFloor(cellmatrix, x, y);
                };

                processLevel(level, cellcallback1);

                //console.log(level);

                return level;
            }

        });
    });