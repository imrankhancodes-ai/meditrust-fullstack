import { useIsFetching } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

// Thin animated bar at the very top during route transitions + query fetching.
export default function RouteProgressBar() {
  const fetching = useIsFetching();
  const { pathname } = useLocation();
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    setLeaving(true);
    const t = setTimeout(() => setLeaving(false), 500);
    return () => clearTimeout(t);
  }, [pathname]);

  const active = fetching > 0 || leaving;
  if (!active) return null;

  return (
    <div className="fixed inset-x-0 top-0 z-[60] h-1 overflow-hidden bg-transparent">
      <div className="animate-route-progress h-full w-1/3 rounded-r-full bg-gradient-to-r from-teal-500 via-glow-500 to-teal-500" />
    </div>
  );
}
