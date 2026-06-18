export default function SpeakerCard({ name, title, photo, quote }) {
    return (
        <div className="rounded-2xl border border-dashed border-[#E4E2E1] p-6">
            <div className="flex items-center gap-4">
                <img
                    src={photo || '/images/event-placeholder.svg'}
                    alt={name}
                    className="h-14 w-14 shrink-0 rounded-full object-cover"
                    onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = '/images/event-placeholder.svg';
                    }}
                />
                <div className="min-w-0">
                    <p className="font-bold text-[#1B1C1C]">{name}</p>
                    <p className="text-sm text-[#6B7280]">{title}</p>
                </div>
            </div>

            {quote && (
                <p className="mt-4 text-sm italic leading-relaxed text-[#6B7280]">
                    “{quote}”
                </p>
            )}
        </div>
    );
}
