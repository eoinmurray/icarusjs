/*global icarusjs, Backbone, JST*/

icarusjs.Views.DatGuiView = Backbone.View.extend({

	initialize:function(){
		var _this = this

		var gui = new dat.GUI({
			autoPlace: false,
			height : 5 * 32 - 1
		});

		var customContainer = document.getElementById('my-gui-container');
		customContainer.appendChild(gui.domElement);


		var params = this.model.toJSON()
		var qdParams = this.model.QuantumDot.toJSON()

		gui.add(qdParams, 'hwp1').min(0.0).max(360).step(0.1).onFinishChange(function(){
			_this.model.QuantumDot.set({'hwp1' : qdParams.hwp1})
		})

		gui.add(qdParams, 'hwp2').min(0.0).max(360).step(0.1).onFinishChange(function(){
			_this.model.QuantumDot.set({'hwp2' : qdParams.hwp2})
		})

		gui.add(qdParams, 'qwp1').min(0.0).max(360).step(0.1).onFinishChange(function(){
			_this.model.QuantumDot.set({'qwp1' : qdParams.qwp1})
		})

		gui.add(qdParams, 'qwp2').min(0.0).max(360).step(0.1).onFinishChange(function(){
			_this.model.QuantumDot.set({'qwp2' : qdParams.qwp2})
		})

		gui.add(qdParams, 'QWPon').onFinishChange(function(){
			_this.model.QuantumDot.set({'QWPon' : qdParams.QWPon})
		})

		gui.add(qdParams, 'HWPon').onFinishChange(function(){
			_this.model.QuantumDot.set({'HWPon' : qdParams.HWPon})
		})

		gui.add(params, 'showHistograms').onFinishChange(function(){
    		_this.model.set({'showHistograms' : params.showHistograms})
		})

		gui.add(qdParams, 'state', [ 'HH+VV', 'HH-VV', 'HV+VH', 'HV-VH' ]).onFinishChange(function(){

			console.log(qdParams.state)

			if (qdParams.state === "HH+VV") _this.model.QuantumDot.set({'state' : 'hhvvp'})
			if (qdParams.state === "HH-VV") _this.model.QuantumDot.set({'state' : 'hhvvm'})
			if (qdParams.state === "HV+VH") _this.model.QuantumDot.set({'state' : 'hvvhp'})
			if (qdParams.state === "HV-VH") _this.model.QuantumDot.set({'state' : 'hvvhm'})

		})

		gui.add(params, 'speed').min(0.0).max(100).step(1).onFinishChange(function(){
    		_this.model.set({'speed' : params.speed})
		})

		gui.add(params, 'play').onFinishChange(function(){
    		_this.model.set({'play' : params.play})
		}).listen()

		var self = this;
		params.ClearCounts = function(){
			self.model.clearCounts()
			self.model.trigger('forceUpdate')
		}

		// window.onblur = function(event) {
  //       	params.play = false;
  //       	self.model.set({'play' : false})
  //     	}


		gui.add(params, 'ClearCounts');


	}

});
