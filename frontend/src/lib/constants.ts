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

interface colorsType {
    title: string;
    color: string;
    text: string;
}

export const COLORS_ARR = {
    "red": {
        title: "Red",
        color: "bg-red-500 text-white",
        text: "text-red-500",
    },
    "blue": {
        title: "Blue",
        color: "bg-blue-500 text-white",
        text: "text-blue-500",

    },
    "green": {
        title: "Green",
        color: "bg-green-500 text-white",
        text: "text-green-500",
    },
    "yellow": {
        title: "Yellow",
        color: "bg-yellow-500 text-gray-900",
        text: "text-yellow-500",
    },
    "purple": {
        title: "Purple",
        color: "bg-purple-500 text-white",
        text: "text-purple-500",
    },
    "pink": {
        title: "Pink",
        color: "bg-pink-500 text-white",
        text: "text-pink-500",
    },
    "indigo": {
        title: "Indigo",
        color: "bg-indigo-500 text-white",
        text: "text-indigo-500",
    },
    "orange": {
        title: "Orange",
        color: "bg-orange-500 text-white",
        text: "text-orange-500",
    },
    "teal": {
        title: "Teal",
        color: "bg-teal-500 text-white",
        text: "text-teal-500",
    },
    "cyan": {
        title: "Cyan",
        color: "bg-cyan-500 text-gray-900",
        text: "text-cyan-500",
    },
    "gray": {
        title: "Gray",
        color: "bg-gray-500 text-white",
        text: "text-gray-500",
    },
    "white": {
        title: "White",
        color: "bg-white text-gray-900 border border-gray-300",
        text: "text-gray-dark",
    }
} as { [id: string]: colorsType }