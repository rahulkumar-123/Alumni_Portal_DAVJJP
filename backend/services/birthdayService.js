const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');

// Function to get today's birthday users
const getTodaysBirthdayUsers = async () => {
    try {
        const today = new Date();
        const todayMonth = today.getMonth() + 1; // JavaScript months are 0-indexed
        const todayDay = today.getDate();

        const birthdayUsers = await User.find({
            isApproved: true,
            $expr: {
                $and: [
                    { $eq: [{ $dayOfMonth: '$dateOfBirth' }, todayDay] },
                    { $eq: [{ $month: '$dateOfBirth' }, todayMonth] }
                ]
            }
        });

        console.log(`Found ${birthdayUsers.length} users with birthdays today (${todayDay}/${todayMonth})`);
        return birthdayUsers;
    } catch (error) {
        console.error('Error fetching today\'s birthday users:', error);
        return [];
    }
};

// Function to calculate age using native Date
const calculateAge = (dateOfBirth) => {
    const today = new Date();
    const birth = new Date(dateOfBirth);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
    }
    return age;
};

// Function to generate birthday email template
const generateBirthdayEmailTemplate = (user) => {
    const age = calculateAge(user.dateOfBirth);
    const firstName = user.fullName.split(' ')[0];

    return `
<div style="font-family: Arial, Helvetica, sans-serif; background-color: #080808; padding: 20px 8px; margin: 0;">

  <table cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width: 560px; margin: 0 auto; background-color: #111419; border-radius: 14px; overflow: hidden; box-shadow: 0 8px 40px rgba(0,0,0,0.5);">

    <!-- Top accent line -->
    <tr>
      <td style="height: 3px; background: linear-gradient(90deg, #c47d0e 0%, #f5a623 50%, #ff6b1a 100%); font-size: 0; line-height: 0;">&nbsp;</td>
    </tr>

    <!-- Header -->
    <tr>
      <td style="padding: 32px 28px 24px; background-color: #111419;">

        <!-- School badge line -->
        <p style="margin: 0 0 20px 0; font-size: 11px; font-family: Arial, Helvetica, sans-serif; color: rgba(245,166,35,0.65); letter-spacing: 2px; text-transform: uppercase;">
          MN JHA DAV PUBLIC SCHOOL &nbsp;·&nbsp; JHANJHARPUR
        </p>

        <!-- Main headline -->
        <h1 style="margin: 0 0 10px 0; font-size: 28px; font-weight: bold; font-family: Georgia, 'Times New Roman', serif; color: #f2ede8; line-height: 1.15;">
          Happy Birthday,<br>
          <span style="color: #f5a623; font-style: italic;">${firstName}.</span>
        </h1>

        <p style="margin: 0; font-size: 14px; font-family: Arial, Helvetica, sans-serif; color: rgba(242,237,232,0.5); line-height: 1.6;">
          Today, your DAV family pauses to celebrate the person you've become.
        </p>

      </td>
    </tr>

    <!-- Divider -->
    <tr>
      <td style="padding: 0 28px;">
        <div style="height: 1px; background: rgba(255,255,255,0.07);"></div>
      </td>
    </tr>

    <!-- Body message -->
    <tr>
      <td style="padding: 28px 28px 0;">

        <p style="margin: 0 0 16px 0; font-size: 15px; font-family: Arial, Helvetica, sans-serif; color: #f2ede8; line-height: 1.75;">
          Some bonds don't need constant reminding — they just stay. The corridors of DAV, the classrooms, the faces. You're part of that story, and that story doesn't end.
        </p>

        <p style="margin: 0 0 28px 0; font-size: 15px; font-family: Arial, Helvetica, sans-serif; color: rgba(242,237,232,0.6); line-height: 1.75;">
          On your ${age}th birthday, 170+ alumni across the country are thinking of you. Wishing you the kind of year that surprises you.
        </p>

        <!-- Pull quote — simple, no emoji -->
        <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-bottom: 28px;">
          <tr>
            <td style="border-left: 2px solid #f5a623; padding: 4px 0 4px 16px;">
              <p style="margin: 0; font-size: 16px; font-family: Georgia, 'Times New Roman', serif; font-style: italic; color: #f5a623; line-height: 1.5;">
                "Once a DAVian, always a DAVian."
              </p>
            </td>
          </tr>
        </table>

        <!-- CTA -->
        <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-bottom: 32px;">
          <tr>
            <td>
              <a href="${process.env.CLIENT_URL || 'https://alumni-portal-davjjp.vercel.app'}/login"
                 style="display: inline-block; background-color: #f5a623; color: #080808; text-decoration: none; font-weight: bold; font-size: 14px; font-family: Arial, Helvetica, sans-serif; padding: 13px 26px; border-radius: 100px; letter-spacing: 0.3px;">
                Send wishes back →
              </a>
            </td>
          </tr>
        </table>

      </td>
    </tr>

    <!-- Footer -->
    <tr>
      <td style="padding: 20px 28px 24px; border-top: 1px solid rgba(255,255,255,0.07);">

        <p style="margin: 0 0 10px 0; font-size: 13px; font-family: Arial, Helvetica, sans-serif; color: rgba(242,237,232,0.35); line-height: 1.6;">
          With warmth from the DAV Alumni Network &nbsp;·&nbsp; Jhanjharpur, Bihar
        </p>

        <p style="margin: 0; font-size: 12px; font-family: Arial, Helvetica, sans-serif; color: rgba(242,237,232,0.25);">
          <a href="${process.env.CLIENT_URL || 'https://alumni-portal-davjjp.vercel.app'}/" style="color: rgba(245,166,35,0.55); text-decoration: none;">Alumni Portal</a>
          &nbsp;·&nbsp;
          <a href="mailto:mnjdavalumni@gmail.com" style="color: rgba(245,166,35,0.55); text-decoration: none;">mnjdavalumni@gmail.com</a>
          &nbsp;·&nbsp;
          <a href="#" style="color: rgba(245,166,35,0.55); text-decoration: none;">Unsubscribe</a>
        </p>

      </td>
    </tr>

    <!-- Bottom accent line -->
    <tr>
      <td style="height: 3px; background: linear-gradient(90deg, #c47d0e 0%, #f5a623 50%, #ff6b1a 100%); font-size: 0; line-height: 0;">&nbsp;</td>
    </tr>

  </table>
</div>
    `;
};

// Function to send birthday email to a user
const sendBirthdayEmail = async (user) => {
    try {
        const emailTemplate = generateBirthdayEmailTemplate(user);

        await sendEmail({
            email: user.email,
            subject: `🎉 Happy Birthday ${user.fullName.split(' ')[0]}! From Your DAV Family 🎂`,
            message: emailTemplate
        });

        console.log(`Birthday email sent successfully to ${user.fullName} (${user.email})`);
        return true;
    } catch (error) {
        console.error(`Failed to send birthday email to ${user.fullName} (${user.email}):`, error);
        return false;
    }
};

// Main function to send birthday emails to all users with birthdays today
const sendBirthdayEmails = async () => {
    try {
        console.log('Starting birthday email service...');
        const birthdayUsers = await getTodaysBirthdayUsers();

        if (birthdayUsers.length === 0) {
            console.log('No birthdays today. Service completed.');
            return;
        }

        let successCount = 0;
        let failureCount = 0;

        // Send emails to all birthday users
        for (const user of birthdayUsers) {
            const success = await sendBirthdayEmail(user);
            if (success) {
                successCount++;
            } else {
                failureCount++;
            }

            // Add small delay between emails to avoid overwhelming the email service
            await new Promise(resolve => setTimeout(resolve, 1000));
        }

        console.log(`Birthday email service completed!`);
        console.log(`Successfully sent: ${successCount} emails`);
        console.log(`Failed to send: ${failureCount} emails`);

    } catch (error) {
        console.error('Error in birthday email service:', error);
    }
};

module.exports = {
    sendBirthdayEmails,
    getTodaysBirthdayUsers,
    sendBirthdayEmail,
    generateBirthdayEmailTemplate
};
