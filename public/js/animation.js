var useDummy = false;

var currentWidth = $('#map').width();
var width = 938;
var height = 620;

var projection = d3.geoMercator()
  .scale(150)
  .translate([width / 2, height / 1.41]);

var path = d3.geoPath()
  .pointRadius(2)
  .projection(projection);

//ref: https://stackoverflow.com/a/56568406
var curve = function (context) {
  var custom = d3.curveLinear(context);
  custom._context = context;
  custom.point = function (x, y) {
    x = +x, y = +y;
    switch (this._point) {
      case 0: this._point = 1;
        this._line ? this._context.lineTo(x, y) : this._context.moveTo(x, y);
        this.x0 = x; this.y0 = y;
        break;
      case 1: this._point = 2;
      default:
        var x1 = this.x0 * 0.5 + x * 0.5;
        var y1 = this.y0 * 0.5 + y * 0.5;
        var m = 1 / (y1 - y) / (x1 - x);
        var r = -100; // offset of mid point.
        var k = r / Math.sqrt(1 + (m * m));
        if (m == Infinity) {
          y1 += r / 2;
          this._context.bezierCurveTo(x1 + r / 2, y1, x1 - r / 2, y1, x, y);
        }
        else {
          y1 += k;
          x1 += m * k;
          this._context.quadraticCurveTo(x1, y1, x, y);
        }
        this.x0 = x; this.y0 = y;
        break;
    }
  }
  return custom;
}

var line = d3.line()
  .x(function (d) {
    return projection([d[0], d[1]])[0];
  })
  .y(function (d) {
    return projection([d[0], d[1]])[1];
  })
  .curve(curve);

var svg = d3.select("#map")
  .append("svg")
  .attr("preserveAspectRatio", "xMidYMid")
  .attr("viewBox", "0 0 " + width + " " + height)
  .attr("width", currentWidth)
  .attr("height", currentWidth * height / width);

if (useDummy) {
  var capitalCities = [];
} else {
  var capitalCities = {};
}

function delta(plane, path) {
  let l = path.getTotalLength();
  //let plane = plane;
  return function (i) {
    return function (t) {
      let p = path.getPointAtLength(t * l);

      let t2 = Math.min(t + 0.05, 1);
      let p2 = path.getPointAtLength(t2 * l);

      let x = p2.x - p.x;
      let y = p2.y - p.y;
      let r = 90 - Math.atan2(-y, x) * 180 / Math.PI;

      let s = Math.min(Math.sin(Math.PI * t) * 0.7, 0.3);

      return "translate(" + p.x + "," + p.y + ") scale(" + s + ") rotate(" + r + ")";
    }
  }
}

function trailDelta() {
  let l = this.getTotalLength(),
    i = d3.interpolateString("0," + l, l + "," + l);
  return function (t) { return i(t); };
}

function transition(route, trail, color) {
  let l = route.node().getTotalLength();
  let duration = l * 5;

  trail.transition()
    .duration(duration)
    .attrTween("stroke-dasharray", trailDelta)
    .on("end", destinationPulse(route, duration, color))
    .remove();
}

function destinationPulse(route, delayDuration, color) {
  let dataCircle = route.datum();
  let pointDestination = projection(dataCircle[1]);
  //- console.log(color);
  svg.append("circle")
    .datum(dataCircle)
    .attr("cx", pointDestination[0])
    .attr("cy", pointDestination[1])
    .attr("r", 2)
    .style("class", "destCircleMouse")
    .style("fill", color)
    .style("fill-opacity", "1")
    .transition()
    .delay(delayDuration)
    .duration(100)
    .attr("r", 3)
    .on("end", function (d) {
      d3.select(this)
        .transition()
        .duration(500)
        .attr("r", 10) // circle radius end
        .style("fill-opacity", "0")
        .on("end", function () {
          this.remove();
        })
    });

  route.remove();
}

function fly(origin, destination, color) {
  //- console.log(color)
  //ref: https://stackoverflow.com/a/56568406
  let route = svg.append("path")
    .datum([capitalCities[origin], capitalCities[destination]])
    .attr("class", "route")
    .attr("d", line);

  let trail = svg.append("path")
    .datum([capitalCities[origin], capitalCities[destination]])
    .attr("class", "trail")
    .attr("d", line)
    .style("stroke-width", 1.5)
    .style("stroke", color);

  transition(route, trail, color);
}

function loaded(countries, capitals) {
  svg.append("g")
    .attr("class", "countries")
    .selectAll("path")
    .data(topojson.feature(countries, countries.objects.countries).features)
    .enter()
    .append("path")
    .attr("d", path);

  svg.append("g")
    .attr("class", "capitals")
    .selectAll("path")
    .data(topojson.feature(capitals, capitals.objects.capitals).features)
    .enter()
    .append("path")
    .attr("id", function (d) { return d.id; })
    .attr("d", path);

  let geos = topojson.feature(capitals, capitals.objects.capitals).features;
  for (i in geos) {
    if (useDummy) {
      capitalCities[i] = geos[i].geometry.coordinates;
    } else {
      capitalCities[geos[i].id] = geos[i].geometry.coordinates;
    }
  }
  let lenCapitalCities = capitalCities.length;
  // console.log(geos);

  let defaultCountry = "ID";
  let colorAttack = {
    "Consecutive TCP small segments exceeding threshold": "Turquoise",
    "Reset outside window": "LightSkyBlue",
    "(spp_ssh) Protocol mismatch": "GreenYellow",
    "(http_inspect) LONG HEADER": "SpringGreen",
    "(http_inspect) UNESCAPED SPACE IN HTTP URI": "LightSalmon",
    "Bad segment, adjusted size <= 0": "Aqua",
    "(http_inspect) TOO MANY PIPELINED REQUESTS": "Gold",
    "(spp_sdf) SDF Combination Alert": "PaleGreen",
    "(http_inspect) INVALID CONTENT-LENGTH OR CHUNK SIZE": "PowderBlue",
    "(http_inspect) NO CONTENT-LENGTH OR TRANSFER-ENCODING IN HTTP RESPONSE": "Orange"
  };
  if (useDummy) {
    setInterval(function () {
      let rand1 = Math.floor(Math.random() * Math.floor(lenCapitalCities));
      let rand2 = Math.floor(Math.random() * Math.floor(lenCapitalCities));
      let rand1test = rand1 == 226 || rand1 == 227;
      let rand2test = rand2 == 226 || rand2 == 227;
      if (rand1 != rand2 && !rand1test && !rand2test) {
        let colorVal = "hsl(" + 360 * Math.random() + ',' +
          (25 + 70 * Math.random()) + '%,' +
          (85 + 10 * Math.random()) + '%)';
        fly(rand1, rand2, colorVal);
      }
    }, 100);
  } else {
    let socket = io({ transports: ['pooling'] });
    socket.on('mongoStream', function (data) {
      let event = data.fullDocument;
      // console.log(event);
      // console.log(colorAttack);
      if (!event.src_country_iso)
        event.src_country_iso = defaultCountry;
      if (!event.dest_country_iso)
        event.dest_country_iso = defaultCountry;


      let color = colorAttack[event.alert_msg];
      if (!color) {
        //generate random color
        let colorVal = "hsl(" + 360 * Math.random() + ',' +
          (25 + 70 * Math.random()) + '%,' +
          (65 + 10 * Math.random()) + '%)';
        colorAttack[event.alert_msg] = colorVal;
        color = colorVal;
      }
      fly(event.src_country_iso, event.dest_country_iso, color);
      updateTable(event, color);
    });
  }
}

let tableRows = 0, maxRow = 5;
function updateTable(data, color) {

  //insert new row
  $("<tr>" +
    `<td><span class="flag:${data.src_country_iso}"></span> ${data.src_ip} (${data.src_country})</td>` +
    `<td><span class="flag:${data.dest_country_iso}"></span> ${data.dest_ip} (${data.dest_country})</td>` +
    `<td style="color:${color};">${data.alert_msg}</td>` +
    `<td style="color:${color};">${moment(data.ts).format('kk:mm:ss.SSS')}</td>` +
    // "<td>"+ data.value +"</td>"+
    "</tr>")
    .hide().appendTo("#stats").show("slow");

  tableRows++;
  if (tableRows > maxRow || tableRows == 1)
    //remove first row
    $("#stats tr:first").remove();
}

$(function () {

  //- d3.queue().defer(d3.json, "../json/countries2.topo.json")
  //-       .defer(d3.json, "../json/capitals.topo.json")
  //-       .await(loaded);

  //ref: https://stackoverflow.com/a/49534634
  var files = ["../json/countries2.topo.json", "../json/capitals.topo.json"];
  var promises = [];
  files.forEach(function (url) {
    promises.push(d3.json(url))
  });

  Promise.all(promises)
    .then(function (values) {
      loaded(values[0], values[1])
    })
    .catch(error => {
      console.error(error.message)
    });

  $(window).resize(function () {
    currentWidth = $("#map").width();
    svg.attr("width", currentWidth);
    svg.attr("height", currentWidth * height / width);
  });
});