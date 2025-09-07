const { sendEmail } = require("../../config/mailer");

async function sendPasswordResetEmail(user, link) {
  return sendEmail({
    to: user.email,
    subject: "รีเซ็ตรหัสผ่าน Fiction Book",
    html: `<p>กดลิงก์เพื่อรีเซ็ตรหัสผ่าน:</p>
        <a href="${link}">${link}</a>
        <p>ลิงก์หมดอายุใน 1 ชั่วโมง</p>`,
  });
}

module.exports = { sendPasswordResetEmail };

