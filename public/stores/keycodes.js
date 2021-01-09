const madeKeys = (lts, cds) => {
    let data = [],
        letters = lts.split('|'),
        codes = cds.split('|');
    for (let i = 0; i < codes.length; i ++) {
        data.push({
            letter: letters[i],
            code: parseInt(codes[i])
        });
    }
    return data;
};

export default cb.define({
    xtype: 'store',
    name: 'keycodes',
    data: {
        letters: {
            title: 'Letras',
            keys: madeKeys(
                'A|B|C|D|E|F|G|H|I|J|K|L|M|N|Ñ|O|P|Q|R|S|T|U|V|W|X|Y|Z',
                '140|141|142|143|144|145|146|147|148|149|150|151|152|153|187|154|155|156|157|158|159|160|161|162|163|164|165'
            )
        },
        numbers: {
            title: 'Números',
            keys: madeKeys(
                '1 !|2 @|3 #|4 $|5 %|6 &|7 /|8 (|9 )|0 =',
                '166|167|168|169|170|171|172|173|174|175'
            )
        },
        modifiers: {
            title: 'Modificadores',
            keys: madeKeys(
                'FN|MIDI|SPACE|MAYUS|SHIFT|ALTGR|CTRL|ALT|CMD|WIN|BORRAR|TAB|ENTER|ESC|INSERT|SUPR|HOME|END|CTRL 2',
                '22|23|180|193|133|134|128|130|131|131|178|179|176|177|209|212|210|213|132'
            )
        },
        symbols: {
            title: 'Símbolos',
            keys: madeKeys(
                '> <|\' ?|¡ ¿|` [|+ ]|´ {|ç }|\, ;|. :|- _|º \\|/|*|-|+|=',
                '189|181|182|183|184|188|186|190|191|192|236|220|221|222|223|239'
            )
        },
        others: {
            title: 'Otros',
            keys: madeKeys(
                'UP|DOWN|LEFT|RIGHT|F1|F2|F3|F4|F5|F6|F7|F8|F9|F10|F11|F12|M1|M2|M3|M4|M5|M6',
                '218|217|216|215|194|195|196|197|198|199|200|201|202|203|204|205|700|701|702|703|704|705'
            )
        },
        mac_only: {
            title: 'Solo para MAC',
            keys: madeKeys(
                'MUTE|VOL +|VOL -|LUZ +|LUZ -',
                '427|428|429|406|405'
            )
        },
        multimedia: {
            title: 'Multimedia',
            keys: madeKeys(
                'VOL +|VOL -|MUTE|PLAY|PAUSE|STOP|NEXT|PREVIOUS|FORWARD|REWIND',
                '600|601|602|603|604|605|606|607|608|609'
            )
        }
    },
    getKey (code) {
        return Object.entries(this.data).map(kc=>kc[1].keys).flat().find(key => key.code == code);
    }
});