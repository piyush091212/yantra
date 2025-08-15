import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Music, User, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const LoginPage = () => {
  const { login, signup } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Login form state
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: ''
  });

  // Signup form state
  const [signupForm, setSignupForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = await login(loginForm.email, loginForm.password);
    
    setLoading(false);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (signupForm.password !== signupForm.confirmPassword) {
      setLoading(false);
      return;
    }

    const result = await signup(signupForm.name, signupForm.email, signupForm.password);
    
    setLoading(false);
  };

  const handleDemoLogin = async () => {
    setLoading(true);
    await login('demo@yantratune.com', 'demo123');
    setLoading(false);
  };

  const handleAdminLogin = async () => {
    setLoading(true);
    await login('admin@yantratune.com', 'admin123');
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800 to-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-green-500 p-3 rounded-full">
              <Music className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">YantraTune</h1>
          <p className="text-zinc-400">Your ultimate music streaming experience</p>
        </div>

        <Card className="bg-zinc-800 border-zinc-700">
          <CardHeader>
            <CardTitle className="text-white text-center">Welcome Back</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-zinc-700 mb-6">
                <TabsTrigger value="login" className="text-white data-[state=active]:text-black">Login</TabsTrigger>
                <TabsTrigger value="signup" className="text-white data-[state=active]:text-black">Sign Up</TabsTrigger>
              </TabsList>

              {/* Login Tab */}
              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <Label htmlFor="login-email" className="text-white">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 w-4 h-4" />
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="Enter your email"
                        value={loginForm.email}
                        onChange={(e) => setLoginForm({...loginForm, email: e.target.value})}
                        className="pl-10 bg-zinc-700 border-zinc-600 text-white placeholder:text-zinc-400"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="login-password" className="text-white">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 w-4 h-4" />
                      <Input
                        id="login-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={loginForm.password}
                        onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                        className="pl-10 pr-10 bg-zinc-700 border-zinc-600 text-white placeholder:text-zinc-400"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-zinc-400 hover:text-white"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                    disabled={loading}
                  >
                    {loading ? 'Signing In...' : 'Sign In'}
                  </Button>
                </form>

                <div className="mt-6 space-y-3">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-zinc-600" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-zinc-800 px-2 text-zinc-400">Or try demo accounts</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleDemoLogin}
                      disabled={loading}
                      className="border-zinc-600 text-white hover:bg-zinc-700 hover:text-white"
                    >
                      <User className="w-4 h-4 mr-2" />
                      Demo User
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleAdminLogin}
                      disabled={loading}
                      className="border-zinc-600 text-white hover:bg-zinc-700 hover:text-white"
                    >
                      <User className="w-4 h-4 mr-2" />
                      Admin
                    </Button>
                  </div>
                </div>
              </TabsContent>

              {/* Signup Tab */}
              <TabsContent value="signup">
                <form onSubmit={handleSignup} className="space-y-4">
                  <div>
                    <Label htmlFor="signup-name" className="text-white">Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 w-4 h-4" />
                      <Input
                        id="signup-name"
                        type="text"
                        placeholder="Enter your name"
                        value={signupForm.name}
                        onChange={(e) => setSignupForm({...signupForm, name: e.target.value})}
                        className="pl-10 bg-zinc-700 border-zinc-600 text-white placeholder:text-zinc-400"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="signup-email" className="text-white">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 w-4 h-4" />
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="Enter your email"
                        value={signupForm.email}
                        onChange={(e) => setSignupForm({...signupForm, email: e.target.value})}
                        className="pl-10 bg-zinc-700 border-zinc-600 text-white placeholder:text-zinc-400"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="signup-password" className="text-white">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 w-4 h-4" />
                      <Input
                        id="signup-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a password"
                        value={signupForm.password}
                        onChange={(e) => setSignupForm({...signupForm, password: e.target.value})}
                        className="pl-10 bg-zinc-700 border-zinc-600 text-white placeholder:text-zinc-400"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="signup-confirm-password" className="text-white">Confirm Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 w-4 h-4" />
                      <Input
                        id="signup-confirm-password"
                        type="password"
                        placeholder="Confirm your password"
                        value={signupForm.confirmPassword}
                        onChange={(e) => setSignupForm({...signupForm, confirmPassword: e.target.value})}
                        className="pl-10 bg-zinc-700 border-zinc-600 text-white placeholder:text-zinc-400"
                        required
                      />
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                    disabled={loading || signupForm.password !== signupForm.confirmPassword}
                  >
                    {loading ? 'Creating Account...' : 'Create Account'}
                  </Button>

                  {signupForm.password !== signupForm.confirmPassword && signupForm.confirmPassword && (
                    <p className="text-red-400 text-sm">Passwords don't match</p>
                  )}
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <p className="text-center text-zinc-400 text-sm mt-6">
          By continuing, you agree to YantraTune's Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
};

export default LoginPage;