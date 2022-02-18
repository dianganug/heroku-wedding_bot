const Setting = require('../../../Setting');

class SendChat {
    constructor({ client, message }) {
        this.client = client;
        this.message = message;
        this.setting = new Setting();
    }

    text = async (text, to = this.message.from) => {
        const message = this.message, client = this.client;
        await client.sendText(to, text)
            .then((result) => {
                // console.log('Result: ', result.status);
            })
            .catch((erro) => {
                console.error('Error sendChat@text: ', erro); //return object error
            });
    }

    toAdminNumber = async (text) => {
        const message = this.message, client = this.client;
        await client.sendText(this.setting.getAdminNumber(), text)
            .then((result) => {
                // console.log('Result: ', result.status);
            })
            .catch((erro) => {
                console.error('Error sendChat@toAdminNumber: ', erro); //return object error
            });
    }

    rejectHandler = async (errorPointer, { text = '', adminText = '' }) => {
        const message = this.message, client = this.client;
        await client.sendText(message.from, text ? text : "Sorry, your request can't being processed right now. please try again later")
            .then((result) => { })
            .catch((erro) => {
                console.error('Error sendChat@rejectHandler: ', erro); //return object error
            });
        await this.toAdminNumber("detect errorPointer in : \n" + errorPointer + '\n' + adminText)
            .then((result) => { })
            .catch((erro) => {
                console.error('Error sendChat@rejectHandler: ', erro); //return object error
            });
    }

}
module.exports = SendChat;