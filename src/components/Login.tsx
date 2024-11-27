import { useState } from "react";

import openPage from '../adapters/open-page';
import authProviders from '../utils/auth-providers';
import { user } from "../utils/auth";
import { getStorage, setStorage } from "../adapters/storage";
import { loginUser } from "../utils/auth";
import LoadingDots from "./LoadingDots";
import { useNavigate } from "react-router-dom";

function Login () {
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const [sentToLogin, setSentToLogin] = useState(false);
  const navigate = useNavigate();

  const retryLoginUntilValid = () => {
    const loop = setInterval(async () => {
      const storage = await getStorage(['loginType']);
      console.log('trying to log in with', storage?.loginType)
      loginUser(storage?.loginType, () => {
        if(user.value?.email) {
          setIsLoggingIn(false);
          setSentToLogin(false);
          navigate('/research');
          clearInterval(loop);
        }
      })
    }, 3000)
  }
  const login = (authType: string) => {
    setIsLoggingIn(true);
    setStorage({ loginType: authType })
    loginUser(authType, () => {
      if(!user.value?.email) {
        const authProvider = authProviders.find(ap => ap.type === authType)
        if(!authProvider) return;
        setSentToLogin(true);
        openPage(authProvider.loginUrl)
        retryLoginUntilValid();
      } else {
        setIsLoggingIn(false);
        navigate('/research');
      }
    })
  }

  return (
    <div className="py-4">
      {isLoggingIn ? (
        <div>
          <h3 className="text-2xl flex justify-center font-semibold pb-4">
            Logging in<LoadingDots showDots={isLoggingIn} />
          </h3>
          {sentToLogin && (
            <p>If you've been redirected to another page, please log in there.</p>
          )}
        </div>
       ) : (
        <div>
          <div className="text-2xl font-semibold pb-4">Login to get started!</div>
          <div className="flex gap-2">
            {authProviders.map(({name, type}) => (
              <button
                key={name}
                className="border border-black p-4 hover:bg-sky-300 bg-sky-200"
                onClick={() => login(type)}
              >
                Login to {name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default Login;