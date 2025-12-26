export default function SpinnerPrimary() {
  return (
    <div className="grid place-items-center">
      <img
        className="animate-spin"
        src="/utils/spinner_primary.png"
        alt="Loading"
        height={18}
        width={18}
      />
    </div>
  );
}
