# Database Setup

1. Create a Neon PostgreSQL project.
2. Copy the pooled connection string into `DATABASE_URL`.
3. Copy the direct connection string into `DIRECT_URL`.
4. Create `.env` from `.env.example`.
5. Run:

```bash
npm run db:generate
npm run db:migrate
npm run db:seed
```

## Notes

- `DATABASE_URL` is intended for application traffic.
- `DIRECT_URL` is intended for migrations.
- The current repository includes a complete Prisma schema and a demo seed script.
