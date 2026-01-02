import NavSection from "../components/nav/NavSection";
import { DEFAULT_TOPICS } from "../lib/constants";
import Card from "../components/utils/Card";
import { Link } from "react-router-dom";
import { twMerge } from "tailwind-merge";

export default function AllTopicsPage() {
  return (
    <NavSection>
      <h2 className="pb-3 mb-4 w-full border-b border-gray-dark/20">
        Browse through popular topics!
      </h2>
      <div className="w-full grid grid-cols-3 gap-6">
        {Object.keys(DEFAULT_TOPICS).map((topic_id: string) => {
          const route = `icons/topics/${DEFAULT_TOPICS[topic_id].src}`;
          return (
            <Link key={topic_id} className="group" to={`/topics/${topic_id}`}>
              <Card
                className="relative h-full min-h-30 overflow-hidden grid place-items-center"
                key={topic_id}
              >
                <div
                  className={twMerge(
                    "absolute left-0 top-0 w-full h-full opacity-50 -translate-x-full ease-in-out group-hover:translate-0 duration-400",
                    DEFAULT_TOPICS[topic_id].color
                  )}
                />
                <div className="group-hover:scale-105 duration-400 ease-in-out relative z-10 flex flex-col items-center justify-center gap-3">
                  <h4 className="text-center custom">
                    {DEFAULT_TOPICS[topic_id].title}
                  </h4>
                  <img alt="route" src={route} width={40} height={40} />
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </NavSection>
  );
}
