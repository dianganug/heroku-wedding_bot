const DeleteMessage = require('../deleteMessage/');
const master = require('./master');

class SendButton {
    constructor({ client, message }) {
        this.client = client;
        this.message = message;
        this.deleteMessage = new DeleteMessage({ client, message });
    }

    orderConfirmation = async (validQuotedMsg) => {
        const message = this.message, client = this.client;
        var customTitle = validQuotedMsg.getAnswer[0];
        await client.sendButtons(message.from,
            '𝕜𝕠𝕟𝕗𝕚𝕣𝕞𝕒𝕤𝕚 𝕡𝕖𝕤𝕒𝕟𝕒𝕟 \n' + customTitle + ' ke nomor ' + message.from.substring(0, message.from.length - 5) + ' ?',
            master.confirmation,
            `${validQuotedMsg.getAnswer[0]},${message.from.substring(0, message.from.length - 5)}`
        )
            .then(async (result) => {
                // console.log('once', (result.to.remote._serialized, result.to._serialized));
                // this.deleteMessage.once(result.to.remote._serialized, result.to._serialized)
            })
            .catch((error) => {
                console.error('Error SendButton@orderConfirmation: ', error); //return object error
            });
    }

}
module.exports = SendButton;