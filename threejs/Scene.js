function init() {

    //------------------------------// Configuración de luces y sombras \\----------------------------\\

    // Activa las sombras en el renderer
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    // Añade una luz
    var light = new THREE.SpotLight(0xffffff);
    light.castShadow = true; // activa las sombras
    light.position.y = 15;
    light.position.x = 5;
    scene.add(light);








    //------------------------------// Funciones control sonidos \\----------------------------------\\

    // Iniciar librerías sonidos
    scene.listenerAudio = new THREE.AudioListener();
    scene.add(scene.listenerAudio);
    scene.sounds = {};
    scene.audioLoader = new THREE.AudioLoader();
    // Pre-cargar .mp3s
    /* scene.audioLoader.load( 'sounds/background1.mp3', function( buffer ) {
    scene.sounds['background1'] = buffer;
    scene.playSound('background1', 0.3, true);
    }); */
	// Función reproducir mp3
    scene.playSound = function (name, volume, loop = false) {
        if (this.sounds[name]) {
            if (!loop || !this.sounds[name + '_sound']) {
                let sound = new THREE.Audio(this.listenerAudio);
                sound.setBuffer(this.sounds[name]);
                sound.setLoop(loop);
                sound.setVolume(volume);
                sound.play();
                if (loop) this.sounds[name + '_sound'] = sound;
            } else {
                if (!this.sounds[name + '_sound'].isPlaying) {
                    this.sounds[name + '_sound'].play();
                }
                this.sounds[name + '_sound'].setVolume(volume);
            }
        }
    }
    // Funcion pausar
    scene.pauseSound = function (name) {
        if (this.sounds[name + '_sound'] && this.sounds[name + '_sound'].isPlaying) {
            this.sounds[name + '_sound'].pause();
        }
    }
    // Funcion parar
    scene.stopSound = function (name) {
        if (this.sounds[name + '_sound'] && this.sounds[name + '_sound'].isPlaying) {
            this.sounds[name + '_sound'].stop();
        }
    }











    //----------------------------------// Otras funciones \\---------------------------------\\

    // Captura el cursor en el canvas para que no se vea y pueda rotar sin límites
    scene.captureCursor = () => {
        let canvas = document.querySelector('canvas');
        canvas.requestPointerLock = canvas.requestPointerLock || canvas.mozRequestPointerLock || canvas.webkitRequestPointerLock;
        canvas.requestPointerLock();
    };
	// Función para poner a pantalla completa
	scene.fullScreen = () => {
		let canvas = document.querySelector('body');
		canvas.requestFullscreen = canvas.requestFullscreen ||
			canvas.mozRequestFullscreen ||
			canvas.mozRequestFullScreen ||
			canvas.webkitRequestFullscreen;
		canvas.requestFullscreen();
	};











    //----------------------// Funciones para cargar librerías externas \\------------------------\\

    // Funcion para cargar JavaScript dinámicamente
    scene.loadScript = function (urls, callback) {
        let url = urls.splice(0, 1);
        if (!document.querySelector(`script[src="${url}"]`)) {
            var head = document.getElementsByTagName('head')[0];
            var script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = url;
            if (urls.length) {
                script.onload = () => {
                    scene.loadScript(urls, callback);
                };
            } else {
                script.onload = callback;
            }
            head.appendChild(script);
        } else if (callback) {
            callback();
        }
    }
    // Función para cargar CSS dinámicamente
    scene.loadCss = function (hrefs, callback) {
        let href = hrefs.splice(0, 1);
        if (!document.querySelector(`link[href="${href}"]`)) {
            var head = document.getElementsByTagName('head')[0];
            var css = document.createElement('link');
            css.rel = 'stylesheet';
            css.href = href;
            if (hrefs.length) {
                css.onload = () => {
                    scene.loadCss(hrefs, callback);
                };
            } else {
                css.onload = callback;
            }
            head.appendChild(css);
        } else if (callback) {
            callback();
        }
    }









    //--------------------------// Funciones para la creación de clientes \\---------------------------\\

    // Funcion crear cliente
    scene.createClient = function (id, pos) {
        var clientGeometry = new THREE.BoxGeometry();
        var clientMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
        var clientMesh = new THREE.Mesh(clientGeometry, clientMaterial);
        clientMesh.receiveShadow = true;
        clientMesh.castShadow = true;
        clientMesh.position.x = pos.x;
        clientMesh.position.z = pos.z;
        clientMesh.position.y = 0.5;
        clientMesh.name = id;
        let Sphere = new THREE.Sphere(new THREE.Vector3(), .5);
        clientMesh.add(Sphere);
        scene.add(clientMesh);
    }
    // Funcion para mover a un cliente
    scene.moveClient = function (client) {
        let clientMesh = scene.getObjectByName(client.id);
        if (clientMesh) {
            clientMesh.position.x = client.x;
            clientMesh.position.z = client.z;
        } else {
            console.warn('El cliente que intenta mover no existe');
        }
    }
    // Funcion para eliminar un cliente desconectado
    scene.removeClient = function (id) {
        var clientMesh = scene.getObjectByName(id);
        scene.remove(clientMesh);
    }







    //--------------------------------//  Configuraciones del socket  \\-------------------------------\\

    scene.configureSocket = () => {
        scene.loadScript(["/socket.io/socket.io.js"], () => {
            // Conexión a socket
            scene.socket = io();
            // Mensaje inicial todos los clientes conectados
            scene.socket.on('all-clients', allClients => {
                scene.clients = allClients;
                Object.entries(scene.clients).forEach(cli => {
                    scene.createClient(cli[0], cli[1]);
                });
            });
            // Un Cliente se ha conetado
            scene.socket.on('new-client', client => {
                scene.clients[client.id] = client;
                scene.createClient(client.id, client);
            });
			// Un cliente se ha movido
            scene.socket.on('move-client', client => {
                scene.moveClient(client);
            });
            // Un cliente se ha desconectado
            scene.socket.on('del-client', clientId => {
                delete scene.clients[clientId];
                scene.removeClient(clientId);
            });
        });
    };









    //--------------------------//  Cargamos ci-bus y otras librerias  \\----------------------------\\

    // Bootstrap
    scene.loadCss(["/node_modules/bootstrap3/dist/css/bootstrap.min.css"]);
    // jQuery y ci-bus
    scene.loadScript(["/node_modules/jquery/dist/jquery.min.js", "/ci-bus.js"], () => {
		
		// Crea store con datos de configuracion
		cb.define({
			xtype: 'store',
			name: 'cc',
			data: {
				selected: { src: '/textures/blue_green_box.png', hex: '#008e8e'},
				colors: [{ src: '/textures/black_box.png', hex: '#313131' },
					{ src: '/textures/blue_box.png', hex: '#00568e'},
					{ src: '/textures/blue_green_box.png', hex: '#008e8e'},
					{ src: '/textures/green_box.png', hex: '#1b8e00'},
					{ src: '/textures/orange_box.png', hex: '#faa300'},
					{ src: '/textures/pink_box.png', hex: '#8e0069'},
					{ src: '/textures/purple_box.png', hex: '#6037b1'},
					{ src: '/textures/red_box.png', hex: '#8e0000'},
					{ src: '/textures/yellow_box.png', hex: '#ded500'}],
				name: 'Cliente ' + Math.round(Math.random() * 1000)
			}
		});

        ///////////////////////////////////////////////////
        // Crear menú inicial elección de nombre y color //
        ///////////////////////////////////////////////////
        cb.create({
            xtype: 'container',
            id: 'menu',
            appendTo: 'body',
            css: {
                position: 'fixed',
                top: 100, left: 0,
				width: '100%'
            },
            cls: 'text-center',
            items: {
                xtype: 'row',
                items: [{
                    xtype: 'col',
                    size: { sm: 1, md: 2, lg: 3 }
                }, {
                    xtype: 'col',
                    size: { sm: 10, md: 8, lg: 6 },
                    items: {
                        xtype: 'panel',
                        type: 'primary',
                        items: [{
                            xtype: 'head',
                            title: 'Elije lo que más te guste'
                        }, {
                            xtype: 'body',
							cls: 'text-left',
                            items: [{
								xtype: 'row',
								items: [{
									xtype: 'col',
									size: 3,
									items: {
										xtype: 'img',
										store: 'cc',
										field: 'selected',
										storelink: true,
										width: '90%',
										src: '{src}'
									}
								}, {
									xtype: 'col',
									size: 9,
									items: [{
										xtype: 'h4',
										text: 'Apodo'
									}, {
										xtype: 'input',
										store: 'cc',
										value: '{name}',
										name: 'name',
										width: '200px',
										change() {
											let name = cb.getCmp(this).val();
											cb.getStore('cc').setData(name, 'name');	
										}
									}, {
										xtype: 'h4',
										text: 'Color',
										css: {'margin-top': 20}
									}, {
										xtype: 'img',
										store: 'cc',
										field: 'colors',
										width: 48,
										src: '{src}',
										cursor: 'pointer',
										click () {
											let color = cb.getCmp(this).getRecord();
											cb.getStore('cc').setData(color, 'selected');
										}
									}]
								}]
							}]
                        }, {
                            xtype: 'footer',
                            css: {
                                text: 'center'
                            },
                            items: {
                                xtype: 'button',
								type: 'primary',
                                text: 'Entrar',
                                click() {
                                    scene.comenzar();
                                }
                            }
                        }]
                    }
                }]
            }
        });
    });










    //-----------------------------------//  FUNCIÓN COMENZAR  \\------------------------------------\\
	
    scene.comenzar = () => {

        // Coger datos seleccionados en el menú (nombre y color)
		let nameClient = cb.getStore('cc').getData('name');
		let colorClient = cb.getStore('cc').getData('selected');
        // Cambiar color al marerial del body
		scene.getChildByName('Body').material.color = new THREE.Color(colorClient.hex);
        // Setea nombre y color de cliente al User
		scene.getChildByName('User').nameClient = nameClient;
		scene.getChildByName('User').colorClient = colorClient.hex;
		

        // Elimina el menú
        $('#menu').remove();
        // Aplica un evento click en el document para capturar el cursor
        document.addEventListener("click", scene.captureCursor, false);
        // Captura el cursor en el canvas para que no se véa y pueda girar sin límites
        scene.captureCursor();
		// Pone la web a pantalla completa
		scene.fullScreen();
        // Configura el socket y crea los demás clientes
        scene.configureSocket(nameClient);
    }
	
	
	
	
	
	
	
	//-------------------------------------// Función abrir página web \\--------------------------------------\\
	scene.openWeb = (url) => {
		if (!cb.getCmp('#menu')) {
			// Crea menú con opción a visitar la tienda
			cb.create({
				xtype: 'container',
				id: 'menu',
				appendTo: 'body',
				css: {
					position: 'fixed',
					top: 100, left: 0,
					width: '100%'
				},
				cls: 'text-center',
				items: {
					xtype: 'row',
					items: [{
						xtype: 'col',
						size: { xs: 1, sm: 2, md: 3, lg: 4 }
					}, {
						xtype: 'col',
						size: { xs: 10, sm: 8, md: 6, lg: 4 },
						items: {
							xtype: 'panel',
							type: 'primary',
							items: [{
								xtype: 'head',
								title: 'Visitar tienda online'
							}, {
								xtype: 'body',
								items: [{
									xtype: 'h3',
									text: url
								}]
							}, {
								xtype: 'footer',
								css: {
									text: 'center'
								},
								click () {
									$('#menu').remove();
								},
								items: [{
									xtype: 'a',
									cls: 'btn btn-default',
									margin: '0 5px 0',
									html: 'Cancelar'
								}, {
									xtype: 'a',
									href: 'https://' + url,
									target: '_blank',
									cls: 'btn btn-primary',
									text: 'Visitar tienda'
								}]
							}]
						}
					}]
				}
			});
			// Muestra el cursor
			document.exitPointerLock();
		}
	}
}





function stop() {
    // Cerrar socket
    if (scene.socket) scene.socket.close();
    // Eliminar menú si aún existe
    $('#menu').remove();
    // Elimina event click document para capturar cursor
    document.removeEventListener("click", scene.captureCursor);
}