var KeyPressed = {
	w: false,
	s: false,
	a: false,
	d: false
};

var CursorPosition = {
	last: {
		x: 0,
		y: 0
	},
	current: {
		x: 0,
		y: 0
	}
}
var SpeedApuntando = 2,
	SpeedCorriendo = 10,
	CameraControlX = 0,
	Apuntando = false,
	listenerAudio,
	soundPasos = [],
	count = 0,
	lastSound = 1,
	Pistola,
	clock = new THREE.Clock(),
	delta,
	Obstacles = [],
	Enemies = [],
	Die = 0,
	Sangre,
	noHit = 0;

function init () {
	listenerAudio = new THREE.AudioListener();
	this.add( listenerAudio );
	// Sonidos pasos
	for (var i = 1; i < 12; i ++) {
		(new THREE.AudioLoader()).load( 'sounds/pasos/p'+i+'.mp3', function( buffer ) {
			soundPasos.push(buffer);
		});
	}
	Pistola = this.getObjectByName('Pistola');
	Obstacles = Obstacles = [].concat.apply([], [].concat.apply([], scene.getObjectByName('Obstacles').children.map(ch => ch.children.map(ch2 => ch2.children))));
	Enemies = scene.getObjectByName('Enemies').children;
	Sangre = scene.getObjectByName('Sangre');
	this.Puntuacion = 0;
	// Marcador puntuación
	let capa = document.createElement('h1');
	capa.id = 'marcador';
	capa.setAttribute('stype', 'position:fixed;top:10px;right:10px;color:white;z-index:88888;');
	capa.innerHTML = '· 0 ·'
	document.body.appendChild(capa);
}

function update( event ) {
	
	delta = clock.getDelta();
	let lastPosition = this.position.clone();
	
	// Cursor rotate
	if (CursorPosition.last.x != CursorPosition.current.x) {
		let diffY = CursorPosition.current.x - CursorPosition.last.x;
		rotateAroundWorldAxis(this, new THREE.Vector3(0,1,0), diffY);
		CursorPosition.last.x = CursorPosition.current.x;
	}
	
	if (CursorPosition.last.y != CursorPosition.current.y) {
		let mX = this.rotation._x,
			diffY = CursorPosition.current.y - CursorPosition.last.y;
		if ((CameraControlX > -1 || diffY > 0) && (CameraControlX < 1 || diffY < 0))
			rotateAroundObjectAxis(this, new THREE.Vector3(1,0,0), diffY);
		CursorPosition.last.y = CursorPosition.current.y;
	}
	
	// Key move
	let running = false;
	if (KeyPressed.w) {
		this.translateZ((Apuntando ? -SpeedApuntando : -SpeedCorriendo) * delta);
		this.position.y = 1;
		running = true;
	}
	if (KeyPressed.s) {
		this.translateZ((Apuntando ? SpeedApuntando : SpeedCorriendo) * delta);
		this.position.y = 1;
		running = true;
	}
	if (KeyPressed.a) {
		this.translateX((Apuntando ? -SpeedApuntando : -SpeedCorriendo) * delta);
		running = true;
	}
	if (KeyPressed.d) {
		this.translateX((Apuntando ? SpeedApuntando : SpeedCorriendo) * delta);
		running = true;
	}
	
	// Detectar colisiones
	let Sphere = new THREE.Sphere(this.getWorldPosition(new THREE.Vector3()), .5);
	if (checkCollision(Sphere)) {
		this.position.x = lastPosition.x;
		this.position.z = lastPosition.z;
	}
	
	// Detectas golpes de enemigos
	if (noHit < 0 && checkHitEmenies(Sphere)) {
		Die = Die < 0 ? .3 : Die + .3;
		Sangre.material.opacity = Die * 2;
		noHit = .5;
		let rand = Math.round(Math.random() * 2 + 1),
			spriteMap = new THREE.TextureLoader().load('sprites/sangre'+rand+'.png'),
			spriteMaterial = new THREE.SpriteMaterial({map: spriteMap, color: 0xffffff}),
			sprite = new THREE.Sprite(spriteMaterial);
		sprite.position.x += Math.random() > 0.6 ? 0.6 : -0.6;
		sprite.position.y += Math.random() / 2 - 0.25;
		Sangre.add(sprite);
		scene.playSound('oh', 1, false);
	} else {
		Die -= delta / 10;
		Sangre.material.opacity = Die;
		noHit -= delta;	
	}
	[].concat(Sangre.children).forEach((s) => s.material.opacity -= delta / 10);
	
	// Sonidos latido
	 if (Die > .5) {
		scene.stopSound('latido1');
		scene.playSound('latido2', 1, true);
	} else if (Die > .1) {
		scene.stopSound('latido2');
		scene.playSound('latido1', 1, true);
	} else {
		scene.stopSound('latido1');
		scene.stopSound('latido2');
	}
	
	// Game over
	if (Die > 1) {
		if (confirm("!!Game over!! \n Tu puntuación ha sido de "+this.Puntuacion+" \n ¿Reiniciar partida?")) {
			document.location.reload();
		} else {
			document.location.href = 'https://www.ci-bus.com/three-js-fps-game/';
		}
	}
		
	// Controls
	if (Apuntando != KeyPressed[' ']) {
		this.getObjectByName('Pistola').Apuntando = Apuntando = KeyPressed[' '];
	}
	
	// Movimiento pistola al correr
	if (!Apuntando) {
		moverPistolaAlCorrer(running);
	}
	
	// Sonido corriendo
	if (running && !Apuntando) {
		scene.playSound('running', .4, true);
	} else {
		scene.pauseSound('running');
	}
}

function checkCollision (meshSphere) {
	var collised = false;
	Obstacles.forEach((meshDetect) => {
		if (!collised) {
			var bounding = new THREE.Box3().setFromObject(meshDetect);
			collised = bounding.intersectsSphere(meshSphere);
		}
	});
	return collised;
}

function checkHitEmenies (meshSphere) {
	var collised = false;
	Enemies.forEach((meshDetect) => {
		if (!collised) {
			var bounding = new THREE.Box3().setFromObject(meshDetect);
			collised = bounding.intersectsSphere(meshSphere);
		}
	});
	return collised;
}

var direUpMoverPistola = true;
function moverPistolaAlCorrer (running) {
	let nsum = running ? .15 : .02;
	if (direUpMoverPistola) {
		if (Pistola.position.y < -.28) {
			Pistola.position.y += nsum * delta;
			Pistola.rotateY(-nsum * delta);
		} else direUpMoverPistola = false;
	} else {
		if (Pistola.position.y > -.32) {
			Pistola.position.y -= nsum * delta;
			Pistola.rotateY(nsum * delta);
		} else direUpMoverPistola = true;
	}
}

function playSoundPaso (pos) {
	let soundGun = new THREE.Audio( listenerAudio );
	soundGun.setBuffer(soundPasos[pos]);
	soundGun.setLoop(false);
	soundGun.setVolume(0.3);
	soundGun.play();
}

function canvasLoop(e) {
	var movementX = e.movementX || e.mozMovementX || 0;
	var movementY = e.movementY || e.mozMovementY ||  0;
	CursorPosition.current.x -= movementX / 100; 
	CursorPosition.current.y -= movementY / 100;
}

function canvasPointerLock() {
	var canvas = document.querySelector('canvas');
	canvas.requestPointerLock = canvas.requestPointerLock || canvas.mozRequestPointerLock || canvas.webkitRequestPointerLock;
	canvas.requestPointerLock();	
}

function rotateAroundObjectAxis(object, axis, radians) {
    let rotObjectMatrix = new THREE.Matrix4();
    rotObjectMatrix.makeRotationAxis(axis.normalize(), radians);
    object.matrix.multiply(rotObjectMatrix);
    object.rotation.setFromRotationMatrix(object.matrix);
	CameraControlX += radians;
}
      
function rotateAroundWorldAxis(object, axis, radians) {
    let rotWorldMatrix = new THREE.Matrix4();
    rotWorldMatrix.makeRotationAxis(axis.normalize(), radians);
	rotWorldMatrix.multiply(object.matrix);
    object.matrix = rotWorldMatrix;
	object.rotation.setFromRotationMatrix(object.matrix);
}

// Listeners
document.onkeydown = (e) => KeyPressed[e.key.toLowerCase()] = true;
document.onkeyup = (e) => KeyPressed[e.key.toLowerCase()] = false;
document.addEventListener("mousemove", canvasLoop, false);
document.addEventListener("click", canvasPointerLock, false);

function stop () {
	scene.stopSound('latido1');
	scene.stopSound('latido2');
	document.onkeydown = undefined;
	document.onkeyup = undefined;
	document.removeEventListener("mousemove", canvasLoop, false);
	document.removeEventListener("click", canvasPointerLock, false);
	document.getElementById('marcador').remove();
}