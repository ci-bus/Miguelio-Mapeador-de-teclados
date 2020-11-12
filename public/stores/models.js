import elementalv1 from '../models/elementalv1.js';

export default cb.define({
    xtype: 'store',
    name: 'models',
    setKey (model, position, data) {
        let key = this.getKey(model, position);
        if (key) {
            key.letter = data.letter;
            key.code = data.code;
            key.buttonType = data.buttonType | 'info';
        }
        this.storelink(model);
    },
    getAllKeys (model) {
        return this.getData(model).map(maps => maps.rows).flat().map(row => row.keys).flat();
    },
    getKey (model, position) {
        let keys = this.getAllKeys(model);
        return keys.find(k=>k.position==position);
    },
    setTitle (model, title) {
        this.getData(model)[0].title = title;
    },
    data: {
        elementalv1
    }
});