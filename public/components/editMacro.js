let capturando = false;

export default {
    xtype: 'div',
    renderTo: '#modal-content',
    items: [{
        xtype: 'div',
        id: 'editMacroLoading',
        items: [{
            xtype: 'div',
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
            <h3 class="text-center">Aplicando cambios</h3>`
        }, {
            xtype: 'div',
            id: 'editMacroProgress',
            //display: 'none',
            items: {
                xtype: 'progress',
                margin: 0,
                defaults: {
                    min: 0,
                    max: 100
                },
                items: [{
                    store: 'editMacro',
                    storelink: true,
                    striped: true,
                    animated: true,
                    value: '{progress}',
                    text: '{progress}%'
                }]
            }
        }]
    }, {
        xtype: 'container',
        id: 'editMacroContainer',
        display: 'none',
        type: 'fluid',
        items: [{
            xtype: 'button',
            type: 'primary',
            text: 'Capturar teclas',
            click () {
                capturando = !capturando;
                cb.getController('mapeador').socket.emit(capturando ? 'enableTestMode' : 'disableTestMode');
                cb.getCmp(this).toggleClass('btn-warning').text(capturando ? 'Dejar de capturar' : 'Capturar teclas');
                cb.getCmp(this).queryClose('.btn-success').css('display', capturando ? 'none' : 'block');
            }
        }, {
            xtype: 'button',
            type: 'success',
            text: 'Guardar',
            pull: 'right',
            click () {
                if (capturando) {
                    cb.getController('mapeador').socket.emit('disableTestMode');
                    capturando = false;
                }
                cb.getCmp('#editMacroContainer').hide();
                cb.getStore('editMacro').setSaving(0);
                cb.getCmp('#editMacroLoading, #editMacroProgress').show();
                setTimeout(() => cb.getStore('editMacro').progressSave(), 1000);
            }
        }, {
            xtype: 'thumbnail',
            height: 300,
            overflow: 'auto',
            css: {
                'margin-top': 10
            },
            items: {
                xtype: 'alert',
                type: 'info',
                store: 'editMacro',
                field: 'actions',
                storelink: true,
                padding: '2px 5px',
                margin: '1px 0px',
                items: [{
                    xtype: 'glyphicon', 
                    type: 'menu-{action}',
                    margin: '0 10px 0 5px', size: 16
                }, {
                    field: 'addr',
                    alterdata (addr) {
                        let ctr = cb.getController('mapeador'),
                            models = cb.getStore('models'),
                            key = models.getKey(ctr.selectedModel, addr);
                        return cb.create({
                            xtype: 'button',
                            type: 'primary',
                            size: 'xs',
                            text: key.letter
                        });
                    }
                }, {
                    xtype: 'button',
                    type: 'danger',
                    size: 'xs',
                    pull: 'right',
                    glyphicon: 'remove',
                    click () {
                        let record = cb.getCmp(this).getRecord();
                        cb.getStore('editMacro').removeAction(record.id);
                    }
                }]
            }
            
        }]
    }],
    onRender () {
        cb.getStore('editMacro').clearAll();
        setTimeout(() => {
            cb.getCmp('#editMacroLoading').hide();
            cb.getCmp('#editMacroContainer').show();
        }, 2000);
    }
};