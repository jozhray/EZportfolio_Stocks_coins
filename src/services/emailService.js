import emailjs from '@emailjs/browser';

// EmailJS Configuration
// TODO: Replace these with your actual EmailJS credentials
const EMAILJS_SERVICE_ID = 'YOUR_SERVICE_ID'; // Replace with your Service ID
const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID'; // Replace with your Template ID
const EMAILJS_PUBLIC_KEY = 'YOUR_PUBLIC_KEY'; // Replace with your Public Key

// Initialize EmailJS
emailjs.init(EMAILJS_PUBLIC_KEY);

/**
 * Generate a 6-digit random code
 */
const generateResetCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Send password reset email with verification code
 * @param {string} userEmail - User's email address
 * @param {string} userName - User's name (optional)
 * @returns {Promise<{success: boolean, code: string, error?: string}>}
 */
export const sendPasswordResetEmail = async (userEmail, userName = 'User') => {
    try {
        const resetCode = generateResetCode();

        const templateParams = {
            to_email: userEmail,
            to_name: userName,
            reset_code: resetCode,
            app_name: 'Ez Portfolio'
        };

        const response = await emailjs.send(
            EMAILJS_SERVICE_ID,
            EMAILJS_TEMPLATE_ID,
            templateParams
        );

        if (response.status === 200) {
            return {
                success: true,
                code: resetCode
            };
        } else {
            return {
                success: false,
                code: '',
                error: 'Failed to send email'
            };
        }
    } catch (error) {
        console.error('Email send error:', error);
        return {
            success: false,
            code: '',
            error: error.message || 'Failed to send reset email'
        };
    }
};

/**
 * Check if EmailJS is configured
 * @returns {boolean}
 */
export const isEmailServiceConfigured = () => {
    return EMAILJS_SERVICE_ID !== 'YOUR_SERVICE_ID' &&
        EMAILJS_TEMPLATE_ID !== 'YOUR_TEMPLATE_ID' &&
        EMAILJS_PUBLIC_KEY !== 'YOUR_PUBLIC_KEY';
};

export default {
    sendPasswordResetEmail,
    isEmailServiceConfigured
};
