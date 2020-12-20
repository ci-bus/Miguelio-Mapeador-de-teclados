export default cb.define({
    xtype: 'store',
    name: 'codes',
    data: {
        elementalv1: (() => {
            let data = [],
                letter = '|A|B|C|D|E|F|G|H|I|J|K|L|M|N|Ñ|O|P|Q|R|S|T|U|V|W|X|Y|Z|1 !|2 @|3 #|4 $|5 %|6 &|7 /|8 (|9 )|0 =|SPACE|MAYUS|SHIFT|ALTGR|CTRL|ALT|CMD|WIN|UP|DOWN|LEFT|RIGHT|BORRAR|TAB|ENTER|ESC|INSERT|SUPR|HOME|END|CTRL 2|FN|F1|F2|F3|F4|F5|F6|F7|F8|F9|F10|F11|F12|MIDI|> <|\' ?|¡ ¿|` [|+ ]|´ {|ç }|\, ;|. :|- _|º \\|/|*|-|+|=|MUTE|VOL +|VOL -'.split('|'),
                codes = '0|140|141|142|143|144|145|146|147|148|149|150|151|152|153|187|154|155|156|157|158|159|160|161|162|163|164|165|166|167|168|169|170|171|172|173|174|175|180|193|133|134|128|130|131|131|218|217|216|215|178|179|176|177|209|212|210|213|132|22|194|195|196|197|198|199|200|201|202|203|204|205|23|189|181|182|183|184|188|186|190|191|192|236|220|221|222|223|239|427|428|429'.split('|');
            for (let i = 0; i < codes.length; i ++) {
                data.push({
                    letter: letter[i],
                    code: parseInt(codes[i])
                });
            }
            return data;
        })()
    },
    getKey (model, code) {
        return this.data[model].find(key => key.code == code);
    }
});