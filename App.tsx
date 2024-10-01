// import { StatusBar } from "expo-status-bar";
import React from "react";
import "@styles/global.css";
import { StatusBar } from "expo-status-bar";

import Home from "./src/app/Home";

export default function App() {
  return (
    <>
      <Home />
      <StatusBar style="light" />
    </>
  );
}
