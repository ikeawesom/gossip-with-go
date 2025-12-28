export default function SpinnerPrimary({ size }: { size?: number }) {
  return (
    <div className="grid place-items-center">
      <img
        className="animate-spin"
        src="/utils/spinner_primary.png"
        alt="Loading"
        height={size ?? 18}
        width={size ?? 18}
      />
    </div>
  );
}
