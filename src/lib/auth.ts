import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db";
import * as schema from "@/db/schema";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: schema.users,
      session: schema.sessions,
      account: schema.accounts,
      verification: schema.verifications,
    },
  }),
  baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  secret: process.env.BETTER_AUTH_SECRET,
  account: {
    accountLinking: {
      enabled: true,
    },
  },
  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ user, url }) => {
      console.log(`Attempting to send reset password email to: ${user.email}`);
      try {
        const { data, error } = await resend.emails.send({
          from: process.env.EMAIL_FROM || "onboarding@resend.dev",
          to: user.email,
          subject: "Reset your password",
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
              <h2>Reset your password</h2>
              <p>You requested a password reset for your LESSONOS account.</p>
              <p>Click the button below to set a new password:</p>
              <a href="${url}" style="display: inline-block; background-color: #37352F; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin: 16px 0;">Reset Password</a>
              <p>If you didn't request this, you can safely ignore this email.</p>
              <p style="color: #666; font-size: 14px;">This link will expire in 1 hour.</p>
            </div>
          `,
        });

        if (error) {
          console.error("Resend error:", error);
        } else {
          console.log("Reset password email sent successfully:", data);
        }
      } catch (err) {
        console.error("Unexpected error sending reset password email:", err);
      }
    },
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
});
