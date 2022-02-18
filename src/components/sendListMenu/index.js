const fs = require('fs');
const SendVoice = require('../sendVoice/');
const master = require('./master');

class SendListMenu {
    constructor({ client, message }) {
        this.client = client;
        this.message = message;
        this.sendVoice = new SendVoice({ client, message });
    }

    categoryList = async () => {
        const message = this.message, client = this.client;
        await client.sendListMenu(message.from, 'BOT GIVE AWAY', 'SubTitle', 'Silahkan pilih menu', 'Lihat Menu', master.listMenu)
            .then(async (result) => {
                console.log('Result: ', result.status);
                this.sendVoice.filesource('./public/audio/gt_female/flow_order_from_listmenu.mp3');
            })
            .catch((error) => {
                console.error('Error SendListMenu@categoryList: ', error); //return object error
            });
    }

    packetList = async () => {
        const message = this.message, client = this.client;
        await client.sendListMenu(message.from, "PULSA REGULER", 'SubTitle', 'Silahkan pilih paket', 'Lihat Paket', master.listPulsa)
            .then(async (result) => {
                console.log('Result: ', result.status);
                this.sendVoice.filesource('./public/audio/gt_female/flow_order_from_listpaket.mp3');
            })
            .catch((error) => {
                console.error('Error SendListMenu@packetList: ', error); //return object error
            });
    }

    opsiNomorTujuan = async (tag, listNomorTujuan) => {
        const message = this.message, client = this.client;
        var title = tag[0] + ' ' + tag[1] + ' ' + tag[2]
        var opsiNomorTujuan = [
            {
                title: title,
                rows: listNomorTujuan
            }
        ];
        await client.sendListMenu(message.from, title, 'SubTitle', 'Silahkan pilih nomor tujuan', 'Pilih Nomor Tujuan', opsiNomorTujuan)
            .then(async (result) => {
                console.log('Result: ', result.status);
            })
            .catch((error) => {
                console.error('Error SendListMenu@packetList: ', error); //return object error
            });
    }

}
module.exports = SendListMenu;