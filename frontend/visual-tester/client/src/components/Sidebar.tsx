import type { FC } from 'react';
import { Link } from 'react-router';
import useSWR from 'swr';
import { fetcher } from '../api';
import type { ReportListResponse } from '@gobs/visual-test-dto';

const Sidebar: FC = () => {
  const { data, isLoading } = useSWR<ReportListResponse>('/api/report', fetcher);

  return (
    <aside className='w-64 h-screen bg-slate-900 text-white p-6 flex flex-col gap-4'>
      <h1 className='text-xl font-bold mb-4'>Visual Tester</h1>
      <nav className='flex flex-col gap-2'>
        <Link
          to='/'
          className='px-4 py-2 rounded hover:bg-slate-700 transition'
        >
          Home
        </Link>

        {isLoading && <p className='px-4 text-sm text-slate-400'>Loading...</p>}

        {data?.map((report) => (
          <Link
            key={report.id}
            to={`/report/${report.id}`}
            className='px-4 py-2 rounded hover:bg-slate-700 transition'
          >
            Report number {report.id}
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
