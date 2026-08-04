import type { ReportItem } from "@gobs/visual-test-dto";

export const fetcher = (url: string) =>
  fetch(url).then((r) => r.json());

export async function sendRequest(url: string, {arg}:{arg:ReportItem}) {
  await fetch(url, {
    method: 'POST',
    headers: {
      'Content-type':"application/json"
    },
    body:JSON.stringify(arg)
  })
}
