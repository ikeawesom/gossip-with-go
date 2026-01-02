import { DEFAULT_TOPICS } from "../../lib/constants";
import { Link } from "react-router-dom";
import Card from "../utils/Card";
import HoriScrollSection from "../utils/HoriScrollSection";

export default function TopicsSection() {
  return (
    <HoriScrollSection title="Explore Topics">
      {Object.keys(DEFAULT_TOPICS).map((id: string) => (
        <Link key={id} to={`/topics/${id}`}>
          <Card className="text-gray-dark flex-wrap hover:brightness-110 duration-150 flex items-center justify-center flex-col gap-2">
            {DEFAULT_TOPICS[id].title}
            <img
              width={20}
              height={20}
              src={`icons/topics/${DEFAULT_TOPICS[id].src}`}
              alt="img"
            />
          </Card>
        </Link>
      ))}
    </HoriScrollSection>
  );
}
