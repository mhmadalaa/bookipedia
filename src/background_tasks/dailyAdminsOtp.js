// sen daily
const cron = require('node-cron');

const AdminModel = require('../models/AdminModel');
const sendEmail = require('../utils/email');

async function sendingDailyAdminEmails() {
  try {
    console.log('enter daily admins emails');
    const admins = await AdminModel.find({ active: true });
    const activeAdmins = [];

    for (const admin of admins) {
      const adminEmail = admin.admin;

      try {
        const Admin = await AdminModel.findOne({ admin: adminEmail });

        console.log(Admin);

        const otp = Admin.createOtp();
        await Admin.save({ validateBeforeSave: false });

        console.log(adminEmail, otp);

        // Push the dictionary to activeAdmins
        activeAdmins.push({ email: adminEmail, otp: otp });
      } catch (error) {
        // Handle any errors that occur during the asynchronous operations
        console.error(`Error processing admin ${adminEmail}:`, error);
      }
    }

    console.log(activeAdmins.length);

    // TODO: create login-otp field
    //       validate that if user has admin: true; then it must has login-otp

    // await active admins FIXME:
    for (const admin of activeAdmins) {
      console.log(':::', admin.adminEmail, admin.otp);
      await sendEmail({
        email: admin.adminEmail,
        subject: 'Email Confirm',
        message: `That's a 5 minutes valid otp ${admin.otp} `,
      });
    }

    console.log(`Daily admins otp sent to ${activeAdmins.length} admins`); // TODO:
  } catch (error) {
    console.log(Date.now());
    console.error(
      'Error occurred during sending daily login-otp emails to admins',
      error,
    );
  }
}

const scheduleTime = '*/1 * * * *'; //run every 1 minute

// const scheduleTime = '0 2 * * *'; //run at 2 am

cron.schedule(scheduleTime, () => {
  sendingDailyAdminEmails();
});
