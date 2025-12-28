export default function SpinnerSecondary({ size }: { size?: number }) {
  return (
    <div className="grid place-items-center">
      <img
        className="animate-spin"
        src="/utils/spinner_white.png"
        alt="Loading"
        height={size ?? 24}
        width={size ?? 24}
      />
    </div>
  );
}
