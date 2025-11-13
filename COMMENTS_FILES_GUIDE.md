# Customer Comments Feature - Files Guide

## 📁 Complete File Structure

### New Files Created

```
project-root/
│
├── 📄 COMMENTS_FEATURE_SETUP.md           ← Detailed setup guide
├── 📄 COMMENTS_QUICK_START.txt            ← Quick reference
├── 📄 COMMENTS_FILES_GUIDE.md             ← This file
│
├── sql/
│   └── 📄 comments_schema.sql             ← Database table creation
│
├── lib/
│   ├── 📝 types.ts                        ← Updated (Comment interface added)
│   └── 📝 api.ts                          ← Updated (Comment API functions added)
│
├── app/
│   ├── components/
│   │   ├── 📝 CustomerComments.tsx        ← NEW: Homepage comments display
│   │   └── 📝 DashboardSidebar.tsx        ← Updated (Comments link added)
│   │
│   ├── 📝 page.tsx                        ← Updated (Comments section added)
│   │
│   └── dashboard/
│       └── comments/
│           ├── 📄 page.tsx                ← NEW: Comments management page
│           └── add/
│               └── 📄 page.tsx            ← NEW: Add comment form page
```

## 🔍 Detailed File Descriptions

### 1. Database Schema

**File:** `sql/comments_schema.sql`

```sql
-- Creates:
-- ✓ comments table
-- ✓ Indexes for performance
-- ✓ Triggers for updated_at
-- ✓ Sample data (3 approved comments)

-- Fields:
-- id, customer_name, customer_email, customer_image_url,
-- comment_text, rating, is_approved, created_at, updated_at
```

**What to do:** Run this SQL in Supabase SQL Editor

---

### 2. Type Definitions

**File:** `lib/types.ts`

**Changes Made:**
```typescript
// ADDED at end of file:
export interface Comment {
  id: string;
  customer_name: string;
  customer_email?: string;
  customer_image_url?: string;
  comment_text: string;
  rating: number;
  is_approved: boolean;
  created_at: string;
  updated_at: string;
}
```

---

### 3. API Functions

**File:** `lib/api.ts`

**Imports Updated:**
```typescript
import type { ..., Comment } from './types';
```

**New Functions Added:**
```typescript
// Get approved comments for public display
export async function getApprovedComments(): Promise<Comment[]>

// Get all comments (admin only)
export async function getAllComments(): Promise<Comment[]>

// Get single comment by ID
export async function getCommentById(id: string): Promise<Comment | null>

// Create new comment
export async function createComment(comment: Omit<Comment, 'id' | 'created_at' | 'updated_at'>): Promise<Comment | null>

// Update comment
export async function updateComment(id: string, updates: Partial<Comment>): Promise<Comment | null>

// Delete comment
export async function deleteComment(id: string): Promise<boolean>

// Approve comment
export async function approveComment(id: string): Promise<Comment | null>

// Reject comment
export async function rejectComment(id: string): Promise<Comment | null>
```

---

### 4. Customer Comments Component

**File:** `app/components/CustomerComments.tsx`

**What it does:**
- Displays approved customer comments on homepage
- Shows customer name, date, rating, comment text
- Displays customer image if available
- Includes CTA button to "Yorum Yaz" (Write Comment)
- Fully responsive and dark mode compatible
- Returns null if no comments (hides section)

**Props:**
```typescript
interface CustomerCommentsProps {
  comments: Comment[];
}
```

**Features:**
- 5-star rating display
- Customer profile image
- Date formatting (Turkish locale)
- Responsive grid layout (1 col mobile, 3 cols desktop)
- Quote styling for comment text
- Call-to-action section at bottom

---

### 5. Main Page Update

**File:** `app/page.tsx`

**Changes Made:**

1. Import:
```typescript
import CustomerComments from "./components/CustomerComments";
import { ..., getApprovedComments } from "@/lib/api";
```

2. Fetch comments:
```typescript
const [pageData, contactInfo, featuredItems, homeContentSetting, comments] = await Promise.all([
  // ... existing fetches ...
  getApprovedComments(),
]);
```

3. Added component:
```typescript
<CustomerComments comments={comments} />
```

**Location:** Between "Philosophy" section and Footer
**Status:** Before footer, inside main max-width container

---

### 6. Admin Sidebar Update

**File:** `app/components/DashboardSidebar.tsx`

**Changes Made:**

1. Interface updated:
```typescript
interface DashboardSidebarProps {
  activePage?: "dashboard" | "menu" | "categories" | "messages" | "comments" | "settings";
  unreadCount?: number;
}
```

2. New navigation link added:
```typescript
<Link
  href="/dashboard/comments"
  className={`flex items-center gap-3 px-3 py-2 rounded-lg ...`}
>
  <span className="material-symbols-outlined">comment</span>
  <p>Yorumlar</p>
</Link>
```

**Position:** Between Messages and Settings links

---

### 7. Comments Management Page

**File:** `app/dashboard/comments/page.tsx`

**Features:**
- List all comments with filtering (All, Approved, Pending)
- Click to select comment for detailed view
- Side panel shows selected comment details
- Action buttons:
  - ✓ Approve/Reject button
  - ✗ Delete button with confirmation
- Statistics and filtering
- Link to "Add Comment" form

**Sections:**
- Header with title and "Add Comment" button
- Filter tabs (All / Approved / Pending)
- Left: Comments list (scrollable)
- Right: Details panel (sticky)

**State Management:**
- Uses `useState` for comments, loading, filtering, selection
- Uses `useEffect` for initial data fetch
- Supabase real-time capable (can be added)

---

### 8. Add Comment Form Page

**File:** `app/dashboard/comments/add/page.tsx`

**Form Fields:**
1. Customer Name (required)
   - Text input
   - Placeholder: "örn: Ahmet Yılmaz"

2. Customer Email (optional)
   - Email input
   - Placeholder: "örn: ahmet@example.com"

3. Customer Image URL (optional)
   - URL input
   - Placeholder: "https://example.com/image.jpg"

4. Rating (1-5)
   - Select dropdown
   - Options: "★★★★★ (5 Yıldız)" to "★ (1 Yıldız)"
   - Default: 5 stars

5. Comment Text (required)
   - Textarea (6 rows)
   - Placeholder: "Müşterinin yorumunu girin..."

6. Approval Checkbox
   - "Bu yorumu hemen yayınla (onayla)"
   - Default: Checked (auto-approve)
   - Can be unchecked for approval queue

**Actions:**
- Submit: "Yorum Ekle" - Creates comment and redirects
- Cancel: Goes back to comments list

**Validation:**
- Customer name required
- Comment text required
- Email and URL validated if provided
- Error messages displayed

**Success Flow:**
- Shows success message
- Auto-redirects after 1.5 seconds
- Page refreshes to show new comment

---

## 🎯 Data Flow Diagram

```
User Views Homepage (/)
    ↓
    ├→ page.tsx calls getApprovedComments()
    ├→ Fetches from: comments table WHERE is_approved = true
    └→ Passes to: <CustomerComments comments={comments} />
         ↓
    CustomerComments.tsx
    ├→ Maps comments array
    ├→ Displays: Name, Date, Rating, Text, Image
    └→ Renders: Grid layout with styling


Admin Opens Dashboard
    ↓
    ├→ DashboardSidebar shows "Yorumlar" link
    └→ Clicks link → /dashboard/comments
         ↓
    comments/page.tsx
    ├→ Fetches: getAllComments() from Supabase
    ├→ Filter: All / Approved / Pending
    ├→ UI: List + Details Panel
    ├→ Actions: Approve, Reject, Delete
    └→ Add: Link to /dashboard/comments/add
         ↓
    comments/add/page.tsx
    ├→ Form with all fields
    ├→ Validation on submit
    └→ Creates: Comment via createComment()
         ↓
    Back to comments/page.tsx (with new comment)
```

---

## 📊 Database Relationships

```
comments table (new)
├── id (PK)
├── customer_name
├── customer_email
├── customer_image_url
├── comment_text
├── rating
├── is_approved
├── created_at
├── updated_at
└── Indexes:
    ├── idx_comments_created_at
    └── idx_comments_is_approved
```

---

## 🔗 Route Mapping

```
Public Routes:
  / (homepage)
    └── Shows approved comments in CustomerComments component

Admin Routes:
  /dashboard/comments
    ├── GET: Lists all comments
    ├── POST: Approve/Reject/Delete via button clicks
    └── Link to: /dashboard/comments/add

  /dashboard/comments/add
    ├── GET: Show form
    ├── POST: Create comment
    └── Redirect to: /dashboard/comments
```

---

## 🎨 Styling System Used

All components use your existing Tailwind theme:

```css
Colors:
├── Primary: text-primary, bg-primary, hover:bg-primary-dark
├── Text: text-text-light, dark:text-text-dark
├── Background: bg-background-light, dark:bg-background-dark
├── Surface: bg-surface-light, dark:bg-surface-dark
├── Border: border-border-light, dark:border-border-dark
└── Status: yellow (pending), green (approved), red (error)

Spacing:
├── Padding: p-4, p-6, px-4, py-2, etc.
├── Gap: gap-2, gap-3, gap-6
└── Margins: mb-8, mt-2, pt-6

Responsive:
├── Mobile-first approach
├── sm:, md:, lg: breakpoints
├── grid-cols-1, md:grid-cols-3, lg:grid-cols-3
└── w-full, max-w-2xl, max-w-5xl
```

---

## ✅ Checklist for Implementation

- [x] Create comments_schema.sql
- [x] Add Comment type to types.ts
- [x] Add API functions to api.ts
- [x] Create CustomerComments.tsx component
- [x] Update main page (page.tsx)
- [x] Update DashboardSidebar
- [x] Create admin comments page
- [x] Create add comment form page
- [x] Create documentation files
- [ ] **Run SQL to create database table** ← DO THIS FIRST!
- [ ] Test on homepage
- [ ] Test admin pages
- [ ] Add/Edit/Delete comments
- [ ] Test filtering
- [ ] Test approval workflow

---

## 🚀 Next Steps

1. **Run SQL Script:** Copy `sql/comments_schema.sql` to Supabase
2. **Restart Dev Server:** `npm run dev`
3. **Test Homepage:** Visit `/` → should see comments section
4. **Test Admin:** Visit `/dashboard/comments` → manage comments
5. **Customize:** Update text, colors, styling as needed
6. **Deploy:** Push to production

---

Last Updated: November 2025
Version: 1.0

