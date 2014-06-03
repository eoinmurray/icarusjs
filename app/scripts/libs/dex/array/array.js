dex.array = {};

////
//
// dex.array : This module provides routines dealing with arrays.
//
////

/**
 * 
 * Take a slice of an array.
 * 
 * @method dex.array.slice
 * @param
 */
dex.array.slice = function(array, rowRange, optLen)
{
	var slice = [];
  var range;
  var i;
  
  // Numeric.
  // Array.
  // Object.  Numeric with start and end.
  if (arguments.length < 2)
  {
  	return array;
  }
  else if (arguments.length == 2)
  {
  	if (Array.isArray(rowRange))
  	{
  		range = rowRange;
  	}
  	else
  	{
  		range = dex.range(rowRange, array.length - rowRange);
  	}
  }
  else if (arguments.length > 2)
  {
    if (Array.isArray(rowRange))
    {
  	  range = rowRange;
    }
    else
    {
  	  range = dex.range(rowRange, optLen);
    }
  }

	for (i = 0; i<range.length; i++)
	{
		slice.push(dex.object.clone(array[range[i]]));
	}

	return slice;
};

dex.array.indexOfById = function(array, id)
{
  var i;

  for (i = 0; i < array.length; i+=1)
  {
    if (array[i].id === id)
    {
      return i;
    }
  }
  
  return -1;
};


dex.array.indexBands = function(data, numValues)
{
  dex.console.log("BANDS");
  var interval, residual, tickIndices, last, i;

  if (numValues <= 0)
  {
    tickIndices = [];
  }
  else if (numValues == 1)
  {
    tickIndices = [ Math.floor(numValues/2) ];
  }
  else if (numValues == 2)
  {
    tickIndices = [ 0, data.length-1 ];
  }
  else
  {
    // We have at least 2 ticks to display.
    // Calculate the rough interval between ticks.
    interval = Math.max(1, Math.floor(data.length / (numValues-1)));
    
    // If it's not perfect, record it in the residual.
    residual = Math.floor(data.length % (numValues-1));

    // Always label our first datapoint.
    tickIndices = [0];

    // Set stop point on the interior ticks.
    last = data.length-interval;

    dex.console.log("TEST", data, numValues, interval, residual, last);

    // Figure out the interior ticks, gently drift to accommodate
    // the residual.
    for (i=interval; i<=last; i+=interval)
    {
      if (residual > 0)
      {
        i += 1;
        residual -= 1;
      }
      tickIndices.push(i);
    }
    // Always graph the last tick.
    tickIndices.push(data.length-1);
  }
  dex.console.log("BANDS");
  return tickIndices;
};

dex.array.unique = function(array)
{
  var uniqueMap =
  {
  };
  var unique = [];
  var i, l;
  
  for (i = 0, l = array.length; i < l; i+=1)
  {
    if (uniqueMap.hasOwnProperty(array[i]))
    {
      continue;
    }
    unique.push(array[i]);
    uniqueMap[array[i]] = 1;
  }
  return unique;
};


dex.array.extent = function(array, indices)
{
	var values = getArrayValues(array, indices);
	var max = Math.max.apply(null, values);
	var min = Math.min.apply(null, values);
	console.log("EXTENT:");
	console.dir(values);
	console.dir([min, max]);
	return [ min, max ];
};

dex.array.difference = function(a1, a2)
{
	var i, j;
  var a = [], diff = [];
  for (i = 0; i < a1.length; i++)
  {
  	a[a1[i]] = true;
  }
  for (i = 0; i < a2.length; i++)
  {
    if (a[a2[i]])
    {
      delete a[a2[i]];
    }
    else
    {
    	a[a2[i]] = true;
    }
  }
  for (j in a)
  {
    diff.push(j);
  }
  return diff;

};

dex.array.selectiveJoin = function(array, rows, delimiter)
{
	var delim = ':::';
	var key = "";
	if (arguments.length >= 3)
  {
  	delim = delimiter;
  }
  else if (arguments.length === 2)
  {
    return dex.array.slice(array, rows).join(delimiter);
  }
  throw "Invalid arguments.";
};
