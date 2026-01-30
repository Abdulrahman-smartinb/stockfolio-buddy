export const isLoggedIn = () => {
  const token = localStorage.getItem("authToken");
  const user = localStorage.getItem("user");
  let loggedIn = true;
  if (!token || !user) loggedIn = false;
  return loggedIn;
};

export const isInvestor = () => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    return user?.role === "investor";
  } catch {
    return false;
  }
};
