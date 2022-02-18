
class DeleteMessage {
    constructor({ client, message }) {
        this.client = client;
        this.message = message;
    }

    once = async (chatId, serialized) => {
        const message = this.message, client = this.client;
        await client.deleteMessage(chatId, [serialized])
            .then((result) => {
                console.log('Result: ', result); //return object success
            })
            .catch((erro) => {
                console.error('Error DeleteMessage@repeat: ', erro); //return object error
            });
    }

    repeat = async (chatId, serialized) => {
        const message = this.message, client = this.client;
        await client.deleteMessage(chatId, serialized)
            .then((result) => {
                console.log('Result: ', result); //return object success
            })
            .catch((erro) => {
                console.error('Error DeleteMessage@repeat: ', erro); //return object error
            });
    }

    clearChatFrom = async () => {
        // WARNING
        // clear all chat from current chat session
        const message = this.message, client = this.client;
        await client.deleteChat(message.from)
            .then((result) => {
            })
            .catch((erro) => {
                console.error('Error DeleteMessage@clearChatFrom: ', erro); //return object error
            });
    }
}
module.exports = DeleteMessage;