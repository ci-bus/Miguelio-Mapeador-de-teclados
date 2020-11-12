export default cb.define({
    xtype: 'view',
    name: 'main',
    renderTo: 'body',
    items: [{
        xtype: 'container',
        type: 'fluid',
        padding: 0,
        id: 'header'
    }, {
        xtype: 'container',
        type: 'fluid',
        id: 'content',
        align: 'center',
        items: [{
            xtype: 'h4',
            padding: '10px 0 20px',
            text: 'Selecciona el puerto USB donde esta conectado el teclado'
        }, {
            xtype: 'button',
            type: 'primary',
            glyphicon: 'flash',
            store: 'ports',
            storelink: true,
            text: ' {manufacturer}',
            click () {
                cb.getController('mapeador').socket.emit('selectPort', cb.getCmp(this).getRecord());
                cb.getCmp('#content').hide();
            }
        }]
    }, {
        xtype: 'container',
        id: 'loading',
        display: 'none',
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
        <h3 id="loading-msg" class="text-center"></h3>`
    }, {
        xtype: 'container',
        id: 'menu',
        items: [{
            xtype: 'edita_tecla',
        }]
    }]
});