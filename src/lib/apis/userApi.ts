const API_BASE = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"}/users`;

export const deleteAccount = async (token: string) => {
  const res = await fetch(`${API_BASE}/delete`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Failed to delete account");
  return res.json();
};
