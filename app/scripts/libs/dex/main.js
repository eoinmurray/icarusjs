var dex =
{
  'version' : "0.6"
};

dex.range = function(start, len)
{
	var i;
	var range = [];
	var end = start + len;

	for (i=start; i<end; i++)
	{
		range.push(i);
	}
	
	return range;
};
