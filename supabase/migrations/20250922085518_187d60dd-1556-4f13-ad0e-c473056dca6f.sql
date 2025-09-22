-- CRITICAL SECURITY FIXES

-- 1. Fix OTP Verifications Table Security (CRITICAL PII exposure)
-- Drop the overly permissive policy
DROP POLICY IF EXISTS "Allow OTP operations" ON public.otp_verifications;

-- Create secure policies for OTP operations
CREATE POLICY "Users can insert OTP for verification" 
ON public.otp_verifications 
FOR INSERT 
WITH CHECK (true); -- Allow anyone to create OTP requests

CREATE POLICY "Users can update their own OTP verification" 
ON public.otp_verifications 
FOR UPDATE 
USING (
  (email IS NOT NULL AND email = (SELECT email FROM auth.users WHERE id = auth.uid())) 
  OR 
  (phone IS NOT NULL AND phone = (SELECT phone FROM auth.users WHERE id = auth.uid()))
);

CREATE POLICY "Users can select their own OTP records" 
ON public.otp_verifications 
FOR SELECT 
USING (
  (email IS NOT NULL AND email = (SELECT email FROM auth.users WHERE id = auth.uid())) 
  OR 
  (phone IS NOT NULL AND phone = (SELECT phone FROM auth.users WHERE id = auth.uid()))
);

-- 2. Create secure role management function (CRITICAL role escalation prevention)
CREATE OR REPLACE FUNCTION public.secure_update_user_role(target_user_id uuid, new_role text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_user_role text;
  target_current_role text;
BEGIN
  -- Get current user's role
  SELECT role INTO current_user_role 
  FROM public.profiles 
  WHERE id = auth.uid();
  
  -- Get target user's current role
  SELECT role INTO target_current_role 
  FROM public.profiles 
  WHERE id = target_user_id;
  
  -- Only allow specific role transitions
  IF current_user_role = 'admin' THEN
    -- Admins can change any role except admin (prevent admin lockout)
    IF new_role = 'admin' AND target_user_id != auth.uid() THEN
      RAISE EXCEPTION 'Cannot assign admin role to other users';
    END IF;
  ELSIF current_user_role = 'provider' OR current_user_role = 'customer' THEN
    -- Regular users can only change their own role between customer/provider
    IF target_user_id != auth.uid() THEN
      RAISE EXCEPTION 'Cannot change other users roles';
    END IF;
    IF new_role = 'admin' THEN
      RAISE EXCEPTION 'Cannot self-assign admin role';
    END IF;
    IF new_role NOT IN ('customer', 'provider') THEN
      RAISE EXCEPTION 'Invalid role transition';
    END IF;
  ELSE
    RAISE EXCEPTION 'Insufficient permissions';
  END IF;
  
  -- Update the role
  UPDATE public.profiles 
  SET role = new_role, updated_at = now() 
  WHERE id = target_user_id;
  
  RETURN FOUND;
END;
$$;

-- 3. Fix database function security (add search_path to all functions)
CREATE OR REPLACE FUNCTION public.get_service_images(service_id uuid)
RETURNS TABLE(id uuid, image_url text, alt_text text, display_order integer)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $function$
  SELECT si.id, si.image_url, si.alt_text, si.display_order
  FROM public.service_images si
  WHERE si.master_service_id = service_id 
    AND si.is_active = true
  ORDER BY si.display_order ASC, si.created_at ASC;
$function$;

CREATE OR REPLACE FUNCTION public.verify_provider(registration_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
DECLARE
  user_uuid UUID;
BEGIN
  -- Get the user_id from the registration
  SELECT user_id INTO user_uuid 
  FROM public.provider_registrations 
  WHERE id = registration_id;
  
  -- Update registration as verified
  UPDATE public.provider_registrations 
  SET verified = true, 
      status = 'approved',
      updated_at = now()
  WHERE id = registration_id;
  
  -- Update user role to provider using secure function
  PERFORM public.secure_update_user_role(user_uuid, 'provider');
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_profile(user_id uuid, profile_data jsonb)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  -- Security check: users can only update their own profile
  IF user_id != auth.uid() THEN
    RAISE EXCEPTION 'Cannot update other users profiles';
  END IF;
  
  UPDATE public.profiles
  SET 
    full_name = COALESCE(profile_data->>'full_name', full_name),
    location = COALESCE(profile_data->>'location', location),
    profile_picture_url = COALESCE(profile_data->>'profile_picture_url', profile_picture_url),
    is_available = COALESCE((profile_data->>'is_available')::boolean, is_available),
    updated_at = now()
  WHERE id = user_id;

  -- If no rows affected, insert the profile
  IF NOT FOUND THEN
    INSERT INTO public.profiles (id, full_name, location, role, is_available, created_at, updated_at)
    VALUES (
      user_id,
      profile_data->>'full_name',
      profile_data->>'location',
      COALESCE(profile_data->>'role', 'customer'),
      COALESCE((profile_data->>'is_available')::boolean, true),
      now(),
      now()
    );
  END IF;

  RETURN TRUE;
END;
$function$;

-- 4. Add automatic cleanup for expired OTP records
CREATE OR REPLACE FUNCTION public.cleanup_expired_otps()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM public.otp_verifications 
  WHERE expires_at < now() - INTERVAL '1 hour';
END;
$$;

-- 5. Update remaining functions with security improvements
CREATE OR REPLACE FUNCTION public.create_booking(p_provider_id uuid, p_provider_service_id uuid, p_scheduled_date timestamp with time zone DEFAULT NULL::timestamp with time zone, p_scheduled_time text DEFAULT NULL::text, p_address text DEFAULT NULL::text, p_notes text DEFAULT NULL::text, p_total_amount numeric DEFAULT NULL::numeric, p_payment_method text DEFAULT NULL::text)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
DECLARE
  booking_id UUID;
BEGIN
  -- Validate that the provider service exists and is available
  IF NOT EXISTS (
    SELECT 1 FROM public.provider_services 
    WHERE id = p_provider_service_id AND provider_id = p_provider_id AND is_available = true
  ) THEN
    RAISE EXCEPTION 'Provider service not found or not available';
  END IF;
  
  INSERT INTO public.bookings (
    customer_id,
    provider_id,
    provider_service_id,
    scheduled_date,
    scheduled_time,
    address,
    notes,
    total_amount,
    payment_method,
    payment_status
  ) VALUES (
    auth.uid(),
    p_provider_id,
    p_provider_service_id,
    p_scheduled_date,
    p_scheduled_time,
    p_address,
    p_notes,
    p_total_amount,
    p_payment_method,
    CASE WHEN p_payment_method = 'cod' THEN 'pending' ELSE 'paid' END
  ) RETURNING id INTO booking_id;
  
  RETURN booking_id;
END;
$function$;