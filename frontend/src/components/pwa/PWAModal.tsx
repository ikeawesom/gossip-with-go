import { usePWAPrompt } from "../../hooks/pwa/usePWAPrompt";
import { isStandalone } from "../../lib/helpers";
import Modal, { type ModalProps } from "../utils/Modal";
import ModalTitle from "../utils/ModalTitle";
import PrimaryButton from "../utils/PrimaryButton";
import SecondaryButton from "../utils/SecondaryButton";

export default function PWAModal({ close }: ModalProps) {
  const { installable, install, isIOS } = usePWAPrompt();

  if (isStandalone()) return null;

  if (!installable && !isIOS) return null;

  const handleInstall = async () => {
    close ? close() : () => {};
    await install();
  };

  return (
    <Modal className="max-w-[500px]" close={close}>
      <ModalTitle>Open in App</ModalTitle>

      <p className="text-center mb-3 mt-4 custom text-sm md:text-base">
        Get the best experience in the Go Gossip app.
      </p>
      <div className="w-full flex items-center justify-center gap-4">
        <PrimaryButton onClick={handleInstall}>Download App</PrimaryButton>
        <SecondaryButton onClick={close}>Another time</SecondaryButton>
      </div>
    </Modal>
  );
}
