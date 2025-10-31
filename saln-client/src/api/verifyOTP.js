import { API_BASE_URL } from "./config";

/**
 * Verify the OTP matches the OTP in the database
 * @param {string} guess
 */
export async function verifyOTP(otp) {
    console.log("call to verifyOTP");

    if (!otp) throw new Error("Please enter an OTP.");

    const response = await fetch(`${API_BASE_URL}/verify-otp`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            otp: otp
        }),
    });

    if (!response.ok) {
        //
    }

    /*

    email = sessionStorage.get("tmpEmail");
    if (!email) throw new Error("Email not found in storage.");
    */


}