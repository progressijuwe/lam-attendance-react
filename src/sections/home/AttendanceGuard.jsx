import { useLocationGuard } from "../../hooks/useLocationGuard";

const ClockIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 15 15"/>
  </svg>
);

const PinIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
    <circle cx="12" cy="10" r="3"/>
  </svg>
);

const AlertIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <line x1="12" y1="8" x2="12" y2="12"/>
    <line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
);

function StepList({ steps }) {
  return (
    <ol className="flex flex-col gap-3">
      {steps.map((text, i) => (
        <li key={i} className="flex items-start gap-3">
          <span className="shrink-0 w-5 h-5 rounded-full border border-stone-200 bg-stone-50 text-stone-400 text-[11px] font-medium flex items-center justify-center mt-0.5">
            {i + 1}
          </span>
          <span className="text-sm text-stone-500 leading-relaxed">{text}</span>
        </li>
      ))}
    </ol>
  );
}

function DistanceMeter({ distance, accuracy }) {
  const cappedPct = Math.min((distance / 400) * 100, 100);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2 flex-wrap">
        <span className="font-body text-xs font-medium px-2.5 py-1 rounded-full bg-red-50 text-red-600">
          {distance} m away
        </span>

        {accuracy !== null && (
          <span className="text-xs text-amber-500">
            ±{accuracy} m accuracy
          </span>
        )}

        <span className="text-sm text-stone-400">must be within 50 m</span>
      </div>

      <div className="h-1 rounded-full bg-stone-100 overflow-hidden">
        <div
          className="h-full rounded-full bg-red-400 transition-all duration-700 ease-out"
          style={{ width: `${cappedPct}%` }}
        />
      </div>

      <div className="flex justify-between text-[11px] text-stone-300">
        <span>0 m</span>
        <span>50 m limit</span>
        <span>400+ m</span>
      </div>
    </div>
  );
}

const STATE_CONFIG = {
  idle: {
    icon: <PinIcon />,
    iconBg: "bg-blue-50 text-blue-500",
    title: "Location required",
    subtitle: "We need to confirm you're at the church before marking attendance.",
  },
  checking: {
    icon: <ClockIcon />,
    iconBg: "bg-blue-50 text-blue-500",
    title: null, // rendered separately with pulse dot
    subtitle: "Please allow location access when prompted by your browser.",
    steps: [
      "Request GPS coordinates from your device",
      "Measure distance to church premises",
      "Unlock the attendance form if within 50 m",
    ],
  },
  blocked: {
    icon: <PinIcon />,
    iconBg: "bg-red-50 text-red-500",
    title: "Outside church premises",
    subtitle: "You must be within 50 m of the church building to mark attendance.",
  },
  denied: {
    icon: <AlertIcon />,
    iconBg: "bg-amber-50 text-amber-500",
    title: "Location access denied",
    subtitle: "Location permission is required. Enable it in your browser settings and try again.",
    steps: [
      "Open browser settings or tap the lock icon in the address bar",
      "Find Location and set it to Allow for this site",
      "Reload the page and try again",
    ],
  },
  unavailable: {
    icon: <AlertIcon />,
    iconBg: "bg-stone-100 text-stone-400",
    title: "Position unavailable",
    subtitle: "Could not get your GPS position. Make sure location services are enabled on your device.",
  },
};

export default function AttendanceGuard({ children }) {
  const { status, distance, accuracy, permissionState, retry } = useLocationGuard();

  // Pass through to the form
  if (status === "allowed" && distance !== null) {
    return children;
  }

  const cfg = STATE_CONFIG[status];

  return (
    <div className="bg-stone-50 flex items-center justify-center px-4 py-12 xl:px-32">
      <div className="w-full max-w-sm">

        {/* Card */}
        <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden">

          {/* Header */}
          <div className="flex items-start gap-4 p-5 border-b border-stone-100">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${cfg.iconBg}`}>
              {cfg.icon}
            </div>
            <div>
              {status === "checking" ? (
                <p className="text-[15px] font-medium text-stone-800 flex items-center gap-2">
                  {/* Pulse dot */}
                  <span className="inline-block w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                  Verifying location…
                </p>
              ) : (
                <p className="text-[15px] font-medium text-stone-800">{cfg.title}</p>
              )}
              <p className="text-sm text-stone-400 mt-0.5 leading-relaxed">{cfg.subtitle}</p>
            </div>
          </div>

          {/* Body */}
          <div className="p-5 flex flex-col gap-4">

            {/* Idle — prompt not yet triggered */}
            {status === "idle" && (
              <button
                onClick={retry}
                type="button"
                className="w-full py-2.5 cursor-pointer rounded-xl border border-stone-200 text-sm font-medium text-stone-600 bg-stone-50 hover:bg-stone-100 active:scale-[0.98] transition-all"
              >
                Check my location
              </button>
            )}

            {/* Checking — step list */}
            {status === "checking" && <StepList steps={cfg.steps} />}

            {/* Blocked — distance meter + retry */}
            {status === "blocked" && (
              <>
                <DistanceMeter distance={distance} accuracy={accuracy} />
                {accuracy !== null && accuracy > 50 && (
                  <p className="text-xs text-amber-500">
                    GPS signal is weak. Move closer to an open area for better accuracy.
                  </p>
                )}
                <button
                  onClick={retry}
                  type='button'
                  className="w-full py-2.5 cursor-pointer rounded-xl border border-stone-200 text-sm font-medium text-stone-600 bg-stone-50 hover:bg-stone-100 active:scale-[0.98] transition-all"
                >
                  Try again
                </button>
              </>
            )}

            {/* Denied — step list + retry */}
            {status === "denied" && (
              <>
                <StepList
                  steps={[
                    "Tap the button below to allow location access",
                    "If no prompt appears, open your device Settings",
                    "Go to Privacy & Security → Location Services",
                    "Tap 'Safari Websites' and set it to 'Ask Next Time'",
                    "Return here and tap retry",
                  ]}
                />
                <p className="text-xs text-stone-400">
                  iPhone users: Safari may block location without prompting if previously denied.
                </p>
                <button
                  onClick={retry}
                  type="button"
                  className="w-full cursor-pointer py-2.5 rounded-xl border border-stone-200 text-sm font-medium text-stone-600 bg-stone-50 hover:bg-stone-100 active:scale-[0.98] transition-all"
                >
                  Retry location access
                </button>
              </>
            )}
            
            {/* Unavailable — GPS off or timeout */}
            {status === "unavailable" && (
              <>
                <p className="text-sm text-stone-500 leading-relaxed">
                  Could not get your position. Make sure GPS is enabled on your device.
                </p>
                <button
                  onClick={retry}
                  type="button"
                  className="w-full cursor-pointer py-2.5 rounded-xl border border-stone-200 text-sm font-medium text-stone-600 bg-stone-50 hover:bg-stone-100 active:scale-[0.98] transition-all"
                >
                  Try again
                </button>
              </>
            )}

          </div>
        </div>

        {/* Footer note */}
        <p className="text-center text-xs text-stone-300 mt-4">
          Your location is only used to verify attendance and is never stored or shared.
        </p>

      </div>
    </div>
  );
}