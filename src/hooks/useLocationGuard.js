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

    const effectiveRadius =
      CHURCH_LOCATION.radiusMeters + roundedAccuracy;

    setStatus((prev) => {
      const nextStatus =
        dist <= effectiveRadius ? "allowed" : "blocked";

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

    // SAFARI FIX: try getCurrentPosition FIRST
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        processPosition(pos);

        // Then start watching for better accuracy
        watchIdRef.current = navigator.geolocation.watchPosition(
          processPosition,
          handleError,
          {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 0,
          }
        );
      },
      handleError,
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      }
    );

    //Stop watching after 12s
    timeoutRef.current = setTimeout(() => {
      clearAll();
    }, 12000);
  }, []);

  // Permissions (skip for Safari)
  useEffect(() => {
    if (!navigator.permissions || isSafari) {
      setStatus("idle");
      return;
    }

    navigator.permissions
      .query({ name: "geolocation" })
      .then((result) => {
        setPermissionState(result.state);

        if (result.state === "granted") {
          requestLocation();
        }
      })
      .catch(() => {
        setStatus("idle");
      });
  }, [requestLocation, isSafari]);

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