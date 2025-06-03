
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
  confirmationUrl: string;
  fullName?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, confirmationUrl, fullName }: ConfirmationEmailRequest = await req.json();

    console.log(`Attempting to send email to: ${email}`);
    console.log(`Confirmation URL: ${confirmationUrl}`);

    // Validate required fields
    if (!email || !confirmationUrl) {
      throw new Error('Missing required fields: email or confirmationUrl');
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('Invalid email format');
    }

    const emailResponse = await resend.emails.send({
      from: "Simplifixr <noreply@simplifixr.com>",
      to: [email],
      subject: "Welcome to Simplifixr - Please confirm your email",
      html: `
        <div style="max-width: 600px; margin: 0 auto; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f8f9fa;">
          <div style="background: linear-gradient(135deg, #00B896, #00C9A7); padding: 40px 20px; text-align: center; border-radius: 12px 12px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 600;">Welcome to Simplifixr!</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">Your trusted service marketplace</p>
          </div>
          
          <div style="padding: 40px 30px; background: white; border-radius: 0 0 12px 12px;">
            <h2 style="color: #1a1a1a; margin: 0 0 20px 0; font-size: 22px; font-weight: 600;">
              Hi ${fullName || 'there'}! 👋
            </h2>
            
            <p style="color: #4a5568; font-size: 16px; line-height: 1.6; margin: 0 0 25px 0;">
              Thank you for joining Simplifixr! We're excited to have you on board. To get started and secure your account, please confirm your email address by clicking the button below.
            </p>
            
            <div style="text-align: center; margin: 35px 0;">
              <a href="${confirmationUrl}" 
                 style="background: linear-gradient(135deg, #00B896, #00C9A7); color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; display: inline-block; box-shadow: 0 4px 12px rgba(0, 184, 150, 0.3); transition: all 0.3s ease;">
                Confirm My Email Address
              </a>
            </div>
            
            <div style="background: #f7fafc; padding: 20px; border-radius: 8px; border-left: 4px solid #00B896; margin: 30px 0;">
              <p style="margin: 0; font-size: 14px; color: #2d3748;">
                <strong>Need help?</strong> If the button doesn't work, copy and paste this link into your browser:
              </p>
              <p style="margin: 10px 0 0 0; font-size: 14px; color: #4a5568; word-break: break-all; background: white; padding: 10px; border-radius: 4px; border: 1px solid #e2e8f0;">
                ${confirmationUrl}
              </p>
            </div>
            
            <div style="margin-top: 40px; padding-top: 30px; border-top: 1px solid #e2e8f0;">
              <p style="color: #718096; font-size: 14px; margin: 0; line-height: 1.5;">
                If you didn't create an account with Simplifixr, you can safely ignore this email. This confirmation link will expire in 24 hours for security.
              </p>
            </div>
          </div>
          
          <div style="background: #f7fafc; padding: 25px 30px; text-align: center; color: #718096; font-size: 14px; border-radius: 0 0 12px 12px;">
            <p style="margin: 0 0 10px 0;">© 2024 Simplifixr. All rights reserved.</p>
            <p style="margin: 0; font-size: 12px;">Making services simple, one click at a time.</p>
          </div>
        </div>
      `,
    });

    console.log("Confirmation email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ 
      success: true, 
      message: "Confirmation email sent successfully",
      emailId: emailResponse.data?.id 
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-confirmation-email function:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: "Failed to send confirmation email. Please check your email address and try again."
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
