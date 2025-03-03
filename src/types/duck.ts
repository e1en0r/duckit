export interface Duck {
  id: string;
  headline: string;
  image: string;
  upvotes: number;
  author: string;
}

export interface DuckResponse {
  Posts: Duck[];
}
