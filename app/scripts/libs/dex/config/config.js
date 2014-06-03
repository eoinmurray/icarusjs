dex.config = {};

/**
 * This routine will expand hiearchically delimited names such as
 * foo.bar into a structure { foo : { bar : value}}.  It will delete
 * the hierarchical name and overwrite the value into the proper
 * location leaving any previous object properties undisturbed.
 *  
 * @param {Object} config The configuration which we will expand.
 * 
 */
dex.config.expand = function(config)
{
  var name;
  var ci;
  var expanded;

  // We have nothing, return nothing.
  if (!config)
  {
    return config;
  }

  // Make a clone of the previous configuration.
  expanded = dex.object.clone(config);

  // Iterate over the property names.
  for (name in config)
  {
    // If this is our property the process it, otherwise ignore.
    if (config.hasOwnProperty(name))
    {
      // The property name is non-null.
      if (name)
      {
        // Determine character index.
        ci = name.indexOf('.');
      }
      else
      {
        // Default to -1
        ci = -1;
      }

      // if Character index is > -1, we have a hierarchical name.
      // Otherwise do nothing, copying was already handled in the
      // cloning activity.
      if (ci > -1)
      {
        // Set it...
        dex.object.setHierarchical(expanded, name,
          dex.object.clone(expanded[name]), '.');
        // Delete the old name.
        delete expanded[name];
      }
    }
  }

  //dex.console.log("CONFIG", config, "EXPANDED", expanded);
  return expanded;
};

dex.config.font = function(custom)
{
  var config = 
  {
    'size' : 18,
    'family' : 'sans-serif',
    'style' : 'normal',
    'variant' : 'normal',
    'weight' : 'normal'
  };

  return (custom) ? dex.object.overlay(custom, config) : config;
};

dex.config.configureFont = function(node, config)
{
  return node
    .attr("font-family", config.family)
    .attr("font-weight", config.weight)
    .attr("font-style", config.style)
    .style("font-size", config.size);
};

dex.config.label = function(custom)
{
  var config = 
  {
    'x' : 0,
    'y' : 0,
    'transform' : "",
    'dy' : ".71em",
    'font' : this.font(),
    'text' : '',
    'anchor' : 'end',
    'color' : 'black'
  };
  if (custom)
  {
  	config = dex.object.overlay(custom, config);
  }
  return config;
};

dex.config.tick = function(custom)
{
  var config =
  {
    'count' : 5,
    //'tickValues'  : null,
    'subdivide' : 3,
    'size' :
    {
      'major' : 5,
      'minor' : 3,
      'end'   : 5
    },
    'padding' : 5,
    'format' : d3.format(",d"),
    'label' : this.label()
  };
  if (custom)
  {
  	config = dex.object.overlay(custom, config);
  }
  return config;
};

dex.config.xaxis = function(custom)
{
	var config =
  {
    'scale' : d3.scale.linear(),
    'orient' : "bottom",
    'tick'   : this.tick(),
    'label'  : this.label()
  };
  if (custom)
  {
  	config = dex.object.overlay(custom, config);
  }
  return config;
};

dex.config.yaxis = function(custom)
{
  var config = 
	{
    'scale'  : d3.scale.linear(),
    'orient' : 'left',
    'tick'   : this.tick(),
    'label'  : this.label({'transform' : 'rotate(-90)'})
  };
  if (custom)
  {
  	config = dex.object.overlay(custom, config);
  }
  return config;
};

dex.config.stroke = function(custom)
{
  var config = 
	{
    'width'     : 1,
    'color'     : "black",
    'opacity'   : 1,
    'dasharray' : ''
  };
  if (custom)
  {
  	config = dex.object.overlay(custom, config);
  }
  return config;
};

dex.config.configureStroke = function(node, config)
{
  return node
    .style('stroke-width', config.width)
    .style('stroke', config.color)
    .style('stroke-opacity', config.opacity)
    .style('stroke-dasharray', config.dasharray);
};

dex.config.rectangle = function(custom)
{
  var config = 
	{
    'width'   : 50,
    'height'  : 50,
    'x'       : 0,
    'y'       : 0,
    'stroke'  : dex.config.stroke(),
    'opacity' : 1,
    'color'   : d3.scale.category20()
  };
  if (custom)
  {
  	config = dex.object.overlay(custom, config);
  }
 return config;
};

dex.config.configureRectangle = function(node, config, d)
{
  dex.console.log("THIS", this, "D", d);
	return node
	  .attr('width', config.width)
	  .attr('height', config.height)
	  .attr('x', config.x)
	  .attr('y', config.y)
	  .attr('opacity', config.opacity)
	  .style('fill', config.color)
	  .call(dex.config.configureStroke, config.stroke);
};

dex.config.point = function(custom)
{
  var config = 
  {
    'x'  : 0,
    'y'  : 0
  };
  if (custom)
  {
    config = dex.object.overlay(custom, config);
  }
 return config;
};

dex.config.configurePoint = function(node, config)
{
  return node
    .attr('x', config.center.cx)
    .attr('y', config.center.cy);
};

dex.config.circle = function(custom)
{
  var config = 
  {
    'center'  : dex.config.point(),
    'radius'  : 10,
    'style'   :
    {
      'stroke'  : dex.config.stroke(),
      'color'   : d3.scale.category20(),
      'opacity' : 1.0
    }
  };
  if (custom)
  {
    config = dex.object.overlay(custom, config);
  }
 return config;
};

// Configures: opacity, color, stroke.
dex.config.configureShapeStyle = function(node, config)
{
  return node
    .call(dex.config.configureStroke, config.stroke)
    .attr('opacity', config.opacity)
    .style('fill', config.color);
};

dex.config.configureCircle = function(node, config)
{
  return node
    .call(dex.config.configureShapeStyle, config.style)
    .attr('r', config.radius)
    .attr('cx', config.center.x)
    .attr('cy', config.center.y);
};

dex.config.configureLabel = function(node, config, text)
{
	var rnode = node
    .attr("x", config.x)
    .attr("y", config.y)
    .attr("transform", config.transform)
    .attr("dy", config.dy)
    .call(dex.config.configureFont, config.font)
    //.text(config.text)
    .style("text-anchor", config.anchor)
    .attr("fill", config.color)
    .style("fill-opacity", config.opacity);
    
  if (text)
  {
  	rnode.attr(text);
  }
    
  return rnode;
};

dex.config.configureAxis = function(config)
{
	return d3.svg.axis()
    .ticks(config.tick.count)
    .tickSubdivide(config.tick.subdivide)
    .tickSize(config.tick.size.major, config.tick.size.minor,
      config.tick.size.end)
    .tickPadding(config.tick.padding)
    .tickFormat(config.tick.format)
    .orient(config.orient);
};