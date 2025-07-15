
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ConfirmationEmailRequest {
  email: string;
  fullName?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("=== Email Confirmation Function Started ===");
    console.log("Request method:", req.method);
    console.log("Request headers:", Object.fromEntries(req.headers.entries()));

    const requestBody = await req.json();
    console.log("Request body received:", requestBody);

    const { email, fullName }: ConfirmationEmailRequest = requestBody;

    console.log(`Processing confirmation email for: ${email}`);
    console.log(`Full name: ${fullName}`);

    // Validate required fields
    if (!email) {
      const errorMsg = 'Missing required field: email';
      console.error(errorMsg);
      throw new Error(errorMsg);
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      const errorMsg = 'Invalid email format';
      console.error(errorMsg, email);
      throw new Error(errorMsg);
    }

    // Check if Resend API key is available
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) {
      const errorMsg = 'RESEND_API_KEY environment variable is not set';
      console.error(errorMsg);
      throw new Error(errorMsg);
    }

    console.log("Attempting to send welcome email via Resend...");

    const emailResponse = await resend.emails.send({
      from: "Simplifixr <onboarding@resend.dev>",
      to: [email],
      subject: "Confirm your Signup",
      html: `
        <div style="max-width: 600px; margin: 0 auto; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;">
          <!-- Header Section -->
          <div style="background-color: #10B981; border-radius: 8px 8px 0 0; padding: 32px 40px; text-align: center;">
            <h1 style="color: #ffffff; font-size: 32px; font-weight: bold; line-height: 1.3; margin: 0 0 8px;">Welcome to Simplifixr!</h1>
            <p style="color: #ffffff; font-size: 18px; line-height: 1.4; margin: 0; opacity: 0.9;">Your trusted service marketplace</p>
          </div>
          
          <!-- Content Section -->
          <div style="padding: 40px; background-color: #ffffff; border-radius: 0 0 8px 8px; border: 1px solid #f0f0f0;">
            <h2 style="color: #333333; font-size: 24px; font-weight: 600; line-height: 1.3; margin: 0 0 24px;">Hi ${fullName || 'there'}! 👋</h2>
            
            <p style="color: #555555; font-size: 16px; line-height: 1.6; margin: 0 0 32px;">
              Thank you for joining Simplifixr! We're excited to have you on board. To get started and secure your account, please confirm your email address by clicking the confirmation link in the email sent by Supabase.
            </p>
            
            <div style="text-align: center; margin: 32px 0;">
              <div style="background-color: #10B981; color: white; padding: 16px 32px; border-radius: 8px; font-weight: 600; font-size: 16px; display: inline-block;">
                Confirm My Email Address
              </div>
            </div>
            
            <p style="color: #888888; font-size: 14px; line-height: 1.6; margin: 32px 0 16px;">
              Need help? If you didn't receive the confirmation email from Supabase, check your spam folder or try signing up again.
            </p>
            
            <p style="color: #888888; font-size: 16px; line-height: 1.6; margin: 32px 0 0;">
              Best regards,<br>
              The Simplifixr Team
            </p>
          </div>
        </div>
      `,
      headers: {
        'X-Priority': '1',
        'X-MSMail-Priority': 'High', 
        'Importance': 'high',
        'List-Unsubscribe': '<mailto:unsubscribe@resend.dev>',
      },
      tags: [
        { name: 'category', value: 'welcome_email' },
        { name: 'user_email', value: email }
      ]
    });

    console.log("Email sent successfully via Resend:");
    console.log("Email ID:", emailResponse.data?.id);
    console.log("Email response:", emailResponse);

    const responsePayload = { 
      success: true, 
      message: "Welcome email sent successfully",
      emailId: emailResponse.data?.id,
      timestamp: new Date().toISOString(),
      note: "Supabase confirmation email sent separately with valid auth tokens"
    };

    console.log("Returning success response:", responsePayload);

    return new Response(JSON.stringify(responsePayload), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("=== ERROR in send-confirmation-email function ===");
    console.error("Error type:", typeof error);
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);
    console.error("Full error object:", error);

    const errorResponse = { 
      error: error.message || "Unknown error occurred",
      details: "Failed to send confirmation email. Please check your email address and try again.",
      timestamp: new Date().toISOString()
    };

    console.log("Returning error response:", errorResponse);

    return new Response(
      JSON.stringify(errorResponse),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
