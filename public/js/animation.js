$(function() {

  var currentWidth = $('#map').width();
  var width = 938;
  var height = 620;

  var projection = d3.geo
                     .mercator()
                     .scale(150)
                     .translate([width / 2, height / 1.41]);

  var path = d3.geo
               .path()
               .pointRadius(2)
               .projection(projection);
  
  var svg = d3.select("#map")
              .append("svg")
              .attr("preserveAspectRatio", "xMidYMid")
              .attr("viewBox", "0 0 " + width + " " + height)
              .attr("width", currentWidth)
              .attr("height", currentWidth * height / width);

  // var capitalCities = {};
  var capitalCities = [];

  function transition(plane, route, trail) {
    var l = route.node().getTotalLength();
    plane.transition()
        .duration(l * 5)
        .attrTween("transform", delta(plane, route.node()))
        .each("end", function() { route.remove(); })
        .remove();
       
   trail.transition()
        .duration(l * 5)
        .attrTween("stroke-dasharray", trailDelta)
        .each("end", function() { route.remove(); })
        .remove();     
  }
  
  function delta(plane, path) {
    var l = path.getTotalLength();
    var plane = plane;
    return function(i) {
      return function(t) {
        var p = path.getPointAtLength(t * l);

        var t2 = Math.min(t + 0.05, 1);
        var p2 = path.getPointAtLength(t2 * l);

        var x = p2.x - p.x;
        var y = p2.y - p.y;
        var r = 90 - Math.atan2(-y, x) * 180 / Math.PI;

        var s = Math.min(Math.sin(Math.PI * t) * 0.7, 0.3);

        return "translate(" + p.x + "," + p.y + ") scale(" + s + ") rotate(" + r + ")";
      }
    }
  }

  function trailDelta() {
    var l = this.getTotalLength(),
        i = d3.interpolateString("0," + l, l + "," + l);
    return function(t) { return i(t); };
  }
  
  var defaultCity = "Indonesia";

  function fly(origin, destination) {
    if(origin == "UNDEFINED")
      origin = defaultCity;
    if(destination == "UNDEFINED")
      destination = defaultCity;

    var route = svg.append("path")
                   .datum({type: "LineString", coordinates: [capitalCities[origin], capitalCities[destination]]})
                   .attr("class", "route")
                   .attr("d", path);
    
    var trail = svg.append("path")
                   .datum({type: "LineString", coordinates: [capitalCities[origin], capitalCities[destination]]})
                   .attr("class", "trail")
                   .attr("d", path);               

    var plane = svg.append("path")
                   .attr("class", "plane")
                   .attr("d", "M-3.837,3.457l-24.399,48.587c-2.322,4.625-0.149,7.31,4.856,5.994L0.366,51.8l22.979,6.185    c5.001,1.346,7.202-1.333,4.923-5.982L4.497,3.499C2.217-1.15-1.515-1.168-3.837,3.457z")
                   .attr("width", "20px")
                   .attr("height", "20px");

    transition(plane, route, trail);
  }

  function loaded(error, countries, airports) {
    svg.append("g")
       .attr("class", "countries")
       .selectAll("path")
       .data(topojson.feature(countries, countries.objects.countries).features)
       .enter()
       .append("path")
       .attr("d", path);

    svg.append("g")
       .attr("class", "airports")
       .selectAll("path")
       .data(topojson.feature(airports, airports.objects.capitals).features)
       .enter()
       .append("path")
       .attr("id", function(d) {return d.id;})
       .attr("d", path);

    var geos = topojson.feature(airports, airports.objects.capitals).features;
    for (i in geos) {
      capitalCities[i] = geos[i].geometry.coordinates;
      // capitalCities[geos[i].properties.country] = geos[i].geometry.coordinates;
    }
    var lenCapitalCities = capitalCities.length;
    console.log(geos);

    // var i = 0;

    // var socket = io();
    // socket.on('mongoStream', function (data) {
    //     console.log(data.fullDocument.src_country, data.fullDocument.dest_country);
    //     fly(data.fullDocument.src_country, data.fullDocument.dest_country);
    // });
    setInterval(function() {
      // if (i > OD_PAIRS.length - 1) {
      //   i = 0;
      // }
      // var od = OD_PAIRS[i];
      // console.log(od);
      let rand1 = Math.floor(Math.random() * Math.floor(lenCapitalCities));
      let rand2 = Math.floor(Math.random() * Math.floor(lenCapitalCities));
      fly(rand1, rand2);
      // i++;
    }, 150);
  }

  queue().defer(d3.json, "json/countries2.topo.json")
         .defer(d3.json, "json/capitals.topo.json")
         .await(loaded);

  $(window).resize(function() {
    currentWidth = $("#map").width();
    svg.attr("width", currentWidth);
    svg.attr("height", currentWidth * height / width);
  });
});