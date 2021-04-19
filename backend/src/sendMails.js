const nodemailer = require("nodemailer");
const wait = time => new Promise(resolve => setTimeout(resolve, time));

const baseDetails = {
    from: '"Chutney ka Momo" <pankajgadia1993@gmail.com>', // sender address
    to: "dolly.agarwal2004@gmail.com, gadiap16@gmail.com", // list of receivers  
    subject: "To the love of my life... ❤️❤️❤️"
}

const letters = [12,3,4,5,6]

export default async function () {

    let transporter = nodemailer.createTransport({
        host: "SMTP",
        service: "Gmail",
        auth: {
            // XOAuth2: {
            user: "pankajgadia1993@gmail.com",
            pass: "0Pankaj@g1",
            port: 587,
            secure: false,
            // user: "pankajgadia1993@gmail.com",
            // clientId: "675038558877-urhm6togkh3b850n2jkf9ghp9rbjvvh9.apps.googleusercontent.com",
            // clientSecret: "9Lxq8Xss8FEv49DwRHNGZQa4",
            // refreshToken: "1//04otvyADWEAmrCgYIARAAGAQSNwF-L9Ir2VoRNht-_O8bX-1a_q56k14tZyBJcUU7vODF0lRYwviHh84p7UYLZ4Ix-cN7O7nSqiI"
            // }
        },

    });

    for (let i of letters) {
        if (i == 1) await wait(1000 * 60 * 60 * 21)
        else await wait(1000 * 60 * 6 * 15)
        const details = { ...baseDetails, ...require(`./letters/letter${i}.js`).default }
        let info = await transporter.sendMail(details);

        console.log(`${Date.now()} Message sent: %s`, info.messageId);
    }
    console.log(`Done for ${letters.length} letters!`)
}

