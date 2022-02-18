// Supports ES6
// import { create, Whatsapp } from 'venom-bot';
const venom = require('venom-bot');
const mime = require('mime-types');
const sendListMenu = require('./src/components/sendListMenu/');
const Routes = require('./src/components/routes');
const Connection = require('./src/helpers/connect/');
const axios = require('axios');
const md5 = require("md5");
const fs = require('fs');

// const mysql = new Connection();
// mysql.query("select * from wa_whitelist").then(({ key, value, rs }) => {
//     console.log('key', key);
//     console.log('rs', rs);
// }).catch((err) => {
//     console.error('Found', err);
// });

venom.create(
    //session | Pass the name of the client you want to start the bot
    // 'botInitSession',
    'SUSession',
    // 'TempSession',
    //catchQR
    (base64Qr, base64Qrimg, asciiQR, attempts, urlCode) => {
        // console.log('Number of attempts to read the qrcode: ', attempts);
        // console.log('Terminal qrcode: ', asciiQR);
        // console.log('base64 image string qrcode: ', base64Qrimg);
        // console.log('urlCode (data-ref): ', urlCode);

        // BEGIN Create Login With QrCode
        console.log(asciiQR); // Optional to log the QR in the terminal
        var matches = base64Qr.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
            response = {};

        if (matches.length !== 3) {
            return new Error('Invalid input string');
        }
        response.type = matches[1];
        response.data = new Buffer.from(matches[2], 'base64');

        var imageBuffer = response;
        require('fs').writeFile(
            'public/loginWithQr/out.png',
            imageBuffer['data'],
            'binary',
            function (err) {
                if (err != null) {
                    console.log(err);
                }
            }
        );
        // END Create Login With QrCode
    },
    // statusFind
    (statusSession, session) => {
        console.log('Status Session: ', statusSession); //return isLogged || notLogged || browserClose || qrReadSuccess || qrReadFail || autocloseCalled || desconnectedMobile || deleteToken
        //Create session wss return "serverClose" case server for close
        console.log('Session name: ', session);
    },
    // options
    {
        folderNameToken: 'savedToken', //folder name when saving tokens
        mkdirFolderToken: '', //folder directory tokens, just inside the venom folder, example:  { mkdirFolderToken: '/node_modules', } //will save the tokens folder in the node_modules directory
        headless: false, // Headless chrome
        devtools: false, // Open devtools by default
        useChrome: true, // If false will use Chromium instance
        debug: false, // Opens a debug session
        logQR: true, // Logs QR automatically in terminal
        browserWS: '', // If u want to use browserWSEndpoint
        browserArgs: [''], // Parameters to be added into the chrome browser instance
        puppeteerOptions: {}, // Will be passed to puppeteer.launch
        disableSpins: true, // Will disable Spinnies animation, useful for containers (docker) for a better log
        disableWelcome: false, // Will disable the welcoming message which appears in the beginning
        updatesLog: true, // Logs info updates automatically in terminal
        autoClose: 60000, // Automatically closes the venom-bot only when scanning the QR code (default 60 seconds, if you want to turn it off, assign 0 or false)
        createPathFileToken: true, //creates a folder when inserting an object in the client's browser, to work it is necessary to pass the parameters in the function create browserSessionToken
    },
    // BrowserSessionToken
    // To receive the client's token use the function await clinet.getSessionTokenBrowser()
    // const browserSessionToken = await client.getSessionTokenBrowser();
    // { "WABrowserId": "\"lQScyXb3VEeeYowiaS2A9Q==\"", "WASecretBundle": "{\"key\":\"QZamJ6kSe57lPX3vVJ2GxR0ysgzO42w8etcJPdQM3ro=\",\"encKey\":\"KvHgqLQcMPuzHB08YHreHuogDi6AHofV+2MAHVeCSlU=\",\"macKey\":\"QZamJ6kSe57lPX3vVJ2GxR0ysgzO42w8etcJPdQM3ro=\"}", "WAToken1": "\"zmA7eUgqN3FrhTAewMrd5BSOrMAMsiOaVvTt0z/5I20=\"", "WAToken2": "\"1@eY6LAs4y78wiRgiMY8T6QpReSohHWlJRfRPkII0iPygy/r3HV2tmQujZffbRNez47UAVKksMiRQ4CA==\"" }
    { logQR: false }
)
    .then((client) => start(client))
    .catch((error) => console.log(error));


function start(client) {

    client.onMessage(async (message) => {
        if (message.chatId == 'status@broadcast') {
            console.log('new status from ' + message.author)
            return false;
        }

        // BEGIN LOG
        // console.warn('GET message ', message);
        message.body = message.body.toUpperCase();
        console.warn('GET message.body ', message.body);
        const chatLastReceivedKey = message.chat.lastReceivedKey;
        // console.warn('GET chatLastReceivedKey ', chatLastReceivedKey);

        // Retrieve client information from
        const status = await client.getStatus('6289667668888@c.us');
        const user = await client.getNumberProfile('6289667668888@c.us');
        const host = await client.getHostDevice();


        // BEGIN LOG

        if (message.body.toUpperCase() === 'HELLO WORLD' && message.isGroupMsg === false) {
            client.sendText(message.from, 'Welcome Slur')
                .then((result) => {
                    console.log('Result: ', result.status);
                })
                .catch((erro) => {
                    console.error('Error when sendText: ', erro); //return object error
                });
        }


        // if (message.body === '#MENU' && message.isGroupMsg === false) {
        const route = new Routes({ client, message });
        route.prabayar()


    });
}