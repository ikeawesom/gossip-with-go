export default function SpinnerSecondary() {
  return (
    <div className="grid place-items-center">
      <img
        className="animate-spin"
        src="/utils/spinner_white.png"
        alt="Loading"
        height={24}
        width={24}
      />
    </div>
  );
}
