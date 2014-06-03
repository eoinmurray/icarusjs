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
