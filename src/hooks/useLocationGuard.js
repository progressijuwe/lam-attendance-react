import { useState, useEffect, useRef, useCallback } from "react";
import { CHURCH_LOCATION } from "../lib/config";
import { getDistanceMeters } from "../lib/utils";

export function useLocationGuard() {
  const [status, setStatus] = useState("idle"); 
  // idle | checking | allowed | blocked | denied | unavailable

  const [distance, setDistance] = useState(null);
  const [coords, setCoords] = useState(null);
  const [accuracy, setAccuracy] = useState(null);
  const [permissionState, setPermissionState] = useState(null);

  const watchIdRef = useRef(null);

  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

  const clearWatch = () => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
  };

  const handleSuccess = (pos) => {
    const { latitude, longitude, accuracy } = pos.coords;

    const dist = getDistanceMeters(
      latitude,
      longitude,
      CHURCH_LOCATION.lat,
      CHURCH_LOCATION.lng
    );

    setCoords({ latitude, longitude });
    setAccuracy(Math.round(accuracy));
    setDistance(Math.round(dist));

    // 🧠 IMPORTANT: factor in GPS accuracy
    const effectiveDistance = dist - accuracy;

    if (effectiveDistance <= CHURCH_LOCATION.radiusMeters) {
      setStatus("allowed");
    } else {
      setStatus("blocked");
    }
  };

  const handleError = (error) => {
    clearWatch();

    switch (error.code) {
      case 1:
        // Permission denied
        setStatus("denied");
        break;
      case 2:
        // Position unavailable
        setStatus("unavailable");
        break;
      case 3:
        // Timeout
        setStatus("unavailable");
        break;
      default:
        setStatus("unavailable");
    }
  };

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setStatus("denied");
      return;
    }

    setStatus("checking");
    setDistance(null);

    clearWatch();

    // 🚀 Use watchPosition for better accuracy stabilization
    watchIdRef.current = navigator.geolocation.watchPosition(
      handleSuccess,
      handleError,
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      }
    );

    // ⛔ Stop watching after a short period (avoid battery drain)
    setTimeout(() => {
      clearWatch();
    }, 12000);
  }, []);

  // ✅ Handle permission state (ONLY where reliable)
  useEffect(() => {
    if (!navigator.permissions || isSafari) {
      setStatus("idle");
      return;
    }

    let mounted = true;

    navigator.permissions
      .query({ name: "geolocation" })
      .then((result) => {
        if (!mounted) return;

        setPermissionState(result.state);

        if (result.state === "granted") {
          requestLocation();
        } else {
          setStatus("idle");
        }

        result.onchange = () => {
          setPermissionState(result.state);

          if (result.state === "granted") {
            requestLocation();
          } else {
            setStatus("idle");
          }
        };
      })
      .catch(() => {
        setStatus("idle");
      });

    return () => {
      mounted = false;
    };
  }, [requestLocation, isSafari]);

  // ✅ Retry automatically when user comes back from settings
  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        // Retry silently if they previously denied
        if (status === "denied" || status === "unavailable") {
          setStatus("idle");
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [status]);

  // ✅ Cleanup
  useEffect(() => {
    return () => clearWatch();
  }, []);

  return {
    status,
    distance,
    coords,
    accuracy,
    permissionState,
    retry: requestLocation,
  };
}