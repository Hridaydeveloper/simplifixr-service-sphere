
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import React from 'npm:react@18.3.1';
import { renderAsync } from 'npm:@react-email/components@0.0.22';
import { WelcomeEmail } from './_templates/welcome-email.tsx';

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

    // Generate a mock confirmation URL (since actual confirmation is handled by Supabase)
    const confirmationUrl = `${Deno.env.get('SUPABASE_URL') || 'https://gyunwjlhcdlposlicatl.supabase.co'}/auth/v1/verify?type=signup&redirect_to=${encodeURIComponent('https://lovable.dev')}`;

    // Render the React email template
    const emailHtml = await renderAsync(
      React.createElement(WelcomeEmail, {
        fullName: fullName || 'there',
        confirmationUrl
      })
    );

    const emailResponse = await resend.emails.send({
      from: "Simplifixr <onboarding@resend.dev>",
      to: [email],
      subject: "Confirm your Signup",
      html: emailHtml,
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
