import { useParams } from "react-router-dom";

type PostPageParams = {
  author_id: string;
  post_id: string;
};

export default function PostPage() {
  const { author_id, post_id } = useParams<PostPageParams>();

  console.log("author_id:", author_id);
  console.log("post_id:", post_id);
  return <div>PostPage</div>;
}
