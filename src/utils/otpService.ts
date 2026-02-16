
// Mock OTP Service
// In production, integrate with Twilio, Msg91, or Firebase

export const generateOTP = () => {
    // For development: using fixed OTP
    // In production: generate random 6-digit number
    return '123456';
    // return Math.floor(100000 + Math.random() * 900000).toString();
};

export const sendOTP = async (mobileNumber: string, otp: string) => {
    // In a real app, send via SMS Gateway
    console.log(`[OTP SERVICE] Sending OTP ${otp} to ${mobileNumber}`);
    return true;
};
