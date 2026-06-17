export default function SuccessCard({
  title = "Pembayaran Berhasil!",
  description = "",
}) {
  return (
    <div className="flex flex-col items-center text-center">
      {/* --- IKON SUKSES --- */}
      <div className="flex items-center justify-center w-20 h-20 rounded-full bg-[#008740] ring-8 ring-[#E5F0E9]">
        <svg
          className="w-10 h-10 text-white"
          fill="none"
          stroke="currentColor"
          strokeWidth={3}
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>

      {/* --- PESAN --- */}
      <h1 className="mt-6 text-3xl font-bold text-[#008740]">{title}</h1>
      <p className="mt-3 max-w-md text-[#6B7280] leading-relaxed">
        {description}
      </p>
    </div>
  );
}
