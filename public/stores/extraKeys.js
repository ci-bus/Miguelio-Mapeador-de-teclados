export default cb.define({
    xtype: 'store',
    name: 'extraKeys',
    data: [{
        addr: 248,
        letter: '50 milisegundos'
    }, {
        addr: 249,
        letter: '100  milisegundos'
    }, {
        addr: 250,
        letter: '250  milisegundos'
    }, {
        addr: 251,
        letter: '500  milisegundos'
    }, {
        addr: 252,
        letter: '1 segundo'
    }, {
        addr: 253,
        letter: '2 segundo'
    }, {
        addr: 254,
        letter: '5 segundo'
    }, {
        addr: 255,
        letter: '10 segundo'
    }],
    getAction (addr) {
        return this.getData().find(a => a.addr == addr);
    }
});