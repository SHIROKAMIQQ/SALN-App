import { API_BASE_URL } from "./config";

// probably will get email from cache?
/**
 * Verify the OTP matches the OTP in the database
 * @param {string} email
 * @param {string} otp
 */
export async function verifyOTP(email, otp) {
    console.log("call to verifyOTP");

    if (!email) throw new Error("Please enter an Email.");
    if (!otp) throw new Error("Please enter an OTP.");

    const response = await fetch(`${API_BASE_URL}/verify-otp`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email: email,
            otp: otp,
        }),
    });

    const result = await response.json();
    console.log("server response: ", result);
    return result;
}