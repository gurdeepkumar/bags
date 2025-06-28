import Portfolio from "../components/Portfolio";
import LandingPage from "../components/LandingPage"
import { useAuth } from "../auth/AuthContext";

export default function Home() {
  const { user, loading: authLoading } = useAuth();
  return (
    <div className="md:w-4/5 w-full mx-auto py-6">
      { !authLoading && user.username != "" ? <Portfolio /> : <LandingPage /> }
    </div>
  );
}
