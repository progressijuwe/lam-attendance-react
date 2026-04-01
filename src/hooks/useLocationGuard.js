import { useState, useEffect, useRef, useCallback } from "react";
import { CHURCH_LOCATION } from "../lib/config";
import { getDistanceMeters } from "../lib/utils";

export function useLocationGuard() {
  const [status, setStatus] = useState("idle");
  const [distance, setDistance] = useState(null);
  const [coords, setCoords] = useState(null);
  const [accuracy, setAccuracy] = useState(null);
  const [permissionState, setPermissionState] = useState(null);

  const watchIdRef = useRef(null);
  const timeoutRef = useRef(null);

  const isSafari =
    typeof navigator !== "undefined" &&
    /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

  const clearAll = () => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const processPosition = (pos) => {
    const { latitude, longitude, accuracy } = pos.coords;

    const dist = getDistanceMeters(
      latitude,
      longitude,
      CHURCH_LOCATION.lat,
      CHURCH_LOCATION.lng
    );

    const roundedDistance = Math.round(dist);
    const roundedAccuracy = Math.round(accuracy);

    console.log("GEO SUCCESS:", { roundedDistance, roundedAccuracy });

    setCoords({ latitude, longitude });
    setAccuracy(roundedAccuracy);
    setDistance(roundedDistance);

    const effectiveRadius = CHURCH_LOCATION.radiusMeters + roundedAccuracy;

    setStatus((prev) => {
      const nextStatus = dist <= effectiveRadius ? "allowed" : "blocked";
      return prev === nextStatus ? prev : nextStatus;
    });
  };

  const handleError = (error) => {
    console.log("GEO ERROR:", error);

    clearAll();

    switch (error.code) {
      case 1:
        setStatus("denied");
        break;
      case 2:
      case 3:
      default:
        setStatus("unavailable");
        break;
    }
  };

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setStatus("denied");
      return;
    }

    setStatus("checking");
    setDistance(null);

    clearAll();

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        processPosition(pos);

        watchIdRef.current = navigator.geolocation.watchPosition(
          processPosition,
          handleError,
          {
            enableHighAccuracy: true,
            timeout: 20000,      // ← increased
            maximumAge: 30000,   // ← allow 30s cached position
          }
        );
      },
      (err) => {
        // If high accuracy times out, fall back to low accuracy
        if (err.code === 3) {
          navigator.geolocation.getCurrentPosition(
            (pos) => {
              processPosition(pos);
            },
            handleError,
            {
              enableHighAccuracy: false,  // ← low accuracy fallback
              timeout: 20000,
              maximumAge: 60000,          // ← accept up to 1min old position
            }
          );
        } else {
          handleError(err);
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 20000,      // ← increased from 15s
        maximumAge: 30000,   // ← allow 30s cached position
      }
    );

    // Stop watching after 25s (increased to match)
    timeoutRef.current = setTimeout(() => {
      clearAll();
    }, 25000);
  }, []);

  // Reset when returning to tab
  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        if (status === "denied" || status === "unavailable") {
          setStatus("idle");
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      document.removeEventListener(
        "visibilitychange",
        handleVisibility
      );
    };
  }, [status]);

  useEffect(() => {
    return () => clearAll();
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