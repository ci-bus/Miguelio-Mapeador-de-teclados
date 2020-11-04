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
	/* new THREE.AudioLoader()).load( 'sounds/pasos/p'+i+'.mp3', function( buffer ) {
			soundPasos.push(buffer);
		});
	}
	Pistola = this.getObjectByName('Pistola');
	Enemies = scene.getObjectByName('Enemies').children;
	Sangre = scene.getObjectByName('Sangre');
    */
	Obstacles = [].concat.apply([], scene.getObjectByName('Obstacles').children.map(ch => ch.children));
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
		this.position.y = 0;
		running = true;
	}
	if (KeyPressed.s) {
		this.translateZ((Apuntando ? SpeedApuntando : SpeedCorriendo) * delta);
		this.position.y = 0;
		running = true;
	}
	if (KeyPressed.a) {
		this.translateX((Apuntando ? -SpeedApuntando : -SpeedCorriendo) * delta);
		this.position.y = 0;
		running = true;
	}
	if (KeyPressed.d) {
		this.translateX((Apuntando ? SpeedApuntando : SpeedCorriendo) * delta);
		this.position.y = 0;
		running = true;
	}
	
	// Detectar colisiones
	let Sphere = new THREE.Sphere(this.getWorldPosition(new THREE.Vector3()), .5);
	if (checkCollision(Sphere)) {
		this.position.x = lastPosition.x;
		this.position.z = lastPosition.z;
		running = false;
	}

	//scene.playSound('running', .4, true);
	if (running) {
		scene.socket.emit('move', {
			name: this.nameClient,
			color: this.colorClient,
			x: this.position.x,
			z: this.position.z,
			y: this.position.y
		});
	}
}

function canvasLoop(e) {
	var movementX = e.movementX || e.mozMovementX || 0;
	var movementY = e.movementY || e.mozMovementY ||  0;
	CursorPosition.current.x -= movementX / 1000; 
	CursorPosition.current.y -= movementY / 1000;
}

function checkCollision (meshSphere) {
	var collised = false;
	Obstacles.forEach((meshDetect) => {
		if (!collised) {
			var bounding = new THREE.Box3().setFromObject(meshDetect);
            collised = bounding.intersectsSphere(meshSphere);
            if (collised) {
                scene.openWeb(meshDetect.name);
            }
		}
	});
	return collised;
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

function stop () {
	//scene.stopSound('latido2');
	document.onkeydown = undefined;
	document.onkeyup = undefined;
	document.removeEventListener("mousemove", canvasLoop, false);
}