import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ServiceCompletionRequest {
  action: 'generate_otp' | 'verify_otp';
  booking_id: string;
  otp?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { action, booking_id, otp }: ServiceCompletionRequest = await req.json()

    if (action === 'generate_otp') {
      // Generate 6-digit OTP
      const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString()
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes from now

      // Update booking with OTP
      const { error } = await supabase
        .from('bookings')
        .update({
          completion_otp: generatedOtp,
          completion_otp_expires_at: expiresAt.toISOString()
        })
        .eq('id', booking_id)

      if (error) {
        console.error('Error generating OTP:', error)
        return new Response(
          JSON.stringify({ error: 'Failed to generate OTP' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      console.log(`OTP generated for booking ${booking_id}: ${generatedOtp}`)

      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'OTP generated successfully',
          otp: generatedOtp // In production, this would be sent via SMS/email
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (action === 'verify_otp') {
      // Get booking with OTP
      const { data: booking, error: fetchError } = await supabase
        .from('bookings')
        .select('completion_otp, completion_otp_expires_at')
        .eq('id', booking_id)
        .single()

      if (fetchError || !booking) {
        return new Response(
          JSON.stringify({ error: 'Booking not found' }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // Check if OTP is valid and not expired
      const now = new Date()
      const expiresAt = new Date(booking.completion_otp_expires_at)

      if (!booking.completion_otp || booking.completion_otp !== otp) {
        return new Response(
          JSON.stringify({ error: 'Invalid OTP' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      if (now > expiresAt) {
        return new Response(
          JSON.stringify({ error: 'OTP has expired' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // Mark service as completed
      const { error: updateError } = await supabase
        .from('bookings')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString(),
          completion_otp: null,
          completion_otp_expires_at: null
        })
        .eq('id', booking_id)

      if (updateError) {
        console.error('Error completing service:', updateError)
        return new Response(
          JSON.stringify({ error: 'Failed to complete service' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      console.log(`Service completed for booking ${booking_id}`)

      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Service completed successfully' 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ error: 'Invalid action' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Service completion error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})