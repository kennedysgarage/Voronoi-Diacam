var voronoi =  new Voronoi();
var sites = generateBeeHivePoints(view.size / 200, true);
var bbox, diagram;
var oldSize = view.size;
var spotColor = new Color('red');
var mousePos = view.center;
var selected = false;

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
						points2 = [];
                    for (var j = 0; j < length; j++) {
                        v = halfedges[j].getEndpoint();
						curr = new Point(v);
						if (j > 0) {
							v = halfedges[j-1].getEndpoint();
						} else {
							v = halfedges[length-1].getEndpoint();
						}
						prev = new Point(v);

						inter = intersect(prev, curr);
						if (inter != false) {
							skip = !skip;
							points.push(inter);
							points2.push(inter);
						}

						if (!skip) {
	                        points.push(curr);
						} else {
							points2.push(curr);
						}
                    }
                    createPath(points, sites[i]);
					if (points2.length > 2) {
						createPath(points2, sites[i]);
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

    for (var i = 0, l = points.length; i < l; i++) {
        var point = points[i];
        var next = points[(i + 1) == points.length ? 0 : i + 1];
        var vector = (next - point) / 2;
        path.add({
            point: point + vector,
            handleIn: -vector,
            handleOut: vector
        });
    }
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
	/*
	// horizontal line
	var start = new Point(300, 400),
	    end = new Point(900, 400),
	*/

	// vertical line
	var start = new Point(600, 300),
	    end = new Point(600, 500),

	/*
	// diagonal
	var start = new Point(300, 300),
	    end = new Point(900, 700),
	*/
		p = line_intersect(v1, v2, start, end);
	if (p === null) {
		return false;
	}

	path = new Path();
	path.strokeColor = 'black';
	path.add(start);
	path.add(end);


	return new Point(p);

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
	    distsq = ((v2.x - v1.x)*(v2.x - v1.x) + (v2.y - v1.y)*(v2.y - v1.y) ),
	    dotprod = (x - v1.x) * (v2.x - v1.x) + (y - v1.y) * (v2.y - v1.y);

	// intersection point is out of bounds
	if (dotprod < 0 || dotprod > distsq) {
		return null;
	}

	return [x, y];
}

