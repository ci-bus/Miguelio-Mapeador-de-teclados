let macrosTamanio = 50;

export default cb.define({
    xtype: 'store',
    name: 'editMacro',
    data: {
        macro: 0,
        saving: 0,
        progress: 0,
        actions: [/* {
            action: 'down',
            addr: 128 - 202
        }, {
            action: 'up',
            addr: 0 - 74
        } */]
    },
    clearAll () {
        let data = this.getData();
        data.actions = [];
        data.saving = data.progress = 0;
        this.storelink();
    },
    addAction (action, addr) {
        let date = new Date();
        if (this.data.actions.length < macrosTamanio) {
            this.data.actions.push({
                action, addr, id: date.getTime() + '' + date.getMilliseconds()
            });
            this.storelink();
        } else {
            if (!$('#alertmaxmacros').length) {
                cb.create({
                    xtype: 'alert',
                    type: 'danger',
                    prependTo: '#editMacroContainer',
                    id: 'alertmaxmacros',
                    text: 'Se ha superado el máximo de acciones.'
                });
            }
        }
    },
    removeAction (id) {
        let count = 0;
        this.data.actions.forEach(act => {
            if (act.id == id) this.data.actions.splice(count, 1);
            count ++;
        });
        this.storelink();
    },
    setMacro (macro) {
        this.data.macro = macro;
    },
    setSaving (saving) {
        let data = this.getData();
        data.saving = saving;
        data.progress = Math.round(saving * 100 / data.actions.length);
    },
    progressSave () {
        let data = this.getData();
        if (data.saving < data.actions.length) {
            let keyAddr = data.actions[data.saving];
            keyAddr = keyAddr.action == 'down' ? keyAddr.addr + 128 : keyAddr.addr;
            cb.getController('mapeador').socket.emit('putMacro', data.macro, data.saving, keyAddr);
            this.setSaving(data.saving + 1);
        } else {
            cb.getController('mapeador').socket.emit('putMacro', data.macro, data.saving, 0);
            this.finishSaving();
        }
        this.storelink();
    },
    finishSaving () {
        this.clearAll();
        cb.create({
            xtype: 'h3', color: 'green',
            align: 'center', glyphicon: 'ok',
            text: ' Macro guardado',
            renderTo: '#editMacroLoading',
            items: {
                xtype: 'container',
                type: 'fluid',
                css: {
                    'padding-top': 30
                },
                items: {
                    xtype: 'button',
                    type: 'primary',
                    text: 'Aceptar',
                    click () {
                        cb.getCmp(this).up('panel').up().remove();
                        cb.getController('mapeador').testMode(false);
                    }
                }
            }
        });
    }
});