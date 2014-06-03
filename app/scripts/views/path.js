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
