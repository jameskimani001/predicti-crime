
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const { user } = useAuth();
  
  // Redirect to dashboard if logged in, otherwise to login
  return user ? <Navigate to="/" /> : <Navigate to="/login" />;
};

export default Index;
