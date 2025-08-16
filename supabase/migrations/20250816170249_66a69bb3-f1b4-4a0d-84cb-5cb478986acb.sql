-- Add OTP column to bookings table for service completion verification
ALTER TABLE public.bookings 
ADD COLUMN completion_otp TEXT NULL,
ADD COLUMN completion_otp_expires_at TIMESTAMP WITH TIME ZONE NULL,
ADD COLUMN completed_at TIMESTAMP WITH TIME ZONE NULL;