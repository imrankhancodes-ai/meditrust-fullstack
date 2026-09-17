import { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import { CartDrawer } from "./components/cart/CartDrawer";
import AppRouter from "./routes/AppRouter";
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

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6">
          <AppRouter />
        </main>
        <Footer />
      </div>
      <CartDrawer />
      <ProfileHydrator />
    </BrowserRouter>
  );
}
