import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import type { ApiError, User } from "../../types/auth";
import PrimaryButton from "../utils/PrimaryButton";
import SpinnerSecondary from "../spinner/SpinnerSecondary";
import { userApi } from "../../api/user.api";
import { useNavigate } from "react-router-dom";
import { defaultError } from "../../lib/constants";
import type { AxiosError } from "axios";

interface EditProfileType {
  username: string;
  bio: string;
  pfpPreview: string | null;
  pfpFile: File | null;
}

export default function EditProfileForm({
  user,
  close,
}: {
  user: User;
  close: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [details, setDetails] = useState<EditProfileType>({
    username: user.username,
    bio: user.bio ?? "",
    pfpFile: null,
    pfpPreview: null,
  });
  const navigate = useNavigate();

  const noChange =
    details.username === user.username &&
    details.bio === user.bio &&
    details.pfpPreview === null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("id", `${user.id}`);
      formData.append("username", details.username);
      formData.append("bio", details.bio);
      if (details.pfpFile) formData.append("avatar", details.pfpFile);

      await userApi.editProfile(formData);
      toast.success("Profile updated successfully!");
      close();
      navigate(`/${details.username}`, { replace: true });
      window.location.reload();
    } catch (err) {
      // get full axios error
      const axiosError = err as AxiosError<ApiError>;
      console.log("[EDIT PROFILE ERROR]:", axiosError.response?.data);

      // toast error or default error
      toast.error(axiosError.response?.data?.message || defaultError.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      if (details.pfpPreview) URL.revokeObjectURL(details.pfpPreview);
    };
  }, [details.pfpPreview]);

  const handleProfileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // save file for upload later and create instant local preview
    const previewUrl = URL.createObjectURL(file);
    setDetails({ ...details, pfpPreview: previewUrl, pfpFile: file });
  };

  return (
    <form
      onSubmit={handleSave}
      className="w-full flex flex-col items-center justify-center gap-2 mt-3"
    >
      <div className="w-full grid place-items-center p-4">
        <input
          id="pfp-upload"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleProfileUpload}
        />
        <label
          htmlFor="pfp-upload"
          className="relative h-30 w-30 rounded-full overflow-hidden border-2 border-gray-light shadow-sm cursor-pointer hover:opacity-90 transition grid place-items-center"
        >
          <img
            src={details.pfpPreview || user.pfp || "/utils/icon_avatar.svg"}
            alt="Profile Picture"
            className="h-full w-full object-cover"
          />
        </label>
        <p className="mt-2">Click to change your display picture</p>
      </div>
      <div className="w-full flex items-center justify-between">
        <p className="custom text-sm w-36">Email Address</p>
        <p
          onClick={() => toast.error("Your email address cannot be changed!")}
          className="custom text-sm font-bold cursor-not-allowed"
        >
          {user.email}
        </p>
      </div>
      <div className="w-full flex items-center justify-start gap-2">
        <p className="custom text-sm w-36">Username</p>
        <input
          className="not-rounded"
          type="text"
          placeholder={user.username}
          value={details.username}
          onChange={(e) => setDetails({ ...details, username: e.target.value })}
        />
      </div>
      <div className="w-full flex items-center justify-start gap-2">
        <p className="custom text-sm w-36">Bio</p>
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
