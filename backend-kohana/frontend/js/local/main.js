console.debug('here');

/*
 * Program execution.
 */
VD.main = function() {
    // Shortcuts:
    var config = VD.config;

    // Program scope vars:
    var start = config.defaultStart; //init

//for testing
var index = 0;


var w = 600,
    h = 300;

/*
var vertices = d3.range(20).map(function(d) {
  return [Math.random() * w, Math.random() * h];
});
*/
//var vertices = [[100,20],[200,200],[130,180],[350,400]];
/*
var images = [
"http://1.bp.blogspot.com/-vENEJS_PBCw/TcwZOm2nR3I/AAAAAAAAAWE/5LArFeuutwo/s1600/Places+montoun.jpg",
"http://3.bp.blogspot.com/-28dn7xabZdI/TcwZJ0JtN9I/AAAAAAAAAV4/hs2m2JK3stk/s1600/Places+pictures.jpg",
"http://sleevage.com/wp-content/uploads/2007/10/aih_places_like_these.jpg",
"http://images2.fanpop.com/images/photos/6900000/Beautiful-Places-national-geographic-6969331-1600-1200.jpg",
"http://www.fedstats.gov/kids/mapstats/graphics/place1.jpg",
"http://www.visitbelgium.com/images/GrandPlaceDayBXL1_003.jpg",
"http://www.travelphotoguide.com/photos/mauritius/beautiful_places/beautiful_places_3.jpg",
"http://www.softsay.com/images/remote/AC%5C35%5CAC352A_24BAFA7DD8DD421CD67F4687365A7C23places_med.jpg",
"http://farm1.static.flickr.com/115/274762017_3c68db3075.jpg",
"http://blogs.princeton.edu/wri152-3/f05/jasonwu/sh87.jpg",
"http://1.bp.blogspot.com/-vENEJS_PBCw/TcwZOm2nR3I/AAAAAAAAAWE/5LArFeuutwo/s1600/Places+montoun.jpg",
"http://3.bp.blogspot.com/-28dn7xabZdI/TcwZJ0JtN9I/AAAAAAAAAV4/hs2m2JK3stk/s1600/Places+pictures.jpg",
"http://sleevage.com/wp-content/uploads/2007/10/aih_places_like_these.jpg",
"http://images2.fanpop.com/images/photos/6900000/Beautiful-Places-national-geographic-6969331-1600-1200.jpg",
"http://www.fedstats.gov/kids/mapstats/graphics/place1.jpg",
"http://www.visitbelgium.com/images/GrandPlaceDayBXL1_003.jpg",
"http://www.travelphotoguide.com/photos/mauritius/beautiful_places/beautiful_places_3.jpg",
"http://www.softsay.com/images/remote/AC%5C35%5CAC352A_24BAFA7DD8DD421CD67F4687365A7C23places_med.jpg",
"http://farm1.static.flickr.com/115/274762017_3c68db3075.jpg",
"http://blogs.princeton.edu/wri152-3/f05/jasonwu/sh87.jpg"
]
*/

var svg = d3.select("#"+config.mapContainerName)
  .append("svg:svg")
    .attr("width", w)
    .attr("height", h);
//    .attr("class", "PiYG")
console.debug('here');

function redraw( data ) {

        console.debug( 'redrawing...', $(config.mapContainerName) );
        console.debug(data);
//replace this max* with values from files
    var minlat = 40.700943;
    var minlong = -74.019184;
    var maxlat = 40.87731;
    var maxlong = -73.911037;

    var latmult = w/(maxlat - minlat);
    var longmult = h/(maxlong - minlong);

    for( var idx in data ) {
        if( data.hasOwnProperty( idx )) {
        data[idx].lat = (data[idx].lat - latmin) * latmut;
        data[idx].long = (data[idx].long -longmin) * longmult;
        }
     }

    var boundary = [{"lat":40.701984,"long":-74.016094},
        {"lat":40.706018, "long":-74.019184},
        {"lat":40.718445, "long":-74.016523},
        {"lat":40.718249, "long":-74.013262},
        {"lat":40.751939, "long":-74.008198},
        {"lat":40.771442, "long":-73.994808},
        {"lat":40.82693, "long":-73.955498},
        {"lat":40.843814, "long":-73.946228},
        {"lat":40.87731, "long":-73.926315},
        {"lat":40.87705, "long":-73.922367},
        {"lat":40.874584, "long":-73.915672},
        {"lat":40.872377, "long":-73.911037},
        {"lat":40.867834, "long":-73.911381},
        {"lat":40.859006, "long":-73.919621},
        {"lat":40.843814, "long":-73.930435},
        {"lat":40.832775, "long":-73.93507},
        {"lat":40.809782, "long":-73.934727},
        {"lat":40.797697, "long":-73.92889},
        {"lat":40.79042, "long":-73.936272},
        {"lat":40.782751, "long":-73.943653},
        {"lat":40.775732, "long":-73.94228},
        {"lat":40.737242, "long":-73.974724},
        {"lat":40.729438, "long":-73.972492},
        {"lat":40.711093, "long":-73.977299},
        {"lat":40.708231, "long":-73.9991},
        {"lat":40.700943, "long":-74.013348},
        {"lat":40.701984, "long":-74.016094}];

        for( var idx in boundary ) {
            if( boundary.hasOwnProperty( idx )) {
            boundary[idx].lat = (boundary[idx].lat - latmin) * latmut;
            boundary[idx].long = (boundary[idx].long -longmin) * longmult;
            }
        }


var line_intersect = function ( v1, v2, p1, p2){
  
  var vslope = ( v1[1] - v2[1] )/ (v1[0] - v2[0]);
  var pslope = ( p1[1] - p2[1] )/ (p1[0] - p2[0]);
  
  if (vslope == pslope)
  {
    //lines are paralel, they will not intersect anyway
    return null;
  }

  var vb = v1[1] - vslope * v1[0];
  var pb = p1[1] - pslope * p1[0];

  var x = (pb + vb )/(vslope-pslope) ;
  var y = vslope*x + vb;

  if (x < Math.min(v1[0],v2[0]) || x > Math.max(v1[0],v1[0])) {
    // no intersect
    return null;
  }
  if (y < Math.min(v1[1],v2[1]) || y > Math.max(v1[1],v1[1])) {
    //mo intersect
    return null;
  }

 return [x, y];
} 

        // find intesection of line and shape
        var poly_intersect = function(p1, p2, polygon) {
            for (var idx in polygon) {
                if( polygon.hasOwnProperty( idx )) {
                    if (idx == 0) {
                        prev = polygon[polygon.length - 1];
                    } else {
                        prev = polygon[idx - 1];
                    }

                    var intersect = line_intersect(p1, p2, prev, polygon[idx]); 
                    if (intersect) {
                        return {idx:idx, point:intersect};
                    }
                }
            }
            return null;
        };


    // clip to boundary;
        var axel_clip = function(shapes) {
        for( var idx in shapes ) {
          if( shapes.hasOwnProperty( idx )) {
          var shape = shapes[idx];
          var first_intersect = null;
          var clipped_poly = [];
          var border_start = null;

          for (var idy in shape) {
             if( shape.hasOwnProperty( idy )) {
                 // x == 0 == lat, y = 1 = long
               if (shape[idy][0] <= 0 || shape[idy][0] >= w || shape[idy][1] <= 1 || shape[idy][1] >= h) {
                  // if first point, then 
                  if (idy == 0) {
                        prev = shape[shape.length - 1];
                  } else {
                        prev = shape[idy - 1];
                  }
                  // 1 intersect1 -= find intersection prev - shape[idy] agains boundry
                  var intersect = poly_intersect(prev, shape[idy], boundary );
                  if (intersect) {
                        if (first_intersect) {
                        console.debug('1');
                            clipped_poly.push(first_intersect);
                            for (var clipx = border_start;  clipx < intersect.idx; clipx++) {
                                clipped_poly.push( boundary[clipx]);
                            }
                            console.debug('2');
                            clipped_poly.push(intersect.point);

                            first_intersect = null;
                            border_start = null;
                        } else {
                            first_intersect = intersect.point;
                            border_start = intersect.idx;
                        }
                  } else if (!first_intersect) {
                        clipped_poly.push(shape[idy]);
                  }

                  // 
               }
             }
          }
          shapes[idx] = clipped_poly;
        }
        }
          return shapes;
        };
//console.debug('lmlm:',minlat,maxlat,minlong,maxlong,latrange,longrange,latmult,longmult);

    var vertices = [];
    for( var idx in data ) {
      if( data.hasOwnProperty( idx )) {
        vertices.push( [data[idx].lat,data[idx].long] ); 
        //console.debug(vertices[idx],data[idx].url);
      }
    }

window.vertices = vertices;
/*
svg.selectAll("path")
    .remove();
*/

svg.selectAll("path")
    .data(axel_clip(d3.geom.voronoi(vertices)))
    .enter().append("svg:path")
//    .attr("class", function(d, i) { return i ? "q" + (i % 9) + "-9" : null; })
    .attr("d", function(d) { return "M" + d.join("L") + "Z"; })
    .on("mousemove", update)
    .attr("stroke", "yellow") 
    .attr("fill", function(d,i) {
    
        var defs = d3.select("#defs")
            .append("svg:pattern")
            .attr("id", "img"+(i+1))
            .attr("patternUnits", "userSpaceOnUse")
            .attr("width", "100%")
            .attr("height", "100%")
            .append("svg:image")
            .attr("width", data[i].sizex)
            .attr("height", data[i].sizey)
            .attr("x", vertices[i][0]-data[i].sizex/2)
            .attr("y", vertices[i][1]-data[i].sizey/2)
            .attr("xlink:href", data[i].url);

window.svg = svg;

        return "url(#img" + (i+1) +")" 
    });

/*
svg.selectAll("circle")
    .data(vertices.slice(1))
  .enter().append("svg:circle")
    .attr("transform", function(d) { return "translate(" + d + ")"; })
    .attr("r", 2);
*/

}


function update( arg1, arg2 ) {
  //console.debug( arg1, arg2, vertices[0] );

  //vertices[0] = d3.svg.mouse(this);

    vertices.pop();
    var cell = data.shift();
    vertices.unshift( [50,50] );

    svg.selectAll("path")
      .data(d3.geom.voronoi(vertices)
      .map(function(d) { return "M" + d.join("L") + "Z"; }))
      .filter(function(d) { return this.getAttribute("d") != d; })
      .attr("d", function(d) { return d; });
}

window.update = update;

window.pollServer = pollServer;


    /* Procedural flow: */
    // - Set polling on an interval
    pollServer();
    setInterval( pollServer, config.queryInterval * 1000 );

    function pollServer() {
        var request = new Request.JSON({

            url: config.apiUrl+start,
            method: 'get',

/*
            data: { // our demo runner and jsfiddle will return this exact data as a JSON string
                start: start
            },
*/

            onSuccess: function( responseJSON, responseText ) {
                start ++;
                redraw( responseJSON );
            },

            onComplete: function( response ) {
                console.debug( 'complete!' );
            },

            onError: function( text, error ) {
                console.debug( 'ERROR!!!', error );
            }

        }).send();
    }

    /* Server interactions: */
}();
