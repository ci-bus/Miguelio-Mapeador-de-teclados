var initPosition = {},
	disparar = false,
	fire,
	listenerAudio,
	soundGunBuffer,
	Pistola,
	PuntoDisparo,
	timeout = false,
	SpeedApuntar = .03,
	Radio;

function init () {
	initPosition = this.position.clone();
	fire = this.getObjectByName('Fire');
	listenerAudio = new THREE.AudioListener();
	this.add( listenerAudio );
	// Sonido disparo
	(new THREE.AudioLoader()).load( 'sounds/gun.mp3', function( buffer ) {
		soundGunBuffer = buffer;
	});
	Pistola = this;
	PuntoDisparo = this.parent.getObjectByName('PuntoDisparo');
	Radio = scene.getObjectByName('Radio');
}

function update (event) {
	if (disparar && this.Apuntando) {
		disparar = false;
		this.position.z = initPosition.z + 0.1;
		showFire();
		playSoundGun();
		gun();
	} else {
		disparar = false;
		if (this.position.z > initPosition.z) this.position.z -= 0.01;
	}
	if (this.Apuntando) {
		if (this.position.x > 0) {
			this.position.x -= SpeedApuntar;
		} else {
			this.position.x = 0;
			PuntoDisparo.visible = true;
		}
	} else {
		if (this.position.x < .260) this.position.x += SpeedApuntar;
		PuntoDisparo.visible = false;
	}
}

function gun () {
	var player = Pistola.parent,
		scene = player.parent,
		camera = player.getObjectByName('PerspectiveCamera'),
		position = player.position.clone(),
		enemies = scene.getObjectByName('Enemies').children;

	let raycaster = new THREE.Raycaster(position, camera.getWorldDirection());
	var intersects = raycaster.intersectObjects(enemies);
	
	intersects.forEach((it) => {
		it.object.doExplode = true;
	});
	
	intersects = raycaster.intersectObject(Radio, true);
	if (intersects.length) {
		if (!intersects[0].object.playing) {
			intersects[0].object.material[1].map = new THREE.TextureLoader().load('models/Radio/TextureRadio2.png');
			scene.pauseSound('background1');
			scene.playSound('music1', 0.5, true);
			intersects[0].object.playing = true;
		} else {
			scene.pauseSound('music1');
			scene.playSound('background1', 0.3, true);
			intersects[0].object.material[1].map = new THREE.TextureLoader().load('models/Radio/TextureRadio.png');
			intersects[0].object.playing = false;
		}
	}
}

function toScreenPosition (obj, camera) {
    var vector = new THREE.Vector3();

    var widthHalf = 0.5*renderer.context.canvas.width;
    var heightHalf = 0.5*renderer.context.canvas.height;

    obj.updateMatrixWorld();
    vector.setFromMatrixPosition(obj.matrixWorld);
    vector.project(camera);

    vector.x = ( vector.x * widthHalf ) + widthHalf;
    vector.y = - ( vector.y * heightHalf ) + heightHalf;

    return { 
        x: vector.x,
        y: vector.y
    };
}

function showFire () {
	if (timeout) {
		clearTimeout(timeout);
	} else {
		fire.visible = true;
	}
	timeout = setTimeout(() => {
		fire.visible = false;
		timeout = false;
	}, 50);
}

function playSoundGun () {
	let soundGun = new THREE.Audio( listenerAudio );
	soundGun.setBuffer(soundGunBuffer);
	soundGun.setLoop(false);
	soundGun.setVolume(.5);
	soundGun.play();
}

function disparo () {
	disparar = true;
}

document.addEventListener("click", disparo, false);

function stop () {
	scene.stopSound('background1');
	scene.stopSound('music1');
	document.removeEventListener("click", disparo, false);
}