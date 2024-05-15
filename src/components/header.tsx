import Link from 'next/link';

export default function Header(){
    return (
    <div>
      <nav>
        <Link href="/">Home</Link>
        
        <div className='space-x-4 text-xl border'>
          <Link href="/popularMovies">Popular Movies</Link>
          <Link href="/highestRatedMovies">Highest Rated Movies</Link>
          <Link href="/popularTv">TV</Link>
        </div>
      </nav>
    </div>
    );
}