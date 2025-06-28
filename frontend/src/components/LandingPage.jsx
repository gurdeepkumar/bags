import React from 'react';
import hero from "/hero.png"
import { Edit, TrendingUp, BarChart4 } from "./icons/Icons";

export default function LandingPage() {

  const features = [
    {
      title: "Effortless Tracking",
      description: "Easily add and manage your crypto holdings. Designed for simplicity, so you can focus on your portfolio, not the setup.",
      icon: "Edit",
    },
    {
      title: "Real-Time Insights",
      description: "Stay up to date with live price updates and automatic profit/loss calculations as the market moves.",
      icon: "TrendingUp",
    },
    {
      title: "Clean Analytics",
      description: "Understand your performance at a glance with beautiful, interactive charts and asset breakdowns.",
      icon: "BarChart4",
    },
  ];

  const iconMap = {
    Edit,
    TrendingUp,
    BarChart4,
  };

  const renderIcon = (feature) => {
    const IconComponent = iconMap[feature.icon]; // e.g. "Edit" => Edit component
    if (!IconComponent) return null; // handle missing icon safely
    return <IconComponent size={24} color="#FEE685" />;
  };


  return (
    <div className="min-h-screen bg-neutral-900 text-amber-50 flex flex-col">
      {/* Hero */}
      <section className="flex flex-col md:flex-row items-center justify-between px-6 md:px-16 py-20">
        <div className="md:w-1/2 space-y-6">
          <h1 className="text-2xl text-amber-200 md:text-3xl font-bold leading-tight">
            Track Your Crypto Portfolio with Ease
          </h1>
          <p className="text-lg md:text-xl">
            Simple, powerful tools to manage your investments and get real-time insights — no hefty setups, no hassle.
          </p>
          <div className="mt-6">
            <a
              href="/register"
              className="inline-block font-semibold bg-amber-600 hover:bg-amber-700font-semibold px-6 py-3 rounded-xl transition"
            >
              Get Started
            </a>
          </div>
        </div>
        <div className="mt-12 md:mt-0 md:w-1/2">
          <img
            src={hero}
            alt="Product screenshot"
            className="rounded-xl shadow-xl"
          />
        </div>
      </section>

      {/* Features */}
      <section className="px-6 md:px-16 py-20 mb-12 rounded-2xl bg-neutral-800">
        <div className="text-center mb-12">
          <h2 className="text-3xl text-amber-200 md:text-4xl font-bold">Why Choose Us?</h2>
          <p className="mt-4">Everything you need in one platform.</p>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="bg-neutral-700 p-6 rounded-2xl shadow hover:shadow-lg transition"
            >
              <div className="flex items-center justify-center gap-2 shadow-neutral-800 rounded px-3 py-4">
                <div className="text-4xl">{renderIcon(feature)}</div>
                <div className="text-xl font-semibold">{feature.title}</div>
              </div>
              <p className="text-justify mt-2">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
