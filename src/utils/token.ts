const TOKENNAME = 'BearToken'

export const getToken = async () => {
  const tokenOption = await cookieStore.get(TOKENNAME)
  return tokenOption?.value
}

export const setToken = (token: string) => {
  return cookieStore.set({
    name: TOKENNAME,
    value: token
  })
}
