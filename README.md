# TRS CIS League site deployment

## Upload to GitHub

Upload the contents of this folder to the repository root. Keep the `api`, `assets`, and `scripts` directories intact. Do not move their files into the repository root. Remove the old root-level copies of server files such as `auth.js`, `discord.js`, `roblox.js`, `callback.js`, `callback (1).js`, `profile.js`, `logout.js`, and `interactions.js`.

The Vercel project Root Directory should be the repository root (`.`). Vercel Functions must remain under `api/` so paths like `/api/auth/discord` and `/api/profile` are deployed.

## Configure Vercel

Copy the variables from `.env.example` into Vercel Project Settings → Environment Variables, using real provider and Upstash values. Set `PUBLIC_SITE_URL` to the public Vercel domain you want OAuth to use. Never commit real secrets.

Register these OAuth callback URLs with Discord and Roblox:

- `https://YOUR-DOMAIN/api/auth/discord/callback`
- `https://YOUR-DOMAIN/api/auth/roblox/callback`

Set Discord's Interactions Endpoint URL to `https://YOUR-DOMAIN/api/discord/interactions`. The bot must have Manage Roles, and its role must be above the verified role.

After redeploy, `/api/profile` should return `401` for a visitor who is not logged in (instead of `404`). Open `/verify.html` to start linking Discord and Roblox. A successful link opens `/profile.html` with both avatars and account details.

See `VERIFICATION_SETUP.md` for provider and database setup.
