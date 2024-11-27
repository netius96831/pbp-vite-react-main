type AuthProvider = {
  type: 'jay-boyer' | 'apex-authors';
  name: string;
  fetchUrl: string;
  loginUrl: string;
}

export const authProviders: AuthProvider[] = [
  {
    type: 'apex-authors',
    name: 'Apex Authors',
    fetchUrl: 'https://apexauthors.com/wp-json/pbpap/v1/access',
    loginUrl: 'https://apexauthors.com/members/account/'
  },
  {
    type: 'jay-boyer',
    name: 'Jay Boyer',
    fetchUrl: 'https://jayboyerproducts.com/wp-json/pbpap/v1/access',
    loginUrl: 'https://jayboyerproducts.com/my-account'
  },
]

export default authProviders;