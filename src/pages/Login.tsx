
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import LoginForm from '@/components/LoginForm';
import { Shield } from 'lucide-react';

const Login: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Redirect to dashboard if already logged in
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-4">
      <div className="mb-8 text-center">
        <div className="flex justify-center mb-4">
          <Shield size={60} className="text-primary" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">PredictCrime</h1>
        <p className="text-muted-foreground">
          Crime Prediction and Analysis Platform
        </p>
      </div>
      
      <div className="w-full max-w-md">
        <LoginForm />
      </div>
      
      <p className="mt-8 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} PredictCrime. All rights reserved.
      </p>
    </div>
  );
};

export default Login;
