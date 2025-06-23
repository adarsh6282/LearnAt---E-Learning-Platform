import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { verifyGoogleS } from '../../services/user.services';
import { USER_ROUTES } from '../../constants/routes.constants';

const GoogleVerify: React.FC = () => {
  const navigate = useNavigate()

  useEffect(() => {
    const verifyGoogleToken = async () => {
      const urlParams = new URLSearchParams(window.location.search)
      const token = urlParams.get('token')

      if (!token) {
        navigate(USER_ROUTES.LOGIN)
        return
      }

      try {
        const response = await verifyGoogleS(token)

        if (response.status === 200) {
          localStorage.setItem('usersToken', token)
          navigate('/')
        } else {
          navigate(USER_ROUTES.LOGIN);
        }
      } catch (error) {
        console.error('Verification failed', error)
        navigate(USER_ROUTES.LOGIN)
      }
    }

    verifyGoogleToken()
  }, [navigate])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <h2 className="text-xl font-semibold">Verifying your account...</h2>
    </div>
  );
};

export default GoogleVerify;
