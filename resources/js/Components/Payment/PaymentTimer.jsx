// resources/js/Components/Payment/PaymentTimer.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";

export default function PaymentTimer(props) {
	/* --- PROPS & DEFAULTS --- */
	const initialSeconds =
		typeof props?.initialSeconds === "number" ? props.initialSeconds : 14 * 60 + 59;
	const variant = props?.variant || "pill"; // "pill" | "badge" | "banner"
	const label = props?.label || "Batas Waktu Pembayaran";
	const onExpire = typeof props?.onExpire === "function" ? props.onExpire : null;

	/* --- STATE --- */
	const [remainingSeconds, setRemainingSeconds] = useState(initialSeconds);
	const hasExpiredRef = useRef(false);

	/* --- EFFECTS --- */
	useEffect(() => {
		setRemainingSeconds(initialSeconds);
		hasExpiredRef.current = false;
	}, [initialSeconds]);

	useEffect(() => {
		const intervalId = setInterval(() => {
			setRemainingSeconds((previous) => {
				if (previous <= 1) {
					clearInterval(intervalId);
					return 0;
				}
				return previous - 1;
			});
		}, 1000);

		return () => clearInterval(intervalId);
	}, []);

	useEffect(() => {
		if (remainingSeconds === 0 && !hasExpiredRef.current) {
			hasExpiredRef.current = true;
			if (onExpire) onExpire();
		}
	}, [remainingSeconds, onExpire]);

	/* --- HELPERS --- */
	const padNumber = (value) => String(value).padStart(2, "0");

	const formattedTime = useMemo(() => {
		const totalSeconds = remainingSeconds < 0 ? 0 : remainingSeconds;
		const hours = Math.floor(totalSeconds / 3600);
		const minutes = Math.floor((totalSeconds % 3600) / 60);
		const seconds = totalSeconds % 60;

		if (hours > 0) {
			return `${padNumber(hours)}:${padNumber(minutes)}:${padNumber(seconds)}`;
		}
		return `${padNumber(minutes)}:${padNumber(seconds)}`;
	}, [remainingSeconds]);

	const ClockIcon = ({ className }) => (
		<svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
			<path
				d="M12 22c5.5 0 10-4.5 10-10S17.5 2 12 2 2 6.5 2 12s4.5 10 10 10z"
				stroke="currentColor"
				strokeWidth="1.8"
			/>
			<path
				d="M12 6.8v5.2l3.6 2.2"
				stroke="currentColor"
				strokeWidth="1.8"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);

	/* --- RENDER: BADGE (compact red pill, e.g. QRIS timer) --- */
	if (variant === "badge") {
		return (
			<span className="inline-flex items-center gap-2 rounded-full bg-[#E11D48] px-4 py-2 text-sm font-extrabold text-white shadow-sm">
				<ClockIcon className="h-4 w-4" />
				<span className="tabular-nums tracking-wide">{formattedTime}</span>
			</span>
		);
	}

	/* --- RENDER: BANNER (full-width green block, e.g. e-wallet summary) --- */
	if (variant === "banner") {
		return (
			<div className="flex items-center gap-3 rounded-xl bg-[#008740] px-5 py-4 text-white">
				<ClockIcon className="h-6 w-6 shrink-0" />
				<div className="leading-tight">
					<p className="text-[11px] font-bold uppercase tracking-wide text-white/90">
						{label}
					</p>
					<p className="text-lg font-extrabold tabular-nums">{formattedTime}</p>
				</div>
			</div>
		);
	}

	/* --- RENDER: PILL (default red-tinted box, e.g. VA deadline) --- */
	return (
		<div className="rounded-xl bg-[#FEF2F2] p-4 ring-1 ring-[#FECACA]">
			<p className="text-xs font-semibold text-[#B42318]">{label}</p>
			<p className="mt-1 text-xl font-extrabold tabular-nums text-[#E11D48]">{formattedTime}</p>
		</div>
	);
}