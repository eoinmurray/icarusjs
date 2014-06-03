/*global icarusjs, Backbone*/

icarusjs.Models.IcarusModel = Backbone.Model.extend({

	defaults : {
		'speed' : 1,
		'chartTick' : 1000,
		'play' : true,
		'histogramHeight' : 20,
		'showHistograms' : false,
		'state' : 'hhvvp'
	},

	initialize : function(){
		this.QuantumDot = new icarusjs.Models.QuantumDotModel()
		this.PCM = new icarusjs.Models.PcmModel({})
	},

	clearCounts : function(){
		var self = this;
		_.each(self.PCM.channels, function(channel){
			console.log(channel.name)
			channel.resetCounts()
		})
	}

});
