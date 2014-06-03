function HeatMap(userConfig)
{
  var chart = new DexComponent(userConfig,
  {
  	// The parent container of this chart.
    'parent'           : null,
    // Set these when you need to CSS style components independently.
    'id'               : 'HeatMap',
    'class'            : 'HeatMap',
    // Our data...
    'csv'              :
    {
    	// Give folks without data something to look at anyhow.
    	'header'         : [ "X", "Y" ],
    	'data'           : [[0,0],[1,1],[2,4],[3,9],[4,16]]
    },
    // width and height of our bar chart.
    'width'            : 600,
    'height'           : 400,
    // The x an y indexes to chart.
    'xi'               : 0,
    'yi'               : 1,
    'hi'               : 2,
    'xoffset'          : 50,
    'yoffset'          : 0,
    'heat'             :
    {
    	'color' : d3.scale.category20(),
    	'scale' : d3.scale.linear().range(["white", "red"])
    },
    'xaxis' : dex.config.xaxis(),
    'yaxis' : dex.config.yaxis(),
    'rect'  : dex.config.rectangle()
  });

  chart.render = function()
  {
    this.update();
  };

  chart.update = function()
  {
    var chart = this;
    var config = chart.config;

  var csv    = config.csv;
  
  if (config.debug)
  {
    console.log("===== HeatMap Configuration =====");
    console.dir(config);
  }

  var chartContainer = config.parent.append("g")
    .attr("id", config["id"])
    .attr("class", config["class"])
    .attr("transform", "translate(" + config.xoffset + "," + config.yoffset + ")");

  var x    = config.xaxis.scale.range([0, config.width]),
      y    = config.yaxis.scale.range([config.height, 0]);
      heat = config.heat.scale;

  // The size of the json in the CSV data file.
  // This could be inferred from the data if it weren't sparse.
  var xStep = 864e5, yStep = 100;

  //var json = dex.csv.toJson(csv);
  var data = csv.data;

  // Coerce the CSV data to the appropriate types.
  data.forEach(function(d)
  {
    d[config.x] = +d[config.xi]
    d[config.yi] = +d[config.yi];
    d[config.hi] = +d[config.hi];
  });

  // Compute the scale domains.
  x.domain(d3.extent(data, function(d) { return d[config.xi]; }));
  y.domain(d3.extent(data, function(d) { return d[config.yi]; }));
  heat.domain(d3.extent(data, function(d) { return d[config.hi]; }));

  // Extend the x- and y-domain to fit the last bucket.
  // For example, the y-bucket 3200 corresponds to values [3200, 3300].
  x.domain([x.domain()[0], +x.domain()[1] + xStep]);
  y.domain([y.domain()[0], y.domain()[1] + yStep]);

  // Display the tiles for each non-zero bucket.
  // See http://bl.ocks.org/3074470 for an alternative implementation.
  var rect = chartContainer.selectAll(".tile")
      .data(data)
    .enter().append("rect")
      .attr("class", "tile")
      .call(dex.config.configureRectangle, config.rect)
      .attr("x", function(d) { return x(d[config.xi]); })
      .attr("y", function(d) { return y(d[config.yi] + yStep); })
      .attr("width", x(xStep) - x(0))
      .attr("height",  y(0) - y(yStep))
      .style("fill", function(d) { return heat(d[config.hi]); })
      .on("mouseover", function(d)
      {
        if (config.event && config.event.mouseover)
        {
          config.event.mouseover(d);
        }
        else
        {
          dex.console.log("on.mouseover", d);
        }
      });

  var xaxis = dex.config.configureAxis(config.xaxis)
    .scale(x);
  var yaxis = dex.config.configureAxis(config.yaxis)
    .scale(y);

  // Add an x-axis with label.
  chartContainer.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + config.height + ")")
      .call(xaxis)
    .append("text")
      .attr("class", "label")
      .call(dex.config.configureLabel, config.xaxis.label)
      .text(config.xaxis.label.text);

  // Add a y-axis with label.
  chartContainer.append("g")
      .attr("class", "y axis")
      .call(yaxis)
    .append("text")
      .attr("class", "label")
      .call(dex.config.configureLabel, config.yaxis.label)
      .text(config.yaxis.label.text);
};

  return chart;
}
