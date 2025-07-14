const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');
const moment = require('moment');

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

// Function to calculate age
const calculateAge = (dateOfBirth) => {
    return moment().diff(moment(dateOfBirth), 'years');
};

// Function to generate birthday email template
const generateBirthdayEmailTemplate = (user) => {
    const age = calculateAge(user.dateOfBirth);
    const firstName = user.fullName.split(' ')[0];
    
    return `
    <div style="font-family: 'Segoe UI', Roboto, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; margin: 0;">
        <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.1);">
            
            <!-- Header Section -->
            <div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); padding: 40px 30px; text-align: center; position: relative;">
                <div style="font-size: 60px; margin-bottom: 10px;">🎉</div>
                <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold; text-shadow: 0 2px 4px rgba(0,0,0,0.2);">
                    Happy Birthday, ${firstName}!
                </h1>
                <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 18px;">
                    आपको जन्मदिन की हार्दिक शुभकामनाएं! 🎂
                </p>
            </div>
            
            <!-- Main Content -->
            <div style="padding: 40px 30px; text-align: center;">
                <div style="background: linear-gradient(135deg, #ffeaa7 0%, #fab1a0 100%); border-radius: 15px; padding: 30px; margin-bottom: 30px;">
                    <div style="font-size: 80px; margin-bottom: 15px;">🎂</div>
                    <h2 style="color: #2d3436; margin: 0 0 10px 0; font-size: 24px;">
                        Turning ${age} Today!
                    </h2>
                    <p style="color: #636e72; margin: 0; font-size: 16px;">
                        Another year of amazing memories and achievements! 🌟
                    </p>
                </div>
                
                <div style="background: #f8f9fa; border-radius: 15px; padding: 25px; margin-bottom: 30px; border-left: 5px solid #6c5ce7;">
                    <h3 style="color: #2d3436; margin: 0 0 15px 0; font-size: 20px;">
                        🏫 From Your DAV Family
                    </h3>
                    <p style="color: #636e72; line-height: 1.6; margin: 0; font-size: 15px;">
                        On this special day, we remember all the wonderful moments from our school days at <strong>MN Jha DAV Public School</strong>. 
                        Whether it was sharing tiffin, playing during breaks, or those unforgettable annual functions - those memories are precious! 
                        <br><br>
                        Today, as you celebrate another year, know that your DAV family is cheering for you from wherever we are! 
                        May this new year bring you happiness, success, and all the joy you deserve.
                    </p>
                </div>
                
                <!-- Birthday Wishes Section -->
                <div style="background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%); border-radius: 15px; padding: 25px; margin-bottom: 30px;">
                    <h3 style="color: #2d3436; margin: 0 0 15px 0; font-size: 18px;">
                        ✨ Special Birthday Wishes ✨
                    </h3>
                    <div style="color: #2d3436; font-style: italic; line-height: 1.8;">
                        <p style="margin: 0 0 10px 0;">"May your birthday be filled with sunshine, smiles, laughter and love! 🌞"</p>
                        <p style="margin: 0 0 10px 0;">"Here's to another year of creating beautiful memories! 📸"</p>
                        <p style="margin: 0;">"Wishing you all the happiness your heart can hold! ❤️"</p>
                    </div>
                </div>
                
                <!-- Action Button -->
                <div style="margin: 30px 0;">
                    <a href="https://alumni-portal-davjjp.vercel.app/login" 
                       style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                              color: white; 
                              padding: 15px 35px; 
                              text-decoration: none; 
                              border-radius: 50px; 
                              display: inline-block; 
                              font-weight: bold; 
                              font-size: 16px;
                              box-shadow: 0 5px 15px rgba(102, 126, 234, 0.3);
                              transition: all 0.3s ease;">
                        🎉 Share Your Birthday Joy with DAV Family!
                    </a>
                </div>
                
                <!-- Fun Birthday Facts -->
                <div style="background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 10px; padding: 20px; margin-top: 30px;">
                    <h4 style="color: #856404; margin: 0 0 10px 0; font-size: 16px;">
                        🎈 Fun Birthday Fact!
                    </h4>
                    <p style="color: #856404; margin: 0; font-size: 14px;">
                        Did you know? You share your birthday with approximately 21 million other people around the world! 
                        But you're the only one who went to our amazing DAV school! 😄
                    </p>
                </div>
            </div>
            
            <!-- Footer -->
            <div style="background: #f8f9fa; padding: 25px 30px; text-align: center; border-top: 1px solid #e9ecef;">
                <p style="color: #6c757d; margin: 0 0 10px 0; font-size: 14px;">
                    🏫 From all of us at <strong>MN Jha DAV Public School Alumni Portal</strong>
                </p>
                <p style="color: #6c757d; margin: 0 0 15px 0; font-size: 13px;">
                    "Once a DAVian, Always a DAVian!" 💙
                </p>
                <div style="border-top: 1px solid #dee2e6; padding-top: 15px; margin-top: 15px;">
                    <p style="color: #adb5bd; margin: 0; font-size: 12px;">
                        You received this birthday greeting because you're part of our DAV Alumni family.<br>
                        <a href="https://alumni-portal-davjjp.vercel.app/" style="color: #667eea; text-decoration: none;">Visit Alumni Portal</a> • 
                        <a href="mailto:support@dav-alumni.com" style="color: #667eea; text-decoration: none;">Contact Us</a>
                    </p>
                </div>
            </div>
        </div>
        
        <!-- Floating Elements -->
        <div style="text-align: center; margin-top: 20px; font-size: 30px;">
            🎊 🎁 🎈 🎂 🎉 🎈 🎁 🎊
        </div>
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
