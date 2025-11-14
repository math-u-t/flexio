/**
 * bbauth OAuth Integration Handler
 * Handles authentication with external bbauth provider
 */

import { Env, AccountData } from '../types';
import { generateCodeVerifier, generateCodeChallenge, generateState } from '../crypto';
import { createServiceToken } from '../utils/tokens';

/**
 * Initiate bbauth OAuth flow - GET /auth/bbauth/login
 */
export async function handleBbauthLogin(
  request: Request,
  env: Env
): Promise<Response> {
  try {
    const url = new URL(request.url);
    const returnUrl = url.searchParams.get('return_url') || '/dashboard';

    // Check if bbauth provider is configured
    if (!env.BBAUTH_PROVIDER_URL || !env.BBAUTH_CLIENT_ID) {
      return new Response(
        JSON.stringify({
          statusCode: 503,
          message: 'bbauth provider not configured',
          error: 'Service Unavailable',
        }),
        { status: 503, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Generate PKCE parameters
    const codeVerifier = generateCodeVerifier();
    const codeChallenge = await generateCodeChallenge(codeVerifier);
    const state = generateState();

    // Store PKCE parameters in KV (10 minute expiry)
    const pkceData = {
      codeVerifier,
      state,
      returnUrl,
      createdAt: new Date().toISOString(),
    };
    await env.KV.put(`bbauth:pkce:${state}`, JSON.stringify(pkceData), {
      expirationTtl: 600, // 10 minutes
    });

    // Build authorization URL
    const bbauthAuthUrl = new URL(`${env.BBAUTH_PROVIDER_URL}/oauth/authorize`);
    bbauthAuthUrl.searchParams.set('client_id', env.BBAUTH_CLIENT_ID);
    bbauthAuthUrl.searchParams.set('redirect_uri', env.BBAUTH_REDIRECT_URI);
    bbauthAuthUrl.searchParams.set('response_type', 'code');
    bbauthAuthUrl.searchParams.set('scope', env.BBAUTH_SCOPE || 'email');
    bbauthAuthUrl.searchParams.set('state', state);
    bbauthAuthUrl.searchParams.set('code_challenge', codeChallenge);
    bbauthAuthUrl.searchParams.set('code_challenge_method', 'S256');

    return Response.redirect(bbauthAuthUrl.toString(), 302);
  } catch (error) {
    console.error('bbauth login error:', error);
    return new Response(
      JSON.stringify({
        statusCode: 500,
        message: 'Failed to initiate bbauth login',
        error: error instanceof Error ? error.message : 'Unknown error',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

/**
 * Handle bbauth OAuth callback - GET /auth/bbauth/callback
 */
export async function handleBbauthCallback(
  request: Request,
  env: Env
): Promise<Response> {
  try {
    const url = new URL(request.url);
    const code = url.searchParams.get('code');
    const state = url.searchParams.get('state');
    const error = url.searchParams.get('error');
    const errorDescription = url.searchParams.get('error_description');

    // Handle OAuth errors
    if (error) {
      return new Response(
        JSON.stringify({
          statusCode: 400,
          message: errorDescription || 'OAuth authorization failed',
          error: error,
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Validate required parameters
    if (!code || !state) {
      return new Response(
        JSON.stringify({
          statusCode: 400,
          message: 'Missing required parameters',
          error: 'Bad Request',
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Retrieve and validate PKCE data
    const pkceDataStr = await env.KV.get(`bbauth:pkce:${state}`);
    if (!pkceDataStr) {
      return new Response(
        JSON.stringify({
          statusCode: 400,
          message: 'Invalid or expired state parameter',
          error: 'Bad Request',
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const pkceData = JSON.parse(pkceDataStr);
    const { codeVerifier, returnUrl } = pkceData;

    // Delete used PKCE data
    await env.KV.delete(`bbauth:pkce:${state}`);

    // Exchange authorization code for tokens
    const tokenResponse = await fetch(`${env.BBAUTH_PROVIDER_URL}/oauth/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: env.BBAUTH_REDIRECT_URI,
        client_id: env.BBAUTH_CLIENT_ID,
        client_secret: env.BBAUTH_CLIENT_SECRET || '',
        code_verifier: codeVerifier,
      }),
    });

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error('bbauth token exchange failed:', errorText);
      return new Response(
        JSON.stringify({
          statusCode: 500,
          message: 'Failed to exchange authorization code',
          error: 'Token Exchange Failed',
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const tokenData = await tokenResponse.json<{
      access_token: string;
      token_type: string;
      expires_in?: number;
      refresh_token?: string;
      id_token?: string;
    }>();

    // Get user info from bbauth
    const userInfoResponse = await fetch(
      `${env.BBAUTH_PROVIDER_URL}/oauth/userinfo`,
      {
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
        },
      }
    );

    if (!userInfoResponse.ok) {
      const errorText = await userInfoResponse.text();
      console.error('bbauth userinfo failed:', errorText);
      return new Response(
        JSON.stringify({
          statusCode: 500,
          message: 'Failed to retrieve user information',
          error: 'UserInfo Failed',
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const userInfo = await userInfoResponse.json<{
      sub: string;
      email?: string;
      name?: string;
    }>();

    // Create or retrieve flexio account linked to bbauth
    const bbauthAccountID = userInfo.sub;
    const account = await getOrCreateAccountByBbauthID(
      bbauthAccountID,
      userInfo.email || '',
      env
    );

    // Generate flexio service token
    const serviceToken = await createServiceToken(
      {
        serviceID: 'flexio',
        accountID: account.accountID,
        issuedAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
      },
      env
    );

    // Store bbauth access token for future use (if needed for scoped operations)
    await env.KV.put(
      `bbauth:token:${account.accountID}`,
      JSON.stringify({
        accessToken: tokenData.access_token,
        refreshToken: tokenData.refresh_token,
        expiresAt: new Date(
          Date.now() + (tokenData.expires_in || 3600) * 1000
        ).toISOString(),
      }),
      {
        expirationTtl: tokenData.expires_in || 3600,
      }
    );

    // Redirect back to frontend with service token
    const redirectUrl = new URL(returnUrl, env.ISSUER_URL || 'http://localhost:5173');
    redirectUrl.searchParams.set('service_token', serviceToken);
    redirectUrl.searchParams.set('account_id', account.accountID);

    return Response.redirect(redirectUrl.toString(), 302);
  } catch (error) {
    console.error('bbauth callback error:', error);
    return new Response(
      JSON.stringify({
        statusCode: 500,
        message: 'Failed to process bbauth callback',
        error: error instanceof Error ? error.message : 'Unknown error',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

/**
 * Get or create flexio account by bbauth account ID
 */
async function getOrCreateAccountByBbauthID(
  bbauthAccountID: string,
  email: string,
  env: Env
): Promise<AccountData> {
  // Check if account already exists
  const existingAccountKeys = await env.KV.list({ prefix: 'account:' });

  for (const key of existingAccountKeys.keys) {
    const accountDataStr = await env.KV.get(key.name);
    if (accountDataStr) {
      const account: AccountData = JSON.parse(accountDataStr);
      if (account.bbauthAccountID === bbauthAccountID) {
        return account;
      }
    }
  }

  // Create new account
  const accountID = crypto.randomUUID();
  const now = Date.now();
  const nowISO = new Date(now).toISOString();

  const newAccount: AccountData = {
    accountID,
    bbauthAccountID,
    belonging: {},
    serviceJoined: nowISO,
    flexioCoin: 0,
    createdAt: now,
    updatedAt: now,
  };

  await env.KV.put(`account:${accountID}`, JSON.stringify(newAccount));

  return newAccount;
}

/**
 * Link existing account to bbauth - POST /auth/bbauth/link
 */
export async function handleBbauthLink(
  request: Request,
  env: Env
): Promise<Response> {
  try {
    // Require existing service token
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({
          statusCode: 401,
          message: 'Missing or invalid authorization header',
          error: 'Unauthorized',
        }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // TODO: Verify service token and extract account ID
    // For now, we'll require the account to re-authenticate via bbauth

    return handleBbauthLogin(request, env);
  } catch (error) {
    console.error('bbauth link error:', error);
    return new Response(
      JSON.stringify({
        statusCode: 500,
        message: 'Failed to link bbauth account',
        error: error instanceof Error ? error.message : 'Unknown error',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

/**
 * Unlink bbauth account - POST /auth/bbauth/unlink
 */
export async function handleBbauthUnlink(
  request: Request,
  env: Env
): Promise<Response> {
  try {
    // Require existing service token
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({
          statusCode: 401,
          message: 'Missing or invalid authorization header',
          error: 'Unauthorized',
        }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // TODO: Verify service token, extract account ID, and remove bbauthAccountID

    return new Response(
      JSON.stringify({
        statusCode: 501,
        message: 'Unlink functionality not yet implemented',
        error: 'Not Implemented',
      }),
      { status: 501, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('bbauth unlink error:', error);
    return new Response(
      JSON.stringify({
        statusCode: 500,
        message: 'Failed to unlink bbauth account',
        error: error instanceof Error ? error.message : 'Unknown error',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

/**
 * Get bbauth account status - GET /auth/bbauth/status
 */
export async function handleBbauthStatus(
  request: Request,
  env: Env
): Promise<Response> {
  try {
    // Require existing service token
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({
          statusCode: 401,
          message: 'Missing or invalid authorization header',
          error: 'Unauthorized',
        }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // TODO: Verify service token, extract account ID, and check bbauth link status

    return new Response(
      JSON.stringify({
        statusCode: 501,
        message: 'Status check not yet implemented',
        error: 'Not Implemented',
      }),
      { status: 501, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('bbauth status error:', error);
    return new Response(
      JSON.stringify({
        statusCode: 500,
        message: 'Failed to check bbauth status',
        error: error instanceof Error ? error.message : 'Unknown error',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
