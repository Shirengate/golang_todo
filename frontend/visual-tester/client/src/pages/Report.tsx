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
    <div className='flex-1 basis-[400px] min-w-0 min-h-0 p-2'>
      <div className='min-h-[300px] flex flex-col gap-2 p-4 border border-slate-700 rounded bg-slate-800'>
        <h3 className='text-sm font-semibold text-slate-300'>{label}</h3>
        <div className='flex-1 bg-slate-900 rounded overflow-hidden min-h-0'>
          {url ? (
            <img
              src={url}
              alt={label}
              className='w-full object-contain object-left'
            />
          ) : (
            <span className='text-slate-500'>No image available</span>
          )}
        </div>
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
    <div className='h-full flex flex-col bg-slate-950 text-slate-100'>
      <h2 className='shrink-0 text-2xl border-b border-slate-700 p-4'>
        Report #{currentReport?.id}
      </h2>

      <div className='relative flex-1 min-h-0'>
        <div className='absolute inset-0 flex flex-wrap -m-2 overflow-y-auto'>
          <ImageContainer url={currentReport?.refUrl} label='Reference' />
          <ImageContainer url={currentReport?.diffUrl} label='Diff' />
        </div>
      </div>
    </div>
  );
};

export default Report;
