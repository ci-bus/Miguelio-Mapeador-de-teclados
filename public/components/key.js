export default cb.define({
    xtype: 'component',
    name: 'key',
    items: {
        xtype: 'button',
        type: 'primary',
        width: '{width}',
        height: '{height}',
        text: '{letter}',
        padding: 0,
        alterdata (record, opt) {
            // Defaults
            record.width = (record.width || 50) * (record.u || 1);
            record.height = (record.height || 50);
            if (record.special === 1) {
                opt.visibility = 'hidden';
            }
            if (record.clicked) {
                opt.type = 'success';
            } else if (record.buttonType) {
                opt.type = record.buttonType;
            }
            return record;
        }
    }
});