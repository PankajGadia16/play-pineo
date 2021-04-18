const nodemailer = require("nodemailer");
const wait = time => new Promise(resolve => setTimeout(resolve, time));

const baseDetails = {
    from: '"Chutney ka Momo" <pankajgadia1993@gmail.com>', // sender address
    to: "gadiap16@gmail.com", // list of receivers
    subject: "To the love of my life... ❤️❤️❤️"
}

const letters = [1,2,3,4,5,6]

export default async function () {

    let transporter = nodemailer.createTransport({
        host: "SMTP",
        service: "Gmail",
        port: 587,
        secure: false,
        auth: {
            user: "pankajgadia1993@gmail.com",
            pass: "0Pankaj@g1"
        },

    });

    for (let i of letters) {
        const details  = { ...baseDetails, ...require(`./letters/letter${i}.js`).default }
        let info = await transporter.sendMail(details);
        wait(2000)
        console.log(`${Date.now()} Message sent: %s`, info.messageId);
    }
    console.log(`Done for ${letters.length} letters!`)
}

