"use client";

import { Provider, useDispatch } from "react-redux";
import { store, persistor } from "@/redux/store";
import { PersistGate } from "redux-persist/integration/react";
import { useEffect } from "react";
import { setCredentials, logout } from "@/redux/slices/auth.slice";

function AuthHydrator({ children }) {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetch("http://localhost:5000/api/auth/profile", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => {
          if (!res.ok) throw new Error("Not authorized");
          return res.json();
        })
        .then((data) => {
          if (data && data.email) {
            dispatch(setCredentials({ user: data, token }));
          }
        })
        .catch(() => {
          localStorage.removeItem("token");
          dispatch(logout());
        });
    }
  }, [dispatch]);

  return <>{children}</>;
}

export default function Providers({ children }) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AuthHydrator>{children}</AuthHydrator>
      </PersistGate>
    </Provider>
  );
}
