export const isLoggedIn = () => {
  const token = localStorage.getItem("authToken");
  const user = localStorage.getItem("user");
  let loggedIn = true;
  if (!token || !user) loggedIn = false;
  return loggedIn;
};
