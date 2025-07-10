-- Add phone column to otp_verifications table
ALTER TABLE public.otp_verifications 
ADD COLUMN phone TEXT;

-- Make email nullable since we can have either email or phone
ALTER TABLE public.otp_verifications 
ALTER COLUMN email DROP NOT NULL;

-- Add constraint to ensure either email or phone is provided
ALTER TABLE public.otp_verifications 
ADD CONSTRAINT check_email_or_phone 
CHECK ((email IS NOT NULL AND phone IS NULL) OR (email IS NULL AND phone IS NOT NULL));

-- Update the table description
COMMENT ON TABLE public.otp_verifications IS 'Stores OTP verification codes for both email and phone authentication';