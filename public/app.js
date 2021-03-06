// Main view
import mainView from './views/main.js';

// Stores
import portStore from './stores/ports.js';
import keycodesTailStore from './stores/keycodesTail.js';
import keyCodesStore from '../stores/keycodes.js';
import modelsStore from './stores/models.js';
import editMacroStore from '../stores/editMacro.js';

// Components
import headerCmp from './components/header.js';
import editKeyCmp from './components/editKey.js';
import keyboard from './components/keyboard.js';
import testKeys from './components/testKeys.js';
import models from './stores/models.js';

cb.define({
    xtype: 'controller',
    name: 'mapeador',
    onload () {
        let ctr = this;
        cb.zIndex = 1001;

        mainView.render();
        headerCmp.render();

        ctr.socket = io.connect('http://localhost', { 'forceNew': true });

        ctr.socket.on('portsList', (data) => {
            portStore.setData(data);
        });

        ctr.socket.on('portConnected', (data) => {
            cb.getCmp('#loading').show().down('#loading-msg').text(data.manufacturer);
        });

        ctr.socket.on('fromArduino', data => {
            switch (data[0]) {
                case 'model': 
                    ctr.selectedModel = data[1];
                    switch (data[1]) {
                        case 'elementalv1':
                            cb.getCmp('#loading-msg').text('Elemental V1');
                            break;
                    }
                    ctr.socket.emit('getKeyCodes');
                    break;
                case 'keycode': 
                    if (parseInt(data[2]) < 0) {
                        // Pre-configura la tecla
                        let key = modelsStore.getKey(ctr.selectedModel, data[1]);
                        if (key && key.code) {
                            keycodesTailStore.addKey(ctr.selectedModel, key);
                        }
                    } else {
                        let keycode = keyCodesStore.getKey(data[2]);
                        modelsStore.setKey(ctr.selectedModel, data[1], {
                            letter: keycode ? keycode.letter : ' ',
                            code: keycode ? parseInt(keycode.code) : 0,
                            buttonType: 'primary'
                        });
                    }
                    break;
                case 'get':
                    cb.create(keyboard.setModelRecord(ctr.selectedModel));
                    cb.getCmp('#loading').hide();
                    cb.getCmp('#content').show();
                    cb.getCmp('#menuOpciones').show();
                    break;
                case 'put':
                    delete models.getKey(ctr.selectedModel, parseInt(data[1])).loading;
                    keycodesTailStore.proccessTail();
                    break;
                case 'putMacro':
                    editMacroStore.progressSave();
                    break;
                case 'modoTest':
                    editMacroStore.addAction(data[3], parseInt(data[2]) * 15 + parseInt(data[1]));
                    modelsStore.clickedKey(ctr.selectedModel, data[1], data[2]);
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
    },

    showModalEditKey (recordKey) {
        editKeyCmp.record = recordKey;
        cb.popup({
            type: 'default',
            onRender () {
                let cmp = cb.getCmp(this),
                    record = cmp.down('row').getRecord();
                cmp.down('select[name="letter"]').val(record.code).trigger('focus');
                cmp.down('input[name="code"]').val(record.code);
                cmp.down('#key').html(record.letter);
            },
            offsetTop: 100,
            css: {
                'max-width': 400
            },
            items: [{
                xtype: 'head',
                css: {'min-height': 40},
                items: [{
                    xtype: 'span',
                    glyphicon: 'remove',
                    cls: 'pull-right',
                    css: {
                cursor: 'pointer',
                        'padding-top': 4
                    },
                    listeners: {
                        click () {
                            cb.getCmp('panel').up().remove();
                            cb.getCmp('#keyboard')
                                .down('button.btn-success')
                                .removeClass('btn-success');
                        }
                    }
                },{
                    xtype: 'div',
                    size: 19,
                    html: 'Editar tecla',
                    cls: 'text-center'
                }]
            },{
                xtype: 'body',
                id: 'modal-content',
                items: editKeyCmp
            }]
        });
    },

    testMode (active) {
        let ctr = this;
        ctr.socket.emit(active ? 'enableTestMode' : 'disableTestMode');
        if (active) {
            cb.create(testKeys.setModelRecord(ctr.selectedModel));
        } else {
            modelsStore.resetAllClickedKeys(ctr.selectedModel);
            cb.create(keyboard.setModelRecord(ctr.selectedModel));
        }
    }
});