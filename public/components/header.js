export default cb.define({
    xtype: 'component',
    name: 'header',
    renderTo: '#header',
    items: [{
        xtype: 'nav',
        type: 'default static-top',
        items: [{
            xtype: 'header',
            items: [{
                xtype: 'img',
                src: '/img/miguelio.png'
            }]
        }, {
            xtype: 'collapse',
            items: [{
                xtype: 'navbar',
                type: 'right',
                items: [{
                    xtype: 'button',
                    type: 'danger',
                    margin: '8px 10px 0',
                    glyphicon: 'repeat',
                    click () {
                        location.reload();
                    }
                }]
            }, {
                xtype: 'navbar',
                type: 'right',
                id: 'menuOpciones',
                display: 'none',
                items: [{
                    xtype: 'button',
                    type: 'secondary',
                    margin: '8px 10px 0',
                    glyphicon: 'check',
                    text: ' Modo prueba',
                    click () {
                        this.active = !this.active;
                        cb.getController('mapeador').testMode(this.active);
                        cb.getCmp(this).toggleClass('btn-success');
                    }
                }]
            }]
        }]
    }]
});