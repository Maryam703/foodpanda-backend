import { ApiError } from "./ApiError.js";
import sendmail from "sendmail";

export const sendMailResetPassword = (email) => {
    sendmail({
        from: process.env.EMAIL_SENDER,
        to: email,
        subject: 'Reset password',
        text: `http://localhost:7000/password/reset/${process.env.RESET_PASSWORD_TOKEN}`
        
    }, (error, reply) => {

        if (error) {
          throw new ApiError(500, "Email couldn't be sent", error);
        } else {
            console.log('Email sent successfully:', reply);
        }

    });
};


