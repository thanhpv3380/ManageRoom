const sgMail = require("@sendgrid/mail");
module.exports = (to, subject, html) => {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    //console.log(process.env.SENDGRID_API_KEY);
    const msg = {
      to,
      from: "thanh.pv173380@sis.hust.edu.vn",
      subject,
      text: "Test",
      html
    };
    sgMail
      .send(msg)
      .then(() => {
        console.log("Message sent to " + to);
      })
      .catch(error => {
        console.log(error.response.body);
        // console.log(error.response.body.errors[0].message)
      });
}