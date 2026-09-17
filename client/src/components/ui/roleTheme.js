// Per-role accent system: one design language, distinct color per dashboard.
export const ROLE_ACCENTS = {
  USER: {
    label: "Patient",
    chip: "bg-teal-700 text-white",
    soft: "bg-teal-50 text-teal-800",
    ring: "ring-teal-200",
    stat: "teal",
    active: "bg-teal-700 text-white",
    dot: "bg-teal-600",
  },
  DOCTOR: {
    label: "Doctor",
    chip: "bg-sky-600 text-white",
    soft: "bg-sky-50 text-sky-800",
    ring: "ring-sky-200",
    stat: "sky",
    active: "bg-sky-600 text-white",
    dot: "bg-sky-600",
  },
  PATHOLOGIST: {
    label: "Lab",
    chip: "bg-violet-600 text-white",
    soft: "bg-violet-50 text-violet-800",
    ring: "ring-violet-200",
    stat: "violet",
    active: "bg-violet-600 text-white",
    dot: "bg-violet-600",
  },
  ADMIN: {
    label: "Admin",
    chip: "bg-ink-950 text-white",
    soft: "bg-slate-900 text-slate-100",
    ring: "ring-slate-300",
    stat: "ink",
    active: "bg-ink-950 text-white",
    dot: "bg-ink-950",
  },
};

export function roleAccent(userType) {
  return ROLE_ACCENTS[userType] || ROLE_ACCENTS.USER;
}
