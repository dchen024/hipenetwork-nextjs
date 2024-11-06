# OAuth

## GitHub

- change Homepage URL when deploying
- add Logo to GitHub App Page
- change from app to oauth only
- app url cant be localhost
- add github logo for oauth button

## Google

- change Homepage URL when deploying
- add Logo to Google App
- change publishing status to allow external google accounts
- add google logo for oauth button

# Login

- Test with bad passwords
- Fix Login with email and password
- add email confirmation

# Profile

- add skills section
- update work history section

# Database

Postgres Function Trigger to create new "users" row when user signs up using OAuth

```sql
-- First, create the trigger function
CREATE OR REPLACE FUNCTION public.create_user_from_auth()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Then, create the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.create_user_from_auth();
```

# CB Notes

- by end of week 5 have app deployed
- think about roles
- create the values of this community

- update slides for business people to understand
- get 5 test users after week 4-5
- start to think about deployment maybe even a computer at ccny

Oct 9 2024

- add linkedin auth
- create profile form
- create post component

Nov 5 2024

- add ratelimiting to chat
