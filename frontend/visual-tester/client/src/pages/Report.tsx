import { useCallback, useMemo, useState, type FC, type MouseEvent } from 'react';
import { useParams } from 'react-router';
import useSWR, { useSWRConfig } from 'swr';
import { fetcher , sendRequest} from '../api';
import type {  ReportListResponse } from '@gobs/visual-test-dto';
import Lightbox from 'yet-another-react-lightbox';
import { Captions, Zoom } from 'yet-another-react-lightbox/plugins';
import "yet-another-react-lightbox/plugins/captions.css";
import 'yet-another-react-lightbox/styles.css';
import useSWRMutation from 'swr/mutation';

interface ImageContainerProps {
  url?: string;
  label: string;
  onClick?: (event: MouseEvent<HTMLImageElement>) => void;
}

const ImageContainer: FC<ImageContainerProps> = ({ url, label, onClick }) => {
  return (
    <div className='flex-1 basis-[400px] min-w-0 min-h-0 p-2'>
      <div className='min-h-[300px] flex flex-col gap-2 p-4 border border-slate-700 rounded bg-slate-800'>
        <h3 className='text-sm font-semibold text-slate-300'>{label}</h3>
        <div className='flex-1 bg-slate-900 rounded overflow-hidden min-h-0'>
          {url ? (
            <img
              src={url}
              alt={label}
              className='w-full object-contain object-left cursor-pointer'
              onClick={onClick}
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
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const { mutate } = useSWRConfig()

  const { data } = useSWR<ReportListResponse>('/api/report', fetcher);

  const { trigger, isMutating } = useSWRMutation('/allow/report', sendRequest, {
    onSuccess: () => mutate('/api/report')
  })

  const currentReport = useMemo(() => {
    return data?.find((item) => item?.id === Number(id));
  }, [data, id]);

  const slides = useMemo(() => {
    const items: { src: string, title?: string, descriptio?: string }[] = [];
    if (currentReport?.refUrl) items.push({ src: currentReport.refUrl, title: 'Ref url' });
    if (currentReport?.allowedUrl) items.push({ src: currentReport.allowedUrl, title: 'Allowed url' })
    if (currentReport?.diffUrl) items.push({ src: currentReport.diffUrl, title: 'Diff rul' });
    return items;
  }, [currentReport]);

  const allowReport = useCallback(async () => {
    if(!currentReport) return
    await trigger(currentReport)
  }, [trigger])

  const handleImageClick = (clickedUrl?: string) => {
    const index = slides.findIndex((slide) => slide.src === clickedUrl);
    setLightboxIndex(index >= 0 ? index : 0);
    setLightboxOpen(true);
  };

  return (
    <>
      <div className='h-full flex flex-col bg-slate-950 text-slate-100'>
        <h2 className='shrink-0 text-2xl border-b border-slate-700 p-4'>
          Report #{currentReport?.id}
        </h2>

        <div className='flex justify-end px-4 py-2'>
          <button onClick={allowReport} disabled={isMutating} className='bg-green-700 p-2 rounded-xl hover:cursor-pointer hover:opacity-90'>
            Allow diff
          </button>
        </div>
        <div className='relative flex-1 min-h-0'>
          <div className='absolute inset-0 flex flex-wrap -m-2 overflow-y-auto'>
            <ImageContainer
              url={currentReport?.refUrl}
              label='Reference'
              onClick={() => handleImageClick(currentReport?.refUrl)}
            />
            <ImageContainer
              url={currentReport?.diffUrl}
              label='Diff'
              onClick={() => handleImageClick(currentReport?.diffUrl)}
            />
          </div>
        </div>
      </div>

      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        index={lightboxIndex}
        slides={slides}
        plugins={[Zoom, Captions]}
      />
    </>
  );
};

export default Report;
