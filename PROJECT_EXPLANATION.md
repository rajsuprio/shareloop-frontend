# ShareLoop - Complete Project Explanation

## Table of Contents
1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Backend Structure](#backend-structure)
4. [Frontend Structure](#frontend-structure)
5. [How Everything Works Together](#how-everything-works-together)

---

## Project Overview

**ShareLoop** is a community sharing platform where users can:
- **Sell** items
- **Donate** items
- **Borrow** items

The platform handles the entire lifecycle: posting items → browsing → making requests → managing transactions → messaging.

**Core Concept**: It's like Airbnb/OLX but for sharing items in a community.

---

## Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js (lightweight web server)
- **Database**: MongoDB (NoSQL database for storing data)
- **Authentication**: JWT (JSON Web Tokens) + bcryptjs (password hashing)
- **Utilities**: CORS (cross-origin requests), dotenv (environment variables)

### Frontend
- **Framework**: React 19 (UI library)
- **Build Tool**: Vite (fast bundler)
- **Routing**: React Router v7 (page navigation)
- **UI Components**: Radix UI (accessible components)
- **Styling**: Tailwind CSS (utility-first CSS framework)
- **Icons**: Lucide React (icon library)
- **Animations**: Framer Motion (motion library)

---

## Backend Structure

### 1. **Database Configuration** (`backend/config/db.js`)

```javascript
The connectDB function:
- Takes MongoDB URI from environment variable
- Connects to MongoDB database
- Logs connection status
- Exits app if connection fails (critical for app to work)
```

**Key Point**: All data (users, items, requests, messages) are stored in MongoDB collections.

---

### 2. **Models** (How data is structured)

#### **User.js** - Represents a user account
```
Fields:
- name: Person's name
- email: Unique email (no duplicate accounts)
- password: Hashed password (never stored as plain text)
- role: "user", "admin", "moderator", or "organization"
- banned: Boolean to mark banned users
- timestamps: Created and updated time automatically

Why structure it this way?
- Email is unique so login works correctly
- Role allows admin features
- Banned field lets admins control users
```

#### **Item.js** - Represents an item someone wants to share
```
Fields:
- title: Name of item ("iPhone 12", "Bicycle")
- category: Type ("Electronics", "Sports")
- type: "Donate", "Sell", or "Borrow"
- price: Cost (string to handle "Free", "500 PKR", etc.)
- location: Where item is located
- image: URL to item photo
- user: Who posted it (references User)
- status: "pending", "approved", "rejected" (admin approval)
- available: Boolean - IS THIS ITEM STILL AVAILABLE?
- featured: Boolean - Should appear in featured section
- timestamps: When created/updated

Key Point: "available" field is crucial - when someone buys/borrows,
this is set to FALSE so others can't request it.
```

#### **Request.js** - Represents someone asking to buy/borrow/donate
```
Fields:
- itemId: Which item is being requested (references Item)
- requester: Who is asking (references User)
- owner: Who owns the item (references User)
- status: "pending" → "accepted"/"rejected" → "completed"/"cancelled"
- days: How many days to borrow (null for buy/donate)
- note: Message from requester to owner
- returnDate: When borrowed item should be returned
- timestamps: Created/updated time

Status Flow:
1. User creates request (status = "pending")
2. Item owner accepts/rejects (status = "accepted"/"rejected")
3. If accepted and completed, status = "completed"
4. User can cancel (status = "cancelled")

Unique Index: A user can only make ONE request per item (no spam)
```

#### **Thread.js** - Represents a conversation about an item
```
Fields:
- item: Which item is being discussed (references Item)
- participants: Array of users in conversation
- requester: The person who made the request
- owner: The item owner
- timestamps: Created/updated time

Why separate from Request?
- A request creates a conversation
- Multiple messages can happen in one thread
- Users can chat before accepting/rejecting

Unique Index: Only ONE thread per item+requester+owner combo
```

#### **Message.js** - An individual message in a thread
```
Fields:
- thread: Which conversation (references Thread)
- sender: Who sent it (references User)
- text: Message content
- timestamps: When sent

Simple structure: Just stores each message sent.
When you retrieve messages, you populate the sender info.
```

#### **SavedItem.js** - Like/bookmark functionality
```
Fields:
- itemId: Item being saved (references Item)
- user: Who saved it (references User)
- timestamps: When saved

Like Instagram bookmarks - users can save items to view later

Unique Index: A user can only save an item ONCE
(clicking save twice removes it)
```

---

### 3. **Middleware** (Request validators)

#### **authMiddleware.js** - Protects routes that need login
```javascript
protect() function does:
1. Check if Authorization header exists with "Bearer TOKEN"
2. Extract the token
3. Verify token using JWT secret
4. Find user in database
5. Check if user is banned
6. Attach user info (userId, role) to req.user
7. Allow request to continue

If any step fails → return 401/403 error

Usage: add "protect" to routes that need authentication
Example: router.post("/", protect, async (req, res) => {...})
         ^ Only logged-in users can create requests
```

#### **adminMiddleware.js** - Ensures user is admin
```javascript
adminMiddleware() checks:
1. User object exists
2. User role is exactly "admin"
3. If yes → allow (next())
4. If no → return 403 Forbidden

Usage: Add to routes only admins should access
Like moderating items, banning users, etc.
```

---

### 4. **Routes** (API endpoints)

#### **authRoutes.js** - User registration & login

```javascript
POST /api/auth/signup
Request body: { name, email, password }
What happens:
1. Check all fields provided
2. Check if user already exists
3. Hash password using bcryptjs (bcryptjs.hash)
4. Create user in database
5. Return user info (NOT password)

Response: { success: true, user: {...} }

POST /api/auth/login
Request body: { email, password }
What happens:
1. Find user by email
2. Compare provided password with hashed password (bcryptjs.compare)
3. If match: Generate JWT token (expires in 7 days)
4. Return token + user info

Response: { success: true, token: "JWT_TOKEN_HERE", user: {...} }

Important: Token is used in "Authorization: Bearer TOKEN" header
for all protected routes
```

#### **itemRoutes.js** - CRUD operations on items

```javascript
GET /api/items
- No authentication needed
- Returns ALL items from database (populated with user info)
- Used by Browse page to show all items

GET /api/items/my-items (protected)
- Only logged-in user can access
- Returns only items posted by that user
- Used by MyItems page

GET /api/items/:id
- Get single item by ID
- Used by ItemDetails page

POST /api/items (protected)
Request body: { title, category, type, price, location, image }
- Create new item
- Automatically sets user to req.user.userId (who posted it)
- Default: status="approved", available=true

PUT /api/items/:id (protected)
- Update item details
- Only owner or admin can update
- Used when editing item listing

DELETE /api/items/:id (protected)
- Delete item
- Only owner or admin can delete
- Also deletes all saved items linked to it

PATCH /api/items/:id/unavailable (protected) *** IMPORTANT ***
- Mark item as unavailable
- Only owner or admin can do this
- Called after successful purchase
- Prevents others from requesting same item
```

#### **requestRoutes.js** - Handling buy/borrow/donate requests

```javascript
GET /api/requests (protected)
- Get all requests MADE by current user
- Populated with item, requester, owner info

GET /api/requests/received (protected)
- Get all requests RECEIVED by current user
- (Requests for items they posted)

POST /api/requests (protected)
Request body: { itemId, days, note, returnDate }
What happens:
1. Check item exists
2. Check user isn't requesting own item (can't request your own posting)
3. Check if item.available = true (if false, reject!)
4. Check user hasn't already requested this item (unique index)
5. Create request with status="pending"
6. Store reference to owner (item.user)

PATCH /api/requests/:id/status (protected)
Request body: { status }
Allowed statuses: "accepted", "rejected", "completed", "cancelled"

Status Change Logic:
- When status = "accepted" → Set item.available = false
  (Nobody else can request it now)
- When status = "rejected" OR "cancelled" (if was accepted before)
  → Set item.available = true (Can be requested again)

DELETE /api/requests/:itemId (protected)
- User deletes their own request
- If request was accepted → restore item.available = true
```

#### **savedItemRoutes.js** - Save items for later

```javascript
GET /api/saved-items (protected)
- Get all saved items for current user
- Populated with full item details

POST /api/saved-items (protected)
Request body: { itemId }
- Save an item
- Check if already saved (unique index prevents duplicates)
- If trying to save twice → error

DELETE /api/saved-items/:itemId (protected)
- Unsave an item
- Remove from SavedItem collection
```

#### **messageRoutes.js** - Chat between users

```javascript
GET /api/messages/threads (protected)
- Get all threads current user is in
- Populated with item, participants, messages
- Sorted by most recently updated

GET /api/messages/threads/:threadId/messages (protected)
- Get all messages in a thread
- Check user is participant (can't read other's messages)
- Sorted by creation time (oldest first)

POST /api/messages/threads (protected)
Request body: { itemId }
- Create or get existing thread for an item
- If thread doesn't exist: create it with requester and owner
- If exists: return existing thread
- Used when user clicks "Message Owner"

POST /api/messages/threads/:threadId/messages (protected)
Request body: { text }
- Send message in thread
- Check user is participant
- Check message text isn't empty
- Create message, update thread.updatedAt
```

#### **adminRoutes.js** - Admin panel operations (read full file as needed)
- Moderate items (approve/reject/feature)
- Ban/unban users
- View all items
- View all users

---

### 5. **Server Setup** (`backend/server.js`)

```javascript
Import dotenv → Load environment variables from .env file
Create Express app
Connect to MongoDB

CORS Configuration:
- origin: Allow requests from frontend URL (http://localhost:5173)
- credentials: true (allow cookies)

Middleware:
- express.json() → Parse JSON requests
- cors() → Handle cross-origin requests

Routes registered:
/api/auth → authentication
/api/items → item operations
/api/saved-items → save items
/api/requests → buy/borrow/donate
/api/messages → messaging
/api/admin → admin panel

Server listens on PORT (default 5000)
```

---

## Frontend Structure

### 1. **Configuration** (`src/config.js`)

```javascript
API_BASE_URL = "http://localhost:5000"
- URL of backend API
- Used for all fetch() calls

CLOUDINARY_CLOUD_NAME & UPLOAD_PRESET
- For image uploads to Cloudinary
- Currently not fully integrated in code
```

---

### 2. **Authentication Context** (`src/context/AuthContext.jsx`)

```javascript
Creates a global auth state using React Context

State Variables:
- user: Current logged-in user object
- token: JWT token for API requests

On Component Mount:
- Check localStorage for saved user & token
- If found, restore login (don't require re-login on refresh)

Functions:
- login(userData, tokenData)
  → Store in state and localStorage
  
- logout()
  → Clear state and localStorage

useAuth() Hook:
- Allows any component to access auth state
- Provides isAdmin, isModerator checks

Why Context?
- Global state without prop drilling
- Any component can check if user is logged in
- Persists across page refreshes
```

---

### 3. **Main Entry Point** (`src/main.jsx`)

```javascript
Renders React app into #root element
Wraps entire app with AuthProvider
This makes useAuth() available everywhere
```

---

### 4. **App Router** (`src/App.jsx`)

```javascript
Sets up all routes using React Router

Public Routes (no login needed):
- / → Home page
- /browse → Browse items
- /item/:id → View item details
- /checkout/:id → Buy item
- /dashboard → Dashboard
- /login → Login page
- /signup → Signup page

Protected Routes (login required - wrapped in <ProtectedRoute>):
- /post → Create new item
- /saved → View saved items
- /my-items → View your items
- /requests → View your requests
- /messages → View messages
- /profile → View your profile

Admin Routes (login + admin role required):
- /admin → Admin panel

How ProtectedRoute works:
- If no token → redirect to /login
- If token exists → show component
```

---

### 5. **Route Guards** (Components)

#### **ProtectedRoute.jsx**
```javascript
export default function ProtectedRoute({ children }) {
  const { token } = useAuth();
  
  if (!token) {
    return <Navigate to="/login" replace ... />;
  }
  
  return children;
}

Usage:
<Route path="/post" element={<ProtectedRoute><PostItem /></ProtectedRoute>} />

If user not logged in → redirects to login
If logged in → shows component
```

#### **AdminRoute.jsx**
```javascript
export default function AdminRoute({ children }) {
  const { token, isAdmin } = useAuth();
  
  if (!token) return <Navigate to="/login" />;
  if (!isAdmin) return <Navigate to="/" />;
  
  return children;
}

Two checks:
1. Is user logged in?
2. Is user an admin?

If not → redirect to home page
If yes → show admin panel
```

---

### 6. **Layout Components**

#### **AppShell.jsx**
```javascript
Wraps every page with consistent styling
- min-h-screen: Full height
- Background gradient (greenish)
- max-w-7xl: Max width for content
- Padding: px-4 py-10 (responsive)

All pages use this to have consistent look
```

#### **PageHeader.jsx**
```javascript
Displays title, description, and action buttons
Used on every page to have consistent header

Props:
- title: Page title
- description: Optional page description
- actions: Optional buttons (like "View Saved" button)

Example:
<PageHeader 
  title="Browse Items"
  description="Find items in your community"
  actions={<Link to="/saved">View Saved</Link>}
/>
```

#### **PageLayout.jsx**
```javascript
Main layout with navbar
- Header with navigation links
- Logo/brand
- Auth buttons (Login/Signup or user menu)
- Search (possibly)
- {children} → page content below navbar
```

#### **Logo.jsx**
```javascript
Brand logo component
Used in navbar
```

---

### 7. **Pages** (Each route/page)

#### **Home.jsx** - Landing page
```javascript
Hero section with:
- Call to action
- Featured items carousel
- How it works section
- Category showcase
- Featured section showing 6 latest items

Uses:
- Browse all items endpoint
- No authentication needed
```

#### **Browse.jsx** - Main discovery page
```javascript
Complex filtering and search:

State:
- items: All items from backend
- savedItems: Items user has saved
- filters: search, type, category, location, radius, recency, price

Features:
- Search by title, location, category
- Filter by type (Donate, Sell, Borrow)
- Filter by category
- Filter by location with radius
- Filter by recency (Last 24h, 7 days, 30 days)
- Filter by price range
- Save/unsave items
- Mark items unavailable ✓ (uses new available field)

Key Logic - filteredItems useMemo:
Returns items that match ALL filters
Includes availability check: item.available !== false

This is where unavailable items get HIDDEN from browse
```

#### **PostItem.jsx** - Create new item
```javascript
Form to post new item:
- title, category, type (Donate/Sell/Borrow)
- price, location, image
- Create request → POST /api/items
- Redirect to /browse

Types:
- Donate: Free items
- Sell: Items for sale with price
- Borrow: Items to lend out
```

#### **ItemDetails.jsx** - View single item
```javascript
Display full item info:
- Image, title, description
- Type, price, location
- Owner info (name, email)
- Button to:
  - Buy (if type="Sell") → goes to /checkout/:id
  - Borrow (if type="Borrow") → creates request
  - Take Donation (if type="Donate") → creates request
- Save item button
- Message owner button

If item.available = false → show "No longer available"
```

#### **Checkout.jsx** - Purchase page
```javascript
Simulated payment form:
- Item details
- Total amount
- Payment method (Card, etc.)
- Card details form (mocked, not real payment)

On Submit:
1. Validate payment info
2. Simulate payment processing
3. Call PATCH /api/items/:id/unavailable ✓ (marks as sold)
4. Show success message
5. Redirect to item page

This is where items become unavailable after purchase!
```

#### **Dashboard.jsx** - User dashboard
```javascript
Overview of:
- Items posted (count)
- Items saved (count)
- Requests made
- Messages

Quick access to main features
```

#### **MyItems.jsx** - Manage your items
```javascript
Display all items posted by user:
- Item cards with edit/delete buttons
- Edit form to update item
- Delete with confirmation

Only show items.where(user === currentUser)
```

#### **SavedItems.jsx** - Your bookmarks
```javascript
Display all saved items:
- Get from /api/saved-items
- Show similar to Browse but only saved
- Can remove from saved
- Can view details
```

#### **Requests.jsx** - Buy/borrow transactions
```javascript
Two tabs:
1. "Made by Me" - Requests I made to others
   - Show status: pending, accepted, rejected, completed
   - Can cancel pending request

2. "Received by Me" - Requests others made for my items
   - Show who requested
   - Buttons to Accept/Reject/Mark Complete
   - When Accept → item.available = false ✓

Status badges show current state
```

#### **Messages.jsx** - Chat feature
```javascript
Display all threads (conversations):
- List of threads
- Click to open chat
- Send/receive messages

Shows:
- Item being discussed
- Participants
- Message history
- Input field to type new message

Used for coordinating pickup/delivery
```

#### **Profile.jsx** - User account page
```javascript
Display:
- User info (name, email, role)
- My items count
- Saved items count
- My requests
- Received requests
- Logout button

Gets data from:
- /api/items/my-items
- /api/saved-items
- /api/requests
- /api/requests/received
```

#### **Login.jsx** - Authentication
```javascript
Email + password form:
- Input validation
- POST /api/auth/login
- On success: store token + user in AuthContext
- Redirect to /browse

Error handling for:
- Wrong credentials
- Email not found
```

#### **Signup.jsx** - New account
```javascript
Name + email + password form:
- Input validation
- Check password == confirm password
- POST /api/auth/signup
- On success: auto-login (store token)
- Redirect to /browse

Error handling for:
- Email already exists
- Password too weak
```

#### **AdminPanel.jsx** - Admin controls
```javascript
Admin dashboard with:
1. All items table
   - Approve/reject items
   - Mark available/unavailable
   - Feature items
   - Delete items

2. All users table
   - Ban/unban users
   - View user info

3. Stats/analytics
   - Total users
   - Total items
   - Total requests

Only admins can access (AdminRoute)
```

---

### 8. **UI Components** (`src/components/ui/`)

These are reusable Radix UI components styled with Tailwind:
- avatar.jsx - User profile pictures
- badge.jsx - Status badges (pending, accepted, etc.)
- button.jsx - Styled button
- card.jsx - Styled card container
- dialog.jsx - Modal/popup
- input.jsx - Text input field
- progress.jsx - Progress bar
- select.jsx - Dropdown select
- tabs.jsx - Tab switcher
- textarea.jsx - Multi-line text input

These use Radix UI primitives under the hood + Tailwind styling

---

## How Everything Works Together

### **Complete User Journey: Buying an Item**

1. **User Signup**
   - Frontend: Signup.jsx form
   - Backend: POST /api/auth/signup
   - Database: New User created
   - Result: JWT token stored in AuthContext + localStorage

2. **User Browses Items**
   - Frontend: Browse.jsx loads
   - Backend: GET /api/items (all items)
   - Frontend filters by: search, type, category, price, location
   - **Key**: Filters out items where available=false
   - Displays available items to user

3. **User Selects an Item**
   - Frontend: ItemDetails.jsx
   - Backend: GET /api/items/:id
   - Shows full details + owner info
   - Button says "Buy Now" (for Sell items)

4. **User Clicks Buy → Checkout**
   - Frontend: Checkout.jsx
   - Shows mock payment form
   - User enters card details (mocked)

5. **Payment Submitted**
   - Frontend: Calls PATCH /api/items/:id/unavailable
   - Backend: Sets item.available = false
   - **Result**: Item no longer appears in Browse!

6. **User Views Their Profile**
   - Frontend: Profile.jsx
   - Backend: GET /api/requests + /api/items/my-items
   - Shows item in their purchases (if tracked)

### **Complete User Journey: Borrowing an Item**

1. **User Selects Borrow Item**
   - Frontend: ItemDetails.jsx
   - Button: "Borrow This Item"
   - Creates Request

2. **Creates Request**
   - Frontend: Creates form with days, note, returnDate
   - Backend: POST /api/requests
   - **Check**: Is item.available = true? If false → error!
   - Creates Request with status="pending"

3. **Item Owner Accepts Request**
   - Frontend: Requests.jsx "Received" tab
   - Button: "Accept"
   - Backend: PATCH /api/requests/:id/status with "accepted"
   - **Happens**: item.available = false (set in code!)
   - **Result**: Item disappears from Browse

4. **Owner & Requester Chat**
   - Frontend: Messages.jsx
   - Backend: Thread created automatically
   - Messages posted/retrieved
   - Discuss pickup details

5. **After Return (Future Feature)**
   - Need button "Mark as Returned"
   - Would set item.available = true again
   - (Not fully implemented yet)

---

## Key Data Flows

### **Authentication Flow**
```
Signup → Hash password → Store user → Return confirmation
                                        ↓
Login → Find user → Compare password → Generate JWT token
                                        ↓ (stored in localStorage)
UseAuth hook → Check token exists → Render protected routes
```

### **Item Availability Flow**
```
Item Created → available = true (default)
                        ↓
User Buys → Checkout Submit → PATCH /unavailable → available = false
                                                        ↓
Item Hidden in Browse (filtered out)
                        ↓
User Can't Request It (validation check)
```

### **Request Status Flow**
```
POST request → status = "pending"
        ↓
Owner Accepts → status = "accepted" → item.available = false
        ↓ or ↓
Owner Rejects → status = "rejected" → item stays available
        ↓
User Completes → status = "completed"
```

---

## Important Patterns

### **1. Protected Routes Pattern**
```javascript
// Routes that need login use <ProtectedRoute>
<Route path="/post" element={<ProtectedRoute><PostItem /></ProtectedRoute>} />

// Inside components:
const { token, user } = useAuth();
if (!token) {
  // Show login prompt or redirect happens automatically
}
```

### **2. Fetch + State Pattern**
```javascript
useEffect(() => {
  if (!token) return;
  
  async function fetch() {
    const res = await fetch(URL, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setData(await res.json());
  }
  
  fetch();
}, [token]);
```

### **3. Error Handling Pattern**
```javascript
try {
  // Fetch/operations
  if (!res.ok) throw new Error(data.message);
  // Success
  setBanner({ type: "success", message: "..." });
} catch (error) {
  setBanner({ type: "error", message: error.message });
}
```

### **4. Unique Index Pattern** (Prevent duplicates)
```javascript
// Database level: savedItemSchema.index({ itemId: 1, user: 1 }, { unique: true })
// Result: User can only save an item once
// Try to save twice → duplicate key error
```

---

## Environment Variables (.env)

**Backend (.env)**:
```
MONGO_URI=mongodb://...
JWT_SECRET=your_secret_key
PORT=5000
CLIENT_URL=http://localhost:5173
```

**Frontend (.env or config.js)**:
```
VITE_API_BASE_URL=http://localhost:5000
VITE_CLOUDINARY_CLOUD_NAME=...
VITE_CLOUDINARY_UPLOAD_PRESET=...
```

---

## Summary for Interview

**What is ShareLoop?**
A full-stack community sharing platform with React frontend and Node/Express backend. Users can post items to Sell/Borrow/Donate, browse with filters, make requests, chat, and manage transactions.

**Key Technical Concepts Used:**
1. **JWT Authentication** - Secure login with tokens
2. **MongoDB with Mongoose** - Flexible NoSQL database
3. **React Context API** - Global state without Redux
4. **Protected Routes** - Role-based access control
5. **RESTful API Design** - Standard HTTP methods
6. **Async/Await** - Cleaner promise handling
7. **Component Composition** - Reusable UI components
8. **Database Relationships** - References between collections
9. **Request/Response Cycle** - Full MERN flow
10. **Availability Management** - Core business logic for item lifecycle

**Most Important Feature:**
The availability management system - when an item is bought/borrowed, it's marked unavailable so multiple people can't request the same item. This required validation at request creation AND status updates.

---

This document covers EVERY file and concept. You can now explain:
- Why each file exists
- What data it contains
- How it connects to other parts
- The complete user flow
- Key technical patterns
