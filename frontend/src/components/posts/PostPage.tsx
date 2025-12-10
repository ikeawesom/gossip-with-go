import { useParams } from "react-router-dom";

export default function PostPage() {
  const { author_id, post_id } = useParams();

  console.log("author_id:", author_id);
  console.log("post_id:", post_id);
  return <div>PostPage</div>;
}
