export interface ReportItem {
  id: number;
  name: string;
  diffUrl?: string;
  refUrl?: string;
  allowedUrl?:string
}

export type ReportListResponse = ReportItem[];
