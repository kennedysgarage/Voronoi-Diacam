var voronoi =  new Voronoi();
var sites = generateBeeHivePoints(view.size / 150, true);
var bbox, diagram;
var oldSize = view.size;
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

/*
eventual Boundary Object
function Boundary(a) {
	this.pts = [ 
		new Point([50, 50], 
		new Point([500,50], 
		new Point([500,250], 
		new Point([270,500], 
		new Point([50,250] 
	];
}

Boundary.prototype.centroid = function() {
	var pts = this. pts;
	var nPts = pts.length;
	var x=0; var y=0;
	var f;
	var j=nPts-1;
	var p1; var p2;

	for (var i=0;i<nPts;j=i++) {
		p1=pts[i]; p2=pts[j];
		f=p1.x*p2.y-p2.x*p1.y;
		x+=(p1.x+p2.x)*f;
		y+=(p1.y+p2.y)*f;
	}

	f=this.area()*6;
	return new Point({x: x/f,y:y/f});
};

*/
















function renderDiagram() {
	project.activeLayer.children = [];
	var diagram = voronoi.compute(sites, bbox);
	if (diagram) {
		for (var i = 0, l = sites.length; i < l; i++) {
			var cell = diagram.cells[sites[i].voronoiId];
			if (cell) {
				var halfedges = cell.halfedges,
				start = false,
				length = halfedges.length,
				clipped = 0,
				orig_shape = [];
				shape1 = [],
				shape2 = [];
				if (length > 2) {
					for (var j = 0; j < length; j++) {
						v = halfedges[j].getEndpoint();
						curr = new Point(v);
						if (j > 0) {
							v = halfedges[j - 1].getEndpoint();
						} else {
							v = halfedges[length - 1].getEndpoint();
						}
						prev = new Point(v);
		
						var inter = intersect(prev, curr);
						if (inter != false) {
							var end = inter.index;
							clipped++;
							if (clipped % 2 == 1) {
								shape1.push(inter.point);
								shape2.push(inter.point);
								var start = inter.index;
							} else if (start >= end) {	

								shape1.push(inter.point);
								shape2.push(inter.point);
							} else {
								if (--end < 0) end += boundary.length;
p = new Path.Circle(prev, 10);p.fillColor = new Color('yellow');
q = new Path.Circle(curr, 10);q.fillColor = new Color('yellow');
								boundary_count = Math.abs(end - start);
								
								shape2.push(inter.point);
								for (var k = 0; k <= boundary_count; k++) {
	console.debug(i +'  :: ' + k + "\nstart :" +start + "\n end:" + end );
									s_index = start + k;
									e_index = end - k;
									if (s_index >= boundary.length) s_index -= boundary.length;
									if (e_index < 0) e_index += boundary.length;
//	console.debug('-----------------' + s_index + ' xx ' + e_index);
									shape1.push(new Point(boundary[s_index]));
									shape2.push(new Point(boundary[e_index]));
								}
								shape1.push(inter.point);
							}
						}
		
						if (clipped % 2 == 0) {
							shape1.push(curr);
						} else {
							shape2.push(curr);
						}
						orig_shape.push(curr);
					}

					if (clipped > 0) {
						if (shape1.length > 2) {
							spotColor = new Color('red');	
							createPath(shape1, sites[i]);
						}

						if (shape2.length > 2) {
							spotColor = new Color('blue');
							createPath(shape2, sites[i]);
						}
						spotColor = new Color('black');
				//		createPath(orig_shape, sites[i]);
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
		//path.fillColor = spotColor;
		path.strokeColor = spotColor;
	} else {
		path.fullySelected = selected;
	}
	path.closed = true;

	//console.debug('begin create path');
	for (var i = 0, l = points.length; i < l; i++) {
		var point = points[i];
		var next = points[(i + 1) == points.length ? 0 : i + 1];
		var vector = (next - point) / 2;
		// console.debug(point);
		path.add({
			point: point + vector,
			handleIn: -vector,
			handleOut: vector
		});

		if (spotColor == new Color('red')) {
			m = new Path.Circle(point, 5);
			m.fillColor = spotColor;
		}
	}
	//console.debug('end create path');
	path.scale(0.80);
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

	spotColor = 'black';
	createPath(boundary, sites[0]);
}

function onKeyDown(event) {
	if (event.key == 'space') {
		selected = !selected;
		renderDiagram();
	}
}













function intersect(v1, v2) {
	var p = poly_intersect(v1, v2, boundary);
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

