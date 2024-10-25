import { User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabase/supabaseClient";

interface NavBarProps {
  user: User;
}

export default function NavBar({ user }: NavBarProps) {
  const router = useRouter();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error logging out:", error.message);
    } else {
      router.push("/");
    }
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        <p className="text-lg font-semibold">
          Welcome, {user.user_metadata.name}!
        </p>
        <div className="flex space-x-2">
          <Button
            onClick={() => router.push("/profile")}
            variant="default"
            className="text-white"
          >
            View Profile
          </Button>
          <Button
            onClick={() => router.push("/create-post")}
            variant="default"
            className="bg-green-500 text-white hover:bg-green-600"
          >
            Create Post
          </Button>

          <Button onClick={handleLogout} variant="outline">
            Logout
          </Button>
        </div>
      </div>
    </nav>
  );
}
