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
                        cb.getView('main').render();
                        cb.getController('mapeador').socket.emit('getPortsList');
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
                letter = 'A|B|C|D|E|F|G|H|I|J|K|L|M|N|Ñ|O|P|Q|R|S|T|U|V|W|X|Y|Z|1 !|2 @|3 #|4 $|5 &|6 &|7 /|8 (|9 )|0 =|SPACE|MAYUS|SHIFT|ALTGR|CTRL|ALT|CMD|WIN|UP|DOWN|LEFT|RIGHT|BORRAR|TAB|ENTER|ESC|INSERT|SUPR|HOME|END|F1|F2|F3|F4|F5|F6|F7|F8|F9|F10|F11|F12|> <|\' ?|¡ ¿|` [|+ ]|´ {|ç }|\, ;|. :|- _|CTRL 2|FN 1|FN 2'.split('|'),
                codes = '140|141|142|143|144|145|146|147|148|149|150|151|152|153|187|154|155|156|157|158|159|160|161|162|163|164|165|166|167|168|169|170|171|172|173|174|175|180|-4|133|134|128|130|131|131|218|217|216|215|178|179|176|27|209|212|210|213|194|195|196|197|198|199|200|201|202|203|204|205|189|181|182|183|184|188|186|190|191|192|132|1|2'.split('|');
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
        elementalv1: {
            rows: [{
                keys: [{
                    letter: 'ESC',
                    position: 0,
                    code: 27
                }, {
                    letter: '1 !',
                    position: 1,
                    code: 166
                }, {
                    letter: '2 @',
                    position: 2,
                    code: 167
                }, {
                    letter: '3 #',
                    position: 3,
                    code: 168
                }, {
                    letter: '4 $',
                    position: 4,
                    code: 169
                }, {
                    letter: '5 %',
                    position: 5,
                    code: 170
                }, {
                    letter: '6 &',
                    position: 6,
                    code: 171
                }, {
                    letter: '7 /',
                    position: 7,
                    code: 172
                }, {
                    letter: '8 (',
                    position: 8,
                    code: 173
                }, {
                    letter: '9 )',
                    position: 9,
                    code: 174
                }, {
                    letter: '0 =',
                    position: 10,
                    code: 175
                }, {
                    letter: '\' ?',
                    position: 11,
                    code: 181
                }, {
                    letter: '¿ ¡',
                    position: 12,
                    code: 182
                }, {
                    letter: 'BORRAR',
                    position: 28,
                    u: 2,
                    code: 178
                }, {
                    letter: 'F12',
                    position: 14,
                    code: 205
                }]
            }, {
                keys: [{
                    letter: 'TAB',
                    position: 15,
                    u: 1.5,
                    code: 179
                }, {
                    letter: 'Q',
                    position: 16,
                    code: 156
                }, {
                    letter: 'W',
                    position: 17,
                    code: 162
                }, {
                    letter: 'E',
                    position: 18,
                    code: 144
                }, {
                    letter: 'R',
                    position: 19,
                    code: 157
                }, {
                    letter: 'T',
                    position: 20,
                    code: 159
                }, {
                    letter: 'Y',
                    position: 21,
                    code: 164
                }, {
                    letter: 'U',
                    position: 22,
                    code: 160
                }, {
                    letter: 'I',
                    position: 23,
                    code: 148
                }, {
                    letter: 'O',
                    position: 24,
                    code: 154
                }, {
                    letter: 'P',
                    position: 25,
                    code: 155
                }, {
                    letter: '` [',
                    position: 26,
                    code: 183
                }, {
                    letter: '+ ]',
                    position: 27,
                    code: 184
                }, {
                    letter: 'ENTER',
                    position: 43,
                    u: 1.5,
                    code: 176
                }, {
                    letter: 'SUPR',
                    position: 29,
                    code: 212
                }]
            }, {
                keys: [{
                    letter: 'MAYUS',
                    position: 30,
                    u: 1.75,
                    code: -4
                }, {
                    letter: 'A',
                    position: 31,
                    code: 140
                }, {
                    letter: 'S',
                    position: 32,
                    code: 158
                }, {
                    letter: 'D',
                    position: 33,
                    code: 143
                }, {
                    letter: 'F',
                    position: 34,
                    code: 145
                }, {
                    letter: 'G',
                    position: 35,
                    code: 146
                }, {
                    letter: 'H',
                    position: 36,
                    code: 147
                }, {
                    letter: 'J',
                    position: 37,
                    code: 149
                }, {
                    letter: 'K',
                    position: 38,
                    code: 150
                }, {
                    letter: 'L',
                    position: 39,
                    code: 151
                }, {
                    letter: 'Ñ',
                    position: 40,
                    code: 187
                }, {
                    letter: '´ {',
                    position: 41,
                    code: 188
                }, {
                    letter: 'Ç }',
                    position: 42,
                    code: 186
                }, {
                    u: 1.25,
                    special: 1
                }, {
                    letter: 'HOME',
                    position: 44,
                    code: 210
                }]
            }, {
                keys: [{
                    letter: 'SHIFT',
                    position: 45,
                    u: 1.25,
                    code: 133
                }, {
                    letter: '> <',
                    position: 46,
                    code: 189
                }, {
                    letter: 'Z',
                    position: 47,
                    code: 165
                }, {
                    letter: 'X',
                    position: 48,
                    code: 163
                }, {
                    letter: 'C',
                    position: 49,
                    code: 142
                }, {
                    letter: 'V',
                    position: 50,
                    code: 161
                }, {
                    letter: 'B',
                    position: 51,
                    code: 141
                }, {
                    letter: 'N',
                    position: 52,
                    code: 153
                }, {
                    letter: 'M',
                    position: 53,
                    code: 152
                }, {
                    letter: ',',
                    position: 54,
                    code: 190
                }, {
                    letter: '.',
                    position: 55,
                    code: 191
                }, {
                    letter: '-',
                    position: 56,
                    code: 192
                }, {
                    letter: 'SHIFT',
                    position: 57,
                    u: 1.75,
                    code: 133
                }, {
                    letter: 'UP',
                    position: 58,
                    code: 218
                }, {
                    letter: 'END',
                    position: 59,
                    code: 213
                }]
            }, {
                keys: [{
                    letter: 'CTRL',
                    position: 60,
                    u: 1.25,
                    code: 128
                }, {
                    letter: 'ALT',
                    position: 61,
                    u: 1.25,
                    code: 130
                }, {
                    letter: 'CMD',
                    position: 62,
                    u: 1.25,
                    code: 131
                }, {
                    letter: 'SPACE',
                    position: 66,
                    u: 6.75,
                    code: 180
                }, {
                    letter: 'ALTGR',
                    position: 69,
                    u: 1,
                    code: 134
                }, {
                    letter: 'FN1',
                    position: 70,
                    u: 1,
                    code: 1
                }, {
                    letter: 'FN2',
                    position: 71,
                    u: 1,
                    code: 2
                }, {
                    letter: 'LEFT',
                    position: 72,
                    u: 1,
                    code: 216
                }, {
                    letter: 'DOWN',
                    position: 73,
                    u: 1,
                    code: 217
                }, {
                    letter: 'RIGHT',
                    position: 74,
                    u: 1,
                    code: 215
                }]
            }]
        }
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
                            record = cmp.getRecord()
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
        ctr.socket = s = io.connect('http://localhost', { 'forceNew': true });

        s.on('portsList', (data) => {
            cb.getStore('ports').setData(data);
            cb.getComponent('header').render();
        });

        s.on('portConnected', (data) => {
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

        s.on('fromArduino', data => {
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
                    s.emit('getKeyCodes');
                    break;
                case 'keycode': 
                    if (!parseInt(data[2])) {
                        // Pre-configura la tecla
                        let key = cb.getStore('models').getKey(ctr.selectedModel, data[1]),
                            tailStore = cb.getStore('keycodesTail');
                        if (key) {
                            tailStore.addKey(key);
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
                    cb.getComponent(ctr.selectedModel).render();
                    cb.getCmp('#loading').hide();
                    cb.getCmp('#content').show();
                    break;
                case 'put':
                    cb.getStore('keycodesTail').proccessTail();
                    break;
            }
        });

        s.on('disconnect', () => {
            location.reload();
        });

        s.on('error', () => {
            location.reload();
        });

        s.emit('getPortsList');
    }
});