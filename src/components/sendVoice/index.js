const fs = require('fs');

class sendVoice {
    constructor({ client, message }) {
        this.client = client;
        this.message = message;
    }

    filesource = async (filesource) => {
        const message = this.message, client = this.client;
        await client.sendVoice(message.from, filesource).then((result) => {
        }).catch((error) => {
            console.error('Error sendVoice@filesource ', error); //return object error
        });
    }

}
module.exports = sendVoice;