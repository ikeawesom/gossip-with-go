import type { errorType } from "../state/auth/constants";

export const APP_NAME = "GossipWithGo";

export const DEV_MODE = import.meta.env.MODE === "development"

export const REQUEST_CURSOR_LIMIT = 10;
export const REQUEST_CURSOR_LIMIT_REPLIES = 5;
export const REQUEST_OFFSET = 0;

export interface DefaultCustomProps {
    className?: string;
    children?: React.ReactNode;
}

export const defaultError: errorType = {
    code: 0,
    message: "An unknown error has occurred. Please try again later."
}

interface topicsType { [id: string]: { title: string, color: string, hover: string, src: string } };

export const DEFAULT_TOPICS = {
    "general-discussion": {
        title: "GENERAL DISCUSSION",
        color: "bg-blue-600",
        hover: "hover:bg-blue-700",
        src: "icon_chat.svg",
    },
    introductions: {
        title: "INTRODUCTIONS",
        color: "bg-green-600",
        hover: "hover:bg-green-700",
        src: "icon_book.svg",
    },
    technology: {
        title: "TECHNOLOGY",
        color: "bg-purple-600",
        hover: "hover:bg-purple-700",
        src: "icon_tech.svg",
    },
    entertainment: {
        title: "ENTERTAINMENT",
        color: "bg-pink-600",
        hover: "hover:bg-pink-700",
        src: "icon_game.svg",
    },
    "sports-fitness": {
        title: "SPORTS & FITNESS",
        color: "bg-red-600",
        hover: "hover:bg-red-700",
        src: "icon_basketball.svg",
    },
    "food-cooking": {
        title: "FOOD & COOKING",
        color: "bg-orange-600",
        hover: "hover:bg-orange-700",
        src: "icon_chef.svg",
    },
    "travel-adventure": {
        title: "TRAVEL & ADVENTURE",
        color: "bg-teal-600",
        hover: "hover:bg-teal-700",
        src: "icon_plane.svg",
    },
    "hobbies-crafts": {
        title: "HOBBIES & CRAFTS",
        color: "bg-indigo-600",
        hover: "hover:bg-indigo-700",
        src: "icon_paint.svg",
    },
    "career-education": {
        title: "CAREER & EDUCATION",
        color: "bg-yellow-600",
        hover: "hover:bg-yellow-700",
        src: "icon_graduate.svg",
    },
    others: {
        title: "OTHERS",
        color: "bg-gray-600",
        hover: "hover:bg-gray-700",
        src: "icon_question.svg",
    },
} as topicsType;