import dynamic from 'next/dynamic';

const UserProfileClient = dynamic(() => import('@/components/UserProfileClient'), { ssr: false });

export default function UserProfilePage() {
  return <UserProfileClient />;
}