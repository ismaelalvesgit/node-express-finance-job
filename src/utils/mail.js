import env from "../env";
import ejs from "ejs";
import path from "path";
import mailjet from 'node-mailjet'


const _client = mailjet.apiConnect(env.email.apiKey, env.email.secret)

/**
 * 
 * @param {string} to 
 * @param {string} subject 
 * @param {string} template 
 * @param {Object} data 
 * @param {import('node-mailjet').SendEmailV3_1.InlinedAttachment[]} attachments 
 * @returns 
 */
export const send = ({to, subject, template, data = {}, attachments})=>{
    return new Promise((resolve, reject)=>{
        ejs.renderFile(path.join(__dirname, `../views/mail/${template}.ejs`), data, async(err, html)=>{
            if(err){
                reject(new Error(err));
            }
            _client.post('send', {
                version: 'v3.1'
            }).request({
                Messages: [
                  {
                    From: {
                      Email: env.email.notificator,
                      Name: 'Finance Service',
                    },
                    To: [
                      {
                        Email: to,
                        Name: 'You',
                      },
                    ],
                    Subject: subject,
                    HTMLPart: html,
                    Attachments: attachments
                  },
                ],
            }).then(resolve).catch(reject);
        });
    });
};