# TRS CIS League account linking

The static league site now includes a Discord + Roblox account-linking flow, a verified player profile, and Vercel API functions under the api folder.

## Required services

- Vercel project serving this folder (outputs/tcl-site) as its project root.
- Upstash Redis REST database for short-lived OAuth state and account/profile records.
- Discord application with an OAuth2 client and a bot installed in the TRS CIS League server.
- Roblox OAuth app with openid and profile identity scopes.

## Provider callback URLs

Register these exact redirect URLs with both providers:

- Discord: https://trscisleague.vercel.app/api/auth/discord/callback
- Roblox: https://trscisleague.vercel.app/api/auth/roblox/callback
- Discord Interactions Endpoint URL: https://trscisleague.vercel.app/api/discord/interactions

Discord OAuth requests identify and guilds.join. For slash commands, set the Discord application Interactions Endpoint URL to https://trscisleague.vercel.app/api/discord/interactions and copy the application Public Key into DISCORD_PUBLIC_KEY. Install the bot in the target guild with the bot and applications.commands scopes, give it Manage Roles, and put its highest role above the verified role it will assign. Set DISCORD_GUILD_ID and DISCORD_VERIFIED_ROLE_ID to the target server and role IDs.

In the Roblox Creator Dashboard, create an OAuth app with openid and profile scopes and the callback above. Roblox currently documents OAuth 2.0 as a beta feature and requires creator identity verification to register and publish OAuth apps; check your dashboard eligibility.

Create an Upstash Redis database and copy its REST URL and REST token. Set all keys from .env.example in Vercel Project Settings → Environment Variables for Production (and Preview if needed). Generate a unique SESSION_SECRET with at least 32 random characters. Keep every secret server-side; never place credentials in browser JavaScript or commit them.

Register the /verify and /profile guild commands by running node scripts/register-discord-commands.js with DISCORD_CLIENT_ID, DISCORD_GUILD_ID, and DISCORD_BOT_TOKEN set in the local environment. Then set all variables in Vercel and redeploy. These slash commands are HTTP interactions handled by Vercel Functions; they do not require a continuously running Gateway process. The flow is:

1. Discord OAuth identifies the user and requests permission to join the league server.
2. Roblox OAuth confirms their Roblox account, username, and avatar.
3. The API prevents one Roblox account or Discord account from being linked to multiple profiles.
4. The bot joins the user to the guild and assigns the configured verified role.
5. The website stores the linked profile and shows the Discord and Roblox avatars.

The API stores OAuth state and pending Discord authorization data in Redis for 10–30 minutes. Profile records are keyed by Discord and Roblox IDs. The browser receives only an HttpOnly signed session cookie; OAuth tokens are not returned to the client.

## Vercel settings

If you upload the contents of this package to the GitHub repository root, set the Vercel Root Directory to the repository root (.) so it can see index.html and the api folder. If you keep the files inside an outputs/tcl-site subfolder, set the Root Directory to outputs/tcl-site. The site uses only built-in Node.js and fetch; no package installation is required. Discord interaction signature verification needs the raw request body, so the interactions function disables Vercel body parsing for that endpoint.



## Added in the latest update

- The bot also sets the member's server nickname to their Roblox username, so give the bot role the **Manage Nicknames** permission as well as Manage Roles. It cannot rename the server owner.
- Verified players get a public profile at `/profile.html?u=<RobloxUsername>`. New API routes: `/api/player?u=` (one public profile) and `/api/players` (list used to badge verified players in search).
- Players who verified before this update are added to the public index the next time they open their own profile (or re-verify).
- `/profile` now accepts an optional `player` option. Re-run `node scripts/register-discord-commands.js` once to register it.
- `tcl-ui.js` is shared by all pages (Terms & Privacy sheet, island back button, verified badges in search). Upload it to the repository root with the other files.

## Login and "Verify me" are now two steps

1. Sign in with Discord, then Roblox (`/api/auth/discord`, `/api/auth/roblox`). This only connects the accounts to the browser session, so the user is already "logged in" and sees their profile.
2. Pressing **Verify me** on `/verify.html` calls `POST /api/verify`: the bot adds the member to the server if needed, gives the verified role, sets the nickname to the Roblox username and publishes the profile.
3. **Use another account** (`/api/auth/reset`) forgets the connected accounts so the user can sign in with different ones.
