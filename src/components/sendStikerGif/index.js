
class SendStikerGif {
    constructor({ client, message }) {
        this.client = client;
        this.message = message;
    }

    filesource = async (filesource) => {
        const message = this.message, client = this.client;
        await client.sendImageAsStickerGif(message.from, filesource)
            .then((result) => {
                console.log('Result: ', result.status);
            })
            .catch((erro) => {
                console.error('Error SendStikerGif@filesource: ', erro); //return object error
            });
    }

}
module.exports = SendStikerGif;