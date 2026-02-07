export function Brand() {
  return (
    <div className="flex items-center gap-3">
      <img
        src="/assets/generated/vidyamitra-logo.dim_512x512.png"
        alt="VidyaMitra"
        className="w-10 h-10 object-contain"
      />
      <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">
        VidyaMitra
      </span>
    </div>
  );
}
