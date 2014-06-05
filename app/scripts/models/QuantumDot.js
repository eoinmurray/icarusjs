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
