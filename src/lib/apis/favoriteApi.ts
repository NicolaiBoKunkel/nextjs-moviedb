const API_BASE = 'http://localhost:5000/api/users';

export const getFavorites = async (token: string) => {
  const res = await fetch(`${API_BASE}/favorites`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch favorites");
  return res.json(); // { favorites: [123, 456] }
};

export const addFavorite = async (mediaId: number, token: string) => {
  const res = await fetch(`${API_BASE}/favorites`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ mediaId }),
  });
  if (!res.ok) throw new Error("Failed to add favorite");
  return res.json();
};

export const removeFavorite = async (mediaId: number, token: string) => {
  const res = await fetch(`${API_BASE}/favorites/${mediaId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to remove favorite");
  return res.json();
};
