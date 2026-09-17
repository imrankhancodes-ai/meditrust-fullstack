import { useEffect } from "react";
import { BrowserRouter, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "./components/layout/Navbar";
import MobileTabBar from "./components/layout/MobileTabBar";
import Footer from "./components/layout/Footer";
import { CartDrawer } from "./components/cart/CartDrawer";
import AppRouter from "./routes/AppRouter";
import PageTransition from "./components/motion/PageTransition";
import RouteProgressBar from "./components/ui/RouteProgressBar";
import authService from "./services/authService";
import { setProfile } from "./redux/slices/authSlice";
import { useCartQuery } from "./hooks/useCart";

function ProfileHydrator() {
  const dispatch = useDispatch();
  const token = useSelector((s) => s.auth.token);
  const profile = useSelector((s) => s.auth.profile);

  useEffect(() => {
    if (token && !profile) {
      authService.me().then((p) => dispatch(setProfile(p))).catch(() => {});
    }
  }, [token, profile, dispatch]);

  useCartQuery();
  return null;
}

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait" initial={false}>
      <PageTransition key={location.pathname} routeKey={location.pathname}>
        <AppRouter />
      </PageTransition>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex min-h-screen flex-col">
        <RouteProgressBar />
        <Navbar />
        <main className="mx-auto w-full max-w-7xl flex-1 px-4 pb-24 pt-6 md:pb-6">
          <AnimatedRoutes />
        </main>
        <Footer />
        <MobileTabBar />
      </div>
      <CartDrawer />
      <ProfileHydrator />
    </BrowserRouter>
  );
}
