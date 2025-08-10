# Havana Food Cart Booking System

A comprehensive food cart booking platform built with Next.js, TypeScript, Prisma, and MySQL. This system allows customers to book food carts for events through a professional multi-step form and provides administrators with a powerful dashboard to manage bookings and operations.

## 🚀 Features

### Customer Features
- **Multi-Step Booking Form**: Professional step-by-step booking process
  - Cart selection with detailed information
  - Food item selection with quantity controls
  - Date and time selection with availability checking
  - Customer information collection
  - Payment processing with multiple methods
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Real-time Availability**: Check cart availability in real-time
- **Professional UI**: Modern, clean interface with Tailwind CSS

### Admin Features
- **Comprehensive Dashboard**: Overview of bookings, revenue, and statistics
- **Booking Management**: View, filter, and manage all bookings
- **Food Cart Management**: Add, edit, and manage food carts
- **Menu Management**: Manage food items and categories
- **Revenue Tracking**: Monthly revenue charts and analytics
- **Status Management**: Update booking and payment statuses

### Technical Features
- **TypeScript**: Full type safety throughout the application
- **Prisma ORM**: Type-safe database operations with MySQL
- **API Routes**: RESTful API endpoints for all operations
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Component Architecture**: Reusable UI components
- **Form Validation**: Client-side validation with error handling

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: MySQL
- **Styling**: Tailwind CSS
- **State Management**: React Hooks
- **Form Handling**: Custom form components with validation
- **Icons**: Unicode emojis for better accessibility

## 📁 Project Structure

```
havana/
├── app/                          # Next.js App Router
│   ├── admin/                    # Admin panel pages
│   │   ├── bookings/             # Booking management
│   │   ├── layout.tsx            # Admin layout
│   │   └── page.tsx              # Dashboard
│   ├── api/                      # API routes
│   │   ├── admin/                # Admin API endpoints
│   │   ├── availability/         # Availability checking
│   │   ├── bookings/             # Booking operations
│   │   └── food-carts/           # Food cart operations
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Home page with booking form
├── components/                   # Reusable components
│   ├── booking/                  # Booking-related components
│   │   ├── steps/                # Individual form steps
│   │   └── BookingForm.tsx       # Main booking form
│   └── ui/                       # UI components
│       ├── Button.tsx            # Button component
│       ├── Card.tsx              # Card components
│       ├── Input.tsx             # Input component
│       ├── Select.tsx            # Select component
│       └── StepIndicator.tsx     # Step progress indicator
├── lib/                          # Utility libraries
│   └── prisma.ts                 # Prisma client setup
├── prisma/                       # Database schema
│   └── schema.prisma             # Prisma schema definition
├── types/                        # TypeScript type definitions
│   └── booking.ts                # Booking-related types
└── utils/                        # Utility functions
```

## 🗄️ Database Schema

The application uses a comprehensive database schema with the following models:

- **User**: Customer and admin user management
- **FoodCart**: Food cart information and pricing
- **FoodItem**: Menu items for each cart
- **Booking**: Main booking records
- **BookingItem**: Individual food items in bookings
- **CartAvailability**: Cart availability scheduling

## 🔧 Setup Instructions

### Prerequisites
- Node.js 18+ installed
- MySQL database server
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd havana
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Update the `.env` file with your database credentials:
   ```env
   DATABASE_URL="mysql://username:password@localhost:3306/havana_booking"
   NEXTAUTH_SECRET="your-secret-key"
   NEXTAUTH_URL="http://localhost:3000"
   JWT_SECRET="your-jwt-secret"
   ```

4. **Setup the database**
   ```bash
   # Create the database
   npx prisma migrate dev --name init
   
   # Generate Prisma client
   npx prisma generate
   
   # (Optional) Seed the database
   npx prisma db seed
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open the application**
   - Customer booking form: `http://localhost:3000`
   - Admin dashboard: `http://localhost:3000/admin`

## 📋 Usage

### Customer Booking Process

1. **Select Food Cart**: Browse available food carts and select one
2. **Choose Food Items**: Select menu items with quantities
3. **Pick Date & Time**: Choose event date and time slot
4. **Enter Details**: Provide customer and event information
5. **Complete Payment**: Choose payment method and complete booking

### Admin Dashboard

1. **Dashboard**: View overview statistics and recent activity
2. **Bookings**: Manage all bookings, update statuses
3. **Food Carts**: Add and manage food cart information
4. **Menu Items**: Manage food items and categories
5. **Reports**: View revenue and booking analytics

## 🔄 API Endpoints

### Public Endpoints
- `GET /api/food-carts` - Get all active food carts
- `GET /api/food-carts/[id]` - Get specific food cart with menu
- `GET /api/availability` - Check cart availability
- `POST /api/bookings` - Create new booking

### Admin Endpoints
- `GET /api/admin/dashboard` - Dashboard statistics
- `GET /api/bookings` - Get all bookings (with filters)
- `PUT /api/bookings/[id]` - Update booking status
- `POST /api/food-carts` - Create food cart
- `PUT /api/food-carts/[id]` - Update food cart

## 🎨 UI Components

### Form Components
- **Button**: Versatile button with variants and loading states
- **Input**: Text input with label, error, and helper text
- **Select**: Dropdown select with options
- **Card**: Container component with header, content, footer

### Booking Components
- **StepIndicator**: Progress indicator for multi-step form
- **BookingForm**: Main form container with step management
- **Step Components**: Individual form steps with validation

## 🔒 Security Features

- Input validation on both client and server
- SQL injection prevention through Prisma ORM
- Type safety with TypeScript
- Secure API routes with proper error handling

## 🚀 Deployment

### Environment Setup
1. Set up production database
2. Configure environment variables
3. Run database migrations
4. Build the application

### Build Commands
```bash
# Build for production
npm run build

# Start production server
npm start
```

## 📝 TODO / Future Enhancements

- [ ] Payment integration (Stripe, PayPal)
- [ ] Email notifications
- [ ] SMS notifications
- [ ] Advanced reporting and analytics
- [ ] Mobile app version
- [ ] Multi-language support
- [ ] Advanced search and filtering
- [ ] Calendar integration
- [ ] Customer reviews and ratings
- [ ] Loyalty program

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For support and questions, please contact the development team or create an issue in the repository.

---

Built with ❤️ using Next.js, TypeScript, and modern web technologies.#   h a v a n a  
 