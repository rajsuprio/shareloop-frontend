import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "../context/AuthContext";

const categories = [
  { name: "Food", emoji: "🍱" },
  { name: "Electronics", emoji: "💻" },
  { name: "Clothes", emoji: "👕" },
  { name: "Furniture", emoji: "🪑" },
  { name: "Books", emoji: "📚" },
  { name: "Essentials", emoji: "📦" },
];

const featuredListings = [
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
    title: "Minimal Desk Lamp",
    location: "Uttara",
    price: "৳450",
    type: "Sell",
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 3,
    title: "Borrow DSLR Camera",
    location: "Mohammadpur",
    price: "Borrow",
    type: "Borrow",
    image:
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=900&q=80",
  },
];

function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200/40 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg">
            ✨
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-zinc-900">ShareLoop</h1>
            <p className="text-xs text-zinc-500">Give. Sell. Borrow.</p>
          </div>
        </div>

        <div className="w-full lg:max-w-xl">
          <Input
            placeholder="Search food, electronics, clothes..."
            className="h-11 rounded-full border-zinc-200 bg-white/80 shadow-sm"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link to="/browse">
            <Button variant="ghost" className="rounded-full">
              Browse
            </Button>
          </Link>

          <Link to="/messages">
            <Button variant="ghost" className="rounded-full">
              Messages
            </Button>
          </Link>

          <Link to="/profile">
            <Button variant="ghost" className="rounded-full">
              Profile
            </Button>
          </Link>



          {user?.role === "admin" && (
            <Link to="/admin">
              <Button variant="ghost" className="rounded-full">
                Admin
              </Button>
            </Link>
          )}



          <Link to="/saved">
            <Button variant="ghost" className="rounded-full">
              Saved
            </Button>
          </Link>

          <Link to="/requests">
            <Button variant="ghost" className="rounded-full">
              Requests
            </Button>
          </Link>

          <Link to="/my-items">
            <Button variant="ghost" className="rounded-full">
              My Items
            </Button>
          </Link>

          <Link to="/dashboard">
            <Button variant="ghost" className="rounded-full">
              Dashboard
            </Button>
          </Link>

          <Link to="/post">
            <Button className="rounded-full bg-green-500 hover:bg-green-600">
              Post
            </Button>
          </Link>

          {user ? (
            <>
              <div className="rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700">
                {user.name} · {user.role}
              </div>
              <Button
                variant="outline"
                className="rounded-full"
                onClick={logout}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="outline" className="rounded-full">
                  Login
                </Button>
              </Link>

              <Link to="/signup">
                <Button className="rounded-full bg-green-500 hover:bg-green-600">
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

function Hero() {
  const { user } = useAuth();

  return (
    <section className="relative overflow-hidden px-4 py-14 sm:px-6 sm:py-20">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(34,197,94,0.16),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(249,115,22,0.14),_transparent_30%),linear-gradient(to_bottom,_#fafaf9,_#f8fafc)]" />

      <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-2">
        <div>
          <Badge className="mb-5 rounded-full bg-green-100 text-green-700 hover:bg-green-100">
            {user ? `Welcome back, ${user.name}` : "Community-powered sharing"}
          </Badge>

          <h2 className="text-4xl font-black tracking-tight text-zinc-900 sm:text-5xl lg:text-6xl">
            {user ? (
              <>
                Ready to share more, <span className="text-green-600">{user.name}</span>?
              </>
            ) : (
              <>
                Give More. Waste Less. <span className="text-green-600">Share Better.</span>
              </>
            )}
          </h2>

          <p className="mt-6 max-w-2xl text-base leading-7 text-zinc-600 sm:text-lg sm:leading-8">
            {user
              ? "Manage your items, help your community, and make the most of what you already have."
              : "ShareLoop is a modern platform where people can donate useful items, sell them affordably, or borrow what they need from nearby users."}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link to="/browse">
              <Button
                size="lg"
                className="w-full rounded-full bg-green-500 px-6 py-3 text-base hover:bg-green-600 sm:w-auto"
              >
                Explore
              </Button>
            </Link>

            {user ? (
              <Link to="/dashboard">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full rounded-full px-6 py-3 text-base sm:w-auto"
                >
                  Go to Dashboard
                </Button>
              </Link>
            ) : (
              <Link to="/signup">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full rounded-full px-6 py-3 text-base sm:w-auto"
                >
                  Create Account
                </Button>
              </Link>
            )}
          </div>

          <div className="mt-10 grid grid-cols-2 gap-4 sm:max-w-2xl sm:grid-cols-4">
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
                className="h-64 w-full object-cover transition-transform duration-500 hover:scale-105 sm:h-72"
              />
            </div>

            <div className="flex flex-col gap-4">
              <div className="rounded-[1.5rem] bg-gradient-to-br from-green-500 to-emerald-600 p-5 text-white shadow-lg">
                <p className="text-sm text-white/80">
                  {user ? "Your next move" : "This week’s impact"}
                </p>
                <p className="mt-2 text-3xl font-bold">
                  {user ? "Post something useful" : "3,482 items"}
                </p>
                <p className="mt-1 text-sm text-white/80">
                  {user
                    ? "help someone nearby with one extra item"
                    : "shared across nearby communities"}
                </p>
              </div>

              <div className="rounded-[1.5rem] border border-zinc-100 bg-white p-5 shadow-sm">
                <p className="text-sm text-zinc-500">Trending category</p>
                <p className="mt-1 text-xl font-bold text-zinc-900">
                  Food & Essentials
                </p>
                <div className="mt-4 h-2 rounded-full bg-zinc-100">
                  <div className="h-full w-[74%] rounded-full bg-gradient-to-r from-orange-500 to-green-500" />
                </div>
              </div>

              <div className="rounded-[1.5rem] border border-zinc-100 bg-white p-5 shadow-sm">
                <p className="text-sm text-zinc-500">Borrow smarter</p>
                <p className="mt-1 text-xl font-bold text-zinc-900">
                  Find nearby items in minutes
                </p>
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
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-green-100 to-orange-100 text-3xl">
          {item.emoji}
        </div>
        <h3 className="mt-5 text-lg font-bold text-zinc-900">{item.name}</h3>
      </CardContent>
    </Card>
  );
}

function FeaturedCard({ item }) {
  const badgeClass =
    item.type === "Donate"
      ? "bg-green-100 text-green-700 hover:bg-green-100"
      : item.type === "Sell"
      ? "bg-orange-100 text-orange-700 hover:bg-orange-100"
      : "bg-sky-100 text-sky-700 hover:bg-sky-100";

  return (
    <Card className="overflow-hidden rounded-[1.75rem] border-white/50 bg-white/80 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
      <div className="relative overflow-hidden">
        <img
          src={item.image}
          alt={item.title}
          className="h-56 w-full object-cover transition-transform duration-500 hover:scale-105 sm:h-60"
        />
        <div className="absolute left-4 top-4">
          <Badge className={`rounded-full border-0 px-3 py-1 ${badgeClass}`}>
            {item.type}
          </Badge>
        </div>

        <div className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/85 text-zinc-700 shadow-md backdrop-blur">
          ♡
        </div>
      </div>

      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold text-zinc-900">{item.title}</h3>
            <p className="mt-2 text-sm text-zinc-500">📍 {item.location}</p>
          </div>
          <p className="text-base font-bold text-zinc-900">{item.price}</p>
        </div>

        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Link to="/browse" className="w-full sm:flex-1">
            <Button variant="outline" className="w-full rounded-full">
              View More
            </Button>
          </Link>

          <Link to="/post" className="w-full sm:flex-1">
            <Button className="w-full rounded-full bg-zinc-900 text-white hover:bg-zinc-800">
              Post Similar
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

function Footer() {
  return (
    <footer className="border-t border-zinc-200/70 bg-white/70 px-4 py-10 backdrop-blur sm:px-6">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-lg font-bold text-zinc-900">ShareLoop</p>
          <p className="mt-1 text-sm text-zinc-500">
            A modern platform for donating, selling, and borrowing nearby.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-500 sm:gap-6">
          <Link to="/browse" className="transition hover:text-zinc-900">
            Browse
          </Link>
          <Link to="/post" className="transition hover:text-zinc-900">
            Post Item
          </Link>
          <a href="#" className="transition hover:text-zinc-900">
            Community
          </a>
          <a href="#" className="transition hover:text-zinc-900">
            Privacy
          </a>
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
    <Link to="/post">
      <button className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full bg-green-500 px-5 py-3 text-sm font-semibold text-white shadow-2xl shadow-green-300 transition hover:bg-green-600">
        + Post Item
      </button>
    </Link>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-stone-50 text-zinc-900">
      <Navbar />
      <Hero />

      <section className="px-4 py-8 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8">
            <Badge className="mb-4 rounded-full bg-green-100 text-green-700 hover:bg-green-100">
              Browse by Category
            </Badge>
            <h2 className="text-3xl font-black tracking-tight text-zinc-900 sm:text-4xl">
              Find what matters, faster
            </h2>
            <p className="mt-3 max-w-2xl text-zinc-500">
              Explore the kinds of items your community is actively sharing.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {categories.map((item) => (
              <CategoryCard key={item.name} item={item} />
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6">
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
            {featuredListings.map((item) => (
              <FeaturedCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6">
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

            <Link to="/post">
              <Button
                size="lg"
                className="w-full rounded-full bg-white px-7 text-zinc-900 hover:bg-zinc-100 sm:w-auto"
              >
                Post Your First Item
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
      <FloatingActionButton />
    </div>
  );
}