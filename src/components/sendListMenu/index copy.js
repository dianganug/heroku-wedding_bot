const fs = require('fs');
const master = require('./master');
const axios = require('axios');
const sendVoice = require('../sendVoice/');
class sendListMenu {

    constructor({ client, message }) {
        this.client = client;
        this.message = message;
        this.command = message.body.split("\n")[0];
        this.sendVoice = new sendVoice({ client, message });

        this.quotedMsgList = message.quotedMsg ?
            message.quotedMsg.type == 'chat' ? message.quotedMsg :
                message.quotedMsg.type == 'list' ? message.quotedMsg.list
                    : false : false;
    }

    prabayar = async () => {
        const message = this.message, client = this.client;
        const host = await client.getHostDevice();
        const quotedMsgList = this.quotedMsgList;
        let validQuotedMsg = message.quotedMsg ? {
            type: message.quotedMsg.type,
            isMention: message.quotedParticipant == host.wid._serialized,
            quoted: quotedMsgList,
            getAnswer: this.command,
            chatSourced: message.chat.lastReceivedKey,
        } : false;
        // console.log('validQuotedMsg ', validQuotedMsg);
        if (message.isGroupMsg === false) {
            // ---------------------------- BODY := >MENU ----------------------------
            if (message.body === '#MENU' || message.body === '#ROBOT') {
                client.sendListMenu(message.from, 'BOT GIVE AWAY', 'SubTitle', 'Silahkan pilih menu', 'Lihat Menu', master.listMenu)
                    .then(async (result) => {
                        console.log('Result: ', result.status);
                        this.sendVoice.filesource('./public/audio/gt_female/flow_order_from_listmenu.mp3');
                    })
                    .catch((error) => {
                        console.error('Error when sendListMenu: ', error); //return object error
                    });
            }
            if (validQuotedMsg.isMention && validQuotedMsg) {
                // ---------------------------- BODY := >MENU>PULSA_REGULER ----------------------------
                if (validQuotedMsg.getAnswer === '#PULSA_REGULER') {
                    client.sendListMenu(message.from, "PULSA REGULER", 'SubTitle', 'Silahkan pilih paket', 'Lihat Paket', master.listPulsa)
                        .then(async (result) => {
                            console.log('Result: ', result.status);
                            this.sendVoice.filesource('./public/audio/gt_female/flow_order_from_listpaket.mp3');
                        })
                        .catch((error) => {
                            console.error('Error when sendListMenu: ', error); //return object error
                        });
                }
                // ---------------------------- BODY := >MENU>PULSA_REGULER>{paket} ----------------------------
                if (validQuotedMsg.quoted && validQuotedMsg.type == 'list' && validQuotedMsg.quoted.title === 'PULSA REGULER') {
                    var customTitle = validQuotedMsg.getAnswer;

                    await client.sendButtons(message.from,
                        '𝕜𝕠𝕟𝕗𝕚𝕣𝕞𝕒𝕤𝕚 𝕡𝕖𝕤𝕒𝕟𝕒𝕟 \n' + customTitle + ' ke nomor ' + message.from.substring(0, message.from.length - 5) + ' ?',
                        master.buttons,
                        `${validQuotedMsg.getAnswer},${message.from.substring(0, message.from.length - 5)}`
                        // "-" + validQuotedMsg.getAnswer + "," + message.from.substring(0, message.from.length - 5) + "-"
                    )
                        .then(async (result) => {

                        })
                        .catch((error) => {
                            console.error('Error when sendButtons: ', error); //return object error
                        });

                }

                // ---------------------------- BODY := >MENU>PULSA_REGULER>{paket}>Konfirmasi ----------------------------
                // ---------------------------- ISSUE : https://github.com/orkestral/venom/issues/1163 ----------------------------
                // if (validQuotedMsg.quoted && validQuotedMsg.type == 'chat' && validQuotedMsg.quoted.footer.toUpperCase() === 'KONFIRMASI UNTUK MELANJUTKAN') {
                //     if (true) {
                //         await client.reply(message.from, "Terkonfirmasi", message.id
                //         ).then(async (result) => {
                //             this.sendVoice.filesource('./public/audio/gt_female/transactionOnProcess.mp3');
                //             setTimeout(async () => {
                //                 this.sendVoice.filesource('./public/audio/gt_female/tapiBohong.mp3');
                //             }, 5000);
                //         }).catch((error) => {
                //             console.error('Error when client.reply: ', error); //return object error
                //         });
                //     }
                // }

                // ---------------------------- BODY := >MENU>PULSA_REGULER>{paket}>Konfirmasi ----------------------------
                if (validQuotedMsg.type == 'chat' && validQuotedMsg.quoted && validQuotedMsg.quoted.caption && validQuotedMsg.quoted.caption.toUpperCase().search("𝕜𝕠𝕟𝕗𝕚𝕣𝕞𝕒𝕤𝕚 𝕡𝕖𝕤𝕒𝕟𝕒𝕟") != -1) {
                    if (true) { // cek apakah judul sudah sesuai : progress
                        this.sendVoice.filesource('./public/audio/gt_female/transactionOnProcess.mp3');
                        setTimeout(async () => {
                            this.sendVoice.filesource('./public/audio/gt_female/tapiBohong.mp3');
                        }, 7000);
                    }
                }
            }
        }
    }
}
// export default sendListMenu;
module.exports = sendListMenu;