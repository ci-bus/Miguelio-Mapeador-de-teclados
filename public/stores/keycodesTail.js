import models from './models.js';

export default cb.define({
    xtype: 'store',
    name: 'keycodesTail',
    data: [],
    applying: false,
    addKey (model, key) {
        this.data.push(key);
        models.getKey(model, key.position).loading = true;
        if (!this.applying) {
            this.proccessTail();
        }
    },
    proccessTail () {
        if (this.data.length) {
            this.applying = true;
            /*
            cb.getCmp('#content').hide();
            let loadingText = 'Aplicando ' + this.data.length;
            loadingText += this.data.length === 1 ? ' cambio' : ' cambios';
            cb.getCmp('#loading').show().down('#loading-msg').text(loadingText);
            */
            let key = this.data.splice(0, 1)[0];
            cb.getController('mapeador').socket.emit('putKeyCode', key.position, key.code);
            this.storelink();
        } else {
            this.applying = false;
            cb.getCmp('#loading').hide();
            cb.getCmp('#content').show();
        }
        models.storelink(cb.getController('mapeador').selectedModel);
    }
});