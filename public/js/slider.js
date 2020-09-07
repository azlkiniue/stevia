var formatDateIntoYear = d3.timeFormat("%H:%M %m/%y");
var formatDate = d3.timeFormat("%b %Y");
var parseDate = d3.timeParse("%m-%d-%H");
var momentDate = function(m, d, h) { return moment().month(m-1).date(d).hour(h).toDate(); };
var startDate = moment().subtract(1, 'day').toDate(),
  endDate = moment().toDate();
var margin = { top: 0, right: 50, bottom: 0, left: 30 },
  widthVis = width - margin.left - margin.right,
  heightVis = 100 - margin.top - margin.bottom;
var vis = d3.select("#vis")
  .append("svg")
  .attr("width", widthVis + margin.left + margin.right)
  .attr("height", heightVis + margin.top + margin.bottom);
////////// slider //////////
var moving = false;
var currentValue = 0;
var targetValue = widthVis;
var playButton = d3.select("#play-button");
var x, slider, handle, label;
function initiateSlider(startDate){
  x = d3.scaleTime()
    .domain([startDate, endDate])
    .range([0, targetValue])
    .clamp(true);
  slider = vis.append("g")
    .attr("class", "slider")
    .attr("transform", "translate(" + margin.left + "," + heightVis / 2 + ")");
  slider.append("line")
    .attr("class", "track")
    .attr("x1", x.range()[0])
    .attr("x2", x.range()[1])
    .select(function () { return this.parentNode.appendChild(this.cloneNode(true)); })
    .attr("class", "track-inset")
    .select(function () { return this.parentNode.appendChild(this.cloneNode(true)); })
    .attr("class", "track-overlay")
    .call(d3.drag()
      .on("start.interrupt", function (){ slider.interrupt(); })
      .on("start drag", function (){
        currentValue = d3.event.x;
        update(x.invert(currentValue));
      })
    );
  slider.insert("g", ".track-overlay")
    .attr("class", "ticks")
    .attr("transform", "translate(0," + 18 + ")")
    .selectAll("text")
    .data(x.ticks(10))
    .enter()
    .append("text")
    .style("fill", "#fff")
    .attr("x", x)
    .attr("y", 10)
    .attr("text-anchor", "middle")
    .text(function (d) { return formatDateIntoYear(d); });
  handle = slider.insert("circle", ".track-overlay")
    .attr("class", "handle")
    .attr("r", 9);
  label = slider.append("text")
    .style("fill", "#fff")
    .attr("class", "label")
    .attr("text-anchor", "middle")
    .text(formatDate(startDate))
    .attr("transform", "translate(0," + (-25) + ")")
}  
////////// plot //////////
let oldData = 0;
var dataset;
d3.json("/json/testFly.json").then(function (data) {
  dataset = data;
  //- console.log(dataset);
  startDate = moment(dataset[0].time).toDate();
  initiateSlider(startDate);
  playButton
    .attr("disabled", null)
    .text("Play")
    .on("click", function () {
      var button = d3.select(this);
      if (button.text() == "Pause") {
        moving = false;
        clearInterval(timer);
        button.text("Play");
      } else {
        moving = true;
        timer = setInterval(step, 250);
        button.text("Pause");
      }
      console.log("Slider moving: " + moving);
    })
});
function step() {
  update(x.invert(currentValue));
  currentValue = currentValue + (targetValue / 151);
  //- console.log(currentValue);
  if (currentValue > targetValue) {
    moving = false;
    currentValue = oldData = 0;
    clearInterval(timer); // disable this for endless loop
    update(x.invert(currentValue));
    playButton.text("Play");
    console.log("Slider moving: " + moving);
  }
}
function drawPlot(data) {
  flyX(data);
}
function update(h) {
  // update handle position and text of label according to slider scale
  handle.attr("cx", x(h));
  label
    .attr("x", x(h))
    .text(formatDate(h));
  // filter data set and redraw plot
  let newData = dataset.filter(function (d) {
    //- let date = momentDate(d._id.month, d._id.day, d._id.hour);
    let date = moment(d.time).toDate();
    //- console.log(date);
    return date < h;
  });

  if(oldData && newData.length == oldData){
    return;
  }
    
  //- console.log(newData);
  let index, goingForward = newData.length > oldData;
  if(goingForward)
    index = oldData - newData.length;
  else
    index = newData.length - oldData;
  
  newData = newData.slice(index);
  //- console.log(`old: ${oldData}, new: ${newData.length}`);
  for(let event of newData){
    drawPlot(event);
  }

  if(goingForward)
    oldData = oldData - index;
  else
    oldData = oldData + index;
}

$(function() {
  $(window).resize(function() {
    //- curWidth = $("#vis").width();
    //- curHeight = $("#vis").height();
    //- vis.attr("width", curWidth + margin.left + margin.right);
    //- vis.attr("height", curHeight + margin.top + margin.bottom);
  });
});