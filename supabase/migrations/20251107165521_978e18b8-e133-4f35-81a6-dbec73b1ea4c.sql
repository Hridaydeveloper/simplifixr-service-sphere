-- Add RLS policies for admin access to all tables

-- Admin can view all profiles
CREATE POLICY "Admins can view all profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'));

-- Admin can view all provider registrations
CREATE POLICY "Admins can view all provider registrations"
ON public.provider_registrations
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'));

-- Admin can update provider registrations
CREATE POLICY "Admins can update provider registrations"
ON public.provider_registrations
FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'));

-- Admin can view all bookings
CREATE POLICY "Admins can view all bookings"
ON public.bookings
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'));

-- Admin can view all provider services
CREATE POLICY "Admins can view all provider services"
ON public.provider_services
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'));

-- Function to get all users with their roles
CREATE OR REPLACE FUNCTION public.get_all_users()
RETURNS TABLE(
  id uuid,
  email text,
  created_at timestamp with time zone,
  full_name text,
  location text,
  role text,
  profile_picture_url text
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    p.id,
    au.email,
    p.created_at,
    p.full_name,
    p.location,
    p.role,
    p.profile_picture_url
  FROM public.profiles p
  LEFT JOIN auth.users au ON p.id = au.id
  ORDER BY p.created_at DESC;
$$;

-- Function to get provider registration statistics
CREATE OR REPLACE FUNCTION public.get_provider_stats()
RETURNS TABLE(
  total_providers bigint,
  pending_providers bigint,
  approved_providers bigint,
  rejected_providers bigint
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    COUNT(*) as total_providers,
    COUNT(*) FILTER (WHERE status = 'pending') as pending_providers,
    COUNT(*) FILTER (WHERE status = 'approved') as approved_providers,
    COUNT(*) FILTER (WHERE status = 'rejected') as rejected_providers
  FROM public.provider_registrations;
$$;

-- Function to get all provider registrations with details
CREATE OR REPLACE FUNCTION public.get_all_provider_registrations()
RETURNS TABLE(
  id uuid,
  user_id uuid,
  email text,
  full_name text,
  phone text,
  business_name text,
  business_address text,
  service_categories text[],
  experience text,
  description text,
  id_proof_type text,
  id_proof_number text,
  id_proof_document_url text,
  business_license_url text,
  additional_documents_urls text[],
  status text,
  verified boolean,
  verified_at timestamp with time zone,
  verified_by uuid,
  admin_notes text,
  created_at timestamp with time zone,
  updated_at timestamp with time zone
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    id,
    user_id,
    email,
    full_name,
    phone,
    business_name,
    business_address,
    service_categories,
    experience,
    description,
    id_proof_type,
    id_proof_number,
    id_proof_document_url,
    business_license_url,
    additional_documents_urls,
    status,
    verified,
    verified_at,
    verified_by,
    admin_notes,
    created_at,
    updated_at
  FROM public.provider_registrations
  ORDER BY created_at DESC;
$$;

-- Function to get all services with provider details
CREATE OR REPLACE FUNCTION public.get_all_services_with_providers()
RETURNS TABLE(
  service_id uuid,
  provider_id uuid,
  provider_name text,
  provider_email text,
  provider_location text,
  master_service_id uuid,
  master_service_name text,
  service_category text,
  custom_service_name text,
  price_range text,
  estimated_time text,
  description text,
  images text[],
  is_available boolean,
  created_at timestamp with time zone
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    ps.id as service_id,
    ps.provider_id,
    p.full_name as provider_name,
    au.email as provider_email,
    p.location as provider_location,
    ps.master_service_id,
    ms.name as master_service_name,
    ms.category as service_category,
    ps.custom_service_name,
    ps.price_range,
    ps.estimated_time,
    ps.description,
    ps.images,
    ps.is_available,
    ps.created_at
  FROM public.provider_services ps
  LEFT JOIN public.profiles p ON ps.provider_id = p.id
  LEFT JOIN auth.users au ON ps.provider_id = au.id
  LEFT JOIN public.master_services ms ON ps.master_service_id = ms.id
  ORDER BY ps.created_at DESC;
$$;

-- Function to get booking statistics
CREATE OR REPLACE FUNCTION public.get_booking_stats()
RETURNS TABLE(
  total_bookings bigint,
  pending_bookings bigint,
  confirmed_bookings bigint,
  completed_bookings bigint,
  cancelled_bookings bigint,
  total_revenue numeric
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    COUNT(*) as total_bookings,
    COUNT(*) FILTER (WHERE status = 'pending') as pending_bookings,
    COUNT(*) FILTER (WHERE status = 'confirmed') as confirmed_bookings,
    COUNT(*) FILTER (WHERE status = 'completed') as completed_bookings,
    COUNT(*) FILTER (WHERE status = 'cancelled') as cancelled_bookings,
    COALESCE(SUM(total_amount) FILTER (WHERE status = 'completed'), 0) as total_revenue
  FROM public.bookings;
$$;

-- Function to get all bookings with details
CREATE OR REPLACE FUNCTION public.get_all_bookings_admin()
RETURNS TABLE(
  id uuid,
  customer_id uuid,
  customer_name text,
  customer_email text,
  provider_id uuid,
  provider_name text,
  provider_email text,
  service_name text,
  status text,
  scheduled_date timestamp with time zone,
  scheduled_time text,
  address text,
  total_amount numeric,
  payment_method text,
  payment_status text,
  created_at timestamp with time zone
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    b.id,
    b.customer_id,
    cp.full_name as customer_name,
    cu.email as customer_email,
    b.provider_id,
    pp.full_name as provider_name,
    pu.email as provider_email,
    COALESCE(ms.name, ps.custom_service_name) as service_name,
    b.status,
    b.scheduled_date,
    b.scheduled_time,
    b.address,
    b.total_amount,
    b.payment_method,
    b.payment_status,
    b.created_at
  FROM public.bookings b
  LEFT JOIN public.profiles cp ON b.customer_id = cp.id
  LEFT JOIN auth.users cu ON b.customer_id = cu.id
  LEFT JOIN public.profiles pp ON b.provider_id = pp.id
  LEFT JOIN auth.users pu ON b.provider_id = pu.id
  LEFT JOIN public.provider_services ps ON b.provider_service_id = ps.id
  LEFT JOIN public.master_services ms ON ps.master_service_id = ms.id
  ORDER BY b.created_at DESC;
$$;