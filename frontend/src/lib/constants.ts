import type { errorType } from "../state/auth/constants";
import type { QueryPeek } from "../types/query";

export const APP_NAME = "GossipWithGo";

export interface DefaultCustomProps {
    className?: string;
    children?: React.ReactNode;
}

export const TEMP_QUERY_RESULTS: QueryPeek[] = [
    {
        id: "1",
        author_id: "auth_001",
        title: "Getting Started with TypeScript in 2024",
        desc: "A comprehensive guide to setting up TypeScript in modern web applications, covering configuration, best practices, and common pitfalls.",
        img: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800",
        date: 1701388800000, // Dec 1, 2023
        likes: 342
    },
    {
        id: "2",
        author_id: "auth_002",
        title: "Understanding React Server Components",
        desc: "Dive deep into React Server Components and learn how they can improve your application's performance and user experience.",
        img: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800",
        date: 1704067200000, // Jan 1, 2024
        likes: 567
    },
    {
        id: "3",
        author_id: "auth_001",
        title: "CSS Grid vs Flexbox: When to Use Each",
        desc: "Learn the differences between CSS Grid and Flexbox, and discover which layout system is best for your specific use cases.",
        img: "https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?w=800",
        date: 1706745600000, // Feb 1, 2024
        likes: 289
    },
    {
        id: "4",
        author_id: "auth_003",
        title: "Building Accessible Web Applications",
        desc: "Essential techniques for creating inclusive web experiences that work for everyone, including keyboard navigation and screen reader support.",
        img: "https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=800",
        date: 1709337600000, // Mar 1, 2024
        likes: 421
    },
    {
        id: "5",
        author_id: "auth_002",
        title: "Optimizing Database Queries for Performance",
        desc: "Practical strategies for improving database query performance, including indexing, query optimization, and caching techniques.",
        img: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800",
        date: 1712016000000, // Apr 2, 2024
        likes: 198
    },
    {
        id: "6",
        author_id: "auth_004",
        title: "Introduction to GraphQL APIs",
        desc: "Learn how GraphQL revolutionizes API development with its flexible query language and efficient data fetching capabilities.",
        img: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800",
        date: 1714608000000, // May 2, 2024
        likes: 503
    },
    {
        id: "7",
        author_id: "auth_003",
        title: "Mastering Git Workflows for Teams",
        desc: "Best practices for collaborative development using Git, covering branching strategies, merge conflicts, and code review processes.",
        img: "https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=800",
        date: 1717286400000, // Jun 2, 2024
        likes: 387
    },
    {
        id: "8",
        author_id: "auth_001",
        title: "Securing Your Node.js Applications",
        desc: "Essential security practices for Node.js apps, including authentication, authorization, input validation, and protecting against common vulnerabilities.",
        img: "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=800",
        date: 1719878400000, // Jul 2, 2024
        likes: 445
    },
    {
        id: "9",
        author_id: "auth_004",
        title: "Docker Containerization Best Practices",
        desc: "Learn how to effectively containerize your applications with Docker, from writing efficient Dockerfiles to orchestrating multi-container apps.",
        img: "https://images.unsplash.com/photo-1605745341112-85968b19335b?w=800",
        date: 1722556800000, // Aug 2, 2024
        likes: 612
    },
    {
        id: "10",
        author_id: "auth_002",
        title: "Modern State Management in React",
        desc: "Explore different state management solutions for React applications, from Context API to Zustand, Redux Toolkit, and Jotai.",
        img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800",
        date: 1725235200000, // Sep 2, 2024
        likes: 531
    }
];

export const defaultError: errorType = {
    code: 0,
    message: "An unknown error has occurred. Please try again later."
}

interface topicsType { [id: string]: { title: string, color: string, hover: string, src: string } };

export const DEFAULT_TOPICS = {
    "general-discussion": { title: "GENERAL DISCUSSION", color: "bg-blue-400", hover: "hover:bg-blue-400", src: "icon_chat.svg" },
    "introductions": { title: "INTRODUCTIONS", color: "bg-green-400", hover: "hover:bg-green-400", src: "icon_book.svg" },
    "technology": { title: "TECHNOLOGY", color: "bg-purple-400", hover: "hover:bg-purple-400", src: "icon_tech.svg" },
    "entertainment": { title: "ENTERTAINMENT", color: "bg-pink-400", hover: "hover:bg-pink-400", src: "icon_game.svg" },
    "sports-fitness": { title: "SPORTS & FITNESS", color: "bg-red-400", hover: "hover:bg-red-400", src: "icon_basketball.svg" },
    "food-cooking": { title: "FOOD & COOKING", color: "bg-orange-400", hover: "hover:bg-orange-400", src: "icon_chef.svg" },
    "travel-adventure": { title: "TRAVEL & ADVENTURE", color: "bg-teal-400", hover: "hover:bg-teal-400", src: "icon_plane.svg" },
    "hobbies-crafts": { title: "HOBBIES & CRAFTS", color: "bg-indigo-400", hover: "hover:bg-indigo-400", src: "icon_paint.svg" },
    "career-education": { title: "CAREER & EDUCATION", color: "bg-yellow-400", hover: "hover:bg-yellow-400", src: "icon_graduate.svg" },
    "others": { title: "OTHERS", color: "bg-gray-400", hover: "hover:bg-gray-400", src: "icon_question.svg" }
} as topicsType;