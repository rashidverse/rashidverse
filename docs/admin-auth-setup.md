# Secure admin login setup

Before deploying the protected dashboard, create a private `.env` file in the
project root on the VPS. It must never be uploaded to GitHub or shared.

```bash
cd /path/to/rashidverse
npm run auth:hash-password
npm run auth:session-secret
nano .env
```

Paste the outputs into `.env` like this:

```env
RASHIDVERSE_ADMIN_EMAIL=your-private-email@example.com
RASHIDVERSE_ADMIN_PASSWORD_HASH=scrypt.paste-the-password-hash-here
RASHIDVERSE_ADMIN_SESSION_SECRET=paste-the-openssl-secret-here
```

Then rebuild and reload the app:

```bash
npm run build
pm2 reload rashidverse --update-env
```

Go to `/admin`. It redirects to `/login` until the correct email and password
are entered. The session lasts 12 hours and can be ended with **Log out**.
