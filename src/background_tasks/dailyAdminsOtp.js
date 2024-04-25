const cron = require('node-cron');

const AdminModel = require('../models/adminModel');
const sendEmail = require('../utils/email');

async function sendingDailyAdminEmails() {
  try {
    const admins = await AdminModel.find({ active: true });
    const activeAdmins = [];

    for (const admin of admins) {
      const adminEmail = admin.admin;

      const Admin = await AdminModel.findOne({ admin: adminEmail });

      const otp = Admin.createOtp();
      await Admin.save({ validateBeforeSave: false });

      activeAdmins.push({ adminEmail: adminEmail, otp: otp });
    }

    for (const admin of activeAdmins) {
      await sendEmail({
        email: admin.adminEmail,
        subject: 'Daily Admins Email',
        message: `Hello Bookipedia admin, that's your daily otp code to login: ${admin.otp} `,
      });
    }

    console.log(`Daily admins otp sent to ${activeAdmins.length} admins`);
  } catch (error) {
    console.log(Date.now());
    console.error(
      'Error occurred during sending daily login-otp emails to admins',
      error,
    );
  }
}

// const scheduleTime = '*/1 * * * *'; //run every 1 minute

const scheduleTime = '0 1 * * *'; //run at 1 am

cron.schedule(scheduleTime, () => {
  sendingDailyAdminEmails();
});
