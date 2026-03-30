import React, { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Package, HeartHandshake, Truck, Clock3, BarChart3, Search, Plus, ShieldCheck, Users, Sparkles } from "lucide-react";

const initialDonations = [
  {
    id: 1,
    title: "Fresh Veg Meals",
    category: "Food",
    quantity: "25 meal boxes",
    location: "Dhanmondi",
    donor: "Green Bowl Restaurant",
    urgency: "High",
    expiresIn: 4,
    status: "Available",
    description: "Cooked lunch boxes available for same-day pickup.",
  },
  {
    id: 2,
    title: "Winter Clothes Bundle",
    category: "Clothes",
    quantity: "12 jackets",
    location: "Uttara",
    donor: "Nabila Rahman",
    urgency: "Medium",
    expiresIn: null,
    status: "Available",
    description: "Clean winter jackets for teenagers and adults.",
  },
  {
    id: 3,
    title: "Used Android Phones",
    category: "Gadgets",
    quantity: "4 devices",
    location: "Mirpur",
    donor: "TechCare Ltd.",
    urgency: "Low",
    expiresIn: null,
    status: "Claimed",
    description: "Working phones with chargers. Good for students.",
  },
  {
    id: 4,
    title: "School Supply Box",
    category: "Supplies",
    quantity: "30 notebooks + pens",
    location: "Mohammadpur",
    donor: "Arafat Karim",
    urgency: "Medium",
    expiresIn: null,
    status: "Available",
    description: "Mixed stationery items for school children.",
  },
];

const impactStats = [
  { label: "Donations Shared", value: "1,284", icon: Package },
  { label: "Families Helped", value: "642", icon: Users },
  { label: "Volunteer Trips", value: "319", icon: Truck },
  { label: "Food Saved", value: "2.4 tons", icon: HeartHandshake },
];

function SectionTitle({ title, subtitle }) {
  return (
    <div className="mb-6">
      <h2 className="text-2xl md:text-3xl font-bold tracking-tight">{title}</h2>
      <p className="text-sm md:text-base text-muted-foreground mt-2">{subtitle}</p>
    </div>
  );
}

function NavBar({ currentView, setCurrentView }) {
  const navItems = ["Home", "Browse", "Dashboard", "Volunteer", "Analytics"];
  return (
    <header className="sticky top-0 z-30 border-b bg-white/90 backdrop-blur">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-black text-white flex items-center justify-center shadow-sm">
            <HeartHandshake className="h-5 w-5" />
          </div>
          <div>
            <p className="font-bold text-lg leading-none">ShareLoop</p>
            <p className="text-xs text-muted-foreground">Smart Donation Redistribution</p>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-2">
          {navItems.map((item) => (
            <Button
              key={item}
              variant={currentView === item ? "default" : "ghost"}
              className="rounded-xl"
              onClick={() => setCurrentView(item)}
            >
              {item}
            </Button>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button variant="outline" className="rounded-xl">Login</Button>
          <Button className="rounded-xl">Get Started</Button>
        </div>
      </div>
    </header>
  );
}

function Hero({ setCurrentView }) {
  return (
    <section className="max-w-7xl mx-auto px-4 pt-10 pb-12 grid lg:grid-cols-2 gap-8 items-center">
      <div>
        <Badge className="rounded-full mb-4">Food • Clothes • Gadgets • Supplies</Badge>
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight">
          Share extra. <span className="text-muted-foreground">Support nearby people.</span>
        </h1>
        <p className="mt-5 text-base md:text-lg text-muted-foreground max-w-xl leading-7">
          A smart community platform where restaurants, shops, and individuals can donate food and useful items,
          while normal people, volunteers, and organizations can claim and distribute them quickly.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button size="lg" className="rounded-2xl" onClick={() => setCurrentView("Browse")}>Browse Donations</Button>
          <Button size="lg" variant="outline" className="rounded-2xl" onClick={() => setCurrentView("Dashboard")}>Open Dashboard</Button>
        </div>
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          {impactStats.map((item) => {
            const Icon = item.icon;
            return (
              <Card key={item.label} className="rounded-2xl shadow-sm">
                <CardContent className="p-4">
                  <Icon className="h-5 w-5 mb-3" />
                  <p className="text-xl font-bold">{item.value}</p>
                  <p className="text-sm text-muted-foreground">{item.label}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      <div className="grid gap-4">
        <Card className="rounded-3xl shadow-lg border-0 bg-gradient-to-br from-zinc-50 to-zinc-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <p className="text-sm text-muted-foreground">Live Urgent Pickup</p>
                <h3 className="text-2xl font-bold">Fresh Veg Meals</h3>
              </div>
              <Badge variant="destructive" className="rounded-full">Expires in 4h</Badge>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="rounded-2xl bg-white p-4 shadow-sm">
                <p className="text-sm text-muted-foreground">Donor</p>
                <p className="font-semibold">Green Bowl Restaurant</p>
                <p className="text-sm mt-3 text-muted-foreground">Pickup</p>
                <p className="font-semibold flex items-center gap-2"><MapPin className="h-4 w-4" /> Dhanmondi</p>
              </div>
              <div className="rounded-2xl bg-white p-4 shadow-sm">
                <p className="text-sm text-muted-foreground">Assigned Volunteer</p>
                <p className="font-semibold">Sadia Akter</p>
                <p className="text-sm mt-3 text-muted-foreground">Route Efficiency</p>
                <div className="mt-2"><Progress value={78} /></div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-3 gap-4">
          {[
            { icon: Package, title: "Post Donation", text: "Share food, clothes, gadgets, books, and other items." },
            { icon: Truck, title: "Get Picked Up", text: "Volunteers can collect and deliver donations." },
            { icon: BarChart3, title: "Track Impact", text: "See how many people, items, and meals were helped." },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <Card key={item.title} className="rounded-2xl shadow-sm">
                <CardContent className="p-5">
                  <Icon className="h-5 w-5 mb-3" />
                  <h4 className="font-bold mb-2">{item.title}</h4>
                  <p className="text-sm text-muted-foreground leading-6">{item.text}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Categories() {
  const categories = [
    ["Food", "Time-sensitive rescue"],
    ["Clothes", "Seasonal and daily wear"],
    ["Gadgets", "Devices for reuse"],
    ["Supplies", "School and household needs"],
    ["Books", "Educational support"],
    ["Furniture", "Large item sharing"],
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 py-10">
      <SectionTitle title="Donation categories" subtitle="One platform for different types of community support." />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map(([name, desc]) => (
          <Card key={name} className="rounded-2xl hover:-translate-y-1 transition-all shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-lg">{name}</h3>
                <Sparkles className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground mt-2">{desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

function DonationCard({ donation, onClaim }) {
  const urgencyVariant = donation.urgency === "High" ? "destructive" : donation.urgency === "Medium" ? "secondary" : "outline";

  return (
    <Card className="rounded-2xl shadow-sm h-full">
      <CardContent className="p-5 flex flex-col h-full">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge className="rounded-full">{donation.category}</Badge>
              <Badge variant={urgencyVariant} className="rounded-full">{donation.urgency} Priority</Badge>
            </div>
            <h3 className="text-lg font-bold mt-3">{donation.title}</h3>
            <p className="text-sm text-muted-foreground mt-2">{donation.description}</p>
          </div>
          <Avatar>
            <AvatarFallback>{donation.donor.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
        </div>

        <div className="mt-4 space-y-2 text-sm">
          <p><span className="font-medium">Quantity:</span> {donation.quantity}</p>
          <p><span className="font-medium">Donor:</span> {donation.donor}</p>
          <p className="flex items-center gap-2"><MapPin className="h-4 w-4" /> {donation.location}</p>
          {donation.expiresIn ? (
            <p className="flex items-center gap-2 text-amber-600"><Clock3 className="h-4 w-4" /> Safe for {donation.expiresIn} more hours</p>
          ) : null}
        </div>

        <div className="mt-5 pt-4 border-t flex items-center justify-between gap-3">
          <Badge variant={donation.status === "Available" ? "default" : "secondary"} className="rounded-full">{donation.status}</Badge>
          <Button disabled={donation.status !== "Available"} className="rounded-xl" onClick={() => onClaim(donation.id)}>
            {donation.status === "Available" ? "Claim Now" : "Unavailable"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function BrowsePage({ donations, onClaim }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const filtered = useMemo(() => {
    return donations.filter((item) => {
      const matchesText = [item.title, item.category, item.location, item.donor].join(" ").toLowerCase().includes(search.toLowerCase());
      const matchesCategory = category === "All" || item.category === category;
      return matchesText && matchesCategory;
    });
  }, [donations, search, category]);

  return (
    <section className="max-w-7xl mx-auto px-4 py-10">
      <SectionTitle title="Browse donations" subtitle="Nearby items that can be claimed by people, volunteers, or organizations." />
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <div className="md:col-span-2 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input className="pl-10 rounded-2xl h-12" placeholder="Search food, clothes, gadgets, places..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="rounded-2xl h-12">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All</SelectItem>
            <SelectItem value="Food">Food</SelectItem>
            <SelectItem value="Clothes">Clothes</SelectItem>
            <SelectItem value="Gadgets">Gadgets</SelectItem>
            <SelectItem value="Supplies">Supplies</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filtered.map((donation) => (
          <DonationCard key={donation.id} donation={donation} onClaim={onClaim} />
        ))}
      </div>
    </section>
  );
}

function CreateDonationDialog({ onAdd }) {
  const [form, setForm] = useState({
    title: "",
    category: "Food",
    quantity: "",
    location: "",
    donor: "",
    urgency: "Medium",
    description: "",
  });

  const update = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const submit = () => {
    if (!form.title || !form.quantity || !form.location || !form.donor) return;
    onAdd({
      ...form,
      id: Date.now(),
      status: "Available",
      expiresIn: form.category === "Food" ? 6 : null,
    });
    setForm({ title: "", category: "Food", quantity: "", location: "", donor: "", urgency: "Medium", description: "" });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="rounded-2xl"><Plus className="h-4 w-4 mr-2" /> Add Donation</Button>
      </DialogTrigger>
      <DialogContent className="rounded-3xl sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create a donation listing</DialogTitle>
        </DialogHeader>
        <div className="grid md:grid-cols-2 gap-4 py-2">
          <Input placeholder="Item title" value={form.title} onChange={(e) => update("title", e.target.value)} />
          <Select value={form.category} onValueChange={(v) => update("category", v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Food">Food</SelectItem>
              <SelectItem value="Clothes">Clothes</SelectItem>
              <SelectItem value="Gadgets">Gadgets</SelectItem>
              <SelectItem value="Supplies">Supplies</SelectItem>
            </SelectContent>
          </Select>
          <Input placeholder="Quantity" value={form.quantity} onChange={(e) => update("quantity", e.target.value)} />
          <Input placeholder="Location" value={form.location} onChange={(e) => update("location", e.target.value)} />
          <Input placeholder="Donor name" value={form.donor} onChange={(e) => update("donor", e.target.value)} />
          <Select value={form.urgency} onValueChange={(v) => update("urgency", v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="High">High</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="Low">Low</SelectItem>
            </SelectContent>
          </Select>
          <div className="md:col-span-2">
            <Textarea placeholder="Description" value={form.description} onChange={(e) => update("description", e.target.value)} />
          </div>
          <div className="md:col-span-2 flex justify-end">
            <Button className="rounded-2xl" onClick={submit}>Publish Donation</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Dashboard({ donations, onAdd }) {
  const available = donations.filter((d) => d.status === "Available").length;
  const claimed = donations.filter((d) => d.status === "Claimed").length;
  const foodCount = donations.filter((d) => d.category === "Food").length;

  return (
    <section className="max-w-7xl mx-auto px-4 py-10">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <SectionTitle title="User dashboard" subtitle="Manage donations, monitor activity, and post new items." />
        <CreateDonationDialog onAdd={onAdd} />
      </div>

      <div className="grid md:grid-cols-3 gap-4 mb-8">
        {[
          ["Available Listings", available, Package],
          ["Claimed Items", claimed, ShieldCheck],
          ["Food Posts", foodCount, Clock3],
        ].map(([label, value, Icon]) => (
          <Card key={label} className="rounded-2xl shadow-sm">
            <CardContent className="p-5">
              <Icon className="h-5 w-5 mb-3" />
              <p className="text-2xl font-bold">{value}</p>
              <p className="text-sm text-muted-foreground">{label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="rounded-2xl shadow-sm">
        <CardHeader>
          <CardTitle>Recent listings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {donations.map((item) => (
              <div key={item.id} className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 border rounded-2xl p-4">
                <div>
                  <p className="font-semibold">{item.title}</p>
                  <p className="text-sm text-muted-foreground">{item.category} • {item.quantity} • {item.location}</p>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge className="rounded-full">{item.urgency}</Badge>
                  <Badge variant={item.status === "Available" ? "default" : "secondary"} className="rounded-full">{item.status}</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

function VolunteerPage() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-10">
      <SectionTitle title="Volunteer operations" subtitle="Pickup tasks, route support, and time-sensitive donation handling." />
      <div className="grid lg:grid-cols-2 gap-5">
        <Card className="rounded-2xl shadow-sm">
          <CardHeader>
            <CardTitle>Today’s route</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              "Pickup meals from Green Bowl Restaurant",
              "Collect notebooks from Mohammadpur donor",
              "Deliver jackets to Mirpur community center",
            ].map((step, i) => (
              <div key={step} className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-full bg-black text-white flex items-center justify-center text-sm font-bold">{i + 1}</div>
                <div>
                  <p className="font-medium">{step}</p>
                  <p className="text-sm text-muted-foreground">Estimated travel optimized by shortest path logic.</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-sm">
          <CardHeader>
            <CardTitle>Safety and urgency</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="font-medium">Food rescue priority</p>
                <p className="text-sm text-muted-foreground">80%</p>
              </div>
              <Progress value={80} />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="font-medium">Claim fulfillment</p>
                <p className="text-sm text-muted-foreground">65%</p>
              </div>
              <Progress value={65} />
            </div>
            <div className="rounded-2xl border p-4 bg-zinc-50">
              <p className="font-medium">AI suggestion</p>
              <p className="text-sm text-muted-foreground mt-2">
                Prioritize Dhanmondi food pickup first because it has the shortest safe consumption window.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

function AnalyticsPage() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-10">
      <SectionTitle title="Impact analytics" subtitle="Simple dashboard cards for project demonstration." />
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="rounded-2xl">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="category">By Category</TabsTrigger>
          <TabsTrigger value="ai">AI Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {impactStats.map((item) => {
              const Icon = item.icon;
              return (
                <Card key={item.label} className="rounded-2xl shadow-sm">
                  <CardContent className="p-5">
                    <Icon className="h-5 w-5 mb-3" />
                    <p className="text-2xl font-bold">{item.value}</p>
                    <p className="text-sm text-muted-foreground">{item.label}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="category" className="mt-6">
          <div className="grid md:grid-cols-2 gap-4">
            {[
              ["Food", "42% of total donations"],
              ["Clothes", "28% of total donations"],
              ["Gadgets", "14% of total donations"],
              ["Supplies", "16% of total donations"],
            ].map(([name, stat]) => (
              <Card key={name} className="rounded-2xl shadow-sm">
                <CardContent className="p-5">
                  <p className="font-bold text-lg">{name}</p>
                  <p className="text-sm text-muted-foreground mt-2">{stat}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="ai" className="mt-6">
          <Card className="rounded-2xl shadow-sm">
            <CardContent className="p-6 space-y-4">
              <p className="font-bold text-lg">Prediction and matching demo</p>
              <div className="rounded-2xl border p-4">
                <p className="font-medium">Tomorrow's expected food surplus</p>
                <p className="text-3xl font-bold mt-2">34 meal boxes</p>
                <p className="text-sm text-muted-foreground mt-1">Predicted from past restaurant donation patterns.</p>
              </div>
              <div className="rounded-2xl border p-4">
                <p className="font-medium">Best matched receiver zone</p>
                <p className="text-3xl font-bold mt-2">Mirpur Cluster</p>
                <p className="text-sm text-muted-foreground mt-1">Suggested using need level, distance, and volunteer availability.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </section>
  );
}

export default function App() {
  const [currentView, setCurrentView] = useState("Home");
  const [donations, setDonations] = useState(initialDonations);

  const handleClaim = (id) => {
    setDonations((prev) => prev.map((item) => (item.id === id ? { ...item, status: "Claimed" } : item)));
  };

  const handleAddDonation = (item) => {
    setDonations((prev) => [item, ...prev]);
    setCurrentView("Dashboard");
  };

  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <NavBar currentView={currentView} setCurrentView={setCurrentView} />

      {currentView === "Home" && (
        <>
          <Hero setCurrentView={setCurrentView} />
          <Categories />
          <BrowsePage donations={donations.slice(0, 3)} onClaim={handleClaim} />
        </>
      )}

      {currentView === "Browse" && <BrowsePage donations={donations} onClaim={handleClaim} />}
      {currentView === "Dashboard" && <Dashboard donations={donations} onAdd={handleAddDonation} />}
      {currentView === "Volunteer" && <VolunteerPage />}
      {currentView === "Analytics" && <AnalyticsPage />}

      <footer className="border-t mt-10">
        <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-sm text-muted-foreground">
          <p>© 2026 ShareLoop. Built for community donation redistribution.</p>
          <div className="flex items-center gap-4">
            <span>Donate</span>
            <span>Receive</span>
            <span>Volunteer</span>
            <span>Admin</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
