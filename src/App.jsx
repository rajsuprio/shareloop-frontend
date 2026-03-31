import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const categories = [
  { name: "Food", emoji: "🍱" },
  { name: "Electronics", emoji: "💻" },
  { name: "Clothes", emoji: "👕" },
  { name: "Furniture", emoji: "🪑" },
  { name: "Books", emoji: "📚" },
  { name: "Essentials", emoji: "📦" },
];

const listings = [
  {
    id: 1,
    title: "Fresh Homemade Meals",
    location: "Dhanmondi",
    price: "Free",
    type: "Donate",
    image:
      "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 2,
    title: "Desk Lamp",
    location: "Uttara",
    price: "৳450",
    type: "Sell",
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 3,
    title: "Winter Jacket",
    location: "Mirpur",
    price: "Free",
    type: "Donate",
    image:
      "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 4,
    title: "Wooden Chair",
    location: "Banani",
    price: "৳700",
    type: "Sell",
    image:
      "https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 5,
    title: "Borrow DSLR Camera",
    location: "Mohammadpur",
    price: "Borrow",
    type: "Borrow",
    image:
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 6,
    title: "Children's Books",
    location: "Bashundhara",
    price: "Free",
    type: "Donate",
    image:
      "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=900&q=80",
  },
];

function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/40 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg">
            ✨
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-zinc-900">ShareLoop</h1>
            <p className="text-xs text-zinc-500">Give. Sell. Borrow.</p>
          </div>
        </div>

        <div className="hidden w-full max-w-xl md:block">
          <Input
            placeholder="Search food, electronics, clothes..."
            className="h-12 rounded-full border-zinc-200 bg-white/80 shadow-sm"
          />
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" className="rounded-full">
            Browse
          </Button>
          <Button className="rounded-full bg-green-500 hover:bg-green-600">
            Post Item
          </Button>
          <Button variant="outline" className="rounded-full">
            Login
          </Button>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden px-4 py-16 sm:py-20">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(34,197,94,0.16),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(249,115,22,0.14),_transparent_30%),linear-gradient(to_bottom,_#fafaf9,_#f8fafc)]" />
      <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-2">
        <div>
          <Badge className="mb-5 rounded-full bg-green-100 text-green-700 hover:bg-green-100">
            Community-powered sharing
          </Badge>

          <h2 className="text-5xl font-black tracking-tight text-zinc-900 sm:text-6xl">
            Give More. Waste Less. <span className="text-green-600">Share Better.</span>
          </h2>

          <p className="mt-6 max-w-xl text-base leading-8 text-zinc-600 sm:text-lg">
            ShareLoop is a modern neighborhood platform where people can donate items,
            sell them affordably, or borrow what they need from nearby users.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button size="lg" className="rounded-full bg-green-500 px-6 hover:bg-green-600">
              Explore Items
            </Button>
            <Button size="lg" variant="outline" className="rounded-full px-6">
              Post Item
            </Button>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              ["24k+", "Users Helped"],
              ["118k+", "Items Shared"],
              ["39k+", "Low-cost Sales"],
              ["12k+", "Borrow Swaps"],
            ].map(([value, label]) => (
              <div
                key={label}
                className="rounded-2xl border border-white/50 bg-white/70 p-4 shadow-sm backdrop-blur"
              >
                <p className="text-xl font-bold text-zinc-900">{value}</p>
                <p className="text-sm text-zinc-500">{label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[2rem] border border-white/40 bg-white/70 p-4 shadow-2xl backdrop-blur-xl">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="overflow-hidden rounded-[1.5rem]">
              <img
                src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80"
                alt="community"
                className="h-72 w-full object-cover transition-transform duration-500 hover:scale-105"
              />
            </div>
            <div className="flex flex-col gap-4">
              <div className="rounded-[1.5rem] bg-gradient-to-br from-green-500 to-emerald-600 p-5 text-white shadow-lg">
                <p className="text-sm text-white/80">This week’s impact</p>
                <p className="mt-2 text-3xl font-bold">3,482 items</p>
                <p className="mt-1 text-sm text-white/80">shared across nearby communities</p>
              </div>
              <div className="rounded-[1.5rem] border border-zinc-100 bg-white p-5 shadow-sm">
                <p className="text-sm text-zinc-500">Trending category</p>
                <p className="mt-1 text-xl font-bold text-zinc-900">Food & Essentials</p>
                <div className="mt-4 h-2 rounded-full bg-zinc-100">
                  <div className="h-full w-[74%] rounded-full bg-gradient-to-r from-orange-500 to-green-500" />
                </div>
              </div>
              <div className="rounded-[1.5rem] border border-zinc-100 bg-white p-5 shadow-sm">
                <p className="text-sm text-zinc-500">Borrow smarter</p>
                <p className="mt-1 text-xl font-bold text-zinc-900">Find nearby items in minutes</p>
                <p className="mt-2 text-sm leading-6 text-zinc-500">
                  From cameras to furniture, borrow what you need without unnecessary purchases.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CategoryCard({ item }) {
  return (
    <Card className="rounded-[1.75rem] border-white/50 bg-white/80 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <CardContent className="p-6 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-green-100 to-orange-100 text-2xl">
          {item.emoji}
        </div>
        <h3 className="mt-5 text-lg font-bold text-zinc-900">{item.name}</h3>
      </CardContent>
    </Card>
  );
}

function ListingCard({ item }) {
  return (
    <Card className="overflow-hidden rounded-[1.75rem] border-white/50 bg-white/80 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
      <div className="relative overflow-hidden">
        <img
          src={item.image}
          alt={item.title}
          className="h-60 w-full object-cover transition-transform duration-500 hover:scale-105"
        />
        <div className="absolute left-4 top-4">
          <Badge
            className={`rounded-full border-0 px-3 py-1 ${
              item.type === "Donate"
                ? "bg-green-100 text-green-700 hover:bg-green-100"
                : item.type === "Sell"
                ? "bg-orange-100 text-orange-700 hover:bg-orange-100"
                : "bg-sky-100 text-sky-700 hover:bg-sky-100"
            }`}
          >
            {item.type}
          </Badge>
        </div>

        <button className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/85 text-zinc-700 shadow-md backdrop-blur">
          ♡
        </button>
      </div>

      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold text-zinc-900">{item.title}</h3>
            <p className="mt-2 text-sm text-zinc-500">📍 {item.location}</p>
          </div>
          <p className="text-base font-bold text-zinc-900">{item.price}</p>
        </div>

        <div className="mt-5 flex items-center justify-between gap-3">
          <Button variant="outline" className="rounded-full">
            View Details
          </Button>
          <Button className="rounded-full bg-zinc-900 text-white hover:bg-zinc-800">
            Quick Action
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function Footer() {
  return (
    <footer className="border-t border-zinc-200/70 bg-white/70 px-4 py-10 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-lg font-bold text-zinc-900">ShareLoop</p>
          <p className="mt-1 text-sm text-zinc-500">
            A premium platform for donating, selling, and borrowing nearby.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-6 text-sm text-zinc-500">
          <a href="#" className="transition hover:text-zinc-900">Browse</a>
          <a href="#" className="transition hover:text-zinc-900">Post Item</a>
          <a href="#" className="transition hover:text-zinc-900">Community</a>
          <a href="#" className="transition hover:text-zinc-900">Privacy</a>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-600 transition hover:-translate-y-0.5 hover:shadow-md">
            🌐
          </button>
          <button className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-600 transition hover:-translate-y-0.5 hover:shadow-md">
            ✉️
          </button>
        </div>
      </div>
    </footer>
  );
}

function FloatingActionButton() {
  return (
    <button className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full bg-green-500 px-5 py-3 text-sm font-semibold text-white shadow-2xl shadow-green-300 transition hover:bg-green-600">
      + Post Item
    </button>
  );
}

export default function App() {
  return (
    <div className="min-h-screen bg-stone-50 text-zinc-900">
      <Navbar />
      <Hero />

      <section className="px-4 py-6">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8">
            <Badge className="mb-4 rounded-full bg-green-100 text-green-700 hover:bg-green-100">
              Browse by Category
            </Badge>
            <h2 className="text-3xl font-black tracking-tight text-zinc-900 sm:text-4xl">
              Find what matters, faster
            </h2>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {categories.map((item) => (
              <CategoryCard key={item.name} item={item} />
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-16">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8">
            <Badge className="mb-4 rounded-full bg-orange-100 text-orange-700 hover:bg-orange-100">
              Featured Listings
            </Badge>
            <h2 className="text-3xl font-black tracking-tight text-zinc-900 sm:text-4xl">
              Explore what your community is sharing
            </h2>
            <p className="mt-3 max-w-2xl text-zinc-500">
              Discover donated essentials, affordable items, and borrowable goods near you.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {listings.map((item) => (
              <ListingCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-16">
        <div className="mx-auto max-w-7xl rounded-[2rem] border border-white/50 bg-gradient-to-r from-green-500 via-emerald-500 to-orange-500 p-8 text-white shadow-2xl sm:p-12">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <Badge className="mb-4 rounded-full bg-white/15 text-white hover:bg-white/15">
                Start Sharing Today
              </Badge>
              <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
                Turn extra items into community value
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-white/85 sm:text-base">
                Post items in seconds, connect with nearby people, and make every extra item more useful.
              </p>
            </div>
            <Button size="lg" className="rounded-full bg-white px-7 text-zinc-900 hover:bg-zinc-100">
              Post Your First Item
            </Button>
          </div>
        </div>
      </section>

      <Footer />
      <FloatingActionButton />
    </div>
  );
}