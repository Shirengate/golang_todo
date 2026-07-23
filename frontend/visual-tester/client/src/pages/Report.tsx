import { useMemo, type FC } from 'react';
import { useParams } from 'react-router';
import useSWR from 'swr';
import { fetcher } from '../api';
import type { ReportListResponse } from '@gobs/visual-test-dto';

interface ImageContainerProps {
  url?: string;
  label: string;
}

const ImageContainer: FC<ImageContainerProps> = ({ url, label }) => {
  return (
    <div className='flex-1 flex flex-col gap-2 p-4 border border-slate-700 rounded bg-slate-800 min-h-[300px]'>
      <h3 className='text-sm font-semibold text-slate-300'>{label}</h3>
      <div className='flex-1 flex items-start justify-start bg-slate-900 rounded overflow-hidden'>
        {url ? (
          <img
            src={url}
            alt={label}
            className='max-w-full '
          />
        ) : (
          <span className='text-slate-500'>No image available</span>
        )}
      </div>
    </div>
  );
};

const Report: FC = () => {
  const { id } = useParams<{ id: string }>();

  const { data } = useSWR<ReportListResponse>('/api/report', fetcher);

  const currentReport = useMemo(() => {
    return data?.find((item) => item?.id === Number(id));
  }, [data, id]);

  return (
    <div className='p-4 min-h-screen bg-slate-950 text-slate-100'>
      <h2 className='text-2xl border-b border-slate-700 pb-2 mb-4'>
        Report #{currentReport?.id}
      </h2>

      <div className='flex gap-4'>
        <ImageContainer url={currentReport?.refUrl} label='Reference' />
        <ImageContainer url={currentReport?.diffUrl} label='Diff' />
      </div>
    </div>
  );
};

export default Report;
