"use client";

import { useState, useEffect } from "react";

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface GeolocationState {
  coordinates: Coordinates | null;
  loading: boolean;
  error: string | null;
}

const DEFAULT_COORDS: Coordinates = {
  latitude: 21.4225, // Mecca latitude
  longitude: 39.8262, // Mecca longitude
};

export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>({
    coordinates: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    if (!navigator.geolocation) {
      setState({
        coordinates: DEFAULT_COORDS,
        loading: false,
        error: "Geolocation is not supported by your browser. Using Mecca as default.",
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState({
          coordinates: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          },
          loading: false,
          error: null,
        });
      },
      (error) => {
        let errorMessage = "Unable to retrieve your location";
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Location access denied. Using default coordinates (Mecca).";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information is unavailable. Using default coordinates (Mecca).";
            break;
          case error.TIMEOUT:
            errorMessage = "The request to get user location timed out. Using default coordinates (Mecca).";
            break;
        }
        setState({
          coordinates: DEFAULT_COORDS,
          loading: false,
          error: errorMessage,
        });
      },
      {
        enableHighAccuracy: false, // Desktop devices often timeout when this is true
        timeout: 15000, // Increased timeout to 15 seconds
        maximumAge: 1000 * 60 * 60 * 24, // Cache location for 24 hours to prevent repeated slow lookups
      }
    );
  }, []);

  return state;
}
