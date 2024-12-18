create or replace function get_profile_by_id(user_id uuid)
returns json
language plpgsql
security definer
as $$
declare
  profile_data json;
begin
  select json_build_object(
    'id', id,
    'email', email,
    'avatar_url', avatar_url,
    'full_name', full_name,
    'is_admin', is_admin
  )
  into profile_data
  from profiles
  where id = user_id;
  
  return profile_data;
end;
$$;