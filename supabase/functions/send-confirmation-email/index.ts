
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
    console.log("=== Email Confirmation Function Started ===");
    console.log("Request method:", req.method);
    console.log("Request headers:", Object.fromEntries(req.headers.entries()));

    const requestBody = await req.json();
    console.log("Request body received:", requestBody);

    const { email, confirmationUrl, fullName }: ConfirmationEmailRequest = requestBody;

    console.log(`Processing confirmation email for: ${email}`);
    console.log(`Full name: ${fullName}`);
    console.log(`Confirmation URL: ${confirmationUrl}`);

    // Validate required fields
    if (!email || !confirmationUrl) {
      const errorMsg = 'Missing required fields: email or confirmationUrl';
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

    console.log("Attempting to send email via Resend...");

    const emailResponse = await resend.emails.send({
      from: "Simplifixr <hello@simplifixr.com>",
      to: [email],
      subject: "✅ Confirm your email - Simplifixr",
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Confirm Your Email - Simplifixr</title>
        </head>
        <body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;">
          <table role="presentation" style="width: 100%; border-collapse: collapse; border: 0; border-spacing: 0; background-color: #f8fafc;">
            <tr>
              <td align="center" style="padding: 40px 20px;">
                <table role="presentation" style="width: 100%; max-width: 600px; border-collapse: collapse; border: 0; border-spacing: 0; background-color: #ffffff; border-radius: 16px; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);">
                  <!-- Header -->
                  <tr>
                    <td style="padding: 48px 40px 32px; text-align: center; background: linear-gradient(135deg, #00B896 0%, #00C9A7 100%); border-radius: 16px 16px 0 0;">
                      <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: 700; line-height: 1.2;">Welcome to Simplifixr!</h1>
                      <p style="margin: 12px 0 0; color: rgba(255, 255, 255, 0.9); font-size: 18px; font-weight: 500;">Your trusted service marketplace</p>
                    </td>
                  </tr>
                  
                  <!-- Main Content -->
                  <tr>
                    <td style="padding: 48px 40px;">
                      <h2 style="margin: 0 0 24px; color: #1a202c; font-size: 24px; font-weight: 600;">
                        Hi ${fullName || 'there'}! 👋
                      </h2>
                      
                      <p style="margin: 0 0 32px; color: #4a5568; font-size: 16px; line-height: 1.6;">
                        Thank you for joining Simplifixr! We're excited to have you on board. To complete your registration and secure your account, please confirm your email address by clicking the button below.
                      </p>
                      
                      <!-- CTA Button -->
                      <table role="presentation" style="width: 100%; border-collapse: collapse; border: 0; border-spacing: 0;">
                        <tr>
                          <td align="center" style="padding: 0 0 40px;">
                            <a href="${confirmationUrl}" 
                               style="display: inline-block; background: linear-gradient(135deg, #00B896 0%, #00C9A7 100%); color: #ffffff; text-decoration: none; padding: 18px 36px; border-radius: 12px; font-weight: 600; font-size: 16px; letter-spacing: 0.5px; box-shadow: 0 8px 24px rgba(0, 184, 150, 0.3); transition: all 0.3s ease;">
                              ✅ Confirm My Email Address
                            </a>
                          </td>
                        </tr>
                      </table>
                      
                      <!-- Help Section -->
                      <div style="background: #f7fafc; padding: 24px; border-radius: 12px; border-left: 4px solid #00B896; margin: 32px 0;">
                        <p style="margin: 0 0 12px; font-size: 15px; font-weight: 600; color: #2d3748;">
                          🔗 Having trouble with the button?
                        </p>
                        <p style="margin: 0 0 16px; font-size: 14px; color: #4a5568;">
                          Copy and paste this link into your browser:
                        </p>
                        <div style="background: #ffffff; padding: 16px; border-radius: 8px; border: 1px solid #e2e8f0; word-break: break-all;">
                          <a href="${confirmationUrl}" style="color: #00B896; text-decoration: none; font-size: 14px; font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;">
                            ${confirmationUrl}
                          </a>
                        </div>
                      </div>
                      
                      <!-- Security Notice -->
                      <div style="background: #fff5f5; padding: 20px; border-radius: 8px; border-left: 4px solid #f56565; margin: 32px 0;">
                        <p style="margin: 0; font-size: 14px; color: #c53030; font-weight: 500;">
                          🔒 Security Notice
                        </p>
                        <p style="margin: 8px 0 0; font-size: 14px; color: #742a2a; line-height: 1.5;">
                          This confirmation link will expire in 24 hours for your security. If you didn't create this account, you can safely ignore this email.
                        </p>
                      </div>
                      
                      <!-- What's Next -->
                      <div style="background: #f0fff4; padding: 24px; border-radius: 12px; border-left: 4px solid #48bb78; margin: 32px 0;">
                        <p style="margin: 0 0 12px; font-size: 15px; font-weight: 600; color: #22543d;">
                          🚀 What's next?
                        </p>
                        <p style="margin: 0; font-size: 14px; color: #2f855a; line-height: 1.5;">
                          Once confirmed, you'll be able to browse services, connect with providers, and start simplifying your life with Simplifixr!
                        </p>
                      </div>
                    </td>
                  </tr>
                  
                  <!-- Footer -->
                  <tr>
                    <td style="padding: 32px 40px; background: #f8fafc; border-radius: 0 0 16px 16px; text-align: center; border-top: 1px solid #e2e8f0;">
                      <p style="margin: 0 0 8px; color: #718096; font-size: 14px; font-weight: 500;">
                        © ${new Date().getFullYear()} Simplifixr. All rights reserved.
                      </p>
                      <p style="margin: 0; color: #a0aec0; font-size: 12px;">
                        Making services simple, one click at a time.
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
      headers: {
        'X-Priority': '1',
        'X-MSMail-Priority': 'High',
        'Importance': 'high',
      },
      tags: [
        { name: 'category', value: 'email_confirmation' },
        { name: 'user_id', value: email }
      ]
    });

    console.log("Email sent successfully via Resend:");
    console.log("Email ID:", emailResponse.data?.id);
    console.log("Email response:", emailResponse);

    const responsePayload = { 
      success: true, 
      message: "Confirmation email sent successfully",
      emailId: emailResponse.data?.id,
      confirmationUrl: `${confirmationUrl}?email=${encodeURIComponent(email)}`,
      timestamp: new Date().toISOString()
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
