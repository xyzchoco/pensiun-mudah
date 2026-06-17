// Ikon tiap metode pembayaran
function MethodIcon({ type }) {
  if (type === "va") {
    return (
      <svg
        className="w-7 h-7"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 10l9-6 9 6M4 10h16M5 10v8m4-8v8m6-8v8m4-8v8M3 21h18"
        />
      </svg>
    );
  }
  if (type === "ewallet") {
    return (
      <svg
        className="w-7 h-7"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 7a2 2 0 012-2h12a2 2 0 012 2v1h1a1 1 0 011 1v8a2 2 0 01-2 2H5a2 2 0 01-2-2V7z"
        />
        <circle cx="16.5" cy="12.5" r="1.2" fill="currentColor" stroke="none" />
      </svg>
    );
  }
  return (
    <svg
      className="w-7 h-7"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 4h6v6H4V4zm10 0h6v6h-6V4zM4 14h6v6H4v-6zm10 2h2m4 0v4m-4 0h4m-4-4v-2"
      />
    </svg>
  );
}

export default function PaymentMethodCard({
  id,
  icon,
  title,
  subtitle,
  selected = false,
  onSelect,
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(id)}
      className={`relative text-left rounded-xl border-2 p-5 transition-all ${selected ? "border-[#008740] bg-[#F4FAF6]" : "border-[#E4E2E1] bg-white hover:border-[#008740]/40"}`}
    >
      {/* --- RADIO --- */}
      <span
        className={`absolute top-4 right-4 flex items-center justify-center w-5 h-5 rounded-full border-2 ${selected ? "border-[#008740]" : "border-[#D1D5DB]"}`}
      >
        {selected && <span className="w-2.5 h-2.5 rounded-full bg-[#008740]" />}
      </span>

      {/* --- IKON --- */}
      <span className="text-[#1B1C1C]">
        <MethodIcon type={icon} />
      </span>

      {/* --- LABEL --- */}
      <p className="mt-6 font-bold text-[#1B1C1C]">{title}</p>
      <p className="mt-1 text-sm text-[#6B7280]">{subtitle}</p>
    </button>
  );
}
