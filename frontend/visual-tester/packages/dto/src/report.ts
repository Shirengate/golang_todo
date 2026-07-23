export interface ReportItem {
  id: number;
  name: string;
  diffUrl?: string;
  refUrl?: string;
}

export type ReportListResponse = ReportItem[];
