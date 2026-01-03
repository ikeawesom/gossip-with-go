import { useState } from "react";
import Modal from "../components/utils/Modal";
import CreatePostForm from "../components/posts/CreatePostForm";
import PrimaryButton from "../components/utils/PrimaryButton";
import SecondaryButton from "../components/utils/SecondaryButton";
import CreateTopicForm from "../components/topics/CreateTopicForm";
import type { StateTriggerType } from "../types/res";

export interface CreatePostTopicSection extends StateTriggerType {
  username: string;
}

export default function CreatePostTopicSection({
  trigger,
  triggerBool,
  username,
}: CreatePostTopicSection) {
  const [createPost, setCreatePost] = useState(false);
  const [createTopic, setCreateTopic] = useState(false);

  const toggleTopic = () => {
    setCreatePost(false);
    setCreateTopic(true);
  };

  return (
    <>
      <div className="w-full flex items-center justify-center gap-4">
        <PrimaryButton onClick={() => setCreatePost(true)}>
          Make a Post
        </PrimaryButton>
        <h4>or</h4>
        <SecondaryButton onClick={() => setCreateTopic(true)}>
          Start a New Topic
        </SecondaryButton>
      </div>
      {createPost && (
        <Modal close={() => setCreatePost(false)}>
          <CreatePostForm
            toggleTopic={toggleTopic}
            close={() => setCreatePost(false)}
            trigger={trigger}
            triggerBool={triggerBool}
            username={username}
          />
        </Modal>
      )}
      {createTopic && (
        <Modal close={() => setCreateTopic(false)}>
          <CreateTopicForm />
        </Modal>
      )}
    </>
  );
}
