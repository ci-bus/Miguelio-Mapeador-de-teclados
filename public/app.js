cb.define({
    xtype: 'store',
    name: 'codes',
    data: {
        elementalv1: (() => {
            let data = [],
                letter = 'A|B|C|D|E|F|G|H|I|J|K|L|M|N|O|P|Q|R|S|T|U|V|W|X|Y|Z|1|2|3|4|5|6|7|8|9|0|SPACE|MAYUS|SHIFT|ALTGR|CTRL|ALT|CMD|WIN|UP|DOWN|LEFT|RIGHT|BORRAR|TAB|ENTER|ESC|INSERT|SUPR|HOME|END|F1|F2|F3|F4|F5|F6|F7|F8|F9|F10|F11|F12|> <|\' ?|¡ ¿|` [|+ ]|´ {|ç }|\, ;|. :|- _|CTRL 2|FN 1|FN 2'.split('|'),
                codes = '140|141|142|143|144|145|146|147|148|149|150|151|152|153|154|155|156|157|158|159|160|161|162|163|164|165|166|167|168|169|170|171|172|173|174|175|180|4|133|134|128|130|131|131|218|217|216|215|178|179|176|27|209|212|210|213|194|195|196|197|198|199|200|201|202|203|204|205|189|181|182|183|184|188|186|190|191|192|132|1|2'.split('|');
            for (let i = 0; i < codes.length; i ++) {
                data.push({
                    letter: letter[i],
                    code: parseInt(codes[i])
                });
            }
            return data;
        })()
    }
});

cb.define({
    xtype: 'store',
    name: 'models',
    data: {
        elementalv1: {
            rows: [{
                keys: [{
                    letter: 'ESC',
                    position: 0,
                    code: 27
                }, {
                    letter: '1',
                    position: 1,
                    code: 166
                }, {
                    letter: '2',
                    position: 2,
                    code: 167
                }, {
                    letter: '3',
                    position: 3,
                    code: 168
                }, {
                    letter: '4',
                    position: 4,
                    code: 169
                }, {
                    letter: '5',
                    position: 5,
                    code: 170
                }, {
                    letter: '6',
                    position: 6,
                    code: 171
                }, {
                    letter: '7',
                    position: 7,
                    code: 172
                }, {
                    letter: '8',
                    position: 8,
                    code: 173
                }, {
                    letter: '9',
                    position: 9,
                    code: 174
                }, {
                    letter: '0',
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
                    code: 4
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
                    letter: '-',
                    position: 43,
                    u: 1.25,
                    special: 1,
                    code: 176
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
        border: 0,
        padding: 0,
        alterdata (record, opt) {
            // Defaults
            record.width = (record.width || 50) * (record.u || 1);
            record.height = (record.height || 50);
            if (record.special === 1) {
                Object.assign(opt, {
                    color: '#337ab7',
                    position: 'relative',
                    top: -10
                });
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
        items: [{
            xtype: 'form',
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
                        type: 'dark',
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
                                cmp.queryClose('button').html(
                                    option ? option.html() : input.val()
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
                            width: 60,
                            placeholder: 'Código',
                            padding: 5,
                            name: 'code',
                            keyup () {
                                cb.getCmp(this).queryClose('select').val(cb.getCmp(this).getValue()).trigger('change');
                            }
                        }]
                    }
                }, {
                    items: [{
                        xtype: 'button',
                        text: 'Aplicar'
                    }, {
                        xtype: 'button',
                        text: 'Cancelar'
                    }]
                }]
            }]
        }]
    }]
});

cb.define({
    xtype: 'view',
    name: 'elementalv1',
    renderTo: 'body',
    items: [{
        xtype: 'container',
        type: 'fluid',
        id: 'header',
        items: [{
            xtype: 'h1',
            text: 'Mapeador de teclados'
        }]
    }, {
        xtype: 'container',
        type: 'fluid',
        store: 'models',
        storelink: true,
        field: 'elementalv1',
        overflow: 'auto',
        items: {
            xtype: 'div',
            overflow: 'auto',
            width: 875,
            margin:'auto',
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
                            record = cmp.getRecord();

                        if (!record.special) {
                            et.show();
                            et.down('select[name="letter"]').val(record.code);
                            et.down('input[name="code"]').val(record.code);
                            et.down('#key').html(record.letter);
                            cmp.queryClose('button.btn-success').removeClass('btn-success');
                            cmp.queryClose('button').addClass('btn-success');
                        }
                        
                    }
                }
            }
        }
    }, {
        xtype: 'container',
        id: 'menu',
        items: [{
            xtype: 'edita_tecla',
        }]
    }]
});

cb.define({
    xtype: 'controller',
    name: 'mapper',

    onload () {
        cb.getView('elementalv1').render();
    }
});