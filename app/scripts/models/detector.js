/*global icarusjs, Backbone*/

icarusjs.Models.DetectorModel = Backbone.Model.extend({
	
	initialize : function(opts){
		this.delay = opts.delay || 0;
		this.time_tags = []		
		this.lastT = 0
	},

	hit : function(t, lifetime){
		if(t !== this.lastT)
			this.time_tags.push(t + lifetime + this.delay)
		this.lastT = t
	},

	reset : function(){
		this.time_tags = []
	},

	times : function(){
		return this.time_tags

	}

});
