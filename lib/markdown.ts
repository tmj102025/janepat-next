import { marked } from "marked";

marked.setOptions({
  gfm: true,
  breaks: false,
});

export async function renderMarkdown(md: string): Promise<string> {
  return marked.parse(md ?? "") as string;
}
