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
    <div style="font-family: Arial, Helvetica, sans-serif; background-color: #f5f7fa; padding: 15px 8px; margin: 0;">
        
        <!-- Mobile-First Container -->
        <table cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 8px 20px rgba(0,0,0,0.08);">
            
            <!-- Top accent -->
            <tr>
                <td style="height: 3px; background: linear-gradient(90deg, #667eea 0%, #764ba2 50%, #f093fb 100%); font-size: 0; line-height: 0;">&nbsp;</td>
            </tr>

            <tr>
                <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px 15px; text-align: center;">
                    
                    <div style="font-size: 36px; margin-bottom: 8px; line-height: 1;">🎉</div>
                    
                    <h1 style="color: #ffffff; margin: 0 0 5px 0; font-size: 22px; font-weight: bold; text-shadow: 0 2px 4px rgba(0,0,0,0.2); font-family: Arial, Helvetica, sans-serif; line-height: 1.1;">
                       Happy Birthday, Dear ${firstName} 
                    </h1>
                    
                    <p style="color: #ffffff; margin: 3px 0 0 0; font-size: 13px; font-family: Arial, Helvetica, sans-serif; opacity: 0.95;">
                        Your DAV family of 170+ alumni is celebrating YOU! 🥳
                    </p>
                </td>
            </tr>

            <tr>
                <td style="padding: 25px 20px;">
                    

                    <table cellpadding="0" cellspacing="0" border="0" width="100%">
                        <tr>
                            <td style="text-align: center; padding-bottom: 20px;">
                                <div style="font-size: 40px; margin-bottom: 8px; line-height: 1;">🌟</div>
                                <h2 style="color: #2c3e50; margin: 0 0 5px 0; font-size: 20px; font-weight: bold; font-family: Arial, Helvetica, sans-serif;">
                                    ${age} Years of Impact!
                                </h2>
                                <p style="color: #7f8c8d; margin: 0; font-size: 14px; font-family: Arial, Helvetica, sans-serif;">
                                    Every year, you inspire someone. Today, we're inspired by YOU.
                                </p>
                            </td>
                        </tr>
                    </table>

                    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #fff8f0; border-radius: 10px; margin-bottom: 20px;">
                        <tr>
                            <td style="padding: 18px 15px; border-left: 3px solid #f39c12;">
                                <h3 style="color: #d35400; margin: 0 0 10px 0; font-size: 16px; font-weight: bold; font-family: Arial, Helvetica, sans-serif;">
                                    💝 Your DAV Family Remembers
                                </h3>
                                
                                <p style="color: #34495e; line-height: 1.5; margin: 0 0 10px 0; font-size: 14px; font-family: Arial, Helvetica, sans-serif;">
                                  The bonds we formed at <strong>MN Jha DAV Public School</strong> remain strong, and you're always in our hearts. Those precious memories and friendships continue to bring us joy!
                                </p>
                                
                                <p style="color: #d35400; line-height: 1.4; margin: 0; font-size: 13px; font-weight: bold; font-family: Arial, Helvetica, sans-serif; background-color: #fef5e7; padding: 6px 8px; border-radius: 4px;">
                                    <em>Wishing you boundless happiness and success in the year ahead!🌟</em>
                                </p>
                            </td>
                        </tr>
                    </table>

                    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #e8f5f3; border-radius: 10px; margin-bottom: 20px;">
                        <tr>
                            <td style="padding: 15px; border-left: 3px solid #1abc9c; text-align: center;">
                                <p style="color: #2c3e50; margin: 0; font-size: 14px; line-height: 1.4; font-family: Arial, Helvetica, sans-serif;">
                                    <em>Your achievements make us proud, your happiness brings us joy. Today and always, we celebrate YOU! ❤️</em>
                                </p>
                            </td>
                        </tr>
                    </table>

                    <table cellpadding="0" cellspacing="0" border="0" width="100%">
                        <tr>
                            <td style="text-align: center; padding: 12px 0;">
                                <table cellpadding="0" cellspacing="0" border="0" style="margin: 0 auto;">
                                    <tr>
                                        <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 25px; text-align: center;">
                                            <a href="${process.env.CLIENT_URL || 'https://alumni-portal-davjjp.vercel.app'}/login" 
                                               style="display: inline-block; padding: 14px 28px; color: #ffffff; text-decoration: none; font-weight: bold; font-size: 15px; font-family: Arial, Helvetica, sans-serif; border-radius: 25px;">
                                                Share Your Joy 🚀
                                            </a>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>

                </td>
            </tr>
            <tr>
                <td style="background-color: #f8faff; padding: 18px 20px; text-align: center; border-top: 1px solid #e9ecef;">
                    
                    <p style="color: #6c757d; margin: 0 0 6px 0; font-size: 12px; font-family: Arial, Helvetica, sans-serif;">
                        <strong>One bond</strong> 🌍
                    </p>
                    
                    <p style="color: #667eea; margin: 0 0 10px 0; font-size: 14px; font-weight: bold; font-family: Arial, Helvetica, sans-serif;">
                        "Once a DAVian, Always a Legend!" 👑
                    </p>
                    
                    <p style="color: #adb5bd; margin: 0; font-size: 11px; font-family: Arial, Helvetica, sans-serif;">
                        <a href="${process.env.CLIENT_URL || 'https://alumni-portal-davjjp.vercel.app'}/" style="color: #667eea; text-decoration: none;">Share Love</a> •
                        <a href="mailto:mnjdavalumni@gmail.com" style="color: #667eea; text-decoration: none;">Tell Story</a>
                    </p>
                    
                </td>
            </tr>

            <tr>
                <td style="height: 3px; background: linear-gradient(90deg, #667eea 0%, #764ba2 50%, #f093fb 100%); font-size: 0; line-height: 0;">&nbsp;</td>
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
