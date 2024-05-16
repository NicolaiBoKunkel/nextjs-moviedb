import homeImg from '/public/home.jpg';
import Hero from '@/components/hero';

export default function Home() {
  return ( 
    <Hero 
      imgData={homeImg}
      imgAlt="movies page"
      title="TMDB with Nextjs"
      description="By Nicolai"
    />
  );
  
}