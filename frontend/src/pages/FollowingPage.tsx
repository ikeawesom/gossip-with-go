import NavSection from "../components/nav/NavSection";
import TopicsSection from "../components/topics/TopicsSection";
import PostsFeed from "../components/posts/PostsFeed";
import usePWAModal from "../hooks/pwa/usePWAModal";
import PWAModal from "../components/pwa/PWAModal";

export default function FollowingPage() {
  const { handleClose, showPWA } = usePWAModal();

  return (
    <>
      <NavSection>
        <div className="flex flex-col items-center justify-center w-full gap-4">
          <TopicsSection />
        </div>
        <h2 className="pb-3 w-full border-b border-gray-dark/20 flex items-center justify-start gap-3 mt-6 mb-4">
          Following
          <img
            src="/icons/icon_user.svg"
            alt="Followings"
            width={15}
            height={15}
          />
        </h2>
        <PostsFeed type="following" />
      </NavSection>
      {showPWA && <PWAModal close={handleClose} />}
    </>
  );
}
