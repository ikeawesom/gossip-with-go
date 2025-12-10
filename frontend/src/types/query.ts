export interface QueryPeek {
    id: string;
    author_id: string;
    title: string;
    desc: string;
    img: string;
    date: number;
    likes: number
}

export interface queryState {
    query: string;
    results: QueryPeek[];
    isLoading: boolean;
}