// Models
import elementalv1 from './models/elementalv1.js';

cb.define({
    xtype: 'store',
    name: 'ports'
});

cb.define({
    xtype: 'store',
    name: 'keycodesTail',
    data: [],
    applying: false,
    addKey (key) {
        this.data.push(key);
        if (!this.applying) {
            this.proccessTail();
        }
    },
    proccessTail () {
        if (this.data.length) {
            this.applying = true;
            cb.getCmp('#content').hide();
            let loadingText = 'Aplicando ' + this.data.length;
            loadingText += this.data.length === 1 ? ' cambio' : ' cambios';
            cb.getCmp('#loading').show().down('#loading-msg').text(loadingText);
            let key = this.data.splice(0, 1)[0];
            cb.getController('mapeador').socket.emit('putKeyCode', key.position, key.code);
            this.storelink();
        } else {
            this.applying = false;
            cb.getCmp('#loading').hide();
            cb.getCmp('#content').show();
        }
    }
})

cb.define({
    xtype: 'component',
    name: 'header',
    renderTo: '#header',
    items: [{
        xtype: 'nav',
        type: 'default static-top',
        items: [{
            xtype: 'header',
            items: [{
                xtype: 'img',
                src: '/img/miguelio.png'
            }]
        }, {
            xtype: 'collapse',
            items: [{
                xtype: 'navbar',
                type: 'right',
                items: [{
                    xtype: 'dropdown',
                    text: ' Puertos USB ',
                    glyphicon: 'flash',
                    items: [{
                        xtype: 'a',
                        store: 'ports',
                        storelink: true,
                        text: '{manufacturer}',
                        cursor: 'pointer',
                        click () {
                            cb.getController('mapeador').socket.emit('selectPort', cb.getCmp(this).getRecord());
                            cb.getCmp('#content').hide();
                        }
                    }]
                }, {
                    xtype: 'button',
                    margin: '8px 0 0',
                    glyphicon: 'repeat',
                    click () {
                        location.reload();
                    }
                }]
            }]
        }]
    }]
});

cb.define({
    xtype: 'store',
    name: 'codes',
    data: {
        elementalv1: (() => {
            let data = [],
                letter = 'A|B|C|D|E|F|G|H|I|J|K|L|M|N|Ñ|O|P|Q|R|S|T|U|V|W|X|Y|Z|1 !|2 @|3 #|4 $|5 &|6 &|7 /|8 (|9 )|0 =|SPACE|MAYUS|SHIFT|ALTGR|CTRL|ALT|CMD|WIN|UP|DOWN|LEFT|RIGHT|BORRAR|TAB|ENTER|ESC|INSERT|SUPR|HOME|END|FN|CTRL 2|FN 2|F1|F2|F3|F4|F5|F6|F7|F8|F9|F10|F11|F12|> <|\' ?|¡ ¿|` [|+ ]|´ {|ç }|\, ;|. :|- _|º \\'.split('|'),
                codes = '140|141|142|143|144|145|146|147|148|149|150|151|152|153|187|154|155|156|157|158|159|160|161|162|163|164|165|166|167|168|169|170|171|172|173|174|175|180|-4|133|134|128|130|131|131|218|217|216|215|178|179|176|27|209|212|210|213|-1|132|-2|194|195|196|197|198|199|200|201|202|203|204|205|189|181|182|183|184|188|186|190|191|192|236'.split('|');
            for (let i = 0; i < codes.length; i ++) {
                data.push({
                    letter: letter[i],
                    code: parseInt(codes[i])
                });
            }
            return data;
        })()
    },
    getKey (model, code) {
        return this.data[model].find(key => key.code == code);
    }
});

cb.define({
    xtype: 'store',
    name: 'models',
    setKey (model, position, data) {
        let rows = this.data[model].rows;
        rows.forEach(row => {
            row.keys.forEach(key => {
                if (key.position == position) {
                    key.letter = data.letter;
                    key.code = data.code;
                    key.buttonType = data.buttonType | 'info';
                }
            })
        });
        this.storelink(model);
    },
    getKey (model, position) {
        let rows = this.data[model].rows;
        return rows.map(row=>row.keys.find(k=>k.position==position)).filter(k=>k)[0];
    },
    data: {
        elementalv1
    }
});

cb.define({
    xtype: 'component',
    name: 'key',
    items: {
        xtype: 'button',
        type: 'primary',
        width: '{width}',
        height: '{height}',
        text: '{letter}',
        padding: 0,
        alterdata (record, opt) {
            // Defaults
            record.width = (record.width || 50) * (record.u || 1);
            record.height = (record.height || 50);
            if (record.special === 1) {
                opt.visibility = 'hidden';
            }
            if (record.buttonType) {
                opt.type = record.buttonType;
            }
            return record;
        }
    }
});

cb.define({
    xtype: 'component',
    name: 'edita_tecla',
    display: 'none',
    items: [{
        xtype: 'br'
    }, {
        xtype: 'panel',
        css: {
            'max-width': 600
        },
        margin: 'auto',
        items: [{
            xtype: 'head',
            text: 'Configuración de tecla'
        }, {
            xtype: 'div',
            margin: 10,
            items: [{
                xtype: 'row',
                defaults: {
                    xtype: 'col',
                    size: 4,
                    align: 'center'
                },
                items: [{
                    items: {
                        xtype: 'button',
                        type: 'success',
                        id: 'key'
                    }
                }, {
                    items: {
                        xtype: 'toolbar',
                        defaults: {
                            display: 'inline'
                        },
                        items: [{
                            xtype: 'select',
                            name: 'letter',
                            width: 'auto',
                            padding: 5,
                            change () {
                                let cmp = cb.getCmp(this),
                                    input = cmp.queryClose('input'),
                                    option = cmp.down('option:selected');
                                if (cmp.getValue()) {
                                    input.val(cmp.getValue());
                                }
                                cmp.queryClose('button').text(
                                    option ? option.text() : input.val()
                                );
                            },
                            items: {
                                store: 'codes',
                                storelink: true,
                                field: 'elementalv1',
                                text: '{letter}',
                                value: '{code}',
                                
                            }
                        }, {
                            xtype: 'input',
                            type: 'numeric',
                            name: 'code',
                            width: 60,
                            placeholder: 'Código',
                            padding: 5,
                            keyup () {
                                cb.getCmp(this).queryClose('select').val(cb.getCmp(this).getValue()).trigger('change');
                            }
                        }]
                    }
                }, {
                    items: [{
                        xtype: 'button',
                        text: 'Aplicar',
                        click () {
                            let et = cb.getCmp('edita_tecla'),
                                record = et.getRecord(),
                                position = record.position,
                                letter = et.down('option:selected').text(),
                                code = et.down('input[name="code"]').getValue();
                            cb.getStore('models').setKey('elementalv1', position, {
                                letter, code
                            });
                            let tailStore = cb.getStore('keycodesTail');
                            tailStore.addKey({
                                position, code
                            });
                            et.hide();
                        }
                    }, {
                        xtype: 'button',
                        text: 'Cancelar',
                        click () {
                            cb.getCmp('edita_tecla').hide();
                        }
                    }]
                }]
            }]
        }]
    }]
});

cb.define({
    xtype: 'view',
    name: 'main',
    renderTo: 'body',
    items: [{
        xtype: 'container',
        type: 'fluid',
        id: 'header'
    }, {
        xtype: 'container',
        type: 'fluid',
        id: 'content',
        items: [{
            xtype: 'h4',
            text: 'Selecciona el puerto USB donde esta conectado el teclado',
            align: 'center'
        }]
    }, {
        xtype: 'container',
        id: 'loading',
        display: 'none',
        html: `<div class="sk-cube-grid">
            <div class="sk-cube sk-cube1"></div>
            <div class="sk-cube sk-cube2"></div>
            <div class="sk-cube sk-cube3"></div>
            <div class="sk-cube sk-cube4"></div>
            <div class="sk-cube sk-cube5"></div>
            <div class="sk-cube sk-cube6"></div>
            <div class="sk-cube sk-cube7"></div>
            <div class="sk-cube sk-cube8"></div>
            <div class="sk-cube sk-cube9"></div>
        </div>
        <h3 id="loading-msg" class="text-center"></h3>`
    }, {
        xtype: 'container',
        id: 'menu',
        items: [{
            xtype: 'edita_tecla',
        }]
    }]
});

cb.define({
  xtype: 'component',
  name: 'portInfo',
  renderTo: '#content',
  items: {
      xtype: 'container',
      align: 'center'
  }  
});

cb.define({
    xtype: 'component',
    name: 'elementalv1',
    appendTo: '#content',
    items: [{
        store: 'models',
        storelink: true,
        field: 'elementalv1',
        overflow: 'auto',
        items: {
            xtype: 'div',
            id: 'keyboard',
            overflow: 'auto',
            width: 880,
            margin: 'auto',
            padding: 2,
            items: {
                xtype: 'div',
                field: 'rows',
                css: {
                    'margin-top': 5
                },
                items: {
                    xtype: 'key',
                    field: 'keys',
                    click () {
                        let et = cb.getCmp('edita_tecla'),
                            cmp = cb.getCmp(this),
                            record = cmp.getRecord(),
                            keyboard = cb.getCmp('#keyboard');

                        if (!record.special) {
                            et.setRecord(cmp.getRecord());
                            et.show();
                            et.down('select[name="letter"]').val(record.code);
                            et.down('input[name="code"]').val(record.code).trigger('focus');
                            et.down('#key').html(record.letter);
                            keyboard.down('button.btn-success').removeClass('btn-success');
                            cmp.queryClose('button').addClass('btn-success');
                        }
                    }
                }
            }
        }
    }]
});

cb.define({
    xtype: 'controller',
    name: 'mapeador',
    onload () {
        let ctr = this;
        ctr.socket = io.connect('http://localhost', { 'forceNew': true });

        ctr.socket.on('portsList', (data) => {
            cb.getStore('ports').setData(data);
            cb.getComponent('header').render();
        });

        ctr.socket.on('portConnected', (data) => {
            // Renderiza información puerto abierto
            let info = cb.getComponent('portInfo');
            info.items.items = {
                xtype: 'h3',
                id: 'portinfo-msg',
                glyphicon: 'flash',
                text: data.manufacturer
            };
            info.render();
            // Muestra cargando
            cb.getCmp('#loading').show().down('#loading-msg').text(' ');
        });

        ctr.socket.on('fromArduino', data => {
            switch (data[0]) {
                case 'model': 
                    ctr.selectedModel = data[1];
                    switch (data[1]) {
                        case 'elementalv1':
                            cb.create({
                                text: ' - Elemental V1',
                                appendTo: '#portinfo-msg'
                            });
                            cb.getCmp('#loading-msg').text('Elemental V1');
                            break;
                    }
                    ctr.socket.emit('getKeyCodes');
                    break;
                case 'keycode': 
                    if (parseInt(data[2]) === 0 || parseInt(data[2]) == 255) {
                        // Pre-configura la tecla
                        let key = cb.getStore('models').getKey(ctr.selectedModel, data[1]);
                        if (key && key.code) {
                            cb.getStore('keycodesTail').addKey(key);
                        }
                    } else {
                        let keycode = cb.getStore('codes').getKey(ctr.selectedModel, data[2]);
                        cb.getStore('models').setKey(ctr.selectedModel, data[1], {
                            letter: keycode ? keycode.letter : ' ',
                            code: keycode ? parseInt(keycode.code) : 0,
                            buttonType: 'primary'
                        });
                    }
                    break;
                case 'get':
                    if (cb.getStore('keycodesTail').getData().length) {
                        cb.getCmp('#content').hide();
                    } else {
                        cb.getCmp('#loading').hide();
                        cb.getCmp('#content').show();
                    }
                    cb.getComponent(ctr.selectedModel).render();
                    break;
                case 'put':
                    cb.getStore('keycodesTail').proccessTail();
                    break;
            }
        });

        ctr.socket.on('disconnect', () => {
            location.reload();
        });

        ctr.socket.on('error', () => {
            location.reload();
        });

        ctr.socket.emit('getPortsList');
    }
});