import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import { motion } from 'framer-motion';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Resident',
    apartmentNumber: '',
    phoneNumber: '',
  });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(formData);
      navigate('/');
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg"
      >
        <Card className="px-8 py-10 shadow-xl border-t-4 border-t-primary" hoverEffect={false}>
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-textMain mb-2">Join CommunityHub</h1>
            <p className="text-textMuted">Create an account to connect with your community.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Full Name" name="name" value={formData.name} onChange={handleChange} placeholder="John Doe" required />
            <Input label="Email Address" type="email" name="email" value={formData.email} onChange={handleChange} placeholder="john@example.com" required />
            <Input label="Password" type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Minimum 6 characters" required minLength="6" />
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-textMain mb-1.5">Role</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-border bg-white px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary h-[42px]"
                >
                  <option value="Resident">Resident</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
              
              {formData.role === 'Resident' && (
                <Input label="Apt Number" name="apartmentNumber" value={formData.apartmentNumber} onChange={handleChange} placeholder="e.g. A-102" required={formData.role === 'Resident'} />
              )}
            </div>
            
            <Input label="Mobile Number" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} placeholder="e.g. 555-0198" required />

            <div className="pt-4">
              <Button type="submit" className="w-full" size="lg" isLoading={loading}>
                Create Account
              </Button>
            </div>
          </form>

          <div className="mt-6 text-center text-sm text-textMuted">
            Already have an account?{' '}
            <Link to="/login" className="text-primary hover:text-primaryHover font-medium transition-colors">
              Sign In
            </Link>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default Register;
