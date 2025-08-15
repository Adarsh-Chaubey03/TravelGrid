# TravelGrid - Proposed Code Cleanup Fixes

## Issue #1: Remove Commented Code Blocks (HIGH PRIORITY)
**File**: `client/src/main.jsx`
**Lines**: 17-44
**Issue**: Multiple blocks of commented out import statements cluttering the main entry file

**Current Code (Lines 17-44):**
```javascript
//import TrendingSpots from './pages/TrendingSpots.jsx';
//import PackingChecklistPage from './pages/PackingChecklist.jsx';
//import Summarizer from './components/Summarizer';
//import Recommendation from './components/recommendation';
//import Wishlist from './pages/Wishlist';
//import { WishlistProvider } from "./context/WishlistContext";

//import TrendingSpots from './pages/TrendingSpots.jsx';
//import PackingChecklistPage from './pages/PackingChecklist.jsx';
//import Summarizer from './components/Summarizer';
//import Recommendation from './components/recommendation';
//import Wishlist from './pages/Wishlist';
// import PetTravel from './pages/PetTravel';

//import TrendingSpots from './pages/TrendingSpots.jsx';
//import PackingChecklistPage from './pages/PackingChecklist.jsx';
//import Summarizer from './components/Summarizer';
//import Recommendation from './components/recommendation';
//import Wishlist from './pages/Wishlist';
//import { WishlistProvider } from "./context/WishlistContext";
//import PetTravel from './pages/PetTravel';

//import ProtectedRoute from './components/Auth/ProtectedRoute';
```

**Fix**: Simply delete all these commented lines

## Issue #2: Fix Import Path Typos (HIGH PRIORITY)
**Files**: Multiple files with double slash import paths

### 2a. TripCalculator.jsx
**Line 1**: `import TripExpenseCalculator from "..///components/TripExpenseCalculator/ExpenseCalculator";`
**Fix**: `import TripExpenseCalculator from "../components/TripExpenseCalculator/ExpenseCalculator";`

### 2b. Other files to check for similar issues:
- HotelDetails.jsx (Line 13)
- TrendingSpots.jsx (Line 6) - duplicate import
- TravelPackages.jsx (Line 5) - potential issues

## Issue #3: Remove Console.log Statements (MEDIUM PRIORITY)
**File**: `client/src/pages/HotelDetails.jsx`
**Line 46**: `console.log("Logged-in user from useAuth:", user);`
**Fix**: Remove this console.log statement

## Issue #4: Remove Commented Route Definitions (MEDIUM PRIORITY)
**File**: `client/src/main.jsx`
**Lines 171-174**: Commented route definitions that are already implemented below
**Lines 179**: Duplicate `/pettravel` route

## Issue #5: Clean Up Duplicate Imports (LOW PRIORITY)
**File**: `client/src/pages/TrendingSpots.jsx`
**Line 6**: `import { Heart as HeartFilled } from "lucide-react"; // We'll reuse but with fill`
This import renames Heart to HeartFilled but Heart is already imported on line 2

## Estimated Impact:
- **High PR Acceptance Probability**: 95%+
- **Files Affected**: 4-5 files
- **Time to Complete**: 15-20 minutes
- **Risk**: Very Low (only removing dead code and fixing typos)
- **Visibility**: Very High (main.jsx is core file, others are commonly used pages)
