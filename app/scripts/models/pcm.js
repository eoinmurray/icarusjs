/*global icarusjs, Backbone*/

icarusjs.Models.PcmModel = Backbone.Model.extend({

	initialize : function(){
		this.channels = {}
		this.detectors = {}

		this.detectors.D1 = new icarusjs.Models.DetectorModel({delay : 180})
		this.detectors.D2 = new icarusjs.Models.DetectorModel({delay : 180})
		this.detectors.D3 = new icarusjs.Models.DetectorModel({delay : 0})
		this.detectors.D4 = new icarusjs.Models.DetectorModel({delay : 0})

		this.channels.D1D3 = new icarusjs.Models.ChannelModel({
			detector1 : this.detectors.D3,
			detector2 : this.detectors.D1,
			name : 'D1D3'
		})

		this.channels.D1D4 = new icarusjs.Models.ChannelModel({
			detector1 : this.detectors.D4,
			detector2 : this.detectors.D1,
			name : 'D1D4'
		})

		this.channels.D2D3 = new icarusjs.Models.ChannelModel({
			detector1 : this.detectors.D3,
			detector2 : this.detectors.D2,
			name : 'D2D3'
		})

		this.channels.D2D4 = new icarusjs.Models.ChannelModel({
			detector1 : this.detectors.D4,
			detector2 : this.detectors.D2,
			name : 'D2D4'
		})

	},

});
