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
                    let cmp = cb.getCmp(this),
                        code = cmp.getValue(),
                        select = cmp.queryClose('select');
                    select.val(code);
                    let option = select.down('option:selected');
                    cmp.queryClose('button').text(
                        option ? option.text() : code
                    );
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
                let ctr = cb.getController('mapeador'),
                    et = cb.getCmp(this).up('row'),
                    record = et.getRecord(),
                    position = record.position,
                    letter = et.down('option:selected').text(),
                    code = et.down('input[name="code"]').getValue(),
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
                    tailStore.addKey({
                        position: position2,
                        code: 0
                    });
                }
                if (code == 22) {
                    let position2 = position < keyCount ? position + keyCount : position - keyCount;
                    models.setKey(ctr.selectedModel, position2, {
                        letter, code
                    });
                    tailStore.addKey({
                        position: position2,
                        code
                    });
                }
                models.setKey(ctr.selectedModel, position, {
                    letter, code
                });
                tailStore.addKey({
                    position, code
                });
                cb.getCmp('panel').up().remove();
            }
        }]
    }]
};