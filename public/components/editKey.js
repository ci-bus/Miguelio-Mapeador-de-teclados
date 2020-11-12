export default {
    xtype: 'row',
    defaults: {
        xtype: 'col',
        align: 'center'
    },
    items: [{
        size: 3,
        items: {
            xtype: 'button',
            type: 'success',
            id: 'key'
        }
    }, {
        size: 5,
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
                    value: '{code}'
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
        size: 4,
        items: [{
            xtype: 'button',
            type: 'primary',
            glyphicon: 'ok',
            text: ' Aceptar',
            click () {
                let et = cb.getCmp(this).up('row'),
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
                cb.getCmp('panel').up().remove();
            }
        }]
    }]
};