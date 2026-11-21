import React, { createContext, useContext, useEffect, useState } from "react";
import { AppState } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { cities, City } from "../constants/cities";
type State = {
  now: Date;
  selected: City;
  saved: string[];
  twelve: boolean;
  select: (id: string) => void;
  toggleSaved: (id: string) => void;
  setTwelve: (v: boolean) => void;
  error: string;
};
const Context = createContext<State>(null!);
export function ClockProvider({ children }: { children: React.ReactNode }) {
  const [now, setNow] = useState(new Date());
  const [selectedId, select] = useState("la");
  const [saved, setSaved] = useState(cities.slice(0, 5).map((c) => c.id));
  const [twelve, setTwelve] = useState(false);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    AsyncStorage.getItem("timezone.v1")
      .then((raw) => {
        if (raw) {
          const s = JSON.parse(raw);
          if (Array.isArray(s.saved))
            setSaved(
              s.saved.filter((id: unknown) => cities.some((c) => c.id === id)),
            );
          if (cities.some((c) => c.id === s.selectedId)) select(s.selectedId);
          if (typeof s.twelve === "boolean") setTwelve(s.twelve);
        }
      })
      .catch(() => setError("Saved preferences could not be loaded."))
      .finally(() => setReady(true));
    const timer = setInterval(() => setNow(new Date()), 1000);
    const sub = AppState.addEventListener("change", (s) => {
      if (s === "active") setNow(new Date());
    });
    return () => {
      clearInterval(timer);
      sub.remove();
    };
  }, []);
  useEffect(() => {
    if (ready)
      AsyncStorage.setItem(
        "timezone.v1",
        JSON.stringify({ saved, selectedId, twelve }),
      ).catch(() => setError("Changes could not be saved on this device."));
  }, [saved, selectedId, twelve, ready]);
  const toggleSaved = (id: string) =>
    setSaved((old) =>
      old.includes(id) ? old.filter((x) => x !== id) : [...old, id],
    );
  return (
    <Context.Provider
      value={{
        now,
        selected: cities.find((c) => c.id === selectedId)!,
        saved,
        twelve,
        select,
        toggleSaved,
        setTwelve,
        error,
      }}
    >
      {children}
    </Context.Provider>
  );
}
export const useClock = () => useContext(Context);
