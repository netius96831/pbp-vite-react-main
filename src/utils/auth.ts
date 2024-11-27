/*
  This auth is easily bypassed by changing the email and tools values in storage.
  However, the only thing that could be done by "hacking" the extension is using the extension for free
  For our target market, that is not likely to be a big problem.
*/

import { getStorage, setStorage } from '../adapters/storage';
import { signal, Signal } from "@preact/signals";
import sendMessage from '../adapters/send-message';

export type User = {
  email: string
  tools: string[]
  loginType: string
  loggedInAt?: string
  name: string
}

const emptyUser: User = { email: '', tools: [], loginType: '', name: '' }
export const user: Signal<User> = signal(emptyUser)

const expiration = 1000 * 60 * 60 * 24 * 21 // 21 days

export const getUser = async () => {
  const storage = await getStorage(['isDisconnected', 'loginType'])
  if(storage?.isDisconnected === 'true') return;

  await loadUser();
  if(user.value?.email) return;


  const [ primaryAuth, backupAuth ] = storage?.loginType == 'jay-boyer' ?
    ['jay-boyer', 'apex-authors'] :
    ['apex-authors', 'jay-boyer']

  loginUser(primaryAuth, () => {
    if(user.value?.email) return;
    loginUser(backupAuth);
  });
}

export const loadUser = async () => {
  const storageUser = await getStorage(['email', 'tools', 'loginType', 'loggedInAt', 'name']) as User
  if(!storageUser?.name) { storageUser.name = storageUser?.email }
  const isExpired = storageUser?.loggedInAt && Date.now() - parseInt(storageUser.loggedInAt) > expiration
  if(isExpired) {
    user.value = emptyUser
  } else {
    user.value = storageUser || emptyUser
  }
}

export const loginUser = (authType: string, callback?: () => void) => {
  setStorage({ isDisconnected: false })
  sendMessage({ type: 'login', provider: authType }, (response) => {
    user.value = response as User
    if(user.value?.email) {
      setStorage(user.value)
      setStorage({ loggedInAt: Date.now() })
      console.log('loginUser', user.value)
    }
    callback && callback()
  })
}

export const disconnect = () => {
  user.value = emptyUser
  setStorage(emptyUser)
  setStorage({ isDisconnected: true })
}
