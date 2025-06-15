'use client';

import Link from 'next/link';
import Image from 'next/image';

interface Person {
  id: number;
  name: string;
  profile_path: string | null;
  known_for_department: string;
}

const PersonCard = ({ person }: { person: Person }) => {
  const imageUrl = person.profile_path
    ? `https://image.tmdb.org/t/p/original${person.profile_path}`
    : '/no-profile.png'; // fallback image if no profile

  return (
    <div className="max-w-xs rounded overflow-hidden shadow-lg bg-white hover:shadow-xl transition">
      <Link href={`/person/${person.id}`}>
        <div className="relative w-[185px] h-[278px] mx-auto mt-4">
          <Image
            src={imageUrl}
            alt={person.name}
            fill
            className="object-cover rounded"
            sizes="(max-width: 640px) 100vw, 185px"
          />
        </div>
        <div className="p-4 text-center">
          <h3 className="text-lg font-semibold">{person.name}</h3>
          <p className="text-sm text-gray-600">{person.known_for_department}</p>
        </div>
      </Link>
    </div>
  );
};

export default PersonCard;
