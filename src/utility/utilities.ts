export const isTokenExpired = (token: string | null): boolean => {
  if (!token) return true;

  const decoded = decodeJwt(token);
  if (!decoded?.exp) return true;

  const expiresIn = decoded.exp * 1000 - Date.now();
  return expiresIn < 0;
};

export const decodeJwt = (token: string) => {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return null;
  }
};
