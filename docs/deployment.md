# Deployment

## Recommended Stack

- Vercel for the Next.js app
- Neon for PostgreSQL
- Cloudinary for media
- Optional Redis / BullMQ for scheduled jobs and distributed rate limits

## Steps

1. Set all environment variables in Vercel.
2. Run `npm run db:deploy`.
3. Run `npm run build`.
4. Deploy the app.

## Post-Deploy Checks

- Auth routes respond correctly
- Draft pages remain private
- Public community feed only shows published public content
- Upload and search endpoints resolve
- Scheduled publishing worker is configured if used
