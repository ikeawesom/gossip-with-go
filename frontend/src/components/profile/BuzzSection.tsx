import QuestionButton from "../utils/QuestionButton";

export default function BuzzSection({ buzz }: { buzz: number }) {
  return (
    <div className="flex items-center justify-start gap-2">
      <div className="w-fit flex items-center justify-start gap-1 rounded-md bg-white/50 px-2 py-1 shadow-sm border border-gray-light mb-2">
        <h4 className="pt-px">{buzz}</h4>
        <img src="/icons/icon_buzz.svg" width={25} height={25} />
      </div>
      <QuestionButton info="Buzz score is calculated on how many interactions (likes, comments and reposts) on users' posts and comments, and their contributions to gossipping!" />
    </div>
  );
}
