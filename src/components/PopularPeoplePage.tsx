"use client";

import { useEffect, useState } from "react";
import PersonCard from "@/components/personCard";
import ParallaxPage from "@/components/ParallaxPage";

import homeImg from "/public/home.jpg";

interface Person {
  id: number;
  name: string;
  profile_path: string | null;
  known_for_department: string;
}

interface TMDBPersonResponse {
  page: number;
  results: Person[];
  total_pages: number;
}

const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const PopularPeoplePage = () => {
  const [people, setPeople] = useState<Person[]>([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchPeople = async (pageNumber: number) => {
    setIsLoading(true);
    try {
      const res = await fetch(`${baseUrl}/people/popular?page=${pageNumber}`);
      if (!res.ok) throw new Error("Failed to fetch people");
      const data: TMDBPersonResponse = await res.json();
      setPeople((prev) => [...prev, ...data.results]);
    } catch (err) {
      setError("Could not load people");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPeople(page);
  }, [page]);

  return (
    <ParallaxPage backgroundImage={homeImg.src} title="Popular People">
      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {people.map((person) => (
          <PersonCard key={person.id} person={person} />
        ))}
      </div>

      <div className="flex flex-col items-center mt-8">
        <p className="text-gray-600 mb-2">Page {page}</p>
        <button
          onClick={() => setPage((prev) => prev + 1)}
          className="bg-teal-600 hover:bg-teal-700 text-white font-semibold px-4 py-2 rounded"
          disabled={isLoading}
        >
          {isLoading ? "Loading..." : "Load More"}
        </button>
      </div>
    </ParallaxPage>
  );
};

export default PopularPeoplePage;
