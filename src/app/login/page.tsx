import Link from "next/link";
import dynamic from 'next/dynamic';

// const LoginClient = dynamic(() => import('@/components/LoginClient'), { ssr: false });

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <p className="text-lg text-gray-500 mb-6">
        Login & Registration is temporarily disabled.  
        You can still browse movies, TV shows, and actors.
      </p>

      <Link
        href="/"
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        Back to Home
      </Link>
    </div>
  );
}
