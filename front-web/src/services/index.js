const BASE_URL = "https://bons-fluidos.tashima.space"

async function signIn(email, password) {
  return await makeRequest("/user/signin", { method: "POST", body: JSON.stringify({ email, password }) })
}

async function myInfo() {
  return await makeRequest("/user/me", { method: "GET" })
}

async function makeRequest(path, options) {
  options.redirect = 'follow'
  options.credentials = 'include'
  const res = await fetch(BASE_URL + path, options)
  if (res.status === 401) {
    throw new Error("user not authenticated")
  }
  return res.json()
}

export { signIn, myInfo }

