dex.object = {};

////
//
// dex.object : This module provides routines dealing with basic javascript
//              objects.
//
////

dex.object.clone = function(obj)
{
  var i, attr, len;

  // Handle the 3 simple types, and null or undefined
  if (null == obj || "object" != typeof obj)
    return obj;

  // Handle Date
  if ( obj instanceof Date)
  {
    var copy = new Date();
    copy.setTime(obj.getTime());
    return copy;
  }

  // Handle Array
  if (obj instanceof Array)
  {
    var copy = [];
    for (i = 0, len = obj.length; i < len; i++)
    {
      copy[i] = dex.object.clone(obj[i]);
    }
    return copy;
  }

  // DOM Nodes are nothing but trouble.
  if (dex.object.isElement(obj) ||
      dex.object.isNode(obj))
  {
    return obj;
  }

  // Handle Object
  if (obj instanceof Object)
  {
    var copy = {};
    //jQuery.extend(copy, obj);
    for (attr in obj)
    {
      if (obj.hasOwnProperty(attr))
      {
        copy[attr] = dex.object.clone(obj[attr]);
        //copy[attr] = obj[attr];
      }
    }
    return copy;
  }

  throw new Error("Unable to copy obj! Its type isn't supported.");
}; 



  /**
   *
   * Overlay the top object on top of the bottom.  This method will first clone
   * the bottom object.  Then it will drop the values within the top object
   * into the clone.
   *
   * @method dex.object.overlay
   * @param {Object} top The object who's properties will be on top.
   * @param {Object} bottom The object who's properties will be on bottom.
   * @return {Object} The overlaid object where the properties in top override
   *                  properties in bottom.  The return object is a clone or
   *                  copy.
   *
   */

dex.object.overlay = function(top, bottom)
{
  // Make a clone of the bottom object.
  var overlay = dex.object.clone(bottom);
  var prop;
  
	// If we have parameters in the top object, overlay them on top
	// of the bottom object.
  if (top !== 'undefined')
  {
  	// Iterate over the props in top.
    for (prop in top)
    {
    	// Arrays are special cases. [A] on top of [A,B] should give [A], not [A,B]
    	if (typeof top[prop] == 'object' && overlay[prop] != null &&
    	  !(top[prop] instanceof Array))
    	{
    		//console.log("PROP: " + prop + ", top=" + top + ", overlay=" + overlay);
        overlay[prop] = dex.object.overlay(top[prop], overlay[prop]);
      }
      // Simply overwrite for simple cases and arrays.
      else
      {
      	overlay[prop] = top[prop];
      }
    }
  }

  //console.dir(config);
  return overlay;
};

//Returns true if it is a DOM node
dex.object.isNode = function(o)
{
  return (
    typeof Node === "object" ? o instanceof Node : 
    o && typeof o === "object" && typeof o.nodeType === "number" && typeof o.nodeName==="string"
  );
};

//Returns true if it is a DOM element    
dex.object.isElement = function(o){
  return (
    typeof HTMLElement === "object" ? o instanceof HTMLElement : //DOM2
    o && typeof o === "object" && o.nodeType === 1 && typeof o.nodeName==="string"
);
};

/**
 * 
 * This method returns a boolean representing whether obj is contained
 * within container.
 * 
 * @param {Object} container
 * @param {Object} obj
 * @return True if container contains obj.  False otherwise.
 */
dex.object.contains = function(container, obj)
{
  var i = container.length;
  while (i--)
  {
    if (container[i] === obj)
    {
      return true;
    }
  }
  return false;
};

dex.object.visit = function(obj, func)
{
	var prop;
	func(obj);
	for (prop in obj)
	{
		if (obj.hasOwnProperty(prop))
		{
			if (typeof obj[prop] === 'object')
			{
				dex.object.visit(obj[prop], func);
			}
		}
	}
};

dex.object.connect = function(map, values)
{
	//dex.console.log("  map:", map, "  values: ", values);
  if (!values || values.length <= 0)
  {
    return this;
  }
  if (!map[values[0]])
  {
    map[values[0]] = {};
  }
  dex.object.connect(map[values[0]], values.slice(1));

  return this;
};

dex.object.isNumeric = function(obj)
{
  return !isNaN(parseFloat(obj)) && isFinite(obj);
};

dex.object.setHierarchical = function(hierarchy, name, value, delimiter)
{
  if (hierarchy == null)
  {
    hierarchy = {};
  }

  if (typeof hierarchy != 'object')
  {
    return hierarchy;
  }

  // Create an array of names by splitting delimiter, then call
  // this function in the 3 argument (Array of paths) context.
  if (arguments.length == 4)
  {
    return dex.object.setHierarchical(hierarchy,
      name.split(delimiter), value);
  }

  // Array of paths context.
  else
  {
    // This is the last variable name, just set the value.
    if (name.length === 1)
    {
      hierarchy[name[0]] = value;
    }
    // We still have to traverse.
    else
    {
      // Undefined container object, just create an empty.
      if (!(name[0] in hierarchy))
      {
        hierarchy[name[0]] = {};
      }

      // Recursively traverse down the hierarchy.
      dex.object.setHierarchical(hierarchy[name[0]], name.splice(1), value);
    }
  }

  return hierarchy;
};