
icarusjs.Views.IcarusView.prototype.addStaticObjects = function(){

	this.staticObjects = []

	var light = new THREE.PointLight( 0x404040, 3, 0 );
	light.position.set( 200, 200, 400 );
	this.scene.add( light );

	var light = new THREE.PointLight( 0x404040, 6, 0 );
	light.position.set( -200, -200, 400 );
	this.scene.add( light );

	var metalMaterial = new THREE.MeshPhongMaterial( {bumpScale: 4, color: 0x222222, ambient: 0x666666, specular: 0x999999, shininess: 200, metal: true, shading: THREE.SmoothShading } )

	this.plane = new THREE.Mesh(new THREE.CubeGeometry(500, 500, 2),
		new THREE.MeshPhongMaterial( {bumpScale: 4, color: 0x333333, ambient: 0x666666, specular: 0x999999, shininess: 200, metal: true, shading: THREE.SmoothShading } )
		);
	this.plane.position.z = -17
	this.scene.add(this.plane);


	// Add NBS
	this.NBS = new THREE.Mesh(new THREE.CubeGeometry(20, 20, 20), new THREE.MeshPhongMaterial({
		color: 'red'
	}));
	this.NBS.position =  {x : -200 + 100, y : -100 + 20, z : 0};

	nbslabel = makeTextSprite('NBS', {
		fontsize: 16,
		borderColor: {r:0, g:0, b:0, a:0.0},
		backgroundColor: {r:255, g:255, b:255, a:0.0}
	});
	nbslabel.position.set(-200 + 90,-100, 0);
	this.scene.add( nbslabel );

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

	pbs1label = makeTextSprite('PBS', {
		fontsize: 16,
		borderColor: {r:0, g:0, b:0, a:0.0},
		backgroundColor: {r:255, g:255, b:255, a:0.0}
	});
	pbs1label.position.set(-200 + 250,-100 , 0);
	this.scene.add( pbs1label );

	this.D1 = new THREE.Mesh(new THREE.CubeGeometry(10, 20, 20), new THREE.MeshLambertMaterial({
		color: 'red'
	}));
	this.D1.position =  {x : -200 + 320, y : -100 + 20, z : 0};

	d1label = makeTextSprite('D1', {
		fontsize: 16,
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
		fontsize: 16,
		borderColor: {r:0, g:0, b:0, a:0.0},
		backgroundColor: {r:255, g:255, b:255, a:0.0}
	});
	d2label.position.set(-200 + 250, -100 + 70, 0);
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

	pbs2label = makeTextSprite('PBS', {
		fontsize: 16,
		borderColor: {r:0, g:0, b:0, a:0.0},
		backgroundColor: {r:255, g:255, b:255, a:0.0}
	});
	pbs2label.position.set(-200 + 80,-100+170 , 0);
	this.scene.add( pbs2label );

	this.D3 = new THREE.Mesh(new THREE.CubeGeometry(20, 10, 20), new THREE.MeshLambertMaterial({
		color: 'red'
	}));
	this.D3.position =  {x : -200 + 100, y : -100 + 240, z : 0};

	d3label = makeTextSprite('D3', {
		fontsize: 16,
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
		fontsize: 16,
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
