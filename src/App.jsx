import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Browse from "./pages/Browse";
import PostItem from "./pages/PostItem";
import ItemDetails from "./pages/ItemDetails";
import SavedItems from "./pages/SavedItems";
import MyItems from "./pages/MyItems";
import Dashboard from "./pages/Dashboard";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/browse" element={<Browse />} />
        <Route path="/post" element={<PostItem />} />
        <Route path="/item/:id" element={<ItemDetails />} />
        <Route path="/saved" element={<SavedItems />} />
        <Route path="/my-items" element={<MyItems />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}