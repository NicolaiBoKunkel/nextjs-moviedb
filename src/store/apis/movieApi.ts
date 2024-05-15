import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const apiKey = 'e46278258cc52ec12ec6d0d0582c89b7';
    const response = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}`);
    const data = await response.json();
    res.status(200).json(data.results);
  } catch (error) {
    console.error('Error fetching movies:', error);
    res.status(500).json({ error: 'Error fetching movies' });
  }
}