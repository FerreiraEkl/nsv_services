import transporter from "../config/configNodemailer";
import { IDocument } from "../schemas/interfaces/IDocument";
import { User } from "../schemas/tableSchemas/userSchema";

interface IMessage {
    subject: string,
    box: "order" | "approval",
    texts: Array<string>,
    link?: string,
    linkLabel?: string
}

interface INotifyMessage {
    subject: string,
    user: User,
    texts: Array<string>,
    link?: string,
    linkLabel?: string
}

class EmailService {

    public notify(message: INotifyMessage) {

        const email = {
            from: process.env.NODEMAIL_SENDER || '',
            to: `${message.user.USU_USU}@weg.net`,
            subject: message.subject,
            html: this.htmlBody2(message.texts, message.user.NOME_USU, message.link, message.linkLabel)
        }

        transporter.sendMail(email, (err, info) => {
            if (err) {
                console.log(`Message error -> ${err.message}, subject: ${email.subject}`);
            } else if (process.env.NODE_ENV === 'development') {
                console.log(`Sended message -> id:${info.messageId}, to:${info.accepted}, subject: ${message.subject}`);
            }
        });
    }

    public notifyPO(message: IMessage) {

        const email = {
            from: process.env.NODEMAIL_SENDER || '',
            to: process.env.NODEMAIL_PO || '',
            subject: message.subject,
            html: this.htmlBody2(message.texts, message.box == 'approval' ? 'Approval team' : 'Order team', message.link, message.linkLabel)
        }

        transporter.sendMail(email, (err, info) => {
            if (err) {
                console.log(`Message error -> ${err.message}, subject: ${email.subject}`);
            } else if (process.env.NODE_ENV === 'development') {
                console.log(`Sended message -> id:${info.messageId}, to:${info.accepted}, subject: ${message.subject}`);
            }
        });
    }

    public orderStatusWarning(order: IDocument, sapOrder: any) {
        const subject = "NSV - Divergência de status - " + order.COD_DOC;

        var texts = [];

        texts = [
            'A ordem ' + order.COD_DOC + ' possui um status diferente do cadastrado no SAP.',
            'Status SAP: ' + sapOrder[11],
            'Status NSV: Confirmada',
            'Data de confirmação da ordem no NSV: ' + order.DT_CONF?.toLocaleDateString(),
        ];

        const email = {
            from: process.env.NODEMAIL_SENDER || '',
            to: process.env.NODEMAIL_USER || '',//(order as any).responsible.USU_USU + '@weg.net',
            subject: subject,
            html: this.htmlBody2(texts, (order as any).responsible.NOME_USU)
        }

        transporter.sendMail(email, (err, info) => {
            if (err) {
                console.log(`Message error -> ${err.message}, subject: ${subject}`);
            } else {
                console.log(`Sended message -> id:${info.messageId}, to:${info.accepted}, subject: ${subject}`);
            }
        });
    }

    private htmlBody2(texts: Array<string>, user: string, link?: string, linkLabel?: string) {
        var html = '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">';
        html += '<html xmlns="http://www.w3.org/1999/xhtml">';
        html += '<head>';
        html += '   <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">';
        html += '   <title>WMO - NSV</title > ';
        html += '   <meta name="viewport" content="width=device-width">';
        html += '   <!-- Favicon icon -->';
        html += '   <style type="text/css">';
        html += '       @media only screen and(min - device - width: 601px) {';
        html += '           .content {';
        html += '               width: 600px!important;';
        html += '           }';
        html += '           .col387 {';
        html += '               width: 387px!important;';
        html += '           }';
        html += '       }';
        html += '   </style>';
        html += '</head>';
        html += '<body style="margin: 0; padding: 0;" yahoo="fix">';
        html += '<!--[if (gte mso 9)|(IE)]>';
        html += '   <table width="600" align="center" cellpadding="0" cellspacing="0" border="0">';
        html += '       <tr>';
        html += '           <td>';
        html += '<![endif]-->';
        html += '   <table align="center" border="0" cellpadding="0" cellspacing="0" style="border-collapse: collapse; width: 100%; max-width: 600px; margin-top: 25px;" class="content">';
        html += '       <tr>';
        html += '           <td align="center" bgcolor="#003478" style="padding: 20px 20px 20px 20px; color: #ffffff; font-family: Arial, sans-serif; font-size: 36px; font-weight: bold;">';
        html += '              <div>WMO - NSV</div>'; ''
        html += '           </td>';
        html += '       </tr>';
        html += '       <tr>';
        html += '           <td bgcolor="#ffffff" style="padding: 20px 20px 0 20px; border-bottom: 1px solid #f6f6f6;">';
        html += '               <table width="100%" align="left" border="0" cellpadding="0" cellspacing="0">';
        html += '                   <tr>';
        html += '                       <td style="padding: 0 0 20px 0; color: #555555; font-family: Arial, sans-serif; font-size: 15px; line-height: 24px;">';
        html += '                           Caro(a) ' + user + ',';
        html += '                       </td>';
        html += '                   </tr>';

        for (const text of texts) {
            html += '               <tr>';
            html += `                   <td style="padding: 0 0 20px 0; color: #555555; font-family: Arial, sans-serif; font-size: 15px; line-height: 24px;">${text}</td>`;
            html += '               </tr>';
        }

        html += '               </table>';
        html += '           </td>';
        html += '       </tr>';

        if (link && linkLabel) {
            html += '       <tr>';
            html += '           <td align="center" bgcolor="#f9f9f9" style="padding: 30px 20px 30px 20px; font-family: Arial, sans-serif;">';
            html += '               <table bgcolor="#003478" border="0" cellspacing="0" cellpadding="0" class="buttonwrapper">';
            html += '                   <tr>';
            html += '                       <td align="center" height="50" style=" padding: 0 25px 0 25px; font-family: Arial, sans-serif; font-size: 16px; font-weight: bold;" class="button">';
            html += `                           <a href="${process.env.MAIN_URL}${link}" style="color: #ffffff; text-align: center; text-decoration: none;">${linkLabel}</a>`;
            html += '                       </td>';
            html += '                   </tr>';
            html += '               </table>';
            html += '           </td>';
            html += '       </tr>';
        }

        html += '       <tr>';
        html += '           <td style="padding: 15px 10px 15px 10px;">';
        html += '               <table border="0" cellpadding="0" cellspacing="0" width="100%">';
        html += '                   <tr>';
        html += '                       <td align="center" width="100%" style="color: #0073AA; font-family: Arial, sans-serif; font-size: 12px;">';
        html += '                               2021 &copy; <a href="https://www.weg.net" style="color: #0073AA;">weg.net</a>';
        html += '                       </td>';
        html += '                   </tr>';
        html += '               </table>';
        html += '           </td>';
        html += '       </tr>';
        html += '   </table>';
        html += '<!--[if (gte mso 9)|(IE)]>';
        html += '           </td>';
        html += '       </tr>';
        html += '   </table>';
        html += '<![endif]-->';
        html += '</body>';
        html += '</html>';

        return html;
    }
}

export default new EmailService();