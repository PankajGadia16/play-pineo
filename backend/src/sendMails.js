import sgMail from '@sendgrid/mail';
sgMail.setApiKey("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");
export default {
    sendMail: async function () {
        console.log("send")
        await sgMail.send({
            from: "gadiap16@gmail.com",
            to: "pankajgadia1993@gmail.com",
            subject: "Congratulations!!",
            html: `Hello Pankaj and Dolly!`
        });
    }
}