function Chord(userConfig)
{
  var chart = new DexComponent(userConfig,
  {
  	// The parent container of this chart.
    'parent'           : null,
    // Set these when you need to CSS style components independently.
    'id'               : 'Chord',
    'class'            : 'Chord',
    // Our data...
    'csv'              :
    {
    	// Give folks without data something to look at anyhow.
    	'header'         : [ "X", "Y", "Z" ],
    	'data'           : [[0,0,0],[1,1,1],[2,2,2]]
    },
    // width and height of our bar chart.
    'width'            : 600,
    'height'           : 400,
    'xoffset'          : 300,
    'yoffset'          : 200,
    'padding'          : 0.05,
    'color'            : d3.scale.category20(),
    'opacity'     : 100,
    'innerRadius' : 130,
    'outerRadius' : 200,
    'mouseoverFade' : 0.2,
    'mouseoutFade'  : 1,
    'tickLength' : 5,
    'strokeWidth' : 1,
    'chordOpacity' : 50,
  	'label'       : dex.config.label()
  });

  chart.render = function()
  {
    this.update();
  };

  chart.update = function()
  {
      var chart = this;
  var config = chart.config;
  var csv = config.csv; 
  var json;
  
  if (config.debug)
  {
    console.log("===== Chord Configuration =====");
    console.dir(config);
  }

  var chartContainer = config.parent.append("g")
    .attr("class", config["id"])
    .attr("id", config["id"])
    .attr("transform",
      "translate(" + config.xoffset + "," + config.yoffset + ")");

  chordData = dex.csv.getConnectionMatrix(csv);
  //dex.console.log("Connection Matrix:", chordData);
  //dex.console.log("CSV", csv);
  var chord = d3.layout.chord()
    .padding(config.padding)
    .sortSubgroups(d3.descending)
    .matrix(chordData.connections);

  chartContainer.append("g")
    .selectAll("path")
    .data(chord.groups)
    .enter().append("path")
    .attr("id", "fillpath")
    .style("fill", function(d) { return config.color(d.index); })
    .style("stroke", function(d) { return config.color(d.index); })
    .style("opacity", config.opacity/100.0)
    .attr("d",
      d3.svg.arc()
        .innerRadius(config.innerRadius)
        .outerRadius(config.outerRadius))
    .on("mouseover", fade(config.mouseoverFade))
    .on("mouseout", fade(config.mouseoutFade));

  // REM: Used to be svg.
  var ticks = config.parent.append("g")
    .attr("id", "ChordTicks")
    .selectAll("g")
    .data(chord.groups)
    .enter().append("g")
    .selectAll("g")
    .data(groupTicks)
    .enter().append("g")
    .attr("transform", function(d)
    {
      //console.dir(d);
      // Probably a bad idea, but getting parent angle data from parent.
      var startAngle = this.parentNode.__data__.startAngle;
      var endAngle = this.parentNode.__data__.endAngle;
      var midAngle = startAngle + (endAngle-startAngle)/2.0;
      return "translate(" + config.xoffset + "," + config.yoffset + ")rotate(" + (midAngle * 180 / Math.PI - 90) + ")"
          + "translate(" + config.outerRadius + ",0)";
      //return "translate(" + config.xoffset + "," + config.yoffset + ")rotate(" + (d.angle * 180 / Math.PI - 90) + ")"
      //    + "translate(" + config.outerRadius + ",0)";
    });

  ticks.append("line")
    .attr("x1", 1)
    .attr("y1", 0)
    .attr("x2", config.tickLength)
    .attr("y2", 0)
    .attr("stroke-width", config.strokeWidth)
    .style("stroke", "#000");

  ticks.append("text")
    .attr("x", config.tickLength + (config.tickLength / 4))
    .attr("dy", ".35em")
    .attr("font-size", config.label.font.size)
    .attr("text-anchor", function(d) {
      return d.angle > Math.PI ? "end" : null;
    })
    .attr("transform", function(d) {
      return d.angle > Math.PI ? "rotate(180)translate(-" +
        ((config.tickLength * 2) + (config.tickLength / 2)) + ")" : null;
    })
    .text(function(d) { return d.label; });

  chartContainer.append("g")
    .attr("class", "chord")
    .selectAll("path")
    .data(chord.chords)
    .enter().append("path")
    .style("fill", function(d) { return config.color(d.target.index); })
    .style("opacity", config.chordOpacity/100.0)
    .attr("d", d3.svg.chord().radius(config.innerRadius));

  /** Returns an array of tick angles and labels, given a group. */
  function groupTicks(d)
  {
    var k = (d.endAngle - d.startAngle) / d.value;
    return d3.range(0, d.value, 1000).map(function(v, i)
    {
      return {
        angle: v * k + d.startAngle,
        //label: i % 5 ? null : v / 1000 + "k"
        label: chordData.header[d.index]
      };
    });
  }

  /** Returns an event handler for fading a given chord group. */
  function fade(opacity)
  {
    return function(g, i)
    {
      chartContainer.selectAll("g.chord path")
        .filter(function(d)
        {
          return d.source.index != i && d.target.index != i;
        })
        .transition()
        .style("opacity", opacity);
    };
  }
};

  return chart;
}


