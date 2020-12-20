import keyCmp from './key.js';

export default {
    xtype: 'div',
    id: 'testKeys',
    renderTo: '#content',
    items: {
        xtype: 'div',
        store: 'models',
        storelink: true,
        field: 'elementalv1', // By defect
        overflow: 'auto',
        css: {
            'padding-bottom': 50
        },
        alterdata (data) {
            if (data.title != "FN") return data;
        },
        items: [{
            xtype: 'h3',
            text: 'Presione las teclas para comprobar su funcionamiento',
            align: 'center'
        }, {
            xtype: 'div',
            overflow: 'auto',
            width: 900,
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
                        let cmp = cb.getCmp(this),
                            record = cmp.getRecord(),
                            keyboard = cb.getCmp('#keyboard');

                        if (!record.special) {
                            cb.getController('mapeador').showModalEditKey(cmp.getRecord());
                            keyboard.down('button.btn-success').removeClass('btn-success');
                            cmp.queryClose('button').addClass('btn-success');
                        }
                    }
                }
            }
        }]
    },
    setModelRecord (keyboardModel) {
        this.items.field = keyboardModel;
        return this;
    }
};