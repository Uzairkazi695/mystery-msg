import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";

import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
  email: string,
  username: string,
  verificationCode: string
): Promise<ApiResponse> {
  try {
    await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: "amazons260@gmail.com",
      subject: "verification Code",
      react: VerificationEmail({ username, otp: verificationCode }),
    });

    return { success: true, message: "Verification code send successfully " };
  } catch (error) {
    console.log("Error in sendVerificationEmail", error);
    return { success: false, message: "Error in sendVerificationEmail" };
  }
}
