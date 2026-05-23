# ShareLoop 🔄

A full-stack community sharing platform where users can **buy**, **sell**, **donate**, and **borrow** items from their local community.

## 📌 What is ShareLoop?

ShareLoop is a modern sharing economy platform inspired by OLX and Airbnb. It enables community members to:
- **Sell** items at a fair price
- **Donate** items for free
- **Borrow** items for a limited time
- **Save** items for later
- **Message** other users to arrange logistics
- **Track** requests and transactions

It's built with modern web technologies and follows full-stack MERN architecture with real-time request management and item availability tracking.

---

## ✨ Key Features

### For Users
- 🔐 **Secure Authentication** - JWT-based login/signup with password hashing
- 🛍️ **Browse Items** - Advanced filtering by category, type, price, location, and recency
- 📍 **Location-Based Discovery** - Find items near you with radius filtering
- ❤️ **Save Items** - Bookmark items for later viewing
- 💬 **Real-Time Messaging** - Chat with buyers/sellers to arrange pickup/delivery
- 📋 **Request Management** - Make and receive requests for items
- 💳 **Checkout** - Simulated payment processing for purchases
- 👤 **User Profile** - View your items, requests, saved items, and activity

### For Admins
- 👥 **User Management** - Ban/unban users, view all accounts
- 📦 **Item Moderation** - Approve/reject items, mark as featured
- 📊 **Analytics** - View platform statistics

### Smart Features
- ✅ **Availability Management** - Items automatically disappear from browse when purchased/borrowed
- 🚫 **Duplicate Prevention** - Users can't request already-unavailable items
- 🔒 **Permission System** - Only item owners can accept/reject requests
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile

---

## 🛠️ Tech Stack

### Frontend
- **React 19** - Modern UI library with hooks
- **Vite** - Lightning-fast build tool
- **React Router v7** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Lucide React** - Modern icon library
- **Framer Motion** - Smooth animations

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web server framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - Secure token-based authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin request handling

---

## 📦 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas cloud instance)
- npm or yarn

### Backend Setup

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/shareloop.git
cd shareloop/backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Create `.env` file**
```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/shareloop
JWT_SECRET=your_super_secret_key_here
PORT=5000
CLIENT_URL=http://localhost:5173
```

4. **Start the server**
```bash
npm start          # Production mode
npm run dev        # Development mode (with nodemon)
```

The server will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory**
```bash
cd ../
```

2. **Install dependencies**
```bash
npm install
```

3. **Create `.env.local` file** (optional, uses defaults)
```env
VITE_API_BASE_URL=http://localhost:5000
VITE_CLOUDINARY_CLOUD_NAME=your_cloudinary_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_preset
```

4. **Start development server**
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

---

## 🚀 Usage

### For Regular Users

1. **Sign Up** - Create an account with email and password
2. **Post an Item** - Go to `/post` and create a new listing (Sell/Donate/Borrow)
3. **Browse Items** - Use `/browse` with advanced filters
4. **Make a Request** - Click on any item to request to buy/borrow/donate
5. **Message Users** - Chat with item owners to arrange details
6. **View Profile** - Check your items, requests, and saved items in `/profile`

### For Admins

1. **Login as Admin** - User must have `role: "admin"` in database
2. **Access Admin Panel** - Go to `/admin`
3. **Moderate Items** - Approve/reject/feature items
4. **Manage Users** - Ban users as needed
5. **View Analytics** - See platform statistics

---

## 📁 Project Structure

```
shareloop/
├── backend/
│   ├── models/              # MongoDB schemas
│   │   ├── User.js         # User accounts
│   │   ├── Item.js         # Items for sale/donation/borrowing
│   │   ├── Request.js      # Buy/borrow/donate requests
│   │   ├── Message.js      # Individual messages
│   │   ├── Thread.js       # Message conversations
│   │   └── SavedItem.js    # Bookmarked items
│   ├── routes/             # API endpoints
│   │   ├── authRoutes.js   # Login/signup
│   │   ├── itemRoutes.js   # Item CRUD
│   │   ├── requestRoutes.js # Request management
│   │   ├── messageRoutes.js # Messaging
│   │   ├── savedItemRoutes.js # Save items
│   │   └── adminRoutes.js  # Admin operations
│   ├── middleware/         # Authentication & authorization
│   │   ├── authMiddleware.js
│   │   └── adminMiddleware.js
│   ├── config/            # Database configuration
│   │   └── db.js
│   ├── server.js          # Express app setup
│   └── package.json
│
├── src/                   # React frontend
│   ├── components/        # Reusable components
│   │   ├── ProtectedRoute.jsx
│   │   ├── AdminRoute.jsx
│   │   ├── AppShell.jsx
│   │   ├── PageHeader.jsx
│   │   ├── PageLayout.jsx
│   │   ├── Logo.jsx
│   │   └── ui/           # UI component library
│   ├── context/          # React context
│   │   └── AuthContext.jsx
│   ├── pages/            # Page components
│   │   ├── Home.jsx
│   │   ├── Browse.jsx
│   │   ├── ItemDetails.jsx
│   │   ├── Checkout.jsx
│   │   ├── PostItem.jsx
│   │   ├── MyItems.jsx
│   │   ├── SavedItems.jsx
│   │   ├── Requests.jsx
│   │   ├── Messages.jsx
│   │   ├── Profile.jsx
│   │   ├── Login.jsx
│   │   ├── Signup.jsx
│   │   ├── Dashboard.jsx
│   │   └── AdminPanel.jsx
│   ├── lib/              # Utilities
│   ├── config.js         # API configuration
│   ├── App.jsx           # Router setup
│   ├── main.jsx          # Entry point
│   └── index.css         # Global styles
│
├── package.json          # Frontend dependencies
├── vite.config.js        # Vite configuration
├── tailwind.config.js    # Tailwind configuration
├── postcss.config.js     # PostCSS configuration
└── README.md
```

---

## 🔌 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Register new user |
| POST | `/api/auth/login` | Login user |

### Items
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/items` | Get all items |
| GET | `/api/items/:id` | Get single item |
| GET | `/api/items/my-items` | Get user's items (protected) |
| POST | `/api/items` | Create new item (protected) |
| PUT | `/api/items/:id` | Update item (protected) |
| DELETE | `/api/items/:id` | Delete item (protected) |
| PATCH | `/api/items/:id/unavailable` | Mark item unavailable (protected) |

### Requests
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/requests` | Get user's requests (protected) |
| GET | `/api/requests/received` | Get received requests (protected) |
| POST | `/api/requests` | Create request (protected) |
| PATCH | `/api/requests/:id/status` | Update request status (protected) |
| DELETE | `/api/requests/:itemId` | Cancel request (protected) |

### Messaging
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/messages/threads` | Get all threads (protected) |
| GET | `/api/messages/threads/:id/messages` | Get thread messages (protected) |
| POST | `/api/messages/threads` | Create/get thread (protected) |
| POST | `/api/messages/threads/:id/messages` | Send message (protected) |

### Saved Items
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/saved-items` | Get saved items (protected) |
| POST | `/api/saved-items` | Save item (protected) |
| DELETE | `/api/saved-items/:itemId` | Unsave item (protected) |

---

## 🔑 Key Concepts

### Authentication Flow
1. User signs up → password hashed with bcryptjs
2. User logs in → credentials verified → JWT token issued
3. Token stored in localStorage + AuthContext
4. All protected routes check token in Authorization header
5. Invalid token → user redirected to login

### Item Availability System
- When item is created: `available = true`
- When item is purchased/borrowed: `available = false`
- When unavailable: item disappears from browse, can't be requested
- If request is rejected/cancelled: `available = true` again

### Request Workflow
```
pending → accepted (item.available = false)
  ↓         ↓
rejected  completed
(item stays available or restored)
```

---

## 🧪 Testing

### Test User Scenarios

1. **Browse & Purchase**
   - Sign up → Post item (Sell) → Create another account → Browse → Buy item → Item disappears from browse

2. **Borrow Flow**
   - User A posts item (Borrow) → User B requests → A accepts → B receives message alert → Discuss pickup

3. **Save Items**
   - Browse items → Click heart icon → View in /saved → Can unsave anytime

4. **Admin Panel**
   - (Requires admin role) → Approve/reject items → Ban users

---

## 🐛 Known Limitations

- Payment processing is simulated (not real transactions)
- Image uploads use default Cloudinary preset (not fully integrated)
- Real-time messaging uses polling (not WebSockets)
- No return mechanism for borrowed items yet (planned feature)

---

## 🚀 Future Enhancements

- [ ] Real payment integration (Stripe/PayPal)
- [ ] WebSocket support for real-time messaging
- [ ] Item return mechanism for borrowing
- [ ] User ratings & reviews system
- [ ] Push notifications
- [ ] Advanced analytics dashboard
- [ ] Email notifications
- [ ] Google/Facebook authentication
- [ ] Mobile app (React Native)
- [ ] Item recommendations algorithm

---

## 📚 Documentation

For detailed code explanation, see [PROJECT_EXPLANATION.md](./PROJECT_EXPLANATION.md) which covers:
- Every file in depth
- Complete data flows
- Design patterns used
- Interview-ready explanations

---

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see LICENSE file for details.

---

## 👤 Author

Created with ❤️ for community sharing.

---

## 📞 Support

Found a bug? Have a feature request? Open an issue on GitHub!

---

## 🎯 Project Status

- ✅ Core functionality complete
- ✅ Authentication system
- ✅ Item management & availability
- ✅ Request & messaging system
- ✅ Admin panel
- 🔄 In active development
- 📋 See [issues](https://github.com/yourusername/shareloop/issues) for current work

---

**Made with React, Express, MongoDB, and ❤️**
