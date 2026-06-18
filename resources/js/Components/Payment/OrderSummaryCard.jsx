// Helper format Rupiah (samain gaya kayak di halaman lain)
function formatRupiah(angka) {
  if (angka === 0) return "Gratis";
  const isNegative = angka < 0;
  const formatted = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(Math.abs(angka));
  return isNegative ? `- ${formatted}` : formatted;
}

export default function OrderSummaryCard({
  variant = "light",
  title = "Ringkasan Pesanan",
  header = null,
  items = [],
  totalLabel = "Total",
  totalValue = 0,
  dashedDivider = false,
  footer = null,
}) {
  const isSolid = variant === "solid";

  return (
    <div
      className={`rounded-2xl p-6 ${isSolid ? "bg-[#008740] text-white" : "bg-[#F3F4F6] border border-[#E4E2E1]"}`}
    >
      <h2
        className={`text-xl font-bold mb-5 ${isSolid ? "text-white" : "text-[#1B1C1C]"}`}
      >
        {title}
      </h2>

      {/* --- HEADER OPSIONAL (mis. thumbnail kursus) --- */}
      {header && <div className="mb-5">{header}</div>}

      {/* --- RINCIAN ITEM --- */}
      <div className="space-y-4">
        {items.map((item, index) => (
          <div key={index} className="flex items-start justify-between gap-4">
            <div>
              <p
                className={`text-sm font-semibold ${isSolid ? "text-white" : "text-[#1B1C1C]"}`}
              >
                {item.label}
              </p>
              {item.subLabel && (
                <p
                  className={`text-xs mt-0.5 ${isSolid ? "text-white/70" : "text-[#6B7280]"}`}
                >
                  {item.subLabel}
                </p>
              )}
            </div>
            <p
              className={`text-sm font-bold whitespace-nowrap ${item.isDiscount ? "text-[#DC2626]" : isSolid ? "text-white" : "text-[#1B1C1C]"}`}
            >
              {item.display ? item.display : formatRupiah(item.value)}
            </p>
          </div>
        ))}
      </div>

      {/* --- TOTAL --- */}
      <div
        className={`flex items-center justify-between mt-5 pt-5 border-t ${dashedDivider ? "border-dashed" : ""} ${isSolid ? "border-white/20" : "border-[#E4E2E1]"}`}
      >
        <span
          className={`text-base font-bold ${isSolid ? "text-white" : "text-[#1B1C1C]"}`}
        >
          {totalLabel}
        </span>
        <span
          className={`text-2xl font-bold ${isSolid ? "text-white" : "text-[#FF8928]"}`}
        >
          {formatRupiah(totalValue)}
        </span>
      </div>

      {/* --- FOOTER OPSIONAL (mis. timer / tombol) --- */}
      {footer && <div className="mt-5">{footer}</div>}
    </div>
  );
}
