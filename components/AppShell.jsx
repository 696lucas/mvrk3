"use client";
import { ViewProvider, useView } from "./view/ViewContext";
import LandingPB from "./LandingPB";
import MerchOverlay from "./MerchOverlay";
import Shows from "./Shows";

function Views() {
  const { view } = useView();
  if (view === "merch") return <MerchOverlay />;
  if (view === "gira") return <Shows />;
  return <LandingPB />; // landing
}

export default function AppShell() {
  return (
    <ViewProvider initial="landing">
      <Views />
    </ViewProvider>
  );
}

