const fs = require('fs');
const master = require('./sendListMenu/master');
const axios = require('axios');
const Api = require('../helpers/API/');

const SendChat = require('./sendChat/');
const SendVoice = require('./sendVoice/');
const SendListMenu = require('./sendListMenu');
const SendButton = require('./sendButton');
const SendStiker = require('./sendStiker');
const SendStikerGif = require('./sendStikerGif');
const Connection = require('../helpers/connect/');
// const Setting = require('../../Setting');

class Routes {

    constructor({ client, message }) {
        this.client = client;
        this.message = message;
        this.messageFromId = message.from.substring(0, message.from.length - 5);
        this.command = message.body.split("\n");
        this.sendChat = new SendChat({ client, message });
        this.sendVoice = new SendVoice({ client, message });
        this.sendListMenu = new SendListMenu({ client, message });
        this.sendButton = new SendButton({ client, message });
        this.sendStiker = new SendStiker({ client, message });
        this.sendStikerGif = new SendStikerGif({ client, message });
        this.mysql = new Connection();
        // this.setting = new Setting();
        this.api = new Api({ client, message, type: 'DEV' }); // DEV or LIVE

        this.quotedMsgList = message.quotedMsgObj ?
            message.quotedMsgObj.type == 'chat' ? message.quotedMsgObj :
                message.quotedMsgObj.type == 'list' ? message.quotedMsgObj.list
                    : false : false;
    }

    mysql_botwa = async () => {
        const message = this.message, client = this.client;
        const host = await client.getHostDevice();
        const quotedMsgList = this.quotedMsgList;
        let validQuotedMsg = message.quotedMsgObj ? {
            type: message.quotedMsgObj.type,
            isMention: message.quotedParticipant == host.id._serialized,
            quoted: quotedMsgList,
            getAnswer: this.command,
            chatSourced: message.chat.lastReceivedKey,
        } : false;

        // make sure chat is not from group
        if (message.isGroupMsg === false) {

        }
    }

    prabayar = async () => {
        const message = this.message, client = this.client;
        const host = await client.getHostDevice();
        const quotedMsgList = this.quotedMsgList;
        let validQuotedMsg = message.quotedMsgObj ? {
            type: message.quotedMsgObj.type,
            isMention: message.quotedParticipant == host.id._serialized,
            quoted: quotedMsgList,
            getAnswer: this.command,
            chatSourced: message.chat.lastReceivedKey,
        } : false;
        // console.log('validQuotedMsg ', validQuotedMsg);
        if (message.isGroupMsg === false) {
            // ---------------------------- BODY := >MENU ----------------------------
            if (message.body === '#MENU' || message.body === '#ROBOT') {
                this.sendListMenu.categoryList();
            }
            if (validQuotedMsg.isMention && validQuotedMsg) {
                // ---------------------------- BODY := >MENU>PULSA_REGULER ----------------------------
                if (validQuotedMsg.getAnswer[0] === '#PULSA_REGULER') {
                    this.sendListMenu.packetList();
                }
                // ---------------------------- BODY := >MENU>PULSA_REGULER>{paket} ----------------------------
                if (validQuotedMsg.quoted && validQuotedMsg.type == 'list' && validQuotedMsg.quoted.title.toUpperCase() === 'PULSA REGULER') {

                    this.mysql.query(`select * from wa_whitelist where phone = '${this.messageFromId}'`).then(({ error, result }) => {

                        if (result != '') {
                            var tag = validQuotedMsg.getAnswer[1].replace(' ', '').toLowerCase().split(",");
                            var sql = `select * from wa_tag where phone = '${this.messageFromId}' AND tag_category = '${tag[0]}' AND tag_name = '${tag[1]}'`;
                            console.log("tag :", tag[0])
                            this.mysql.query(sql).then(({ error, result }) => {
                                if (result != '') {
                                    var listNomorTujuan = [];
                                    listNomorTujuan.push(
                                        {
                                            title: 'Nomor Baru',
                                            description: 'tambah nomor baru yang belum didaftarkan',
                                        })
                                    result.map((item, index) => {
                                        // console.log('tes', validQuotedMsg.getAnswer[1].replace(' ', '').split(","));
                                        // listNomorTujuan: [
                                        //     {
                                        //         title: "6289667668888",
                                        //         description: " ",
                                        //     },
                                        //     {
                                        //         title: "628988888320",
                                        //         description: " ",
                                        //     }
                                        // ]
                                        listNomorTujuan.push(
                                            {
                                                title: item.tag_value,
                                                description: item.tag_description,
                                            })
                                    });
                                    console.log("listNomorTujuan :", listNomorTujuan)
                                }
                                this.sendListMenu.opsiNomorTujuan(tag, listNomorTujuan);
                            }).catch((err) => {
                                console.error('catch errorQuery@wa_tag :', err);
                            });

                        } else {
                            this.sendChat.text(`Sorry, Your account access appears to be restricted`)
                        }

                    }).catch((err) => {
                        console.error('catch errorQuery@wa_whitelist :', err);
                    });
                    // this.sendButton.orderConfirmation(validQuotedMsg);
                }
                // ---------------------------- BODY := >MENU>PULSA_REGULER>{paket}>62xxxx ----------------------------
                if (validQuotedMsg.quoted && validQuotedMsg.type == 'list' && validQuotedMsg.quoted.title.toUpperCase().startsWith('PULSA ') && validQuotedMsg.getAnswer[0].toUpperCase().startsWith('62')) {
                    console.log('tesss,,,', validQuotedMsg.getAnswer);
                    console.log('tesss2,,,', validQuotedMsg.quoted.title.toUpperCase().split(' '));
                    this.api.pricelist().then(({ error, result }) => {
                        result.data.filter((item) => {
                            let found = true;
                            validQuotedMsg.quoted.title.toUpperCase().split(' ').map((attribute) => {
                                if (item.buyer_sku_code.toUpperCase().search(attribute) == -1) {
                                    found = false;
                                }
                            })
                            if (found) {
                                found = item.buyer_sku_code;
                                this.sendVoice.filesource('./public/audio/gt_female/transactionOnProcess.mp3');
                                this.api.topup({ skuCode: item.buyer_sku_code, customerNo: validQuotedMsg.getAnswer[0], testing: true }).then(async ({ error, result }) => {
                                    // console.log('resultnyo', result.data)
                                    // setTimeout(() => {
                                    //     this.sendStiker.filesource('./asset/png/thankyou_1.png');
                                    // }, 950);

                                    // this.sendChat.text(`Sorry, Your account access appears to be restricted`)
                                    await this.sendChat.text(
                                        '*ORDER* \n' + result.data.ref_id + '\n\n\n' +
                                        // '*customer_no* : ' + result.data.customer_no + '\n' +
                                        // '*customer_name* : ' + result.data.customer_name + '\n' +
                                        '*admin* : ' + result.data.admin + '\n' +
                                        '*message* : ' + result.data.message + '\n' +
                                        '*status* : ' + result.data.status + '\n' +
                                        // '*rc* : ' + result.data.rc + '\n' +
                                        // '*sn* : ' + result.data.sn + '\n' +
                                        // '*sisa_saldo* : ' + result.data.buyer_last_saldo + '\n' +
                                        // '*price* : ' + result.data.price + '\n' +
                                        '*selling_price* : ' + result.data.selling_price + '\n' +
                                        // '*xxxx* : ' + result.data.xxxx+'\n'+
                                        '*desc* : ' + JSON.stringify(result.data.desc) + '\n'
                                    )
                                    // send transaction report
                                    // await this.sendChat.toAdminNumber(
                                    //     '*ORDER* \n' + result.data.ref_id + '\n\n\n' +
                                    //     '*customer_no* : ' + result.data.customer_no + '\n' +
                                    //     '*customer_name* : ' + result.data.customer_name + '\n' +
                                    //     '*buyer_sku_code* : ' + result.data.buyer_sku_code + '\n' +
                                    //     '*admin* : ' + result.data.admin + '\n' +
                                    //     '*message* : ' + result.data.message + '\n' +
                                    //     '*status* : ' + result.data.status + '\n' +
                                    //     '*rc* : ' + result.data.rc + '\n' +
                                    //     '*sn* : ' + result.data.sn + '\n' +
                                    //     '*sisa_saldo* : ' + result.data.buyer_last_saldo + '\n' +
                                    //     '*price* : ' + result.data.price + '\n' +
                                    //     '*selling_price* : ' + result.data.selling_price + '\n' +
                                    //     // '*xxxx* : ' + result.data.xxxx+'\n'+
                                    //     '*desc* : ' + JSON.stringify(result.data.desc) + '\n'
                                    // );

                                }).catch((e) => {
                                    console.log('Error Routes@transactionPulsa in this.api.topup', e);
                                    // this.sendChat.toAdminNumber('Error Routes@transactionPulsa in this.api.topup')
                                    this.sendChat.rejectHandler('Routes@transactionPulsa')
                                });
                            }
                        })
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
                        this.sendStikerGif.filesource('./asset/gif/processing.gif');
                        this.sendVoice.filesource('./public/audio/gt_female/transactionOnProcess.mp3');
                        setTimeout(async () => {
                            this.sendVoice.filesource('./public/audio/gt_female/tapiBohong.mp3');
                            this.sendStiker.filesource('./asset/png/thankyou_1.png');
                        }, 7000);
                    }
                }
            }
        }
    }
}
module.exports = Routes;