import { disconnect } from '../utils/auth'
import { user } from '../utils/auth'
import authProviders from '../utils/auth-providers';

export const Settings = () => {
  const authProvider = authProviders.find(ap => ap.type === user.value.loginType)
  return (
    <div>
      <div className="text-3xl font-bold py-4">Settings</div>
      <div className="text-lg py-2">
        Logged in as <span className="font-bold">{user.value.email}</span>
        {/* For some reason, this doesn't show right after logging in... it only shows after reloading */}
        {authProvider && <>
          , through <span className="font-bold">{authProvider.name}</span>
        </>}
      </div>
      <button
        className="p-2 border border-black"
        onClick={disconnect}
      >
        Disconnect
      </button>
    </div>
  )
};