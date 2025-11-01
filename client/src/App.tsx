import Pages from "./pages";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";

export default function App() {
  const [navHeight, setNavHeight] = useState(0);
  const [routeLoading, setRouteLoading] = useState(false);
  const location = useLocation();
  useEffect(() => {
    setNavHeight(document.querySelector("nav")?.clientHeight || 0);
  }, []);
  useEffect(() => {
    // Show a brief top loader on route change
    setRouteLoading(true);
    const id = setTimeout(() => setRouteLoading(false), 500);
    return () => clearTimeout(id);
  }, [location.pathname]);
  return (
    <>
      <Navbar />
      <Toaster />
      {routeLoading && (
        <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-[#E50914] animate-pulse" />
      )}
      <main
        className="bg-[#141414] min-h-[100svh] w-screen overflow-y-scroll text-white"
        style={{ paddingTop: `${navHeight}px` }}
      >
        <Pages />
      </main>
      <Footer />
    </>
  );
}
