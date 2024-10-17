if (typeof window !== 'undefined' && !Promise.withResolvers) {
  Promise.withResolvers = function <T>() {
    let resolve!: (value: T | PromiseLike<T>) => void;
    let reject!: (reason?: unknown) => void; // Mudança de any para unknown
    const promise = new Promise<T>((res, rej) => {
      resolve = res;
      reject = rej;
    });
    return { promise, resolve, reject };
  };
}

import Style from './Parceiros.module.scss';
import GridCard from '@/components/GridCard';

export default function Parceiros() { 
  return (
    <div className={Style.page}>
      <GridCard />
    </div>
  );
};
