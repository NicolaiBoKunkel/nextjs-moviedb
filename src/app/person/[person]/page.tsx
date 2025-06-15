import Image from "next/image";
import Link from "next/link";

interface Person {
  id: number;
  name: string;
  profile_path: string | null;
  biography: string;
  known_for_department: string;
  birthday: string | null;
  deathday: string | null;
  place_of_birth: string | null;
}

interface Credit {
  id: number;
  media_type: "movie" | "tv";
  title?: string;
  name?: string;
  poster_path: string | null;
  release_date?: string;
  first_air_date?: string;
}

const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
const tmdbBaseUrl = 'https://api.themoviedb.org/3';
const imageBase = 'https://image.tmdb.org/t/p/w300_and_h450_bestv2';

async function fetchCredits(personId: string): Promise<Credit[]> {
  const res = await fetch(`${baseUrl}/people/${personId}/credits`);
  if (!res.ok) throw new Error("Failed to fetch person credits");
  return await res.json();
}

async function fetchPerson(personId: string): Promise<Person> {
  const res = await fetch(`${baseUrl}/people/${personId}/details`);
  if (!res.ok) throw new Error("Failed to fetch person details");
  return await res.json();
}

export default async function PersonPage({ params }: { params: { person: string } }) {
  const personId = params.person;

  const [person, credits] = await Promise.all([
    fetchPerson(personId),
    fetchCredits(personId),
  ]);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex flex-col md:flex-row gap-6 mb-8">
        {person.profile_path && (
          <Image
            src={imageBase + person.profile_path}
            alt={person.name}
            width={300}
            height={450}
            className="rounded shadow-lg"
          />
        )}

        <div>
          <h1 className="text-4xl font-bold mb-2">{person.name}</h1>
          <p className="text-gray-600 mb-2">{person.known_for_department}</p>
          {person.birthday && <p><strong>Born:</strong> {person.birthday}</p>}
          {person.place_of_birth && <p><strong>Birthplace:</strong> {person.place_of_birth}</p>}
          {person.deathday && <p><strong>Died:</strong> {person.deathday}</p>}

          {person.biography && (
            <div className="mt-4">
              <h2 className="text-2xl font-semibold mb-2">Biography</h2>
              <p className="text-gray-700 whitespace-pre-wrap">{person.biography}</p>
            </div>
          )}
        </div>
      </div>

      <h2 className="text-3xl font-semibold mb-4">Known For</h2>
      {credits.length === 0 ? (
        <p>No known credits found.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {credits
            .filter((c) => c.poster_path)
            .sort((a, b) => (b.release_date || b.first_air_date || '').localeCompare(a.release_date || a.first_air_date || ''))
            .map((c) => (
              <Link key={c.id} href={`/${c.media_type}/${c.id}`} className="block">
                <div className="bg-white rounded shadow hover:shadow-md transition overflow-hidden">
                  <Image
                    src={`https://image.tmdb.org/t/p/w185${c.poster_path}`}
                    alt={c.title || c.name || 'No title available'}
                    width={185}
                    height={278}
                    className="object-cover w-full"
                  />
                  <div className="p-2 text-sm text-center">
                    <p className="font-semibold truncate">{c.title || c.name}</p>
                    <p className="text-gray-500">
                      {c.release_date || c.first_air_date || 'Unknown date'}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
        </div>
      )}
    </div>
  );
}
