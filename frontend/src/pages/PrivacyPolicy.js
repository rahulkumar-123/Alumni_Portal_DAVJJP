import React from 'react';
import { Link } from 'react-router-dom';

export default function PrivacyPolicy() {
    return (
        <div className="max-w-4xl mx-auto py-12 px-4 bg-surface rounded-xl shadow-lg">
            <h1 className="text-4xl font-bold mb-6 text-on-surface">Privacy Policy</h1>
            <div className="space-y-6 text-muted prose lg:prose-lg">
                <p><strong>Last Updated:</strong> June 13, 2025</p>

                <p>Welcome to the MNJ DAV Alumni Portal. We are committed to protecting your privacy and handling your data in an open and transparent manner. This policy outlines how we collect, use, and protect your personal information.</p>

                <h2 className="text-2xl font-bold text-on-surface">1. What Information Do We Collect?</h2>
                <p>We collect the following information when you register on the portal:</p>
                <ul>
                    <li><strong>Personal Identification Information:</strong> Full Name, Email Address, Date of Birth.</li>
                    <li><strong>Academic Information:</strong> Batch Year, Admission Number.</li>
                    <li><strong>Contact Information:</strong> Phone Number (optional).</li>
                    <li><strong>Professional Information:</strong> Current Company/Institute, Location, LinkedIn Profile (optional).</li>
                    <li><strong>User-Generated Content:</strong> Posts, comments, group chat messages, and profile information you voluntarily add.</li>
                </ul>

                <h2 className="text-2xl font-bold text-on-surface">2. How Do We Use Your Information?</h2>
                <p>Your data is used solely for the purpose of running and enhancing the Alumni Portal. This includes:</p>
                <ul>
                    <li><strong>Authentication:</strong> To securely log you into your account.</li>
                    <li><strong>Alumni Directory:</strong> To display your profile to other approved alumni members, fostering connections. Your contact details are part of this private directory.</li>
                    <li><strong>Communication:</strong> To send important notifications, such as account approval emails.</li>
                    <li><strong>Community Features:</strong> To attribute your posts, comments, and group messages to your profile.</li>
                    <li><strong>Homepage Features:</strong> To feature you on the portal on your birthday, celebrating with the community.</li>
                </ul>

                <h2 className="text-2xl font-bold text-on-surface">3. Data Handling and Security</h2>
                <p><strong>We do not share, sell, or rent your personal data to any third-party companies or for marketing purposes.</strong></p>
                <ul>
                    <li>All data is stored securely in a MongoDB database.</li>
                    <li>Passwords are encrypted using industry-standard hashing algorithms (bcrypt). No one, not even administrators, can see your plain-text password.</li>
                    <li>The Alumni Directory is a private feature, accessible only to logged-in and approved alumni. It is not visible to the public.</li>
                </ul>

                <h2 className="text-2xl font-bold text-on-surface">4. Your Control Over Your Data</h2>
                <p>You have full control over the optional information in your profile. You can edit or remove your Bio, Company/Institute, Location, and other optional fields at any time via your Profile page.</p>

                <h2 className="text-2xl font-bold text-on-surface">5. Contact</h2>
                <p>If you have any questions or concerns about our privacy practices, please feel free to reach out to the portal administrator.</p>
            </div>
            <div className="text-center mt-8">
                <Link to="/" className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark">
                    Back to Home
                </Link>
            </div>
        </div>
    );
}
