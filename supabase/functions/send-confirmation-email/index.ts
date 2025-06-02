
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

    const emailResponse = await resend.emails.send({
      from: "Simplifixr <onboarding@resend.dev>",
      to: [email],
      subject: "Confirm your email address",
      html: `
        <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
          <div style="background: linear-gradient(135deg, #00B896, #00C9A7); padding: 40px 20px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 32px;">Welcome to Simplifixr!</h1>
          </div>
          <div style="padding: 40px 20px; background: white;">
            <h2 style="color: #333; margin-bottom: 20px;">Hi ${fullName || 'there'}!</h2>
            <p style="color: #666; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
              Thank you for signing up for Simplifixr. To complete your registration, please confirm your email address by clicking the button below.
            </p>
            <div style="text-align: center; margin: 40px 0;">
              <a href="${confirmationUrl}" 
                 style="background: #00B896; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                Confirm Email Address
              </a>
            </div>
            <p style="color: #999; font-size: 14px; margin-top: 40px;">
              If you didn't create an account with Simplifixr, you can safely ignore this email.
            </p>
            <p style="color: #999; font-size: 14px;">
              Or copy and paste this link in your browser: ${confirmationUrl}
            </p>
          </div>
          <div style="background: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 14px;">
            <p>© 2024 Simplifixr. All rights reserved.</p>
          </div>
        </div>
      `,
    });

    console.log("Confirmation email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, emailResponse }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-confirmation-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
