import type { FC } from 'react';

const Home: FC = () => {
  return (
    <div className='p-8'>
      <h2 className='text-2xl font-bold'>Home</h2>
      <p className='mt-2 text-slate-600'>
        Select a report from the sidebar or navigate to /report/:id.
      </p>
    </div>
  );
};

export default Home;
