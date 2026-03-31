import { useState, useEffect, useRef } from "react";
import { CHURCH_LOCATION } from "../lib/config";
import { getDistanceMeters } from "../lib/utils";

export function useLocationGuard() {
  const [status, setStatus] = useState("checking");
  const [distance, setDistance] = useState(null);
  const [coords, setCoords] = useState(null);
  const [permissionState, setPermissionState] = useState(null); // 'prompt' | 'granted' | 'denied'
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
        // err.code 1 = PERMISSION_DENIED
        // err.code 2 = POSITION_UNAVAILABLE
        // err.code 3 = TIMEOUT
        if (err.code === 1) {
          setStatus("denied");
        } else {
          setStatus("unavailable"); // GPS off, or timeout
        }
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  useEffect(() => {
    if (didRun.current) return;
    didRun.current = true;

    // Check permission state first if the Permissions API is available
    if (navigator.permissions) {
      navigator.permissions.query({ name: "geolocation" }).then((result) => {
        setPermissionState(result.state); // 'prompt' | 'granted' | 'denied'
        requestLocation();

        // Listen for changes (e.g. user enables it in settings and comes back)
        result.onchange = () => {
          setPermissionState(result.state);
          if (result.state !== "denied") requestLocation();
        };
      });
    } else {
      // Safari < 16 doesn't support Permissions API — just request directly
      requestLocation();
    }
  }, []);

  return { status, distance, coords, permissionState, retry: requestLocation };
}