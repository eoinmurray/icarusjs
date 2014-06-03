/*global icarusjs, Backbone*/

icarusjs.Models.ChannelModel = Backbone.Model.extend({
	
	initialize : function(opts){
		this.detector1 = opts.detector1
		this.detector2 = opts.detector2
		this.name = opts.name

		this.starts = []
		this.stops = []
		this.initializeBins()

	},

	initializeBins : function(){
		var numBins = Math.floor(400/(50*27./1000.))
		this.bins = numeric.linspace(0.04, 400, numBins)
		this.counts = Array.apply(null, new Array(numBins)).map(Number.prototype.valueOf,0);
	},

	resetCounts : function(){
		var numBins = Math.floor(400/(50*27./1000.))
		this.counts = Array.apply(null, new Array(numBins)).map(Number.prototype.valueOf,0);	
	},

	corrolate : function(data){
		var x = data[0],
			y = data[1],
			bins = data[2],
			len = x.length,
			arr = []

		for(var i = 0; i < len; i ++){
			var stop = y[i]
			for(var j = 0; j < len; j ++){
				arr.push(stop - x[j])
			}
		}

		return histogram({
			data : arr,
			i : bins.length,
			bins : bins
		})
	},

	process : function(cb){
		this.starts = this.detector1.time_tags
		this.stops = this.detector2.time_tags
		
		var _this = this,
			arr1 = this.starts,
			arr2 = this.stops,
			arr3 = this.bins;
		var start_stops = [].concat([arr1], [arr2], [arr3])

		var p = new Parallel(start_stops)
		p.require(histogram).spawn(this.corrolate).then(function(data){
			for(var i = 0; i < data.length; i ++){
				_this.bins[i] = data[i].x
				_this.counts[i] += data[i].y
			}

			_this.starts = []
			_this.stops = []
			_this.detector1.time_tags = []
			_this.detector2.time_tags = []
			cb()
		});

		return _this.counts
	}
});
