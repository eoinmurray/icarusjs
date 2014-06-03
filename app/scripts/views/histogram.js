/*global icarusjs, Backbone, JST*/

icarusjs.Views.HistogramView = Backbone.View.extend({

    initialize : function(opts){
    	this.IcarusView = opts.IcarusView
    	this.$div = $('.histograms')

		this.model.on('change:histogramHeight', function(){
			if(this.model.get('showHistograms')) this.resize(this.model.get('histogramHeight'))
				this.update()
		}, this)

		this.model.on('change:showHistograms', function(){
			if(this.model.get('showHistograms')){
				this.show()
				this.update()	
			} 
			else this.hide()
		}, this)

		this.model.on('forceUpdate', function(){
			this.update()	
		}, this)


		var _this = this
		setInterval(function(){
			if(_this.model.get('play')) _this.update()
		}, 3000)

		this.model.trigger('forceUpdate')

    },

    resize : function(height){
		this.$div.height(height + '%').show()
		this.IcarusView.$container.height($('body').height() - this.$div.height())
		this.IcarusView.resize()
    },

    hide : function(){
		this.resize(0)
    },

    show : function(e){
		this.resize(this.model.get('histogramHeight'))
    },

    update : function(){
		var _this = this
		_.each(_this.model.PCM.channels, function(channel){
			channel.process(function(){
				if (_this.model.get('showHistograms') == true){
					_this.updateChart(channel)	
				}
			})
		})
    }, 

    updateChart : function(channel){
		d3.select(".chart" + channel.name + ' svg').remove()
		this.addChart(channel)
    },

    addCharts : function(){
		var _this = this
		_.each(_this.model.PCM.channels, function(channel){
			_this.addChart(channel)
		})

		return this;
    },

    addChart : function(channel){
		var svg = d3.select(".chart" + channel.name).append("svg")
		var width = $('body').width()*0.25;
		var height = $('body').height()*this.model.get('histogramHeight')/100;
        
        svg
            .append('g')
            .attr("width", width)
            .attr("height", height);

		var len = channel.bins.length;
		var arr = []
		
		for(var i = 10; i < len-20; i++){
			var x = channel.bins[i]
			var y = channel.counts[i]

			arr.push([x, y])
		}

		var chart = new LineChart({
		    'parent' : svg,
		    'csv'    :{
				'header' : [ "time(ns)", "counts" ],
				'labels' : [ "time(ns)", "counts" ],
				'data'   : arr
		    },
		    'width' : width*0.9,
		    'height' : height*0.7,
	        'xoffset' : 30,
    		'yoffset' : 0,
		    'xaxis' : {
				'label' : {
					'anchor' : 'end',
					'color'  : 'black',
					'dy'     : '.71em',
					'font'   : {
						'family'  : 'sans-serif',
						'size'    : 12,
						'style'   : 'normal',
						'variant' : 'normal',
						'weight'  : 'normal'
					},
					'text' : channel.name + "- time(ns)",
					'transform' : "",
					'x' : 190,
					'y' : 25
				},
				'orient' : 'bottom',
				'tick' : {
					'count' : 10,
					'format' : d3.format(',d'),
					'subdivide' : 5,
					'padding' : 5,
					'size' : {
						'major' : 5,
						'minor' : 3,
						'end' : 5
					},
					'label'  : {
						'anchor' : 'end',
						'color'  : 'black',
						'dy'     : '.71em',
						'font'   : {
							'family'  : 'sans-serif',
							'size'    : 10,
							'style'   : 'normal',
							'variant' : 'normal',
							'weight'  : 'normal'
						},
						'transform' : "",
						'x' : 8,
						'y' : 10
					}
				}
			},
			'yaxis' : {
				'label' : {
					'anchor' : 'end',
					'color'  : 'black',
					'dy'     : '.71em',
					'font'   : {
						'family'  : 'sans-serif',
						'size'    : 10,
						'style'   : 'normal',
						'variant' : 'normal',
						'weight'  : 'normal'
					},
					'text' : "",
					'transform' : "rotate(-90deg)",
					'x' : 20,
					'y' : -15
				},
				'orient' : 'left',
				'tick' : {
					'count' : 5,
					'format' : d3.format(',d'),
					'subdivide' : 3,
					'padding' : 5,
					'size' :{
					'major' : 5,
					'minor' : 3,
					'end' : 5
					},
					'label'  : {
						'anchor' : 'end',
						'color'  : 'black',
						'dy'     : '.71em',
						'font'   :
							{
								'family'  : 'sans-serif',
								'size'    : 10,
								'style'   : 'normal',
								'variant' : 'normal',
								'weight'  : 'normal'
							},
						'transform' : "",
						'x' : -10,
						'y' : 0
					}
				}
			}

		});

		chart.render();

		channel.chart = chart
    },

});
