import { useState, useEffect, useRef } from "react";
import { CHURCH_LOCATION } from "../lib/config";
import { getDistanceMeters } from "../lib/utils";

export function useLocationGuard() {
  const [status, setStatus] = useState("checking"); // checking | allowed | blocked | denied
  const [distance, setDistance] = useState(null);
  const [coords, setCoords] = useState(null);
  const didRun = useRef(false);

  const check = () => {
    setStatus("checking");
    setDistance(null);

    if (!navigator.geolocation) {
      setStatus("denied");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const dist = getDistanceMeters(
          latitude,
          longitude,
          CHURCH_LOCATION.lat,
          CHURCH_LOCATION.lng
        );
        setDistance(Math.round(dist));
        setCoords({ latitude, longitude });
        setStatus(dist <= CHURCH_LOCATION.radiusMeters ? "allowed" : "blocked");
      },
      () => setStatus("denied"),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  useEffect(() => {
    if (didRun.current) return;
    didRun.current = true;
    check();
  }, []);

  return { status, distance, coords, retry: check };
}x