// sen daily
const cron = require('node-cron');
const Admin = require('../models/AdminModel');
const sendEmail = require('../utils/email');

async function sendingDailyAdminEmails() {
  try {
    const admins = await Admin.find({ active: true });
    const adminsEmails = [];
    admins.forEach((admin) => adminsEmails.push(admin.admin));

    // TODO: create login-otp field
    //       validate that if user has admin: true; then it must has login-otp

    adminsEmails.forEach(async (email) => {
      await sendEmail({
        email: email,
        subject: 'Email Confirm',
        message: 'Daily admins otp',
        // message: `That's a 5 minutes valid otp ${otp} `, // FIXME:
      });
    });

    console.log(`daily admins otp sent to ${adminsEmails.length} admins`); // TODO:
  } catch (error) {
    console.log(Date.now());
    console.error(
      'Error occurred during sending daily login-otp emails to admins',
      error,
    );
  }
}

// const scheduleTime = '*/1 * * * *'; //run every 5 mints

const scheduleTime = '0 2 * * *'; //run at 2 am

cron.schedule(scheduleTime, () => {
  sendingDailyAdminEmails();
});
