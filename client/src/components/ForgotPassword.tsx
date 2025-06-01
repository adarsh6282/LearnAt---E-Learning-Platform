import React, { useState } from 'react';
import axiosInstance from '../services/apiService';
import { successToast } from './Toast';
import { useNavigate } from 'react-router-dom';

interface OtpPageProps {
  role: "users" | "instructors"
}

const ForgotPassword: React.FC<OtpPageProps> = ({role}) => {
  const navigate=useNavigate()
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setError('');

    try {
        localStorage.setItem("email",email)
        const response = await axiosInstance.post(`/${role}/forgotpassword`,{email:email})
        if(response&&response.status===200){
          successToast((response.data as {message:string}).message)
          navigate(`/${role}/reset-verify-otp`)
        }
    } catch (err) {
      setError('Something went wrong. Please try again later.');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-xl shadow-md bg-white">
      <h2 className="text-2xl font-semibold mb-4 text-center">Forgot Password</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
        >
          Send OTP
        </button>
      </form>
    </div>
  )
}

export default ForgotPassword;
