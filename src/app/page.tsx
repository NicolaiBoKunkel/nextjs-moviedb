import dynamic from 'next/dynamic';

const HomeClient = dynamic(() => import('@/components/HomeClient'), { ssr: false });

export default function HomePage() {
  return <HomeClient />;
}