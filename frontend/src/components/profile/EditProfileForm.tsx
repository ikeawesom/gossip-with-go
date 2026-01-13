import React, { useState } from "react";
import { toast } from "sonner";
import type { User } from "../../types/auth";
import PrimaryButton from "../utils/PrimaryButton";
import SpinnerSecondary from "../spinner/SpinnerSecondary";
import { userApi } from "../../api/user.api";
import { useNavigate } from "react-router-dom";

export default function EditProfileForm({
  user,
  close,
}: {
  user: User;
  close: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [details, setDetails] = useState({
    username: user.username,
    bio: user.bio ?? "",
  });
  const navigate = useNavigate();

  const noChange =
    details.username === user.username && details.bio === user.bio;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await userApi.editProfile(user.id, details.username, details.bio);
      toast.success("Profile updated successfully!");
      close();
      navigate(`/${details.username}`, { replace: true });
      window.location.reload();
    } catch (err) {
      console.log(err);
      toast.error("An unexpected error has occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSave}
      className="w-full flex flex-col items-center justify-center gap-2"
    >
      <div className="w-full flex items-center justify-start gap-2">
        <p className="custom text-sm w-24">Username</p>
        <input
          className="not-rounded"
          type="text"
          placeholder={user.username}
          value={details.username}
          onChange={(e) => setDetails({ ...details, username: e.target.value })}
        />
      </div>
      <div className="w-full flex items-center justify-start gap-2">
        <p className="custom text-sm w-24">Bio</p>
        <textarea
          placeholder="Describe yourself"
          className="resize-none"
          value={details.bio}
          onChange={(e) => setDetails({ ...details, bio: e.target.value })}
        />
      </div>
      <p className="self-end fine-print">
        Your bio will be visible to everyone.
      </p>
      <PrimaryButton
        disabled={loading || noChange}
        type="submit"
        className="self-end mt-2"
      >
        {loading ? <SpinnerSecondary /> : "Save Changes"}
      </PrimaryButton>
    </form>
  );
}
