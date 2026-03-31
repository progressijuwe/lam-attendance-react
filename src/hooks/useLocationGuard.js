import { useState, useEffect, useRef } from "react";
import { CHURCH_LOCATION } from "../lib/config";
import { getDistanceMeters } from "../lib/utils";

export function useLocationGuard() {
  const [status, setStatus] = useState("idle"); // idle | checking | allowed | blocked | denied | unavailable
  const [distance, setDistance] = useState(null);
  const [coords, setCoords] = useState(null);
  const [permissionState, setPermissionState] = useState(null);
  const didRun = useRef(false);

  const requestLocation = () => {
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
          latitude, longitude,
          CHURCH_LOCATION.lat,
          CHURCH_LOCATION.lng
        );
        setDistance(Math.round(dist));
        setCoords({ latitude, longitude });
        setStatus(dist <= CHURCH_LOCATION.radiusMeters ? "allowed" : "blocked");
      },
      (err) => {
        if (err.code === 1) setStatus("denied");
        else setStatus("unavailable");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  useEffect(() => {
    if (didRun.current) return;
    didRun.current = true;

    if (!navigator.permissions) {
      // Safari < 16 — don't auto-call, wait for user tap
      setStatus("idle");
      return;
    }

    navigator.permissions.query({ name: "geolocation" }).then((result) => {
      setPermissionState(result.state);

      if (result.state === "granted") {
        // Already allowed — check silently on mount
        requestLocation();
      } else {
        // "prompt" or "denied" — wait for user tap
        setStatus("idle");
      }

      result.onchange = () => {
        setPermissionState(result.state);
        if (result.state === "granted") requestLocation();
        else setStatus("idle");
      };
    });
  }, []);

  return { status, distance, coords, permissionState, retry: requestLocation };
}