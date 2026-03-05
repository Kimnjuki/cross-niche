# Insert NVIDIA Rubin Article

This guide explains how to insert the NVIDIA Rubin AI Architecture article into your database.

## Option 1: Using SQL Migration (Recommended)

1. **Get the full article body text** - The SQL file has a placeholder `[Full article text as provided above] ...` that needs to be replaced with the complete article content.

2. **Open Supabase Dashboard**:
   - Go to your Supabase project dashboard
   - Navigate to SQL Editor
   - Create a new query

3. **Copy and paste** the contents of `supabase/migrations/insert_nvidia_rubin_article.sql`

4. **Replace the article body**:
   - Find the line with `'At CES 2026, NVIDIA CEO Jensen Huang announced... [Full article text as provided above] ...'`
   - Replace `[Full article text as provided above] ...` with the complete article text
   - Make sure to properly escape single quotes (use `''` for a single quote in SQL)

5. **Run the SQL** - Execute the query in the Supabase SQL Editor

## Option 2: Using TypeScript Script

1. **Install dependencies** (if not already installed):
   ```bash
   npm install tsx dotenv
   ```

2. **Set environment variables** in `.env`:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_key
   ```

3. **Edit the script** `scripts/insert-nvidia-rubin-article.ts`:
   - Find the `ARTICLE_BODY` constant
   - Replace the placeholder with the full article text

4. **Run the script**:
   ```bash
   npx tsx scripts/insert-nvidia-rubin-article.ts
   ```

## Important Notes

- **Article Body**: The full article body text must be provided. The SQL/script includes a placeholder that needs to be replaced.
- **Table Names**: The script uses `authors` table. If your database uses `users` instead, update the SQL accordingly.
- **Field Names**: The script uses `seo_meta_title` and `seo_meta_description`. If your schema uses different field names (like `meta_title`, `subtitle`, etc.), adjust the SQL.
- **UUIDs**: The provided UUIDs are examples. You may want to generate new ones or use existing author IDs from your database.

## Verifying the Insert

After running the script, verify the article was inserted:

```sql
SELECT id, title, slug, status, published_at 
FROM public.content 
WHERE slug = 'nvidia-rubin-ai-architecture-specs-release-date';
```

## Troubleshooting

- **Author not found**: Make sure the author ID exists in your `authors` table, or update the `author_id` in the content insert.
- **Tags not linking**: Check that tags are created first, then the content_tags relationships are established.
- **Table doesn't exist**: Some tables like `content_tables` or `media` might not exist in your schema. Comment out those sections if needed.



