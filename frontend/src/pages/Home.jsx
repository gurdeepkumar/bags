import Portfolio from "../components/Portfolio";
import LandingPage from "../components/LandingPage";
import { useAuth } from "../auth/AuthContext";

export default function Home() {
  const { user, loading: authLoading } = useAuth();

  if (authLoading) {
    return (
      <div className="md:w-4/5 w-full mx-auto py-6">
        <div className="flex justify-center items-center h-screen">
          <div className="flex space-x-2">
            <div className="w-3 h-3 bg-amber-200 rounded-full animate-bounce"></div>
            <div className="w-3 h-3 bg-amber-200 rounded-full animate-bounce [animation-delay:-0.2s]"></div>
            <div className="w-3 h-3 bg-amber-200 rounded-full animate-bounce [animation-delay:-0.4s]"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="md:w-4/5 w-full mx-auto py-6">
      {user?.username !== "" ? <Portfolio /> : <LandingPage />}
    </div>
  );
}
