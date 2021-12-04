const nodemailer = require("nodemailer")
import {host, port, auth, tls, translate} from './transportConfig.json'


const transport = nodemailer.createTransport({
  host: host,
  port: port,
  auth: {
    user: auth.user,
    pass: auth.pass
  },
  tls: {
    rejectUnauthorized: tls.rejectUnauthorized
  }
});

// transport.use('compile',hbs({
//     viewEngine:'handlebars',
//     viewPath: './templates/forgotPassword',
//     extName: '.html'
// }))

export {transport};