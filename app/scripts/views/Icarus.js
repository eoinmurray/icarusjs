
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
		this.camera.position.x = 0;
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
