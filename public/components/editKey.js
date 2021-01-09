import editMacroCmp from './editMacro.js';

const btnAction = function () {
    let ctr = cb.getController('mapeador'),
        btn = cb.getCmp(this),
        et = btn.up('row'),
        record = et.getRecord(),
        position = record.position,
        letter = btn.getRecord().letter,
        code = btn.getRecord().code,
        models = cb.getStore('models'),
        tailStore = cb.getStore('keycodesTail'),
        key = models.getKey(ctr.selectedModel, position),
        keyCount = models.getKeyCount(ctr.selectedModel);
    // Secure FN key assign
    if (key.code == 22) {
        let position2 = position < keyCount ? position + keyCount : position - keyCount;
        models.setKey(ctr.selectedModel, position2, {
            letter: '', code: 0
        });
        tailStore.addKey(ctr.selectedModel, {
            position: position2,
            code: 0
        });
    }
    if (code == 22) {
        let position2 = position < keyCount ? position + keyCount : position - keyCount;
        models.setKey(ctr.selectedModel, position2, {
            letter, code
        });
        tailStore.addKey(ctr.selectedModel, {
            position: position2,
            code
        });
    }
    models.setKey(ctr.selectedModel, position, {
        letter, code
    });
    tailStore.addKey(ctr.selectedModel, {
        position, code
    });
    // Macros
    if (code >= 700 && code < 706) {
        cb.getStore('editMacro').setMacro(code - 700);
        cb.create(editMacroCmp);
    } else {
        cb.getCmp('panel').up().remove();
    }
};

export default {
    xtype: 'row',
    css: {
        'margin-top': -10
    },
    defaults: {
        xtype: 'col',
        align: 'center'
    },
    items: [{
        size: 12,
        items: {
            xtype: 'tabpanel',
            store: 'keycodes',
            items: [{
                id: 'letters',
                active: true,
                tab: {
                    field: 'letters',
                    text: '{title}'
                },
                panel: {
                    xtype: 'container',
                    type: 'fluid',
                    field: 'letters',
                    padding: '10px 0px',
                    items: {
                        xtype: 'button',
                        type: 'primary',
                        field: 'keys',
                        margin: 3,
                        text: '{letter}',
                        click: btnAction
                    }
                }
            }, {
                id: 'numbers',
                tab: {
                    field: 'numbers',
                    text: '{title}'
                },
                panel: {
                    xtype: 'container',
                    type: 'fluid',
                    field: 'numbers',
                    padding: '10px 0px',
                    items: {
                        xtype: 'button',
                        type: 'primary',
                        field: 'keys',
                        margin: 3,
                        text: '{letter}',
                        click: btnAction
                    }
                }
            }, {
                id: 'modifiers',
                tab: {
                    field: 'modifiers',
                    text: '{title}'
                },
                panel: {
                    xtype: 'container',
                    type: 'fluid',
                    field: 'modifiers',
                    padding: '10px 0px',
                    items: {
                        xtype: 'button',
                        type: 'primary',
                        field: 'keys',
                        margin: 3,
                        text: '{letter}',
                        click: btnAction
                    }
                }
            }, {
                id: 'symbols',
                tab: {
                    field: 'symbols',
                    text: '{title}'
                },
                panel: {
                    xtype: 'container',
                    type: 'fluid',
                    field: 'symbols',
                    padding: '10px 0px',
                    items: {
                        xtype: 'button',
                        type: 'primary',
                        field: 'keys',
                        margin: 3,
                        text: '{letter}',
                        click: btnAction
                    }
                }
            }, {
                id: 'others',
                tab: {
                    field: 'others',
                    text: '{title}'
                },
                panel: {
                    xtype: 'container',
                    type: 'fluid',
                    field: 'others',
                    padding: '10px 0px',
                    items: {
                        xtype: 'button',
                        type: 'primary',
                        field: 'keys',
                        margin: 3,
                        text: '{letter}',
                        click: btnAction
                    }
                }
            }, {
                id: 'mac_only',
                tab: {
                    field: 'mac_only',
                    text: '{title}'
                },
                panel: {
                    xtype: 'container',
                    type: 'fluid',
                    field: 'mac_only',
                    padding: '10px 0px',
                    items: {
                        xtype: 'button',
                        type: 'primary',
                        field: 'keys',
                        margin: 3,
                        text: '{letter}',
                        click: btnAction
                    }
                }
            }, {
                id: 'multimedia',
                tab: {
                    field: 'multimedia',
                    text: '{title}'
                },
                panel: {
                    xtype: 'container',
                    type: 'fluid',
                    field: 'multimedia',
                    padding: '10px 0px',
                    items: {
                        xtype: 'button',
                        type: 'primary',
                        field: 'keys',
                        margin: 3,
                        text: '{letter}',
                        click: btnAction
                    }
                }
            }, {
                id: 'ninguna',
                tab: {
                    text: 'Ninguna',
                    record: {
                        letter: '',
                        code: 0
                    },
                    click: btnAction
                }
            }]
        }
    }]
};