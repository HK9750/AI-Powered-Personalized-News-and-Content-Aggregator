const NEXT_PUBLIC_BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export const getUserByEmail = async (email: string) => {
  const response = await fetch(`${NEXT_PUBLIC_BACKEND_URL}/api/v1/users/user`, {
    method: "POST",
    mode: "no-cors",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
    }),
  });

  return response.json();
};

export const createUser = async (email: string, name: string) => {
  const response = await fetch(`${NEXT_PUBLIC_BACKEND_URL}/api/v1/userauth`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      name,
    }),
  });

  return response.json();
};
