import Link from 'next/link';
import Image from 'next/image';
import NavLink from "./nav-link";
import logoImg from '/public/movie_black2.jpg';



export default function Header(){
    return (

      
      <nav className='flex items-center justify-between flex-wrap bg-teal-500 p-6'>        
        <div className="w-full block flex-grow lg:flex lg:items-center lg:w-auto">
            <Link href="/">
                <div className='rounded-full overflow-hidden'>
                  <Image src={logoImg} alt="movie img" priority width="75" height="75" />
                </div>
            </Link>
          <div className="text-sm lg:flex-grow">
            <NavLink href="/popularMovies" >Popular Movies</NavLink>
            <NavLink href="/highestRatedMovies" >Highest Rated Movies</NavLink>
            <NavLink href="/popularTv" >TV</NavLink>
            <NavLink href="/aboutUs" >About</NavLink>
          </div>
        </div>
      </nav>

    );
}