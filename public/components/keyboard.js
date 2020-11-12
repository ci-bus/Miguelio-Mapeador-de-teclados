import keyCmp from './key.js';

export default {
    xtype: 'div',
    id: 'keyboard',
    renderTo: '#content',
    items: {
        xtype: 'div',
        store: 'models',
        storelink: true,
        field: 'elementalv1', // By defect
        overflow: 'auto',
        items: [{
            xtype: 'h3',
            field: 'title',
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