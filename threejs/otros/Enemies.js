var Player,
	Obstacles,
	Clock = new THREE.Clock(),
	Delta;

function init () {
	Delta = Clock.getDelta();
    Player = scene.getObjectByName('Player');
	Obstacles = [].concat.apply([], [].concat.apply([], scene.getObjectByName('Obstacles').children.map(ch => ch.children.map(ch2 => ch2.children))));
	[].concat(this.children).forEach((ball) => {
		ball.props = {
			type: 1,
			speed: 3,
			minY: -.5,
			clone () {
				return Object.assign({}, this);
			}
		};
		ball.material = ball.material.clone();
		ball.geometry = ball.geometry.clone();
		ball.initGeometry = ball.geometry.clone();
		ball.initPosition = ball.position.clone();
		ball.dontMove = 0;
	});
}

function cloneMesh (mesh, material) {
	// Create mesh with geometry and material
	let newMesh = new THREE[mesh.constructor.name](mesh.geometry.clone(), material);
	// Set position, scale, rotation and visibility
	newMesh.position.copy(mesh.position);
	newMesh.scale.copy(mesh.scale);
	newMesh.rotation.copy(mesh.rotation);
	newMesh.visible = mesh.visible;
	newMesh.castShadow = mesh.castShadow;
	// Add children
	[].concat(mesh.children).forEach((ch) => newMesh.add(cloneMesh(ch)));
	return newMesh;
}

function createBall (mesh, material) {
	let ball = cloneMesh(mesh, material);
	ball.props = mesh.props.clone();
	return ball;
}

function update () {
	Delta = Clock.getDelta();
	[].concat(this.children).forEach((ball) => {
		if (ball.doExplode) {
			if (!ball.dataExplode) {
				// Create child
				switch (ball.props.type) {
					case 1:
						// Create children balls
						var material = ball.material.clone();
						material.color.setHex(0x0433FF);
						material.emissive.setHex(0x040015);
						material.specular.setHex(0x04ADFF);
						[[-1,-1], [1,-1], [-1,1], [1,1]].forEach((dire) => {
							let chBall = createBall(ball, material.clone());
							chBall.scale.copy(new THREE.Vector3(1, 1, 1));
							chBall.props = {
								type: 2,
								count: 0.1,
								speed: 2,
								speedMove: 2,
								initSalto: 4,
								salto: Math.random() * 6,
								minY: 0,
								movX: dire[0],
								movZ: dire[1],
								desv: 3,
								noCheckCollision: 0,
								clone () {
									return Object.assign({}, this);
								}
							};
							chBall.scale.copy(new THREE.Vector3(1.5, 1.5, 1.5));
							// Add ball to scene
							this.add(chBall);
						});
						break;
					case 2:
						// Create children balls
						var material = ball.material.clone();
						material.color.setHex(0xFF0000);
						material.emissive.setHex(0x2B0600);
						material.specular.setHex(0xFFAB9D);
						[[-1,-1], [1,-1], [-1,1], [1,1]].forEach((dire) => {
							let chBall = createBall(ball, material.clone());
							chBall.scale.copy(new THREE.Vector3(1, 1, 1));
							// Jump random
							let b = Math.random() * 4 + 4,
								c = chBall.position.y,
								x = Math.abs((-b+Math.sqrt(Math.pow(b,2)-4*c))/2);
							chBall.props = {
								type: 3,
								count: x,
								speed: 2.5,
								speedMove: 3,
								initSalto: 5,
								salto: b,
								minY: -.1,
								movX: dire[0],
								movZ: dire[1],
								desv: 5,
								noCheckCollision: 0,
								clone () {
									return Object.assign({}, this);
								}
							};
							// Add ball to scene
							this.add(chBall);
						});
						break;
				}
				// Init model to explode
				initModelo(ball);
				// Para sonido tension
				scene.stopSound('tension');
				// Reproduce sonido explosion
				let distance = ball.getWorldPosition(new THREE.Vector3()).distanceTo(Player.position);
				scene.playSound('explosion', (100 - distance) / 100);
				Player.Puntuacion += ball.props.type;
				document.getElementById('marcador').innerHTML = '· '+Player.Puntuacion+' ·';
			}
			explode(ball);
			var materiales = [].concat(ball.material);
			if (materiales[0].opacity <= 0) {
				if (ball.props.type === 1) {
					ball.position.set(ball.initPosition.x, -2, ball.initPosition.z);
					ball.geometry.copy(ball.initGeometry);
					materiales[0].opacity = 1;
					ball.doExplode = false;
					ball.dataExplode = undefined;
					ball.dontMove = 30;
				} else {
					ball.geometry.dispose();
					materiales.forEach((m) => m.dispose());
					this.remove(ball);
				}
			}
		} else {
			switch (ball.props.type) {
				case 1: 
					if (ball.dontMove <= 0) {
						moveEnemy(ball);
					} else {
						ball.dontMove -= Delta;
					}
					break;
				case 2: moveEnemy2(ball); break;
				case 3: moveEnemy2(ball); break;
			}
		}
	});
}

function moveEnemy (mesh) {
	var props = mesh.props,
		toSum = props.speed * Delta,
		lastPos = mesh.position.clone();
	
	let distance = mesh.getWorldPosition(new THREE.Vector3()).distanceTo(Player.position);
	if (distance < 15) {
		// Aparece
		if (mesh.position.y < props.minY) {
			mesh.position.y += toSum;
		} else {
			// Check direction of Player
			let diffX = Player.position.x - mesh.position.x,
				diffZ = Player.position.z - mesh.position.z,
				diffXZ = Math.abs(diffX) + Math.abs(diffZ);
			// Move
			mesh.position.x += diffX * toSum / diffXZ;
			mesh.position.z += diffZ * toSum / diffXZ;
		}
		let volume = 1 - distance / 15;
		scene.playSound('tension', volume, true);
	} else {
		// Se esconde
		if (mesh.position.y > -2) {
			mesh.position.y -= toSum / 4;
		}
	}
}

function stop () {
	scene.stopSound('tension');		
}

function moveEnemy2 (mesh) {
	let props = mesh.props,
		toSum = props.speed * Delta;
	var lastPos = mesh.position.clone(),
		distance = mesh.getWorldPosition(new THREE.Vector3()).distanceTo(Player.position);;

	mesh.position.y = (props.count * props.salto - Math.pow(props.count, 2)) + props.minY;
	mesh.position.x += props.movX * Delta;
	mesh.position.z += props.movZ * Delta;
	
	props.count += toSum;

	// If ball hit with ground
	if (props.minY > mesh.position.y) {
		props.count = 0;
		props.salto = props.initSalto;
		mesh.position.y = props.minY;
		if (distance < 25) {
			// Check direction of Player
			let diffX = Player.position.x - mesh.position.x,
				diffZ = Player.position.z - mesh.position.z,
				diffXZ = Math.abs(diffX) + Math.abs(diffZ),
				desv = Math.random() * props.desv - props.desv / 2;
			// Set movement with random desviation
			props.movX = diffX * props.speedMove / diffXZ + desv;
			props.movZ = diffZ * props.speedMove / diffXZ + desv;
		} else {
			let desv = Math.random() * props.desv - props.desv / 2;
			props.movX += desv;
			props.movZ += desv;
			if (mesh.scale.x < 2) {
				mesh.scale.x += .1;
				mesh.scale.y += .1;
				mesh.scale.z += .1;
				props.minY += .01;
			}
		}
		// Sonido rebote
		let volume = 0.5 - distance / 50;
		if (volume > 0) {
			scene.playSound('rebote', volume, false);
		}
	} else if (props.noCheckCollision < 0 && checkCollision2(mesh)) {
		mesh.position.set(lastPos.x, lastPos.y, lastPos.z);
		let desv = Math.random() * props.desv - props.desv / 2;
		props.movX = (props.movX * -1 + desv) / 2;
		props.movZ = (props.movZ * -1 + desv) / 2;
		props.count = props.salto - props.count;
		props.noCheckCollision = .2;
	} else {
		props.noCheckCollision -= Delta;
	}
}

function checkCollision2 (mesh) {
	let position = mesh.getWorldPosition(new THREE.Vector3());
	var meshSphere = new THREE.Sphere(position, mesh.scale.x / 2);
	var collised = false;
	Obstacles.forEach((meshDetect) => {
		if (!collised) {
			var bounding = new THREE.Box3().setFromObject(meshDetect);
			collised = bounding.intersectsSphere(meshSphere);
			if (collised) debugger;
		}
	});
	return collised;
}

function initModelo (obj) {
	obj.dataExplode = {
		scale: .2,
		avgVertexNormals: [],
		avgVertexCount: []
	};
	obj.dataExplode.model = new THREE.Geometry().fromBufferGeometry(obj.geometry);
	obj.dataExplode.model.computeFaceNormals();
	obj.dataExplode.model.computeVertexNormals();
	obj.dataExplode.model.vertices.forEach(function (v) {
		v.velocity = Math.random() * 10 + 10;
	});
	for (var i = 0; i < obj.dataExplode.model.vertices.length; i++) {
		obj.dataExplode.avgVertexNormals.push(new THREE.Vector3(0, 0, 0));
		obj.dataExplode.avgVertexCount.push(0);
	}
	// Add all the normals
	obj.dataExplode.model.faces.forEach(function (f) {
		// Add the vector
		obj.dataExplode.avgVertexNormals[f.a].add(f.vertexNormals[0]);
		obj.dataExplode.avgVertexNormals[f.b].add(f.vertexNormals[1]);
		obj.dataExplode.avgVertexNormals[f.c].add(f.vertexNormals[2]);
		// Update the count
		obj.dataExplode.avgVertexCount[f.a] += 1;
		obj.dataExplode.avgVertexCount[f.b] += 1;
		obj.dataExplode.avgVertexCount[f.c] += 1;
	});
	// Calculate the average
	for (var i = 0; i < obj.dataExplode.avgVertexNormals.length; i++) {
		obj.dataExplode.avgVertexNormals[i].divideScalar(obj.dataExplode.avgVertexCount[i]);
	}
	delete obj.dataExplode.avgVertexCount;
}

function explode (obj) {
	var count = 0;
	obj.dataExplode.model.vertices.forEach(function (v) {
		v.x += (obj.dataExplode.avgVertexNormals[count].x * (v.velocity * Delta) * obj.dataExplode.scale);
		v.y += (obj.dataExplode.avgVertexNormals[count].y * (v.velocity * Delta) * obj.dataExplode.scale);
		v.z += (obj.dataExplode.avgVertexNormals[count].z * (v.velocity * Delta) * obj.dataExplode.scale);
		count++;
	});
	obj.dataExplode.model.verticesNeedUpdate = true;
	obj.geometry = new THREE.BufferGeometry().fromGeometry(obj.dataExplode.model);
	desaparecer(obj);
}

function desaparecer (obj) {
	obj.material.transparent = true;
	obj.material.opacity -= Delta * 2;
}