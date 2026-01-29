import React from "react";
import { useNavigate } from "react-router-dom";
import Nav from "./components/Nav";
import ProductCard from "./components/ProductCard";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="bg-slate-50 min-h-screen flex flex-col font-sans">
      <Nav />

      {/* ================= HERO SECTION (FULLSCREEN VIDEO BACKGROUND) ================= */}
      <section className="relative h-screen w-full overflow-hidden">
        {/* Background Video */}
        <video
          src="/videos/hero.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/80"></div>

        {/* Decorative blobs (optional but nice) */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-24 left-10 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
          <span className="inline-block px-4 py-1.5 mb-6 text-sm font-semibold tracking-wider text-indigo-300 uppercase bg-indigo-500/10 backdrop-blur rounded-full">
            Premium & Authentic
          </span>

          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight leading-tight">
            Discover the Future of <br />
            <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
              Apple Accessories
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-200 mb-10 max-w-2xl leading-relaxed">
            Your one-stop shop for premium 3rd party Apple products.
            Elevating your experience with quality and style.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => navigate("/products")}
              className="px-8 py-4 bg-indigo-600 text-white rounded-xl font-semibold text-lg hover:bg-indigo-700 transition-all"
            >
              Browse Collection
            </button>

            {!localStorage.getItem("access-token") && (
  <button
    onClick={() => navigate("/login")}
    className="px-8 py-4 bg-white/10 text-white border border-white/30 backdrop-blur rounded-xl font-semibold text-lg hover:bg-white/20 transition-all"
  >
    Sign In
  </button>
)}


          </div>
        </div>
      </section>

      {/* ================= FEATURED PRODUCTS ================= */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12">
          <div>
            <h3 className="text-3xl font-bold text-slate-900 mb-2">
              Featured Products
            </h3>
            <p className="text-slate-500">
              Handpicked selections just for you.
            </p>
          </div>

          <button
            onClick={() => navigate("/products")}
            className="hidden md:flex items-center text-indigo-600 font-semibold hover:text-indigo-700 transition-colors mt-4 md:mt-0"
          >
            View All Products <span className="ml-2">→</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <ProductCard
            name="iPhone 17 Pro Max"
            description="Latest 3rd party models with stunning display and performance."
            price="799"
            image="https://www.apple.com/v/iphone/home/ce/images/overview/select/iphone_17pro__0s6piftg70ym_large_2x.jpg"
            link="/iphone"
          />

          <ProductCard
            name="MacBook Air M3"
            description="High-performance laptops for professionals and creatives."
            price="1999"
            image="https://www.apple.com/v/macbook-air/v/images/overview/routers/compare_mba_13_15__caznvrb61zyu_large_2x.png"
            link="/macbook"
          />

          <ProductCard
            name="AirPods Pro 2"
            description="Wireless audio devices with immersive sound quality."
            price="249"
            image="https://www.apple.com/v/airpods/shared/compare/f/images/compare/compare_airpods_4__fy4e25bzx1u2_large_2x.png"
            link="/earpod"
          />
        </div>

        <div className="mt-12 text-center md:hidden">
          <button
            onClick={() => navigate("/products")}
            className="text-indigo-600 font-semibold hover:text-indigo-700"
          >
            View All Products →
          </button>
        </div>
      </section>
    </div>
  );
}

export default Home;
