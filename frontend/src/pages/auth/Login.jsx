import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import { motion } from 'framer-motion';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="px-8 py-10 shadow-xl border-t-4 border-t-primary" hoverEffect={false}>
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-textMain mb-2">CommunityHub</h1>
            <p className="text-textMuted">Welcome back! Please login to your account.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
            
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />

            <div className="pt-2">
              <Button type="submit" className="w-full" size="lg" isLoading={loading}>
                Sign In
              </Button>
            </div>
          </form>

          <div className="mt-6 text-center text-sm text-textMuted">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary hover:text-primaryHover font-medium transition-colors">
              Create one now
            </Link>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default Login;
