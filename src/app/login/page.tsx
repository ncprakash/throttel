import { Suspense } from 'react';
import LoginPage from '@/components/LoginPage';

const Login = () => {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center text-white">Loading...</div>}>
      <LoginPage />
    </Suspense>
  );
};

export default Login;

