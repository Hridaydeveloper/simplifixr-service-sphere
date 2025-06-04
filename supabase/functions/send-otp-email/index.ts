
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface OTPEmailRequest {
  email: string;
  otp: string;
  type: 'signup' | 'login';
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, otp, type }: OTPEmailRequest = await req.json();

    console.log(`Sending OTP email to: ${email}, OTP: ${otp}, Type: ${type}`);

    const emailResponse = await resend.emails.send({
      from: "Simplifixr <noreply@simplifixr.com>",
      to: [email],
      subject: `Your Simplifixr verification code: ${otp}`,
      html: `
        <div style="max-width: 600px; margin: 0 auto; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f8f9fa;">
          <div style="background: linear-gradient(135deg, #00B896, #00C9A7); padding: 40px 20px; text-align: center; border-radius: 12px 12px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 600;">Simplifixr</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">Your verification code</p>
          </div>
          
          <div style="padding: 40px 30px; background: white; border-radius: 0 0 12px 12px;">
            <h2 style="color: #1a1a1a; margin: 0 0 20px 0; font-size: 22px; font-weight: 600;">
              ${type === 'signup' ? 'Welcome to Simplifixr!' : 'Welcome back!'}
            </h2>
            
            <p style="color: #4a5568; font-size: 16px; line-height: 1.6; margin: 0 0 25px 0;">
              ${type === 'signup' ? 'Thank you for signing up! Use the verification code below to complete your registration:' : 'Use the verification code below to sign in to your account:'}
            </p>
            
            <div style="text-align: center; margin: 35px 0;">
              <div style="background: #f7fafc; border: 2px solid #00B896; border-radius: 12px; padding: 20px; display: inline-block;">
                <div style="font-size: 32px; font-weight: bold; color: #00B896; letter-spacing: 8px; font-family: 'Courier New', monospace;">
                  ${otp}
                </div>
              </div>
            </div>
            
            <div style="background: #f7fafc; padding: 20px; border-radius: 8px; border-left: 4px solid #00B896; margin: 30px 0;">
              <p style="margin: 0; font-size: 14px; color: #2d3748;">
                <strong>Security Notice:</strong> This code will expire in 10 minutes. If you didn't request this code, please ignore this email.
              </p>
            </div>
            
            <div style="margin-top: 40px; padding-top: 30px; border-top: 1px solid #e2e8f0;">
              <p style="color: #718096; font-size: 14px; margin: 0; line-height: 1.5;">
                This is an automated message from Simplifixr. Please do not reply to this email.
              </p>
            </div>
          </div>
          
          <div style="background: #f7fafc; padding: 25px 30px; text-align: center; color: #718096; font-size: 14px;">
            <p style="margin: 0 0 10px 0;">© 2024 Simplifixr. All rights reserved.</p>
            <p style="margin: 0; font-size: 12px;">Making services simple, one click at a time.</p>
          </div>
        </div>
      `,
    });

    console.log("OTP email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ 
      success: true, 
      message: "OTP email sent successfully",
      emailId: emailResponse.data?.id 
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-otp-email function:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: "Failed to send OTP email. Please try again."
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
