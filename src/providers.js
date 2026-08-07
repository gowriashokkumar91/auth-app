"use client";

import { Provider, useDispatch } from "react-redux";
import { store, persistor } from "@/redux/store";
import { PersistGate } from "redux-persist/integration/react";
import { useEffect } from "react";
import { useState } from "react";
import {
  setCredentials,
  logout,
  useProfileQuery,
} from "@/redux/slices/auth.slice";

function AuthHydrator({ children }) {
  const dispatch = useDispatch();
  const [token, setToken] = useState(null);

  useEffect(() => {
    setToken(localStorage.getItem("token"));
  }, []);

  const { data, error } = useProfileQuery(undefined, {
    skip: !token,
  });

  useEffect(() => {
    if (data && data.email && token) {
      dispatch(setCredentials({ user: data, token }));
    }
  }, [data, token, dispatch]);

  useEffect(() => {
    if (error) {
      localStorage.removeItem("token");
      dispatch(logout());
    }
  }, [error, dispatch]);

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
