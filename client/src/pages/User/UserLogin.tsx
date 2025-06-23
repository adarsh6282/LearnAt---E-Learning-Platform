import { useEffect, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import type { FormEvent } from 'react';
import { errorToast, successToast } from "../../components/Toast";
import { useNavigate,Link } from 'react-router-dom';
import { userLoginS } from '../../services/user.services';
import { USER_ROUTES } from '../../constants/routes.constants';

export default function UserLogin() {
  const [email, setEmail] = useState('')
  const [canSubmit,setCanSubmit]=useState(false)
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [errors,setErrors]=useState<{email?:string;password?:string}>({});
  const [isLoading, setIsLoading] = useState(false)
  const navigate=useNavigate()

  useEffect(()=>{
    const filled=email.trim() &&
    password.trim()

    setCanSubmit(Boolean(filled))
  })

  const validateForm = () => {
    const newErrors: { email?: string} = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email.trim())) {
      newErrors.email = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async(e:FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setErrors({})

    if(!validateForm()){
      return
    }

    setIsLoading(true)
      try{
      const response=await userLoginS(email,password)
      setIsLoading(false)
      if(response&&response.status===200){
        const token=response.data.token
        const email=response.data.user?.email
        localStorage.setItem("usersEmail",email)
        localStorage.setItem("usersToken",token)
        successToast("User Registered Successfully")
        setTimeout(() => {
          navigate("/")
        }, 2000);
      }
      }catch(err:any){
        const msg=err.response?.data?.message
        errorToast(msg)
        setIsLoading(false)
      }
  }

  return (
    <div className="w-full max-w-md mx-auto p-6 mt-35 rounded-lg shadow-lg">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Welcome back</h2>
        <p className="text-gray-600 mt-2">Enter your credentials to sign in</p>
      </div>
    <form onSubmit={handleSubmit}>
      <div className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email address
          </label>
          <div className="relative">
            <input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full py-2 pl-3 pr-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="you@example.com"
            />
            {errors.email && (
                <p className="text-sm text-red-600 mt-1">{errors.email}</p>
              )}
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full py-2 pl-3 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="••••••••"
            />
            {errors.password && (
                <p className="text-sm text-red-600 mt-1">{errors.password}</p>
              )}
            <button
              type="button"
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center"></div>
          <div className="text-sm">
            <Link to={USER_ROUTES.FORGOT_PASSWORD} className="font-medium text-blue-600 hover:text-blue-500">
              Forgot password?
            </Link>
          </div>
        </div>

        <div>
          <button
            type='submit'
            disabled={!canSubmit||isLoading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Signing in..." : "Sign in"}
          </button>
        </div>
      </div>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Don't have an account?{" "}
          <Link to={USER_ROUTES.REGISTER} className="font-medium text-blue-600 hover:text-blue-500">
          Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}