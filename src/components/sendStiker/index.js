
class SendStiker {
    constructor({ client, message }) {
        this.client = client;
        this.message = message;
    }

    filesource = async (filesource) => {
        const message = this.message, client = this.client;
        await client.sendImageAsSticker(message.from, filesource)
            .then((result) => {
                console.log('Result: ', result.status);
            })
            .catch((erro) => {
                console.error('Error SendStiker@filesource: ', erro); //return object error
            });
    }

}
module.exports = SendStiker;