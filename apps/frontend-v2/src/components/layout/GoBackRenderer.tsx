import { useGoBackState } from '@/store/goBack';
import Link from 'next/link';

export const GoBackRenderer = () => {
  const [goBack] = useGoBackState();

  return goBack && goBack.length ? (
    <div className="mb-5 inline-flex w-full justify-start items-center">
      <Link href={goBack} className="text-gray-500 hover:text-black transition">
        ← Go back
      </Link>
    </div>
  ) : null;
};
