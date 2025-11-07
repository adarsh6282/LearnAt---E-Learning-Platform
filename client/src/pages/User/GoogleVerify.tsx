import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { verifyGoogleS } from '../../services/user.services';
import { USER_ROUTES } from '../../constants/routes.constants';

const GoogleVerify: React.FC = () => {
  const navigate = useNavigate()
  const [verifying,setVerifying]=useState(true)

  useEffect(() => {
    const verifyGoogleToken = async () => {
      const urlParams = new URLSearchParams(window.location.search)
      const token = urlParams.get('token')

      if (!token) {
        console.log("token not found")
        navigate(USER_ROUTES.LOGIN)
        return
      }

      try {
        const response = await verifyGoogleS(token)

        if (response.status === 200) {
          localStorage.setItem('usersToken', token)
          await new Promise((resolve) => setTimeout(resolve, 800));
          navigate('/home')
        }
         else {
          navigate(USER_ROUTES.HOME);
        }
      } catch (error) {
        console.error('Verification failed', error)
        navigate(USER_ROUTES.LOGIN)
      }finally{
        setVerifying(false)
      }
    }

    verifyGoogleToken()
  }, [navigate])

  if(verifying){
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <h2 className="text-xl font-semibold">Verifying your account...</h2>
      </div>
    );
  }
};

export default GoogleVerify;
