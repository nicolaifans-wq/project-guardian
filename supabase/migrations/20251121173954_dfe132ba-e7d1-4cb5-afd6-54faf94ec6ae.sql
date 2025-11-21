-- Create a function to get all users with their roles (accessible by admins)
CREATE OR REPLACE FUNCTION get_all_users_with_roles()
RETURNS TABLE (
  id uuid,
  email text,
  created_at timestamptz,
  role app_role
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Check if the user is an admin
  IF NOT EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  ) THEN
    RAISE EXCEPTION 'Access denied. Admin only.';
  END IF;

  -- Return all users from auth.users with their roles
  RETURN QUERY
  SELECT 
    au.id,
    au.email::text,
    au.created_at,
    COALESCE(ur.role, 'user'::app_role) as role
  FROM auth.users au
  LEFT JOIN user_roles ur ON au.id = ur.user_id
  ORDER BY au.created_at DESC;
END;
$$;