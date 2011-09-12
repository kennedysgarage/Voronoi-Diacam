var voronoi =  new Voronoi();
var sites = generateBeeHivePoints(view.size / 300, true);
var bbox, diagram;
var oldSize = view.size;
var spotColor = new Color('red');
var mousePos = view.center;
var selected = false;
var boundary = [ [50, 50], [500,50], [500,250], [270,500], [50,250] ];

onResize();
function onMouseDown(event) {
    sites.push(event.point);
    renderDiagram();
}

function onMouseMove(event) {
    mousePos = event.point;
    if (event.count == 0)
        sites.push(event.point);
    sites[sites.length - 1] = event.point;
    renderDiagram();
}


function renderDiagram() {
    project.activeLayer.children = [];
    var diagram = voronoi.compute(sites, bbox);
    if (diagram) {
        for (var i = 0, l = sites.length; i < l; i++) {
            var cell = diagram.cells[sites[i].voronoiId];
            if (cell) {
                var halfedges = cell.halfedges,
					skip = false;
                    length = halfedges.length;
                if (length > 2) {
                    var points = []
			points2 = [],
			ignore = false,
			clipped = true; //false;
                    for (var j = 0; j < length; j++) {
                        v = halfedges[j].getEndpoint();
						curr = new Point(v);
						if (j > 0) {
							v = halfedges[j - 1].getEndpoint();
						} else {
							v = halfedges[length - 1].getEndpoint();
						}
						prev = new Point(v);

						inter = intersect(prev, curr);
						if (inter != false && !ignore) {
							clipped = true;
							if (skip === false) {
								points.push(inter.point);
								points2.push(inter.point);
								skip = inter.index;
							} else {
console.debug('inter point: ' + inter.point);
console.debug('inter.index: ' + inter.index + ' skip: ' + skip);
								points2.push(inter.point);
								follow_poly = Math.abs(inter.index - skip );
								if (inter.index < skip) follow_poly--;	// big hack, dunno why this is needed...
								for (var h = 0; h < follow_poly ; h++) {
									tmp = h + skip >= boundary.length ? h + skip - boundary.length : h + skip;
									points.push(new Point(boundary[tmp]));
									tmp = inter.index - h -1 < 0 ? inter.index - h + boundary.length - 1: inter.index - h - 1;
									points2.push(new Point(boundary[tmp]));

console.debug('h: ' + h + ' tmp: ' + tmp);
console.debug(boundary[tmp]);

							//		c = new Path.Circle(new Point(boundary[h + skip - 1]), 120);
							//		c.fillColor = 'green';
									c = new Path.Circle(new Point(boundary[tmp]), h* 5 +10);
									c.Color = 'green';
									
								}
								points.push(inter.point);
								skip = false;
								ignore = true; // ignore more clipping since we can only handle two shapes at a time
							}
						}

						if (skip === false) {
	           				        points.push(curr);
						} else {
							points2.push(curr);
						}
                    }
		    if (clipped) {
			spotColor = new Color('red');			    
	                createPath(points, sites[i]);
			if (points2.length > 2) {
				spotColor = new Color('blue');
				createPath(points2, sites[i]);
			}
		    }
                }
            }
        }
    }
}

function removeSmallBits(path) {
    var averageLength = path.length / path.segments.length;
    var min = path.length / 50;
    for(var i = path.segments.length - 1; i >= 0; i--) {
        var segment = path.segments[i];
        var cur = segment.point;
        var nextSegment = segment.next;
        var next = nextSegment.point + nextSegment.handleIn;
        if (cur.getDistance(next) < min) {
            segment.remove();
        }
    }
}

function generateBeeHivePoints(size, loose) {
    var points = [];
    var col = view.size / size;
    for(var i = -1; i < size.width + 1; i++) {
        for(var j = -1; j < size.height + 1; j++) {
            var point = new Point(i, j) / new Point(size) * view.size + col / 2;
            if(j % 2)
                point += new Point(col.width / 2, 0);
            if(loose)
                point += (col / 4) * Point.random() - col / 4;
            points.push(point);
        }
    }
    return points;
}
function createPath(points, center) {
    var path = new Path();
    if (!selected) {
        path.fillColor = spotColor;
    } else {
        path.fullySelected = selected;
    }
    path.closed = true;

    console.debug('begin create path');
    for (var i = 0, l = points.length; i < l; i++) {
        var point = points[i];
        var next = points[(i + 1) == points.length ? 0 : i + 1];
        var vector = (next - point) / 2;
        path.add({
            point: point + vector,
            handleIn: -vector,
            handleOut: vector
        });
	console.debug(point);
    }
    console.debug('end create path');
    path.scale(0.98);
    removeSmallBits(path);
    return path;
}

function onResize() {
    var margin = 20;
    bbox = {
        xl: margin,
        xr: view.bounds.width - margin,
        yt: margin,
        yb: view.bounds.height - margin
    };
    for (var i = 0, l = sites.length; i < l; i++) {
        sites[i] = sites[i] * view.size / oldSize;
    }
    oldSize = view.size;
    renderDiagram();
}

function onKeyDown(event) {
    if (event.key == 'space') {
        selected = !selected;
        renderDiagram();
    }
}













function intersect(v1, v2) {
	var start = new Point(300, 0),
		end = new Point(300, 600),
		// p = line_intersect(v1, v2, start, end);
		p = poly_intersect(v1, v2, boundary);
	if (p === null) {
		return false;
	}

	var path = new Path();
   	path.closed = true;
	path.strokeColor = 'black';
	for (var h = 0; h < boundary.length; h++) {
//		path.add(new Point(boundary[h]));
	}

	return {
		point: new Point(p.point),
		index: p.index
		};

}



/**
 * params v1 [x, y]
 * params v2 [x, y]
 * params p1 [x, y]
 * params p2 [x, y]
 *
 * return intersection point [x, y] or null
 */
function line_intersect(v1, v2, p1, p2) {

	// Ax + By = C
	var Va = v2.y - v1.y,
	    Vb = v1.x - v2.x,
   	    Vc = Va * v1.x + Vb * v1.y,

	    Pa = p2.y - p1.y,
	    Pb = p1.x - p2.x,
	    Pc = Pa * p1.x + Pb * p1.y,

	    det = (Va * Pb - Pa * Vb);

	// parallel lines
	if (det == 0) {
		return null;
	}

	var x = (Pb * Vc - Vb * Pc) / det,
	    y = (Va * Pc - Pa * Vc) / det,
	    vdistsq = ((v2.x - v1.x)*(v2.x - v1.x) + (v2.y - v1.y)*(v2.y - v1.y) ),
	    vdotprod = (x - v1.x) * (v2.x - v1.x) + (y - v1.y) * (v2.y - v1.y),
	    pdistsq = ((p2.x - p1.x)*(p2.x - p1.x) + (p2.y - p1.y)*(p2.y - p1.y) ),
	    pdotprod = (x - p1.x) * (p2.x - p1.x) + (y - p1.y) * (p2.y - p1.y);

	// intersection point is out of bounds
	if (vdotprod < 0 || vdotprod > vdistsq || pdotprod < 0 || pdotprod > pdistsq) {
		return null;
	}

	var circle = new Path.Circle(new Point(x, y), 10);
	circle.fillColor = 'green';

	return [x, y];
}

// find intesection of line and shape
function poly_intersect(p1, p2, polygon) {
	var id, intersect = null, curr, next;

	for (var id = 0; id < polygon.length; id++) {
		curr = new Point(polygon[id]);
		next_id = id === polygon.length - 1 ? 0 : id + 1;
 		next = new Point(polygon[next_id]);

		intersect = line_intersect(p1, p2, curr, next);
		if (intersect != null) {
			return {
				point: intersect,
				index : next_id
				};
		}
	}
	return null;
}

