# bbauth Integration Guide

This guide explains how to integrate Flexio with an external bbauth OAuth 2.0 provider for persistent account authentication.

## Overview

The bbauth integration allows users to authenticate with an external bbauth OAuth 2.0 provider (such as the one from [github.com/math-u-t/bbauth](https://github.com/math-u-t/bbauth)). This provides:

- **Persistent Accounts**: User accounts that persist across sessions via bbauth
- **OAuth 2.0 Security**: RFC 6749-compliant authentication with PKCE (RFC 7636)
- **Account Linking**: Flexio accounts automatically linked to bbauth accounts via `bbauthAccountID`
- **Scoped Access**: Support for bbauth OAuth scopes (email, drive.readonly, gmail.send, etc.)

## Architecture

```
┌─────────────┐         ┌──────────────┐         ┌─────────────────┐
│   Flexio    │  OAuth  │   bbauth     │  Auth   │     Google      │
│   Frontend  │────────▶│   Provider   │────────▶│   Apps Script   │
│             │◀────────│   (External) │◀────────│                 │
└─────────────┘         └──────────────┘         └─────────────────┘
       │                        │
       │                        │
       ▼                        ▼
┌─────────────┐         ┌──────────────┐
│   Flexio    │         │   Cloudflare │
│   Workers   │────────▶│      KV      │
│   API       │         │   (Storage)  │
└─────────────┘         └──────────────┘
```

## Setup Instructions

### 1. Prerequisites

- A running bbauth OAuth 2.0 provider instance
- Access to register OAuth clients on your bbauth provider
- Flexio Workers and Frontend deployed

### 2. Register OAuth Client with bbauth

Register Flexio as an OAuth client with your bbauth provider:

```bash
curl -X POST https://your-bbauth-domain.com/admin/client/register \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "clientId": "flexio-client",
    "clientSecret": "YOUR_SECURE_CLIENT_SECRET",
    "redirectUris": [
      "http://localhost:8787/auth/bbauth/callback",
      "https://your-workers-subdomain.workers.dev/auth/bbauth/callback"
    ],
    "allowedScopes": ["email", "drive.readonly"],
    "clientType": "confidential",
    "name": "Flexio Chat Platform"
  }'
```

### 3. Configure Flexio Workers

#### Update `workers/.env` (for local development):

```bash
# External bbauth OAuth provider
BBAUTH_PROVIDER_URL=https://your-bbauth-domain.com
BBAUTH_CLIENT_ID=flexio-client
BBAUTH_CLIENT_SECRET=YOUR_SECURE_CLIENT_SECRET
BBAUTH_REDIRECT_URI=http://localhost:8787/auth/bbauth/callback
BBAUTH_SCOPE=email
```

#### Update `workers/wrangler.toml` (for production):

```toml
[env.production.vars]
BBAUTH_PROVIDER_URL = "https://your-bbauth-domain.com"
BBAUTH_CLIENT_ID = "flexio-client"
BBAUTH_REDIRECT_URI = "https://your-workers-subdomain.workers.dev/auth/bbauth/callback"
BBAUTH_SCOPE = "email"
```

#### Set Client Secret as Wrangler Secret:

```bash
wrangler secret put BBAUTH_CLIENT_SECRET
# Enter your client secret when prompted
```

### 4. Configure Flexio Frontend

Update `frontend/.env`:

```bash
# Enable bbauth integration
VITE_ENABLE_BBAUTH=true

# bbauth provider URL
VITE_BBAUTH_PROVIDER_URL=https://your-bbauth-domain.com
```

### 5. Deploy Changes

```bash
# Deploy Workers
cd workers
npm run deploy

# Build and deploy Frontend
cd ../frontend
npm run build
```

## Usage

### For End Users

1. Navigate to the Flexio login page (`/login`)
2. Click the **"Sign in with bbauth"** button
3. You'll be redirected to the bbauth provider for authentication
4. After successful authentication, you'll be redirected back to Flexio dashboard
5. Your Flexio account is now linked to your bbauth account

### For Developers

#### API Endpoints

The following endpoints are available for bbauth integration:

##### `GET /auth/bbauth/login`

Initiates the bbauth OAuth flow.

**Query Parameters:**
- `return_url` (optional): URL to redirect to after successful authentication (default: `/dashboard`)

**Example:**
```bash
curl -L "http://localhost:8787/auth/bbauth/login?return_url=/dashboard"
```

##### `GET /auth/bbauth/callback`

Handles the bbauth OAuth callback. This endpoint is called by the bbauth provider after authentication.

**Query Parameters:**
- `code`: Authorization code from bbauth
- `state`: State parameter for CSRF protection

##### `POST /auth/bbauth/link`

Links an existing Flexio account to a bbauth account.

**Headers:**
- `Authorization: Bearer <SERVICE_TOKEN>`

##### `POST /auth/bbauth/unlink`

Unlinks a bbauth account from a Flexio account (not yet implemented).

##### `GET /auth/bbauth/status`

Checks the bbauth link status for the authenticated user (not yet implemented).

#### Account Linking

When a user authenticates via bbauth:

1. Flexio receives the user's bbauth account ID (`sub` claim from userinfo)
2. Flexio checks if an account with that `bbauthAccountID` exists
3. If yes, returns the existing account's service token
4. If no, creates a new Flexio account and links it to the bbauth ID

**AccountData Structure:**

```typescript
interface AccountData {
  accountID: string;          // Flexio account UUID
  bbauthAccountID: string;    // bbauth account ID (from OAuth sub claim)
  belonging: {                // Chats this account belongs to
    [chatLink: string]: {
      authority: ChatRole;
      userName: string;
      joinedAt: string;
    };
  };
  serviceJoined: string;      // ISO 8601 timestamp
  flexioCoin: number;         // Virtual currency
  createdAt: number;          // Unix timestamp (ms)
  updatedAt: number;          // Unix timestamp (ms)
}
```

## Security Considerations

### PKCE (Proof Key for Code Exchange)

The bbauth integration uses PKCE (RFC 7636) to prevent authorization code interception attacks:

- **Code Verifier**: 128-byte random string, base64url-encoded
- **Code Challenge**: SHA-256 hash of code verifier, base64url-encoded
- **Code Challenge Method**: S256

### State Parameter

A cryptographically random state parameter is used for CSRF protection:

- 128-bit random value
- Stored in Cloudflare KV with 10-minute expiry
- Single-use only

### Token Storage

- **bbauth Access Token**: Stored in Cloudflare KV (encrypted at rest)
- **Flexio Service Token**: Returned to frontend, stored in localStorage
- **Client Secret**: Stored as Wrangler secret (never exposed to frontend)

## Troubleshooting

### "bbauth provider not configured" Error

**Cause:** Environment variables for bbauth are not set.

**Solution:** Ensure `BBAUTH_PROVIDER_URL` and `BBAUTH_CLIENT_ID` are configured in your Workers environment.

### "Invalid or expired state parameter" Error

**Cause:** The OAuth state parameter is invalid, expired (>10 minutes), or already used.

**Solution:** Restart the login flow. Ensure system clocks are synchronized.

### "Failed to exchange authorization code" Error

**Cause:** Token exchange with bbauth provider failed. Common reasons:
- Invalid client credentials
- Incorrect redirect URI
- Authorization code expired or already used

**Solution:**
- Verify `BBAUTH_CLIENT_ID` and `BBAUTH_CLIENT_SECRET` are correct
- Ensure `BBAUTH_REDIRECT_URI` matches the registered redirect URI exactly

### "Sign in with bbauth" Button Not Showing

**Cause:** bbauth integration is not enabled in frontend configuration.

**Solution:** Set `VITE_ENABLE_BBAUTH=true` and `VITE_BBAUTH_PROVIDER_URL` in `frontend/.env`

## Advanced Configuration

### Custom OAuth Scopes

To request additional OAuth scopes from bbauth, update the `BBAUTH_SCOPE` environment variable:

```bash
BBAUTH_SCOPE="email drive.readonly gmail.send"
```

Available scopes depend on your bbauth provider configuration.

### Token Refresh

bbauth access tokens are stored with their expiry time. Token refresh logic can be implemented by:

1. Checking token expiry before making scoped API calls
2. Using the refresh token to obtain a new access token
3. Updating the stored token in KV

**Example token storage:**

```json
{
  "accessToken": "eyJhbGc...",
  "refreshToken": "def502...",
  "expiresAt": "2025-11-14T12:00:00Z"
}
```

## API Integration Examples

### Making Authenticated Requests

Once a user has authenticated via bbauth, you can use their service token to make authenticated requests to Flexio:

```javascript
// Frontend example
const serviceToken = localStorage.getItem('flexio_service_token');

const response = await fetch('http://localhost:8787/chat/new', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${serviceToken}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    chatLink: 'my-new-chat',
    displayName: 'Alice',
    description: 'A chat for discussing projects'
  })
});
```

## Migration Guide

### Migrating Existing Users to bbauth

If you have existing Flexio users and want to migrate them to bbauth:

1. Users log in with bbauth for the first time
2. Backend creates a new account with `bbauthAccountID`
3. Optionally implement account merging logic to transfer:
   - Chat memberships (`belonging` field)
   - FlexioCoin balance
   - Historical data

## Support

For issues or questions:

- Flexio Issues: [GitHub Issues](https://github.com/your-username/flexio/issues)
- bbauth Documentation: [bbauth GitHub](https://github.com/math-u-t/bbauth)

## References

- [RFC 6749 - OAuth 2.0 Authorization Framework](https://datatracker.ietf.org/doc/html/rfc6749)
- [RFC 7636 - Proof Key for Code Exchange (PKCE)](https://datatracker.ietf.org/doc/html/rfc7636)
- [OpenID Connect Core 1.0](https://openid.net/specs/openid-connect-core-1_0.html)
- [bbauth GitHub Repository](https://github.com/math-u-t/bbauth)
