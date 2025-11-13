# Customer Comments Feature Setup Guide

## Overview

The customer comments feature allows you to:
- Display approved customer testimonials on the main page
- Manage customer comments in the admin dashboard
- Approve/reject comments before they appear publicly
- Rate comments (1-5 stars)
- Add customer images and email addresses

## Installation Steps

### 1. Create the Database Table

Run the following SQL in your Supabase SQL editor to create the comments table:

```sql
-- Comments table for customer testimonials/reviews
CREATE TABLE IF NOT EXISTS comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name text NOT NULL,
  customer_email text,
  customer_image_url text,
  comment_text text NOT NULL,
  rating integer DEFAULT 5,
  is_approved boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_comments_created_at ON comments (created_at);
CREATE INDEX IF NOT EXISTS idx_comments_is_approved ON comments (is_approved);

-- Create trigger for updated_at
CREATE TRIGGER trg_comments_set_updated_at
  BEFORE UPDATE ON comments
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();

-- Sample data (optional)
INSERT INTO comments (customer_name, customer_email, comment_text, rating, is_approved)
VALUES
  ('Ahmet Yılmaz', 'ahmet@example.com', 'Harika bir restoran! Yemekler çok lezzetli ve sunumu mükemmel. Kesinlikle tekrar geleceğim.', 5, true),
  ('Fatma Demir', 'fatma@example.com', 'Şef harika! Her tabak bir sanat eseri. Atmosfer çok sıcak ve samimi. Arkadaşlarıma da tavsiye ettim.', 5, true),
  ('Mehmet Kaya', 'mehmet@example.com', 'Menü çeşitleri fazla değil ama olan yemekler gerçekten özel. Kalite her şeyden önemli.', 4, true)
ON CONFLICT DO NOTHING;
```

Alternatively, you can run the SQL file:
```bash
# Copy the SQL file path to Supabase
D:\SEO\DFL\DFL-main\sql\comments_schema.sql
```

### 2. Enable RLS (Row Level Security) - Optional but Recommended

Add these policies for security:

```sql
-- Allow anyone to read approved comments
CREATE POLICY "Allow public to read approved comments"
  ON comments
  FOR SELECT
  USING (is_approved = true);

-- Allow authenticated admins to manage comments
CREATE POLICY "Allow admins to manage comments"
  ON comments
  FOR ALL
  USING (auth.uid() = (SELECT auth.uid() FROM public.users WHERE is_admin = true))
  WITH CHECK (auth.uid() = (SELECT auth.uid() FROM public.users WHERE is_admin = true));
```

## Features

### 1. Customer Comments Section on Main Page

The comments section appears on the homepage (`/`) with:
- Customer name and date
- 5-star rating display
- Comment text
- Customer image (if provided)
- Call-to-action button to add comments

**Location:** `/app/components/CustomerComments.tsx`

### 2. Admin Dashboard Comments Management

Access at `/dashboard/comments` with:
- **List View:** All comments organized by approval status
  - Filter: All, Approved, Pending
  - Click any comment to view details
  
- **Details Panel:** Shows selected comment with actions
  - Approve/reject button
  - Delete button
  - Edit ratings and text

- **Add Comment Form:** `/dashboard/comments/add`
  - Customer name (required)
  - Customer email (optional)
  - Customer image URL (optional)
  - Comment text (required)
  - Rating selection (1-5 stars)
  - Approval toggle

### 3. API Functions

All API functions are in `/lib/api.ts`:

```typescript
// Get approved comments (for public display)
getApprovedComments(): Promise<Comment[]>

// Get all comments (admin only)
getAllComments(): Promise<Comment[]>

// Get single comment
getCommentById(id: string): Promise<Comment | null>

// Create new comment
createComment(comment: Omit<Comment, 'id' | 'created_at' | 'updated_at'>): Promise<Comment | null>

// Update comment
updateComment(id: string, updates: Partial<Comment>): Promise<Comment | null>

// Delete comment
deleteComment(id: string): Promise<boolean>

// Approve comment
approveComment(id: string): Promise<Comment | null>

// Reject comment
rejectComment(id: string): Promise<Comment | null>
```

## File Structure

```
app/
├── components/
│   ├── CustomerComments.tsx          # Main page comments display
│   └── DashboardSidebar.tsx          # Updated with comments link
├── dashboard/
│   ├── comments/
│   │   ├── page.tsx                  # Comments management page
│   │   └── add/
│   │       └── page.tsx              # Add comment form
│   └── ...
├── page.tsx                          # Updated with comments section
└── ...

lib/
├── api.ts                            # Updated with comment functions
├── types.ts                          # Updated with Comment interface
└── ...

sql/
├── comments_schema.sql               # Database schema
└── ...
```

## Usage Examples

### Display Comments on Main Page

The comments are automatically fetched and displayed:

```typescript
// In app/page.tsx
const comments = await getApprovedComments();

// Passed to component
<CustomerComments comments={comments} />
```

### Manage Comments in Admin

1. Go to `/dashboard/comments`
2. Filter by status (All, Approved, Pending)
3. Click a comment to view details
4. Approve/reject or delete as needed
5. Add new comments via "Add Comment" button

### Add Comment Programmatically

```typescript
import { createComment } from '@/lib/api';

const newComment = await createComment({
  customer_name: "John Doe",
  customer_email: "john@example.com",
  comment_text: "Great experience!",
  rating: 5,
  is_approved: true
});
```

## Customization

### Styling

All components use your existing Tailwind theme colors:
- Primary colors for buttons and highlights
- Dark mode support throughout
- Responsive design (mobile-first)

### Comment Display Limit

To limit displayed comments, modify `CustomerComments.tsx`:

```typescript
// Show only latest 6 comments
const displayedComments = comments.slice(0, 6);
```

### Approval Workflow

To require approval for all new comments:

1. In `/dashboard/comments/add/page.tsx`, change:
```typescript
const [is_approved] = useState(false); // Default to pending
```

2. Update the form message accordingly

## Database Fields Reference

| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Unique comment ID |
| customer_name | text | Customer's name (required) |
| customer_email | text | Customer's email |
| customer_image_url | text | URL to customer's profile image |
| comment_text | text | The comment content (required) |
| rating | integer | Star rating (1-5) |
| is_approved | boolean | Whether comment is published |
| created_at | timestamp | Creation date |
| updated_at | timestamp | Last update date |

## Security Considerations

1. **Input Validation:** All inputs are validated before insertion
2. **XSS Protection:** Supabase automatically sanitizes data
3. **RLS Policies:** Set up to prevent unauthorized access
4. **Admin Only:** Management features require authentication

## Troubleshooting

### Comments not appearing on main page?

1. Check if comments table exists in Supabase
2. Verify at least one comment has `is_approved = true`
3. Check browser console for errors
4. Ensure `getApprovedComments()` is imported in `app/page.tsx`

### Admin page shows no comments?

1. Verify you're logged in as admin
2. Check Supabase connection
3. Ensure comments table has data
4. Check browser console for errors

### Images not loading in comments?

1. Verify image URLs are valid and accessible
2. Check CORS settings in Supabase Storage
3. Test URLs directly in browser

## Performance Notes

- Comments are cached and revalidated every 60 seconds
- Indexes on `created_at` and `is_approved` for fast queries
- Pagination can be added if comments exceed 100+

## Future Enhancements

Possible features to add:
- Comment search and sorting
- Comment replies/threading
- Email notifications for new comments
- Social media share buttons
- Comment moderation queue
- Analytics and comment insights

## Support

For issues or questions:
1. Check the Supabase dashboard for errors
2. Review browser console logs
3. Verify database schema matches SQL files
4. Check file permissions and ownership

---

**Last Updated:** November 2025
**Version:** 1.0

