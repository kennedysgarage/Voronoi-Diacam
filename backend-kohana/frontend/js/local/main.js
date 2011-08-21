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

function redraw( data ) {

        console.debug( 'redrawing...', $(config.mapContainerName) );
        console.debug(data);
//replace this max* with values from files
var minlat = 40.700943;
var minlong = -74.019184
var maxlat = 40.87731 ;
var maxlong = -73.911037
    // calculate min max range multiplier
    var minlat = null, minlong = null, maxlat = null, maxlong = null;
    for( var idx in data ) {
      if( data.hasOwnProperty( idx )) {
        if( !minlat || data[idx].lat - minlat < 0 ) minlat = data[idx].lat;
        if( !maxlat || data[idx].lat - maxlat > 0 ) maxlat = data[idx].lat;
        if( !minlong || data[idx].long - minlong < 0 ) minlong = data[idx].long;
        if( !maxlong || data[idx].long - maxlong > 0 ) maxlong = data[idx].long;
      }
    }
    //loop and multiple latmult to get pixels
    //latmult*
    var latrange = maxlat - minlat;
    var longrange = maxlong - minlong;
    
    var latmult = w/latrange;
    var longmult = h/longrange;
    //loop lat *= latmult

    for( var idx in data ) {
        if( data.hasOwnProperty( idx )) {
        data[idx].lat = data[idx].lat * latmut;
        data[idx].long = data[idx].long * longmult;
        }
     }

//console.debug('lmlm:',minlat,maxlat,minlong,maxlong,latrange,longrange,latmult,longmult);

    var vertices = [];
    for( var idx in data ) {
      if( data.hasOwnProperty( idx )) {
        //TODO: REMOVE RANDOM!!!
        vertices.push( [Math.round(Math.random()*10+(latmult*(data[idx].lat-minlat))),Math.round((latmult*(data[idx].long-minlong)))] ); //latmult preserves aspect ratio
        //console.debug(vertices[idx],data[idx].url);
      }
    }

window.vertices = vertices;
/*
svg.selectAll("path")
    .remove();
*/

svg.selectAll("path")
    .data(d3.geom.voronoi(vertices))
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
