import { useState } from "react";
import PfpImg from "./PfpImg";

export default function PfpModal({ pfp }: { pfp: string | undefined }) {
  const [show, setShow] = useState(false);

  return (
    <>
      <PfpImg pfp={pfp} onClick={() => setShow(true)} />
      {show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center transition-opacity p-6">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm duration-300 fade-in"
            onClick={() => setShow(false)}
          />
          <PfpImg onClick={() => setShow(false)} zoomed={true} pfp={pfp} />
        </div>
      )}
    </>
  );
}
