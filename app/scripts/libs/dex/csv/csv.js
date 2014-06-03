dex.csv =
{
};

dex.csv.csv = function(header, data)
{
  var csv =
  {
    "header" : header,
    "data" : data
  };

  return csv;
};

/**
 *
 * Given a CSV, create a connection matrix suitable for feeding into a chord
 * diagram.  Ex, given CSV:
 * 
 */
dex.csv.getConnectionMatrix = function(csv)
{
	var matrix = [];
	var ri, ci;
	var row;
  var cid;
  var header = [];
  var nameToIndex = {};
  var connectionMatrix;
  var uniques;
  var nameIndices = [];
  var src, dest;

  // Create a list of unique values to relate to one another.
  uniques = dex.matrix.uniques(csv.data);
  // Flatten them into our header.
  header = dex.matrix.flatten(uniques);
  
  // Create a map of names to header index for each column.
  nameToIndex = new Array(uniques.length);
  for ( ri = 0, cid = 0; ri < uniques.length; ri++)
  {
    nameToIndex[ri] =
    {
    };
    for ( ci = 0; ci < uniques[ri].length; ci++)
    {
      nameToIndex[ri][header[cid]] = cid;
      cid += 1;
    }
  }

  // Create a N x N matrix of zero values.
  matrix = new Array(header.length);
  for ( ri = 0; ri < header.length; ri++)
  {
    row = new Array(header.length);
    for ( ci = 0; ci < header.length; ci++)
    {
      row[ci] = 0;
    }
    matrix[ri] = row;
  }
  //dex.console.log("nameToIndex", nameToIndex, "matrix", matrix);

  for ( ri = 0; ri < csv.data.length; ri++)
  {
    for ( ci = 1; ci < csv.header.length; ci++)
    {
      src = nameToIndex[ci-1][csv.data[ri][ci - 1]];
      dest = nameToIndex[ci][csv.data[ri][ci]];

      //dex.console.log(csv.data[ri][ci-1] + "<->" + csv.data[ri][ci], src + "<->" + dest);
      matrix[src][dest] = 1;
      matrix[dest][src] = 1;
    }
  }


	connectionMatrix = { "header" : header, "connections" : matrix };
  //dex.console.log("Connection Matrix", connectionMatrix);
	return connectionMatrix;
};

dex.csv.createMap = function(csv, keyIndex)
{
  var ri, ci, rowMap, map =
  {
  };

  for ( ri = 0; ri < csv.data.length; ri += 1)
  {
    if (csv.data[ri].length === csv.header.length)
    {
      rowMap =
      {
      };

      for ( ci = 0; ci < csv.header.length; ci += 1)
      {
        rowMap[csv.header[ci]] = csv.data[ri][ci];
      }
      map[csv.data[ri][keyIndex]] = rowMap;
    }
  }
  return map;
};

dex.csv.toJson = function(csv, rowIndex, columnIndex)
{
  var jsonData = [];
  var ri, ci, jsonRow;

  if (arguments.length >= 3)
  {
    jsonRow = {};
    jsonRow[csv.header[columnIndex]] = csv.data[rowIndex][columnIndex];
    return jsonRow;
  }
  else if (arguments.length === 2)
  {
    var jsonRow =
    {
    };
    for ( ci = 0; ci < csv.header.length; ci+=1)
    {
      jsonRow[csv.header[ci]] = csv.data[rowIndex][ci];
    }
    return jsonRow;
  }
  else if (arguments.length === 1)
  {
    for ( ri = 0; ri < csv.data.length; ri++)
    {
      var jsonRow =
      {
      };
      for ( ci = 0; ci < csv.header.length; ci++)
      {
        jsonRow[csv.header[ci]] = csv.data[ri][ci];
        //dex.console.log(csv.header[ci] + "=" + csv.data[ri][ci], jsonRow);
      }
      jsonData.push(jsonRow);
    }
  }
  return jsonData;
};

/**
 * Transforms:
 * csv =
 * {
 * 	 header : {C1,C2,C3},
 *   data   : [
 *     [A,B,C],
 *     [A,B,D]
 *   ]
 * }
 * into:
 * json =
 * {
 * 	"name"     : rootName,
 *  "category" : category,
 *  "children" :
 *  [
 *    "children" :
 *     [
 *       {
 *         "name"     : "A",
 *         "category" : "C1",
 *         "children" :
 *         [
 *           {
 * 	           "name" : "B",
 *             "category" : "C2",
 *             "children" :
 *             [
 *               {
 *                 "name"     : "C",
 *                 "category" : "C3",
 *                 "size"     : 1
 *               }
 *               {
 *                 "name"     : "D",
 *                 "category" : "C3",
 *                 "size"     : 1
 *               }
 *             ]
 *           }
 *         ]
 *       }
 *     ]
 *  ]
 * }
 *
 * @param {Object} csv
 */
dex.csv.toHierarchicalJson = function(csv)
{
  var connections = dex.csv.connections(csv);
  return getChildren(connections, 0);

  function getChildren(connections, depth)
  {
    //dex.console.log("connections:", connections, "depth="+depth);
    var kids = [], cname;

    if ( typeof connections === 'undefined')
    {
      return kids;
    }

    for (cname in connections)
    {
      //dex.console.log("CNAME", cname);
      if (connections.hasOwnProperty(cname))
      {
        kids.push(createChild(cname, csv.header[depth],
        	getChildren(connections[cname], depth + 1)));
      }
    }

    return kids;
  }
  
  function createChild(name, category, children)
  {
    var child =
    {
      "name" : name,
      "category" : category,
      "children" : children
    };
    return child;
  }

};

/**
 *
 * Transforms:
 * csv =
 * {
 * 	 header : {C1,C2,C3},
 *   data   : [
 *     [A,B,C],
 *     [A,B,D]
 *   ]
 * }
 * into:
 * connections =
 * { A:{B:{C:{},D:{}}}}
 *
 * @param {Object} csv
 *
 */
dex.csv.connections = function(csv)
{
  var connections =
  {
  };
  var ri;

  for ( ri = 0; ri < csv.data.length; ri++)
  {
    dex.object.connect(connections, csv.data[ri]);
  }

  //dex.console.log("connections:", connections);
  return connections;
};

dex.csv.createRowMap = function(csv, keyIndex)
{
  var map =
  {
  };
  var ri;

  for ( ri = 0; ri < csv.data.length; ri++)
  {
    if (csv.data[ri].length == csv.header.length)
    {
      map[csv.data[ri][keyIndex]] = csv.data[ri];
    }
  }
  return map;
};

dex.csv.columnSlice = function(csv, columns)
{
	csv.header = dex.array.slice(columns);
	csv.data   = dex.matrix.columnSlice(csv.data, columns);

	return csv;
};

dex.csv.getNumericColumnNames = function(csv)
{
  var possibleNumeric =
  {
  };
  var i, j, ri, ci;
  var numericColumns = [];

  for ( i = 0; i < csv.header.length; i++)
  {
    possibleNumeric[csv.header[i]] = true;
  }

  // Iterate thru the data, skip the header.
  for ( ri = 0; ri < csv.data.length; ri++)
  {
    for ( ci = 0; ci < csv.data[ri].length && ci < csv.header.length; ci++)
    {
      if (possibleNumeric[csv.header[ci]] && !dex.object.isNumeric(csv.data[ri][ci]))
      {
        possibleNumeric[csv.header[ci]] = false;
      }
    }
  }

  for ( ci = 0; ci < csv.header.length; ci++)
  {
    if (possibleNumeric[csv.header[ci]])
    {
      numericColumns.push(csv.header[ci]);
    }
  }

  return numericColumns;
};

dex.csv.getNumericIndices = function(csv)
{
  var possibleNumeric =
  {
  };
  var i, j;
  var numericIndices = [];

  for ( i = 0; i < csv.header.length; i++)
  {
    possibleNumeric[csv.header[i]] = true;
  }

  // Iterate thru the data, skip the header.
  for ( i = 1; i < csv.data.length; i++)
  {
    for ( j = 0; j < csv.data[i].length && j < csv.header.length; j++)
    {
      if (possibleNumeric[csv.header[j]] && !dex.object.isNumeric(csv.data[i][j]))
      {
        possibleNumeric[csv.header[j]] = false;
      }
    }
  }

  for ( i = 0; i < csv.header.length; i++)
  {
    if (possibleNumeric[csv.header[i]])
    {
      numericIndices.push(i);
    }
  }

  return numericIndices;
};

dex.csv.isColumnNumeric = function(csv, columnNum)
{
  var i;

  for ( i = 0; i < csv.data.length; i++)
  {
    if (!dex.object.isNumeric(csv.data[i][columnNum]))
    {
      return false;
    }
  }
  return true;
};

// Used to be toMapArray
dex.csv.group = function(csv, columns)
{
	var ri, ci;
	var groups = {};
	var returnGroups = [];
  var values;
  var key;
  var otherColumns;
  var otherHeaders;
  var groupName;
  
  if (arguments < 2)
  {
  	return csv;
  }

  function compare(a,b)
  {
  	var si, h;
  	
  	for (si=0; si<columns.length; si++)
  	{
  		h = csv.header[columns[si]]
  		if (a[h] < b[h])
  		{
  			return -1;
  		}
  		else if (a[h] > b[h])
  		{
  			return 1
  		}
  	}
  	
  	return 0;
  }

  //otherColumns = dex.array.difference(dex.range(0, csv.header.length), columns);
  //otherHeaders = dex.array.slice(csv.header, otherColumns);

	for (ri=0; ri<csv.data.length;ri+=1)
	{
		values = dex.array.slice(csv.data[ri], columns);
		key = values.join(':::');

		if (groups[key])
		{
			group = groups[key];
		}
		else
		{
			//group = { 'csv' : dex.csv.csv(otherHeaders, []) };
			group = { 'csv' : dex.csv.csv(csv.header, []) };
			for (ci=0; ci<values.length; ci++)
			{
				group[csv.header[columns[ci]]] = values[ci];
			}
			groups[key] = group;
		}
		//group.csv.data.push(dex.array.slice(csv.data[ri], otherColumns));
		group.csv.data.push(csv.data[ri]);
    //groups[key] = group;
	}

  for (groupName in groups)
  {
  	if (groups.hasOwnProperty(groupName))
  	{
  		returnGroups.push(groups[groupName]);
  	}
  }
  
  return returnGroups.sort(compare);
};

dex.csv.visitCells = function(csv, func)
{
	var ci, ri;

	for (ri=0; ri<csv.data.length; ri++)
	{
		for (ci=0; ci<csv.header.length; ci++)
		{
			func(ci, ri, csv.data[ri][ci]);
		}
	}
};
