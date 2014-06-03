/*global icarusjs, $*/

window.numeric = {}
numeric.linspace = function linspace(a,b,n) {
    if(typeof n === "undefined") n = Math.max(Math.round(b-a)+1,1);
    if(n<2) { return n===1?[a]:[]; }
    var i,ret = Array(n);
    n--;
    for(i=n;i>=0;i--) { ret[i] = (i*b+(n-i)*a)/n; }
    return ret;
}

window.loadingClass = {}

_.extend(loadingClass, Backbone.Events)

loadingClass.isDone = false

loadingClass.x = 0

loadingClass.tick = function(x){
    loadingClass.x += 0.25
    NProgress.set(loadingClass.x)
    if(loadingClass.x >= 1.){
        NProgress.done()
    }
}

loadingClass.done = function(){
    NProgress.set(1.0)
    NProgress.done()
    loadingClass.isDone = true
}


window.icarusjs = {
    Models: {},
    Collections: {},
    Views: {},
    Routers: {},
    init: function () {
        'use strict';
        icarusjs.model = new icarusjs.Models.IcarusModel();

        icarusjs.view = new icarusjs.Views.IcarusView({
            model : icarusjs.model
        })

        icarusjs.datGuiView = new icarusjs.Views.DatGuiView({
            model : icarusjs.model
        })

        icarusjs.histogramView = new icarusjs.Views.HistogramView({
            IcarusView : icarusjs.view,
            model : icarusjs.model,
            el : '.container'
        })
    }
};

$(document).ready(function () {
    'use strict';


    $('.headline-center').delay(500).animate({ opacity: 1 }, 700)
    $('.documentation').delay(500).animate({ opacity: 1 }, 700)


    if ( Detector.webgl ){
        icarusjs.init();
    }

    function start(){
        $('.headline-container').fadeOut('fast')
        icarusjs.view.start()
    }

    $('.start').click(function(e){
        start()
    })

    if ( ! Detector.webgl ){
        $('.start').addClass('disabled').hide()
        $('.error').removeClass('hide')
    }



});

/*global icarusjs, Backbone*/

icarusjs.Models.QuantumDotModel = Backbone.Model.extend({

	defaults : {
		'xtau' : 1,
		'xxtau' : 1,
		'crosstau' : 1000000000,
		'power' : 100,
		'FSS' : 0.*math.pow(10, -6),
		'hwp1' : (0)*math.pi,
		'hwp2' : (0)*math.pi,
		'qwp1' : 45,
		'qwp2' : 45,
		'QWPon' : false,
		'HWPon' : false,
		'state' : 'hhvvp',
		'noWrongSpectrometerPath' : true
 	},

	initialize : function(){},

	generate_lifetimes : function(){
		this.xlifetime = this.exponentialDistribution(this.get('xtau'))
		return [this.xlifetime, this.xlifetime/2]
	},

	exponentialDistribution : function(tau){
		return  - tau*math.log(math.random())
	},

	calculatePhase : function( t, FSS, curve_phase){

		var hbar = 6.56 * math.pow(10, -16)

		var float_num = FSS*t*math.pow(10, -9)

		var complex = new math.complex(0, 1)

		complex = math.multiply(complex, float_num)
		complex = math.add(complex, curve_phase)
		complex = math.divide(complex, hbar)

		return math.exp(complex)
	},

	generatePhase : function(){


		var t = numeric.linspace(0, this.xlifetime, 100)
		var sin = []
		var curve_phase = 0
		var dephasing_event = this.exponentialDistribution(this.get('crosstau'))

		var i = 0;
		while (i < 100){
			p = this.calculatePhase(t[i], this.get('FSS'), curve_phase)
			sin.push(p)
			if (t[i] > dephasing_event){
				if (dephasing_event < this.xlifetime){
					curve_phase = Math.random()*1e-9
					dephasing_event += this.exponentialDistribution(this.get('crosstau'))
				}
			}
		i = i+1

		}

		phase = sin.slice(-1)[0]

		return phase
	},

	xProbability : function(){
		return 1 - Math.exp(- this.get('power'))
	},

	xxProbability : function(){
		return 1 - (1+ this.get('power'))*Math.exp(- this.get('power'))
	},

	xEmission : function( ){
		boole = (Math.random() < this.xProbability())
		return boole
	},

	xxEmission : function(){
		boole = (Math.random() < this.xxProbability())
		return boole
	},


	Emission : function(){
		if (this.xxEmission())
			return [true, true]
		else if (this.xEmission())
			return [false, true]
		else
			return [false, false]
	},

	pathProbabilities : {

		evalExpression : function(state, name, phi, hwp1, hwp2, qwp1, qwp2){

			var expression = this[state][name]

			hwp1 = hwp1*Math.PI/180
			hwp2 = hwp2*Math.PI/180;
			qwp1 = qwp1*Math.PI/180;
			qwp2 = qwp2*Math.PI/180;

			expression = expression.replace(new RegExp('Abs', 'g'), 'pow(abs')

			expression = expression.replace('**2', ',2)')

			expression = expression.replace(new RegExp('phi', 'g'), '(' + phi.toString() + ')')

			expression = expression.replace(new RegExp('I', 'g'), 'i');

			expression = expression.replace(new RegExp('hwp1', 'g'), hwp1.toString());
			expression = expression.replace(new RegExp('hwp2', 'g'), hwp2.toString());
			expression = expression.replace(new RegExp('qwp1', 'g'), qwp1.toString());
			expression = expression.replace(new RegExp('qwp2', 'g'), qwp2.toString());

			return math.eval(expression)
		},


		hhvvp : {

			d1d3Both : '4*Abs(0.25*sqrt(2)*I*(0.5*(I*cos(2*qwp1) + 1.0)*(I*cos(2*qwp2) + 1.0)*sin(2*hwp1)*sin(2*hwp2) - 0.5*I*(I*cos(2*qwp1) + 1.0)*sin(2*hwp1)*sin(2*qwp2)*cos(2*hwp2) - 0.5*I*(I*cos(2*qwp2) + 1.0)*sin(2*hwp2)*sin(2*qwp1)*cos(2*hwp1) - 0.5*sin(2*qwp1)*sin(2*qwp2)*cos(2*hwp1)*cos(2*hwp2)) + 0.25*sqrt(2)*I*(0.5*(I*cos(2*qwp1) + 1.0)*(I*cos(2*qwp2) + 1.0)*cos(2*hwp1)*cos(2*hwp2) + 0.5*I*(I*cos(2*qwp1) + 1.0)*sin(2*hwp2)*sin(2*qwp2)*cos(2*hwp1) + 0.5*I*(I*cos(2*qwp2) + 1.0)*sin(2*hwp1)*sin(2*qwp1)*cos(2*hwp2) - 0.5*sin(2*hwp1)*sin(2*hwp2)*sin(2*qwp1)*sin(2*qwp2)))**2'

			,d1d4Both : '4*Abs(0.25*sqrt(2)*I*(-0.5*(I*cos(2*qwp1) + 1.0)*(-I*cos(2*qwp2) + 1.0)*sin(2*hwp1)*cos(2*hwp2) + 0.5*I*(I*cos(2*qwp1) + 1.0)*sin(2*hwp1)*sin(2*hwp2)*sin(2*qwp2) + 0.5*I*(-I*cos(2*qwp2) + 1.0)*sin(2*qwp1)*cos(2*hwp1)*cos(2*hwp2) + 0.5*sin(2*hwp2)*sin(2*qwp1)*sin(2*qwp2)*cos(2*hwp1)) + 0.25*sqrt(2)*I*(0.5*(I*cos(2*qwp1) + 1.0)*(-I*cos(2*qwp2) + 1.0)*sin(2*hwp2)*cos(2*hwp1) + 0.5*I*(I*cos(2*qwp1) + 1.0)*sin(2*qwp2)*cos(2*hwp1)*cos(2*hwp2) + 0.5*I*(-I*cos(2*qwp2) + 1.0)*sin(2*hwp1)*sin(2*hwp2)*sin(2*qwp1) - 0.5*sin(2*hwp1)*sin(2*qwp1)*sin(2*qwp2)*cos(2*hwp2)))**2'

			,d2d3Both : '4*Abs(0.25*sqrt(2)*I*(0.5*(-I*cos(2*qwp1) + 1.0)*(I*cos(2*qwp2) + 1.0)*sin(2*hwp1)*cos(2*hwp2) + 0.5*I*(-I*cos(2*qwp1) + 1.0)*sin(2*hwp1)*sin(2*hwp2)*sin(2*qwp2) + 0.5*I*(I*cos(2*qwp2) + 1.0)*sin(2*qwp1)*cos(2*hwp1)*cos(2*hwp2) - 0.5*sin(2*hwp2)*sin(2*qwp1)*sin(2*qwp2)*cos(2*hwp1)) + 0.25*sqrt(2)*I*(-0.5*(-I*cos(2*qwp1) + 1.0)*(I*cos(2*qwp2) + 1.0)*sin(2*hwp2)*cos(2*hwp1) + 0.5*I*(-I*cos(2*qwp1) + 1.0)*sin(2*qwp2)*cos(2*hwp1)*cos(2*hwp2) + 0.5*I*(I*cos(2*qwp2) + 1.0)*sin(2*hwp1)*sin(2*hwp2)*sin(2*qwp1) + 0.5*sin(2*hwp1)*sin(2*qwp1)*sin(2*qwp2)*cos(2*hwp2)))**2'

			,d2d4Both : '4*Abs(0.25*sqrt(2)*I*(0.5*(-I*cos(2*qwp1) + 1.0)*(-I*cos(2*qwp2) + 1.0)*sin(2*hwp1)*sin(2*hwp2) + 0.5*I*(-I*cos(2*qwp1) + 1.0)*sin(2*hwp1)*sin(2*qwp2)*cos(2*hwp2) + 0.5*I*(-I*cos(2*qwp2) + 1.0)*sin(2*hwp2)*sin(2*qwp1)*cos(2*hwp1) - 0.5*sin(2*qwp1)*sin(2*qwp2)*cos(2*hwp1)*cos(2*hwp2)) + 0.25*sqrt(2)*I*(0.5*(-I*cos(2*qwp1) + 1.0)*(-I*cos(2*qwp2) + 1.0)*cos(2*hwp1)*cos(2*hwp2) - 0.5*I*(-I*cos(2*qwp1) + 1.0)*sin(2*hwp2)*sin(2*qwp2)*cos(2*hwp1) - 0.5*I*(-I*cos(2*qwp2) + 1.0)*sin(2*hwp1)*sin(2*qwp1)*cos(2*hwp2) - 0.5*sin(2*hwp1)*sin(2*hwp2)*sin(2*qwp1)*sin(2*qwp2)))**2'

			,d1d3HWPOnly : '4*Abs(0.25*sqrt(2)*I*sin(2*hwp1)*sin(2*hwp2) + 0.25*sqrt(2)*I*cos(2*hwp1)*cos(2*hwp2))**2'

			,d1d4HWPOnly : '4*Abs(-0.25*sqrt(2)*I*sin(2*hwp1)*cos(2*hwp2) + 0.25*sqrt(2)*I*sin(2*hwp2)*cos(2*hwp1))**2'

			,d2d3HWPOnly : '4*Abs(0.25*sqrt(2)*I*sin(2*hwp1)*cos(2*hwp2) - 0.25*sqrt(2)*I*sin(2*hwp2)*cos(2*hwp1))**2'

			,d2d4HWPOnly : '4*Abs(0.25*sqrt(2)*I*sin(2*hwp1)*sin(2*hwp2) + 0.25*sqrt(2)*I*cos(2*hwp1)*cos(2*hwp2))**2'

			,d1d3QWPOnly : '4*Abs(0.125*sqrt(2)*I*(I*cos(2*qwp1) + 1.0)*(I*cos(2*qwp2) + 1.0) - 0.125*sqrt(2)*I*sin(2*qwp1)*sin(2*qwp2))**2'

			,d1d4QWPOnly : '4*Abs(-0.125*sqrt(2)*(I*cos(2*qwp1) + 1.0)*sin(2*qwp2) - 0.125*sqrt(2)*(-I*cos(2*qwp2) + 1.0)*sin(2*qwp1))**2'

			,d2d3QWPOnly : '4*Abs(-0.125*sqrt(2)*(-I*cos(2*qwp1) + 1.0)*sin(2*qwp2) - 0.125*sqrt(2)*(I*cos(2*qwp2) + 1.0)*sin(2*qwp1))**2'

			,d2d4QWPOnly : '4*Abs(0.125*sqrt(2)*I*(-I*cos(2*qwp1) + 1.0)*(-I*cos(2*qwp2) + 1.0) - 0.125*sqrt(2)*I*sin(2*qwp1)*sin(2*qwp2))**2'
		},

		hhvvm : {

			d1d3Both : '4*Abs(-0.25*sqrt(2)*I*(0.5*(I*cos(2*qwp1) + 1.0)*(I*cos(2*qwp2) + 1.0)*sin(2*hwp1)*sin(2*hwp2) - 0.5*I*(I*cos(2*qwp1) + 1.0)*sin(2*hwp1)*sin(2*qwp2)*cos(2*hwp2) - 0.5*I*(I*cos(2*qwp2) + 1.0)*sin(2*hwp2)*sin(2*qwp1)*cos(2*hwp1) - 0.5*sin(2*qwp1)*sin(2*qwp2)*cos(2*hwp1)*cos(2*hwp2)) + 0.25*sqrt(2)*I*(0.5*(I*cos(2*qwp1) + 1.0)*(I*cos(2*qwp2) + 1.0)*cos(2*hwp1)*cos(2*hwp2) + 0.5*I*(I*cos(2*qwp1) + 1.0)*sin(2*hwp2)*sin(2*qwp2)*cos(2*hwp1) + 0.5*I*(I*cos(2*qwp2) + 1.0)*sin(2*hwp1)*sin(2*qwp1)*cos(2*hwp2) - 0.5*sin(2*hwp1)*sin(2*hwp2)*sin(2*qwp1)*sin(2*qwp2)))**2'

			,d1d4Both : '4*Abs(-0.25*sqrt(2)*I*(-0.5*(I*cos(2*qwp1) + 1.0)*(-I*cos(2*qwp2) + 1.0)*sin(2*hwp1)*cos(2*hwp2) + 0.5*I*(I*cos(2*qwp1) + 1.0)*sin(2*hwp1)*sin(2*hwp2)*sin(2*qwp2) + 0.5*I*(-I*cos(2*qwp2) + 1.0)*sin(2*qwp1)*cos(2*hwp1)*cos(2*hwp2) + 0.5*sin(2*hwp2)*sin(2*qwp1)*sin(2*qwp2)*cos(2*hwp1)) + 0.25*sqrt(2)*I*(0.5*(I*cos(2*qwp1) + 1.0)*(-I*cos(2*qwp2) + 1.0)*sin(2*hwp2)*cos(2*hwp1) + 0.5*I*(I*cos(2*qwp1) + 1.0)*sin(2*qwp2)*cos(2*hwp1)*cos(2*hwp2) + 0.5*I*(-I*cos(2*qwp2) + 1.0)*sin(2*hwp1)*sin(2*hwp2)*sin(2*qwp1) - 0.5*sin(2*hwp1)*sin(2*qwp1)*sin(2*qwp2)*cos(2*hwp2)))**2'

			,d2d3Both : '4*Abs(0.25*sqrt(2)*I*(0.5*(-I*cos(2*qwp1) + 1.0)*(I*cos(2*qwp2) + 1.0)*sin(2*hwp1)*cos(2*hwp2) + 0.5*I*(-I*cos(2*qwp1) + 1.0)*sin(2*hwp1)*sin(2*hwp2)*sin(2*qwp2) + 0.5*I*(I*cos(2*qwp2) + 1.0)*sin(2*qwp1)*cos(2*hwp1)*cos(2*hwp2) - 0.5*sin(2*hwp2)*sin(2*qwp1)*sin(2*qwp2)*cos(2*hwp1)) - 0.25*sqrt(2)*I*(-0.5*(-I*cos(2*qwp1) + 1.0)*(I*cos(2*qwp2) + 1.0)*sin(2*hwp2)*cos(2*hwp1) + 0.5*I*(-I*cos(2*qwp1) + 1.0)*sin(2*qwp2)*cos(2*hwp1)*cos(2*hwp2) + 0.5*I*(I*cos(2*qwp2) + 1.0)*sin(2*hwp1)*sin(2*hwp2)*sin(2*qwp1) + 0.5*sin(2*hwp1)*sin(2*qwp1)*sin(2*qwp2)*cos(2*hwp2)))**2'

			,d2d4Both : '4*Abs(0.25*sqrt(2)*I*(0.5*(-I*cos(2*qwp1) + 1.0)*(-I*cos(2*qwp2) + 1.0)*sin(2*hwp1)*sin(2*hwp2) + 0.5*I*(-I*cos(2*qwp1) + 1.0)*sin(2*hwp1)*sin(2*qwp2)*cos(2*hwp2) + 0.5*I*(-I*cos(2*qwp2) + 1.0)*sin(2*hwp2)*sin(2*qwp1)*cos(2*hwp1) - 0.5*sin(2*qwp1)*sin(2*qwp2)*cos(2*hwp1)*cos(2*hwp2)) - 0.25*sqrt(2)*I*(0.5*(-I*cos(2*qwp1) + 1.0)*(-I*cos(2*qwp2) + 1.0)*cos(2*hwp1)*cos(2*hwp2) - 0.5*I*(-I*cos(2*qwp1) + 1.0)*sin(2*hwp2)*sin(2*qwp2)*cos(2*hwp1) - 0.5*I*(-I*cos(2*qwp2) + 1.0)*sin(2*hwp1)*sin(2*qwp1)*cos(2*hwp2) - 0.5*sin(2*hwp1)*sin(2*hwp2)*sin(2*qwp1)*sin(2*qwp2)))**2'

			,d1d3HWPOnly : '4*Abs(-0.25*sqrt(2)*I*sin(2*hwp1)*sin(2*hwp2) + 0.25*sqrt(2)*I*cos(2*hwp1)*cos(2*hwp2))**2'

			,d1d4HWPOnly : '4*Abs(0.25*sqrt(2)*I*sin(2*hwp1)*cos(2*hwp2) + 0.25*sqrt(2)*I*sin(2*hwp2)*cos(2*hwp1))**2'

			,d2d3HWPOnly : '4*Abs(0.25*sqrt(2)*I*sin(2*hwp1)*cos(2*hwp2) + 0.25*sqrt(2)*I*sin(2*hwp2)*cos(2*hwp1))**2'

			,d2d4HWPOnly : '4*Abs(0.25*sqrt(2)*I*sin(2*hwp1)*sin(2*hwp2) - 0.25*sqrt(2)*I*cos(2*hwp1)*cos(2*hwp2))**2'

			,d1d3QWPOnly : '4*Abs(0.125*sqrt(2)*I*(I*cos(2*qwp1) + 1.0)*(I*cos(2*qwp2) + 1.0) + 0.125*sqrt(2)*I*sin(2*qwp1)*sin(2*qwp2))**2'

			,d1d4QWPOnly : '4*Abs(-0.125*sqrt(2)*(I*cos(2*qwp1) + 1.0)*sin(2*qwp2) + 0.125*sqrt(2)*(-I*cos(2*qwp2) + 1.0)*sin(2*qwp1))**2'

			,d2d3QWPOnly : '4*Abs(0.125*sqrt(2)*(-I*cos(2*qwp1) + 1.0)*sin(2*qwp2) - 0.125*sqrt(2)*(I*cos(2*qwp2) + 1.0)*sin(2*qwp1))**2'

			,d2d4QWPOnly : '4*Abs(-0.125*sqrt(2)*I*(-I*cos(2*qwp1) + 1.0)*(-I*cos(2*qwp2) + 1.0) - 0.125*sqrt(2)*I*sin(2*qwp1)*sin(2*qwp2))**2'
		},

		hvvhp : {

			d1d3Both : '4*Abs(0.25*sqrt(2)*I*(0.5*(I*cos(2*qwp1) + 1.0)*(I*cos(2*qwp2) + 1.0)*sin(2*hwp1)*cos(2*hwp2) + 0.5*I*(I*cos(2*qwp1) + 1.0)*sin(2*hwp1)*sin(2*hwp2)*sin(2*qwp2) - 0.5*I*(I*cos(2*qwp2) + 1.0)*sin(2*qwp1)*cos(2*hwp1)*cos(2*hwp2) + 0.5*sin(2*hwp2)*sin(2*qwp1)*sin(2*qwp2)*cos(2*hwp1)) + 0.25*sqrt(2)*I*(0.5*(I*cos(2*qwp1) + 1.0)*(I*cos(2*qwp2) + 1.0)*sin(2*hwp2)*cos(2*hwp1) - 0.5*I*(I*cos(2*qwp1) + 1.0)*sin(2*qwp2)*cos(2*hwp1)*cos(2*hwp2) + 0.5*I*(I*cos(2*qwp2) + 1.0)*sin(2*hwp1)*sin(2*hwp2)*sin(2*qwp1) + 0.5*sin(2*hwp1)*sin(2*qwp1)*sin(2*qwp2)*cos(2*hwp2)))**2'

			,d1d4Both : '4*Abs(0.25*sqrt(2)*I*(0.5*(I*cos(2*qwp1) + 1.0)*(-I*cos(2*qwp2) + 1.0)*sin(2*hwp1)*sin(2*hwp2) + 0.5*I*(I*cos(2*qwp1) + 1.0)*sin(2*hwp1)*sin(2*qwp2)*cos(2*hwp2) - 0.5*I*(-I*cos(2*qwp2) + 1.0)*sin(2*hwp2)*sin(2*qwp1)*cos(2*hwp1) + 0.5*sin(2*qwp1)*sin(2*qwp2)*cos(2*hwp1)*cos(2*hwp2)) + 0.25*sqrt(2)*I*(-0.5*(I*cos(2*qwp1) + 1.0)*(-I*cos(2*qwp2) + 1.0)*cos(2*hwp1)*cos(2*hwp2) + 0.5*I*(I*cos(2*qwp1) + 1.0)*sin(2*hwp2)*sin(2*qwp2)*cos(2*hwp1) - 0.5*I*(-I*cos(2*qwp2) + 1.0)*sin(2*hwp1)*sin(2*qwp1)*cos(2*hwp2) - 0.5*sin(2*hwp1)*sin(2*hwp2)*sin(2*qwp1)*sin(2*qwp2)))**2'

			,d2d3Both : '4*Abs(0.25*sqrt(2)*I*(0.5*(-I*cos(2*qwp1) + 1.0)*(I*cos(2*qwp2) + 1.0)*sin(2*hwp1)*sin(2*hwp2) - 0.5*I*(-I*cos(2*qwp1) + 1.0)*sin(2*hwp1)*sin(2*qwp2)*cos(2*hwp2) + 0.5*I*(I*cos(2*qwp2) + 1.0)*sin(2*hwp2)*sin(2*qwp1)*cos(2*hwp1) + 0.5*sin(2*qwp1)*sin(2*qwp2)*cos(2*hwp1)*cos(2*hwp2)) + 0.25*sqrt(2)*I*(-0.5*(-I*cos(2*qwp1) + 1.0)*(I*cos(2*qwp2) + 1.0)*cos(2*hwp1)*cos(2*hwp2) - 0.5*I*(-I*cos(2*qwp1) + 1.0)*sin(2*hwp2)*sin(2*qwp2)*cos(2*hwp1) + 0.5*I*(I*cos(2*qwp2) + 1.0)*sin(2*hwp1)*sin(2*qwp1)*cos(2*hwp2) - 0.5*sin(2*hwp1)*sin(2*hwp2)*sin(2*qwp1)*sin(2*qwp2)))**2'

			,d2d4Both : '4*Abs(0.25*sqrt(2)*I*(-0.5*(-I*cos(2*qwp1) + 1.0)*(-I*cos(2*qwp2) + 1.0)*sin(2*hwp1)*cos(2*hwp2) + 0.5*I*(-I*cos(2*qwp1) + 1.0)*sin(2*hwp1)*sin(2*hwp2)*sin(2*qwp2) - 0.5*I*(-I*cos(2*qwp2) + 1.0)*sin(2*qwp1)*cos(2*hwp1)*cos(2*hwp2) - 0.5*sin(2*hwp2)*sin(2*qwp1)*sin(2*qwp2)*cos(2*hwp1)) + 0.25*sqrt(2)*I*(-0.5*(-I*cos(2*qwp1) + 1.0)*(-I*cos(2*qwp2) + 1.0)*sin(2*hwp2)*cos(2*hwp1) - 0.5*I*(-I*cos(2*qwp1) + 1.0)*sin(2*qwp2)*cos(2*hwp1)*cos(2*hwp2) + 0.5*I*(-I*cos(2*qwp2) + 1.0)*sin(2*hwp1)*sin(2*hwp2)*sin(2*qwp1) - 0.5*sin(2*hwp1)*sin(2*qwp1)*sin(2*qwp2)*cos(2*hwp2)))**2'

			,d1d3HWPOnly : '4*Abs(0.25*sqrt(2)*I*sin(2*hwp1)*cos(2*hwp2) + 0.25*sqrt(2)*I*sin(2*hwp2)*cos(2*hwp1))**2'

			,d1d4HWPOnly : '4*Abs(0.25*sqrt(2)*I*sin(2*hwp1)*sin(2*hwp2) - 0.25*sqrt(2)*I*cos(2*hwp1)*cos(2*hwp2))**2'

			,d2d3HWPOnly : '4*Abs(0.25*sqrt(2)*I*sin(2*hwp1)*sin(2*hwp2) - 0.25*sqrt(2)*I*cos(2*hwp1)*cos(2*hwp2))**2'

			,d2d4HWPOnly : '4*Abs(-0.25*sqrt(2)*I*sin(2*hwp1)*cos(2*hwp2) - 0.25*sqrt(2)*I*sin(2*hwp2)*cos(2*hwp1))**2'

			,d1d3QWPOnly : '4*Abs(-0.125*sqrt(2)*(I*cos(2*qwp1) + 1.0)*sin(2*qwp2) - 0.125*sqrt(2)*(I*cos(2*qwp2) + 1.0)*sin(2*qwp1))**2'

			,d1d4QWPOnly : '4*Abs(0.125*sqrt(2)*I*(I*cos(2*qwp1) + 1.0)*(-I*cos(2*qwp2) + 1.0) - 0.125*sqrt(2)*I*sin(2*qwp1)*sin(2*qwp2))**2'

			,d2d3QWPOnly : '4*Abs(0.125*sqrt(2)*I*(-I*cos(2*qwp1) + 1.0)*(I*cos(2*qwp2) + 1.0) - 0.125*sqrt(2)*I*sin(2*qwp1)*sin(2*qwp2))**2'

			,d2d4QWPOnly : '4*Abs(-0.125*sqrt(2)*(-I*cos(2*qwp1) + 1.0)*sin(2*qwp2) - 0.125*sqrt(2)*(-I*cos(2*qwp2) + 1.0)*sin(2*qwp1))**2'
		},

		hvvhm : {

			d1d3Both : '4*Abs(-0.25*sqrt(2)*I*(0.5*(I*cos(2*qwp1) + 1.0)*(I*cos(2*qwp2) + 1.0)*sin(2*hwp1)*cos(2*hwp2) + 0.5*I*(I*cos(2*qwp1) + 1.0)*sin(2*hwp1)*sin(2*hwp2)*sin(2*qwp2) - 0.5*I*(I*cos(2*qwp2) + 1.0)*sin(2*qwp1)*cos(2*hwp1)*cos(2*hwp2) + 0.5*sin(2*hwp2)*sin(2*qwp1)*sin(2*qwp2)*cos(2*hwp1)) + 0.25*sqrt(2)*I*(0.5*(I*cos(2*qwp1) + 1.0)*(I*cos(2*qwp2) + 1.0)*sin(2*hwp2)*cos(2*hwp1) - 0.5*I*(I*cos(2*qwp1) + 1.0)*sin(2*qwp2)*cos(2*hwp1)*cos(2*hwp2) + 0.5*I*(I*cos(2*qwp2) + 1.0)*sin(2*hwp1)*sin(2*hwp2)*sin(2*qwp1) + 0.5*sin(2*hwp1)*sin(2*qwp1)*sin(2*qwp2)*cos(2*hwp2)))**2'

			,d1d4Both : '4*Abs(-0.25*sqrt(2)*I*(0.5*(I*cos(2*qwp1) + 1.0)*(-I*cos(2*qwp2) + 1.0)*sin(2*hwp1)*sin(2*hwp2) + 0.5*I*(I*cos(2*qwp1) + 1.0)*sin(2*hwp1)*sin(2*qwp2)*cos(2*hwp2) - 0.5*I*(-I*cos(2*qwp2) + 1.0)*sin(2*hwp2)*sin(2*qwp1)*cos(2*hwp1) + 0.5*sin(2*qwp1)*sin(2*qwp2)*cos(2*hwp1)*cos(2*hwp2)) + 0.25*sqrt(2)*I*(-0.5*(I*cos(2*qwp1) + 1.0)*(-I*cos(2*qwp2) + 1.0)*cos(2*hwp1)*cos(2*hwp2) + 0.5*I*(I*cos(2*qwp1) + 1.0)*sin(2*hwp2)*sin(2*qwp2)*cos(2*hwp1) - 0.5*I*(-I*cos(2*qwp2) + 1.0)*sin(2*hwp1)*sin(2*qwp1)*cos(2*hwp2) - 0.5*sin(2*hwp1)*sin(2*hwp2)*sin(2*qwp1)*sin(2*qwp2)))**2'

			,d2d3Both : '4*Abs(0.25*sqrt(2)*I*(0.5*(-I*cos(2*qwp1) + 1.0)*(I*cos(2*qwp2) + 1.0)*sin(2*hwp1)*sin(2*hwp2) - 0.5*I*(-I*cos(2*qwp1) + 1.0)*sin(2*hwp1)*sin(2*qwp2)*cos(2*hwp2) + 0.5*I*(I*cos(2*qwp2) + 1.0)*sin(2*hwp2)*sin(2*qwp1)*cos(2*hwp1) + 0.5*sin(2*qwp1)*sin(2*qwp2)*cos(2*hwp1)*cos(2*hwp2)) - 0.25*sqrt(2)*I*(-0.5*(-I*cos(2*qwp1) + 1.0)*(I*cos(2*qwp2) + 1.0)*cos(2*hwp1)*cos(2*hwp2) - 0.5*I*(-I*cos(2*qwp1) + 1.0)*sin(2*hwp2)*sin(2*qwp2)*cos(2*hwp1) + 0.5*I*(I*cos(2*qwp2) + 1.0)*sin(2*hwp1)*sin(2*qwp1)*cos(2*hwp2) - 0.5*sin(2*hwp1)*sin(2*hwp2)*sin(2*qwp1)*sin(2*qwp2)))**2'

			,d2d4Both : '4*Abs(0.25*sqrt(2)*I*(-0.5*(-I*cos(2*qwp1) + 1.0)*(-I*cos(2*qwp2) + 1.0)*sin(2*hwp1)*cos(2*hwp2) + 0.5*I*(-I*cos(2*qwp1) + 1.0)*sin(2*hwp1)*sin(2*hwp2)*sin(2*qwp2) - 0.5*I*(-I*cos(2*qwp2) + 1.0)*sin(2*qwp1)*cos(2*hwp1)*cos(2*hwp2) - 0.5*sin(2*hwp2)*sin(2*qwp1)*sin(2*qwp2)*cos(2*hwp1)) - 0.25*sqrt(2)*I*(-0.5*(-I*cos(2*qwp1) + 1.0)*(-I*cos(2*qwp2) + 1.0)*sin(2*hwp2)*cos(2*hwp1) - 0.5*I*(-I*cos(2*qwp1) + 1.0)*sin(2*qwp2)*cos(2*hwp1)*cos(2*hwp2) + 0.5*I*(-I*cos(2*qwp2) + 1.0)*sin(2*hwp1)*sin(2*hwp2)*sin(2*qwp1) - 0.5*sin(2*hwp1)*sin(2*qwp1)*sin(2*qwp2)*cos(2*hwp2)))**2'

			,d1d3HWPOnly : '4*Abs(-0.25*sqrt(2)*I*sin(2*hwp1)*cos(2*hwp2) + 0.25*sqrt(2)*I*sin(2*hwp2)*cos(2*hwp1))**2'

			,d1d4HWPOnly : '4*Abs(-0.25*sqrt(2)*I*sin(2*hwp1)*sin(2*hwp2) - 0.25*sqrt(2)*I*cos(2*hwp1)*cos(2*hwp2))**2'

			,d2d3HWPOnly : '4*Abs(0.25*sqrt(2)*I*sin(2*hwp1)*sin(2*hwp2) + 0.25*sqrt(2)*I*cos(2*hwp1)*cos(2*hwp2))**2'

			,d2d4HWPOnly : '4*Abs(-0.25*sqrt(2)*I*sin(2*hwp1)*cos(2*hwp2) + 0.25*sqrt(2)*I*sin(2*hwp2)*cos(2*hwp1))**2'

			,d1d3QWPOnly : '4*Abs(-0.125*sqrt(2)*(I*cos(2*qwp1) + 1.0)*sin(2*qwp2) + 0.125*sqrt(2)*(I*cos(2*qwp2) + 1.0)*sin(2*qwp1))**2'

			,d1d4QWPOnly : '4*Abs(0.125*sqrt(2)*I*(I*cos(2*qwp1) + 1.0)*(-I*cos(2*qwp2) + 1.0) + 0.125*sqrt(2)*I*sin(2*qwp1)*sin(2*qwp2))**2'

			,d2d3QWPOnly : '4*Abs(-0.125*sqrt(2)*I*(-I*cos(2*qwp1) + 1.0)*(I*cos(2*qwp2) + 1.0) - 0.125*sqrt(2)*I*sin(2*qwp1)*sin(2*qwp2))**2'

			,d2d4QWPOnly : '4*Abs(0.125*sqrt(2)*(-I*cos(2*qwp1) + 1.0)*sin(2*qwp2) - 0.125*sqrt(2)*(-I*cos(2*qwp2) + 1.0)*sin(2*qwp1))**2'
		}

	},

	getProbabilities : function(){

		// var phi = this.generatePhase()
		var phi = 0

		var names = ['d1d3', 'd1d4', 'd2d3', 'd2d4']


		if (this.get('QWPon') && this.get('HWPon')){
			names = _.map(names, function(num){ return num + 'Both'; });
		}

		else if (this.get('HWPon')){
			names = _.map(names, function(num){ return num + 'HWPOnly'; });
		}

		else if (this.get('QWPon')){
			names = _.map(names, function(num){ return num + 'QWPOnly'; });
		}


		var d1d3p;
		var d1d4p;
		var d2d3p;
		var d2d4p;

		state = this.get('state')

		console.log(state)

		if(this.get('QWPon') || this.get('HWPon')){
			d1d3p = this.pathProbabilities.evalExpression(state, names[0], phi, this.get('hwp1'), this.get('hwp2'), this.get('qwp1'), this.get('qwp2'))
			d1d4p = this.pathProbabilities.evalExpression(state, names[1], phi, this.get('hwp1'), this.get('hwp2'), this.get('qwp1'), this.get('qwp2'))
			d2d3p = this.pathProbabilities.evalExpression(state, names[2], phi, this.get('hwp1'), this.get('hwp2'), this.get('qwp1'), this.get('qwp2'))
			d2d4p = this.pathProbabilities.evalExpression(state, names[3], phi, this.get('hwp1'), this.get('hwp2'), this.get('qwp1'), this.get('qwp2'))
		}

		else{
			names = ['d1d3HWPOnly', 'd1d4HWPOnly', 'd2d3HWPOnly', 'd2d4HWPOnly']
			d1d3p = this.pathProbabilities.evalExpression(state, names[0], phi, 0, 0, 0, 0)
			d1d4p = this.pathProbabilities.evalExpression(state, names[1], phi, 0, 0, 0, 0)
			d2d3p = this.pathProbabilities.evalExpression(state, names[2], phi, 0, 0, 0, 0)
			d2d4p = this.pathProbabilities.evalExpression(state, names[3], phi, 0, 0, 0, 0)
		}

		return [d1d3p, d1d4p, d2d3p, d2d4p]
	},


});

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

/*global icarusjs, Backbone*/

icarusjs.Collections.IcarusCollection = Backbone.Collection.extend({

    model: icarusjs.Models.IcarusModel

});


/*global icarusjs, Backbone, JST*/

icarusjs.Views.IcarusView = Backbone.View.extend({

	initialize : function(){
		this
			.initializeThreejs()
			.initializeStats()

		this.Particles = []
		this.addStaticObjects()
		this.time = 0
		this.laserIteration = 0
		this.usedParticles = 0
		this.initializeParticleSystem()

	},
	
	update : function(){
		var speed = this.model.get('speed')
		
		var temp = (Math.floor(75/speed)==0) ? 1 : Math.floor(75/speed)

		if (this.time % temp ==0 ) {
			this.fireLaser()
			this.addParticles()
			this.laserIteration += 25
		}

		var _this = this
		_.each(this.Particles.vertices, function(particle){
			if (particle.path){
				particle.pathPercentage += particle.pathPercentageVelocity;
				if (particle.pathPercentage >= 1){
					particle.pathPercentageVelocity = 0;
					particle.pathPercentage = 0
				}

				var position = particle.path.getPointAt(particle.pathPercentage);
				particle.x = position.x
				particle.y = position.y
				particle.z = position.z
			}
			_this.particleSystem.geometry.__dirtyVertices = true;
		})

		this.time += 1.0
	},

	initializeThreejs : function(){

		if ( ! Detector.webgl ) Detector.addGetWebGLMessage();
		this.$container = $('.three-js-hook');
		
		var width = this.$container.width();
		var height = this.$container.height();

		var viewAngle = 45,
			aspect = width / height,
			near = 0.1,
			far = 10000;		


		this.renderer = new THREE.WebGLRenderer({antialias : true});
		this.camera = new THREE.PerspectiveCamera( viewAngle, aspect, near, far);

		this.scene = new THREE.Scene();
		this.scene.fog = new THREE.Fog( 0x000000, 250, 1400 );
		this.renderer.setClearColor('white')

		this.scene.add(this.camera);
		this.camera.position.z = 150;
		this.camera.position.x = -00;
		this.camera.position.y = -400;

		this.camera.updateMatrix();

		this.camera.lookAt(0, 0, 0)

		this.resize()
		this.$container.append(this.renderer.domElement);		

		THREEx.WindowResize(this.renderer, this.camera);

		this.renderer.autoClear = false;

		var renderModel = new THREE.RenderPass( this.scene, this.camera );
		var effectBloom = new THREE.BloomPass( 0.15 );

		var effectFilm = new THREE.FilmPass( 0.02, 0.125, 2048, false );
		effectFilm.renderToScreen = true;
		this.composer = new THREE.EffectComposer( this.renderer );



		this.composer.addPass( renderModel );
		this.composer.addPass( effectBloom );
		this.composer.addPass( effectFilm );

		return this;
	},

	resize : function(){
		var width = this.$container.width();
		var height = this.$container.height();

		this.renderer.setSize(width, height);

		this.camera.aspect = width / height;
    	this.camera.updateProjectionMatrix();
	},

	initializeStats : function(){

		this.stats = new Stats();
		this.stats.domElement.style.position = 'absolute';
		this.stats.domElement.style.top = '0px';
		this.stats.domElement.style.right = '50px';
		document.body.appendChild( this.stats.domElement );

		return this;
	},

	start : function(){

		this.controls = new THREE.TrackballControls( this.camera, this.renderer.domElement );
		this.controls.rotateSpeed = 1.0;
		this.controls.zoomSpeed = 1.2;
		this.controls.panSpeed = 0.8;
		this.controls.noZoom = false;
		this.controls.noPan = false;
		this.controls.staticMoving = true;
		this.controls.dynamicDampingFactor = 0.3;
		this.controls.keys = [ 65, 83, 68 ];
		this.controls.addEventListener( 'change', render );

		this.gameStepTime = 1000/60;
		this.frameTime = 0; // ms
		this.cumulatedFrameTime = 0; // ms
		this._lastFrameTime = Date.now(); // timestamp
		this.gameOver = false;

		var self = this

		var animate = function() {
			var time = Date.now();
			self.frameTime = time - self._lastFrameTime;
			self._lastFrameTime = time;
			self.cumulatedFrameTime += self.frameTime;

			while(self.cumulatedFrameTime > self.gameStepTime) {
				if(self.model.get('play') == true){
			        self.update();
		    	}
				self.cumulatedFrameTime -= self.gameStepTime;
			}
			self.controls.update();
			self.stats.update();

			render()
			 
			if(!self.gameOver) window.requestAnimationFrame(animate);
		}

		function render (){
			self.renderer.clear()
			self.composer.render(0.05)
			// self.renderer.render(self.scene, self.camera);
		}
		
		animate()	
	}

});

icarusjs.Views.IcarusView.prototype.particles = {}

icarusjs.Views.IcarusView.prototype.initializeParticleSystem = function(){
	this.particleCount = 2000,
		this.Particles = new THREE.Geometry(),
		pMaterial = new THREE.ParticleBasicMaterial({
			color: 'yellow',
			size: 5,
			map: THREE.ImageUtils.loadTexture(
				// "http://i.imgur.com/gqrylTp.png"
				"images/particle.png"
			),
			blending: THREE.AdditiveBlending,
			transparent: true
		});

		for(var p = 0; p < this.particleCount; p++) {

			var pX = -200 + 5,
			pY = -100 + 20,
			pZ = 0,
			particle = new THREE.Vector3(pX, pY, pZ)
			particle.velocity = {x : 0, y : 0, z : 0}
			particle.path = null
			this.Particles.vertices.push(particle);
		}

		// create the particle system
		var particleSystem = new THREE.ParticleSystem( this.Particles, pMaterial);
		particleSystem.sortParticles = true;
		this.scene.add(particleSystem);

		this.particleSystem = particleSystem
}

icarusjs.Views.IcarusView.prototype.fireLaser = function(){
	this.laserPlane = new THREE.Mesh(new THREE.PlaneGeometry(20, 20), new THREE.MeshBasicMaterial({
		color: 'red'
	}));
	this.laserPlane.position = {x : -200, y : -100+20, z : 0}
	this.laserPlane.rotation.y += 90 * (Math.PI / 180);
	this.scene.add(this.laserPlane);

	var _this = this
	setTimeout(function(){
		_this.scene.remove(_this.laserPlane)
	}, 10)	
}

icarusjs.Views.IcarusView.prototype.addParticle = function(path){

	if (this.usedParticles < this.particleCount){
		var particle = this.Particles.vertices[this.usedParticles];
		particle.velocity = {x : 2, y : 0, z : 0}
		particle.path = this.path[path](this)
		this.usedParticles ++;
		particle.pathPercentage = 0;
		particle.pathPercentageVelocity = 0.01;
	}
	if (this.usedParticles >= this.particleCount) this.usedParticles = 0

}

icarusjs.Views.IcarusView.prototype.addParticles = function(){
	var time = this.laserIteration

	var lifetimes = this.model.QuantumDot.generate_lifetimes()
	xlifetime = lifetimes[0]
	xxlifetime = lifetimes[1]

	var phi = this.model.QuantumDot.generatePhase()

	var probabilities = this.model.QuantumDot.getProbabilities()

	var d1d3p = probabilities[0]
	var d1d4p = probabilities[1]
	var d2d3p = probabilities[2]
	var d2d4p = probabilities[3]

	var r = Math.random()
	var path = []

	var emissions = this.model.QuantumDot.Emission()
	xxTrue = emissions[0]
	xTrue = emissions[1]

	if(xxTrue){
		if (r < d1d3p) {
			this.model.PCM.detectors.D3.hit(time, xxlifetime)
			this.addParticle('D3')
		}
		else if (r < (d1d3p + d1d4p)) {	
			this.model.PCM.detectors.D4.hit(time, xxlifetime)	
			this.addParticle('D4')
		}
		else if (r < (d1d3p + d1d4p + d2d3p)) {
			this.model.PCM.detectors.D3.hit(time, xxlifetime)	
			this.addParticle('D3')
		}
		else if (r < (d1d3p + d1d4p + d2d3p + d2d4p)) {
			this.model.PCM.detectors.D4.hit(time, xxlifetime)
			this.addParticle('D4')
		}
	}
		
	if(xTrue){
		if (r < d1d3p) {
			this.model.PCM.detectors.D1.hit(time, xlifetime)
			this.addParticle('D1')
		}
		else if (r < (d1d3p + d1d4p)) {	
			this.model.PCM.detectors.D1.hit(time, xlifetime)
			this.addParticle('D1')
		}
		else if (r < (d1d3p + d1d4p + d2d3p)) {
			this.model.PCM.detectors.D2.hit(time, xlifetime)
			this.addParticle('D2')
		}
		else if (r < (d1d3p + d1d4p + d2d3p + d2d4p)) {
			this.model.PCM.detectors.D2.hit(time, xlifetime)
			this.addParticle('D2')
		}
	}
}

THREE.LinearCurve3 = THREE.Curve.create(

	function ( points /* array of Vector3 */) {

		this.points = (points == undefined) ? [] : points;

	},

	function ( t ) {

		var v = new THREE.Vector3();
		var c = [];
		var points = this.points, point, intPoint, weight;
		point = ( points.length - 1 ) * t;

		intPoint = Math.floor( point );
		weight = point - intPoint;

		c[ 0 ] = intPoint == 0 ? intPoint : intPoint - 1;
		c[ 1 ] = intPoint;
		c[ 2 ] = intPoint  > points.length - 2 ? points.length - 1 : intPoint + 1;
		c[ 3 ] = intPoint  > points.length - 3 ? points.length - 1 : intPoint + 2;

		var pt0 = points[ c[0] ],
			pt1 = points[ c[1] ],
			pt2 = points[ c[2] ],
			pt3 = points[ c[3] ];

		// v.x = THREE.Curve.Utils.interpolate(pt0.x, pt1.x, pt2.x, pt3.x, weight);
		// v.y = THREE.Curve.Utils.interpolate(pt0.y, pt1.y, pt2.y, pt3.y, weight);
		// v.z = THREE.Curve.Utils.interpolate(pt0.z, pt1.z, pt2.z, pt3.z, weight);
		v.copy( pt1 ).lerp( pt2, weight );

		return v;

	}

);

icarusjs.Views.IcarusView.prototype.path = {}

icarusjs.Views.IcarusView.prototype.path.D1 = function(self){

	var spline = new THREE.LinearCurve3([
		new THREE.Vector3(-200+5, -100+20, 0),
		new THREE.Vector3(self.NBS.position.x, self.NBS.position.y, self.NBS.position.z),
		new THREE.Vector3(self.PBS1.position.x, self.PBS1.position.y, self.PBS1.position.z),
		new THREE.Vector3(self.D1.position.x, self.D1.position.y, self.D1.position.z),
	]);
	return spline
}

icarusjs.Views.IcarusView.prototype.path.D2 = function(self){
	
	var spline = new THREE.LinearCurve3([
		new THREE.Vector3(-200+5, -100+20, 0),
		new THREE.Vector3(self.NBS.position.x, self.NBS.position.y, self.NBS.position.z),
		new THREE.Vector3(self.PBS1.position.x, self.PBS1.position.y, self.PBS1.position.z),
		new THREE.Vector3(self.D2.position.x, self.D2.position.y, self.D2.position.z),
	]);
	return spline
}

icarusjs.Views.IcarusView.prototype.path.D3 = function(self){
	var spline = new THREE.LinearCurve3([
		new THREE.Vector3(-200+5, -100+20, 0),
		new THREE.Vector3(self.NBS.position.x, self.NBS.position.y, self.NBS.position.z),
		new THREE.Vector3(self.PBS2.position.x, self.PBS2.position.y, self.PBS2.position.z),
		new THREE.Vector3(self.D3.position.x, self.D3.position.y, self.D3.position.z),
	]);
	return spline
}

icarusjs.Views.IcarusView.prototype.path.D4 = function(self){
	var spline = new THREE.LinearCurve3([
		new THREE.Vector3(-200+5, -100+20, 0),
		new THREE.Vector3(self.NBS.position.x, self.NBS.position.y, self.NBS.position.z),
		new THREE.Vector3(self.PBS2.position.x, self.PBS2.position.y, self.PBS2.position.z),
		new THREE.Vector3(self.D4.position.x, self.D4.position.y, self.D4.position.z),
	]);
	return spline
}


icarusjs.Views.IcarusView.prototype.addStaticObjects = function(){

	this.staticObjects = []

	var light = new THREE.PointLight( 0x404040, 3, 0 );
	light.position.set( 200, 200, 400 );
	this.scene.add( light );

	var light = new THREE.PointLight( 0x404040, 6, 0 );
	light.position.set( -200, -200, 400 );
	this.scene.add( light );

	var metalMaterial = new THREE.MeshPhongMaterial( {bumpScale: 4, color: 0x222222, ambient: 0x666666, specular: 0x999999, shininess: 200, metal: true, shading: THREE.SmoothShading } )

	this.plane = new THREE.Mesh(new THREE.CubeGeometry(400, 400, 2),
		new THREE.MeshPhongMaterial( {bumpScale: 4, color: 0x333333, ambient: 0x666666, specular: 0x999999, shininess: 200, metal: true, shading: THREE.SmoothShading } )
		);
	this.plane.position.z = -17
	this.scene.add(this.plane);


	// Add NBS
	this.NBS = new THREE.Mesh(new THREE.CubeGeometry(20, 20, 20), new THREE.MeshPhongMaterial({
		color: 'red'
	}));
	this.NBS.position =  {x : -200 + 100, y : -100 + 20, z : 0};

	this.HWP1 = new THREE.Mesh(new THREE.CubeGeometry(5, 20, 20), new THREE.MeshLambertMaterial({
		color: 'red'
	}));
	this.HWP1.position =  {x : -200 + 140, y : -100 + 20, z : 0};

	this.QWP1 = new THREE.Mesh(new THREE.CubeGeometry(5, 20, 20), new THREE.MeshLambertMaterial({
		color: 'red'
	}));
	this.QWP1.position =  {x : -200 + 160, y : -100 + 20, z : 0};

	this.PBS1 = new THREE.Mesh(new THREE.CubeGeometry(20, 20, 20), new THREE.MeshLambertMaterial({
		color: 'red'
	}));
	this.PBS1.position =  {x : -200 + 260, y : -100 + 20, z : 0	};

	this.D1 = new THREE.Mesh(new THREE.CubeGeometry(10, 20, 20), new THREE.MeshLambertMaterial({
		color: 'red'
	}));
	this.D1.position =  {x : -200 + 320, y : -100 + 20, z : 0};

	d1label = makeTextSprite('D1', {
		fontsize: 12,
		borderColor: {r:0, g:0, b:0, a:0.0},
		backgroundColor: {r:255, g:255, b:255, a:0.0}
	});
	d1label.position.set(-200 + 305,-100 + 10, 0);
	this.scene.add( d1label );

	this.D2 = new THREE.Mesh(new THREE.CubeGeometry(20, 10, 20), new THREE.MeshLambertMaterial({
		color: 'red'
	}));
	this.D2.position =  {x : -200 + 260, y : -100 + 80, z : 0};

	d2label = makeTextSprite('D2', {
		fontsize: 12,
		borderColor: {r:0, g:0, b:0, a:0.0},
		backgroundColor: {r:255, g:255, b:255, a:0.0}
	});
	d2label.position.set(-200 + 250, -100 + 0, 0);
	this.scene.add( d2label );


	this.HWP2 = new THREE.Mesh(new THREE.CubeGeometry(20, 5, 20), new THREE.MeshLambertMaterial({
		color: 'red'
	}));
	this.HWP2.position =  {x : -200 + 100, y : -100 + 60, z : 0};

	this.QWP2 = new THREE.Mesh(new THREE.CubeGeometry(20, 5, 20), new THREE.MeshLambertMaterial({
		color: 'red'
	}));
	this.QWP2.position =  {x : -200 + 100, y : -100 + 80, z : 0};


	this.PBS2 = new THREE.Mesh(new THREE.CubeGeometry(20, 20, 20), new THREE.MeshLambertMaterial({
		color: 'red'
	}));
	this.PBS2.position =  {x : -200 + 100, y : -100 + 180, z : 0};

	this.D3 = new THREE.Mesh(new THREE.CubeGeometry(20, 10, 20), new THREE.MeshLambertMaterial({
		color: 'red'
	}));
	this.D3.position =  {x : -200 + 100, y : -100 + 240, z : 0};

	d3label = makeTextSprite('D3', {
		fontsize: 12,
		borderColor: {r:0, g:0, b:0, a:0.0},
		backgroundColor: {r:255, g:255, b:255, a:0.0}
	});
	d3label.position.set(-200 + 90, -100 + 230, 0);
	this.scene.add( d3label );

	this.D4 = new THREE.Mesh(new THREE.CubeGeometry(10, 20, 20), new THREE.MeshLambertMaterial({
		color: 'red'
	}));
	this.D4.position =  {x : -200 + 160, y : -100 + 180, z : 0};

	d4label = makeTextSprite('D4', {
		fontsize: 12,
		borderColor: {r:0, g:0, b:0, a:0.0},
		backgroundColor: {r:255, g:255, b:255, a:0.0}
	});
	d4label.position.set(-200 + 150, -100 + 170, 0);
	this.scene.add( d4label );

	this.scene.add(this.cube);
	// this.scene.add(this.D1)
	// this.scene.add(this.D2)
	// this.scene.add(this.D3)
	// this.scene.add(this.D4)

	var _this = this

	this.wavePlateGeometry = null
	var loader = new THREE.STLLoader();
	loader.addEventListener( 'load', function ( event ) {
		var geometry = event.content;
		_this.wavePlateGeometry = geometry;
		addWavePlates()
		loadingClass.tick()
	} );
	loader.load( './models/PRM1-Solidworks.STL' );


	this.spectrometerGeometry = null
	var loader = new THREE.STLLoader();
	loader.addEventListener( 'load', function ( event ) {
		var geometry = event.content;
		_this.spectrometerGeometry = geometry;
		addSpectrometers()
		loadingClass.tick()
	} );
	loader.load( './models/JY_Spectrometer.STL' );

	this.beamSplitterGeometry = null
	var loader = new THREE.STLLoader();
	loader.addEventListener( 'load', function ( event ) {
		var geometry = event.content;
		_this.beamSplitterGeometry = geometry;
		addBeamSplitters()
		loadingClass.tick()
	} );
	loader.load( './models/KM100PM_M-Solidworks.STL' );


	this.apdGeometry = null;
	var loader = new THREE.STLLoader();
	loader.addEventListener( 'load', function ( event ) {
		var geometry = event.content;
		_this.apdGeometry = geometry;
		addAPDs()
		loadingClass.tick()
	} );
	loader.load( './models/Assem1.STL' );

	var spectrometerMaterial = new THREE.MeshPhongMaterial( {bumpScale: 4, color: 0x666666, ambient: 0x666666, specular: 0x999999, shininess: 200, metal: true, shading: THREE.SmoothShading } )

	var hwp1Label = null;
	var hwp2Label = null;
	var qwp1Label = null;
	var qwp2Label = null;
	this.wavePlates = []

	this.model.QuantumDot.on('change:HWPon', function(){
		if(hwp1Label) _this.scene.remove(hwp1Label)
		if(hwp2Label) _this.scene.remove(hwp2Label)

		_.each(_this.wavePlates, function(mesh){
			_this.scene.remove(mesh)
			_this.wavePlates = []
		})
		addWavePlates()
	})

	this.model.QuantumDot.on('change:QWPon', function(){
		if(qwp1Label) _this.scene.remove(qwp1Label)
		if(qwp2Label) _this.scene.remove(qwp2Label)
		_.each(_this.wavePlates, function(mesh){
			_this.scene.remove(mesh)
			_this.wavePlates = []
		})
		addWavePlates()
	})

	var addWavePlates =  function(){
		if(_this.wavePlateGeometry){
			if(_this.model.QuantumDot.get('HWPon')){

 				var mesh = new THREE.Mesh( _this.wavePlateGeometry, metalMaterial );
				mesh.scale = {x : 0.13, y : 0.13, z : 0.13}
				mesh.rotation.x = -180*Math.PI/180
				mesh.rotation.y = 0*Math.PI/180
				mesh.rotation.z = 90*Math.PI/180
				mesh.position =  {x : -200 + 140, y : -100 + 24.5, z : 6};
				_this.wavePlates.push(mesh)
				_this.scene.add( mesh );


				_this.model.QuantumDot.on('change:hwp1', function(){
					if (hwp1Label) _this.scene.remove( hwp1Label );
					hwp1Label = makeTextSprite(
						'hwp1 ' + math.round(_this.model.QuantumDot.get('hwp1'), 2 )
						, {
						fontsize: 12,
						borderColor: {r:0, g:0, b:0, a:0.0},
						backgroundColor: {r:255, g:255, b:255, a:0.0}
						}
					);
					hwp1Label.position.set(-200 + 140,-100 + 20, -10);
					_this.scene.add( hwp1Label );
				})
				_this.model.QuantumDot.trigger('change:hwp1')

 				var mesh = new THREE.Mesh( _this.wavePlateGeometry, metalMaterial );
				mesh.scale = {x : 0.13, y : 0.13, z : 0.13}
				mesh.rotation.x = -180*Math.PI/180
				mesh.rotation.y = 0*Math.PI/180
				mesh.rotation.z = 0*Math.PI/180
				mesh.position =  {x : -200 + 95.5, y : -100 + 60, z : 6};
				_this.wavePlates.push(mesh)
				_this.scene.add( mesh );

				_this.model.QuantumDot.on('change:hwp2', function(){
					if (hwp2Label) _this.scene.remove( hwp2Label );
					hwp2Label = makeTextSprite(
						'hwp2 ' + math.round(_this.model.QuantumDot.get('hwp2'), 2 )
						, {
						fontsize: 12,
						borderColor: {r:0, g:0, b:0, a:0.0},
						backgroundColor: {r:255, g:255, b:255, a:0.0}
						}
					);
					hwp2Label.position.set(-200 + 85.5,-100 + 56, -10);
					_this.scene.add( hwp2Label );
				})
				_this.model.QuantumDot.trigger('change:hwp2')

			}

			if(_this.model.QuantumDot.get('QWPon')){
	 				var mesh = new THREE.Mesh( _this.wavePlateGeometry, metalMaterial );
					mesh.scale = {x : 0.13, y : 0.13, z : 0.13}
					mesh.rotation.x = -180*Math.PI/180
					mesh.rotation.y = 0*Math.PI/180
					mesh.rotation.z = 90*Math.PI/180
					mesh.position =  {x : -200 + 160, y : -100 + 24.5, z : 6};
					_this.wavePlates.push(mesh)
					_this.scene.add( mesh );

					_this.model.QuantumDot.on('change:qwp1', function(){
						if (qwp1Label) _this.scene.remove( qwp1Label );
						qwp1Label = makeTextSprite(
							'qwp1 ' + math.round(_this.model.QuantumDot.get('qwp1'), 2 )
							, {
							fontsize: 12,
							borderColor: {r:0, g:0, b:0, a:0.0},
							backgroundColor: {r:255, g:255, b:255, a:0.0}
							}
						);
						qwp1Label.position.set(-200 + 160,-100 + 20, -10);
						_this.scene.add( qwp1Label );
					})
					_this.model.QuantumDot.trigger('change:qwp1')

	 				var mesh = new THREE.Mesh( _this.wavePlateGeometry, metalMaterial );
					mesh.scale = {x : 0.13, y : 0.13, z : 0.13}
					mesh.rotation.x = -180*Math.PI/180
					mesh.rotation.y = 0*Math.PI/180
					mesh.rotation.z = 0*Math.PI/180
					mesh.position =  {x : -200 + 95.5, y : -100 + 80, z : 6};
					_this.wavePlates.push(mesh)
					_this.scene.add( mesh );

					_this.model.QuantumDot.on('change:qwp2', function(){
						if (qwp2Label) _this.scene.remove( qwp2Label );
						qwp2Label = makeTextSprite(
							'qwp2 ' + math.round(_this.model.QuantumDot.get('qwp2'), 2 )
							, {
							fontsize: 12,
							borderColor: {r:0, g:0, b:0, a:0.0},
							backgroundColor: {r:255, g:255, b:255, a:0.0}
							}
						);
						qwp2Label.position.set(-200 + 85.5,-100 + 80, -10);
						_this.scene.add( qwp2Label );
					})
					_this.model.QuantumDot.trigger('change:qwp2')
			}
		}

	}

	var addSpectrometers = function(){
		if(_this.spectrometerGeometry){
			var mesh = new THREE.Mesh( _this.spectrometerGeometry, spectrometerMaterial );
			mesh.scale = {x : 0.07, y : 0.07, z : 0.07}
			mesh.rotation.x = 90*Math.PI/180
			mesh.rotation.y = -0*Math.PI/180
			mesh.position =  {x : -200 + 180, y : -100 + 34.5, z : -17.6};
			_this.scene.add( mesh );
			var mesh = new THREE.Mesh( _this.spectrometerGeometry, spectrometerMaterial );

			mesh.castShadow = true;
			mesh.receiveShadow = true;
			mesh.scale = {x : 0.07, y : 0.07, z : 0.07}
			mesh.rotation.x = 90*Math.PI/180
			mesh.rotation.y = 90*Math.PI/180
			mesh.position =  {x : -200 + 86, y : -100 + 95, z : -17.6};
			_this.scene.add( mesh );
		}

	}


	var beamSplitterMaterial = new THREE.MeshPhongMaterial({ color: 'white', opacity : 0.6, transparent : true});
	var addBeamSplitters = function(){
		if(_this.beamSplitterGeometry){


			var mesh = new THREE.Mesh( _this.beamSplitterGeometry, metalMaterial );
			var cubeMesh = new THREE.Mesh(new THREE.CubeGeometry(4, 4, 4), beamSplitterMaterial);
			mesh.scale = {x : 0.13, y : 0.13, z : 0.13}
			mesh.rotation.x = 90*Math.PI/180
			mesh.rotation.y = 90*Math.PI/180
			mesh.rotation.z = 0*Math.PI/180
			mesh.position =  {x : -200 + 96, y : -100 + 16, z : -17};
			cubeMesh.position = {x : -200 + 100, y : -100 + 20, z : 0};

			_this.scene.add( cubeMesh );
			_this.scene.add( mesh );

			var mesh = new THREE.Mesh( _this.beamSplitterGeometry, metalMaterial );
			var cubeMesh = new THREE.Mesh(new THREE.CubeGeometry(4, 4, 4), beamSplitterMaterial);
			mesh.scale = {x : 0.13, y : 0.13, z : 0.13}
			mesh.rotation.x = 90*Math.PI/180
			mesh.rotation.y = 90*Math.PI/180
			mesh.rotation.z = 0*Math.PI/180
			mesh.position =  {x : -200 + 258, y : -100 + 16, z : -17};
			cubeMesh.position = {x : -200 + 262, y : -100 + 20, z : 0};
			_this.scene.add( cubeMesh );
			_this.scene.add( mesh );

			var mesh = new THREE.Mesh( _this.beamSplitterGeometry, metalMaterial );
			var cubeMesh = new THREE.Mesh(new THREE.CubeGeometry(4, 4, 4), beamSplitterMaterial);
			mesh.scale = {x : 0.13, y : 0.13, z : 0.13}
			mesh.rotation.x = 90*Math.PI/180
			mesh.rotation.y = 0*Math.PI/180
			mesh.rotation.z = 0*Math.PI/180
			mesh.position =  {x : -200 + 96, y : -100 + 183, z : -17};
			cubeMesh.position = {x : -200 + 100, y : -100 + 179, z : 0};
			_this.scene.add( cubeMesh );
			_this.scene.add( mesh );
		}
	}

	var addAPDs = function(){
		if(_this.apdGeometry){

			var mesh = new THREE.Mesh( _this.apdGeometry, metalMaterial );
			mesh.scale = {x : 0.13, y : 0.13, z : 0.13}
			mesh.rotation.x = 90*Math.PI/180
			mesh.rotation.y = -90*Math.PI/180
			mesh.rotation.z = 0*Math.PI/180
			mesh.position =  {x : -200 + 375, y : -100 + 23.5, z : -18};
			_this.scene.add(mesh)

			var mesh = new THREE.Mesh( _this.apdGeometry, metalMaterial );
			mesh.scale = {x : 0.13, y : 0.13, z : 0.13}
			mesh.rotation.x = 90*Math.PI/180
			mesh.rotation.y = 0*Math.PI/180
			mesh.rotation.z = 0*Math.PI/180
			mesh.position =  {x : -200 + 256.7, y : -100 + 136.5, z : -18};
			_this.scene.add(mesh)

			var mesh = new THREE.Mesh( _this.apdGeometry, metalMaterial );
			mesh.scale = {x : 0.13, y : 0.13, z : 0.13}
			mesh.rotation.x = 90*Math.PI/180
			mesh.rotation.y = -90*Math.PI/180
			mesh.rotation.z = 0*Math.PI/180
			mesh.position =  {x : -200 + 375 - 161.5, y : -100 + 23.5 + 161, z : -18};
			_this.scene.add(mesh)

			var mesh = new THREE.Mesh( _this.apdGeometry, metalMaterial );
			mesh.scale = {x : 0.13, y : 0.13, z : 0.13}
			mesh.rotation.x = 90*Math.PI/180
			mesh.rotation.y = 0*Math.PI/180
			mesh.rotation.z = 0*Math.PI/180
			mesh.position =  {x : -200 + 256.7 - 161.5, y : -100 + 136.5 + 159.5, z : -18};
			_this.scene.add(mesh)

		}
	}


}



function makeTextSprite( message, parameters )
{
	if ( parameters === undefined ) parameters = {};

	var fontface = parameters.hasOwnProperty("fontface") ?
		parameters["fontface"] : "Arial";

	var fontsize = parameters.hasOwnProperty("fontsize") ?
		parameters["fontsize"] : 18;

	var borderThickness = parameters.hasOwnProperty("borderThickness") ?
		parameters["borderThickness"] : 4;

	var borderColor = parameters.hasOwnProperty("borderColor") ?
		parameters["borderColor"] : { r:0, g:0, b:0, a:1.0 };

	var backgroundColor = parameters.hasOwnProperty("backgroundColor") ?
		parameters["backgroundColor"] : { r:255, g:255, b:255, a:1.0 };

	var spriteAlignment = THREE.SpriteAlignment.topLeft;

	var canvas = document.createElement('canvas');
	var context = canvas.getContext('2d');
	context.font = "Bold " + fontsize + "px " + fontface;

	// get size data (height depends only on font size)
	var metrics = context.measureText( message );
	var textWidth = metrics.width;

	// background color
	context.fillStyle   = "rgba(" + backgroundColor.r + "," + backgroundColor.g + ","
								  + backgroundColor.b + "," + backgroundColor.a + ")";
	// border color
	context.strokeStyle = "rgba(" + borderColor.r + "," + borderColor.g + ","
								  + borderColor.b + "," + borderColor.a + ")";

	context.lineWidth = borderThickness;
	roundRect(context, borderThickness/2, borderThickness/2, textWidth + borderThickness, fontsize * 1.4 + borderThickness, 6);
	// 1.4 is extra height factor for text below baseline: g,j,p,q.

	// text color
	context.fillStyle = "rgba(0, 0, 0, 1.0)";

	context.fillText( message, borderThickness, fontsize + borderThickness);

	// canvas contents will be used for a texture
	var texture = new THREE.Texture(canvas)
	texture.needsUpdate = true;

	var spriteMaterial = new THREE.SpriteMaterial(
		{ map: texture, useScreenCoordinates: false, alignment: spriteAlignment } );
	var sprite = new THREE.Sprite( spriteMaterial );
	sprite.scale.set(100,50,1.0);
	return sprite;
}

function roundRect(ctx, x, y, w, h, r)
{
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x+w, y);
    ctx.lineTo(x+w, y+h);
    ctx.lineTo(x, y+h);
    ctx.lineTo(x, y);

    ctx.closePath();
	ctx.fill();
	ctx.stroke();
}

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
