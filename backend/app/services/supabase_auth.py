"""
Supabase JWT verification for Flask backend.

How it works:
  1. Frontend → Supabase Auth → gets JWT (access_token)
  2. Frontend sends: Authorization: Bearer <supabase_jwt>
  3. Backend verifies JWT — tries HS256 first, then ES256 via JWKS
  4. Extracts user UUID (sub claim) as user_id
"""

import os
import jwt as pyjwt
from jwt import PyJWKClient
from functools import wraps
from flask import request, jsonify, current_app

# Cache JWKS client so we don't fetch on every request
_jwks_client = None

def _get_jwks_client():
    global _jwks_client
    if _jwks_client is None:
        supabase_url = os.environ.get('SUPABASE_URL', '')
        if supabase_url:
            _jwks_client = PyJWKClient(f"{supabase_url}/auth/v1/.well-known/jwks.json")
    return _jwks_client


def get_user_id_from_request() -> str | None:
    """Extract Supabase user UUID from the Authorization header JWT.
    Tries HS256 first (legacy), then ES256 via JWKS (new Supabase tokens).
    """
    auth_header = request.headers.get('Authorization', '')
    if not auth_header.startswith('Bearer '):
        return None

    token = auth_header.split(' ', 1)[1]

    # ── Try HS256 first (legacy secret-based) ────────────────────────────────
    try:
        jwt_secret = current_app.config.get('SUPABASE_JWT_SECRET', '')
        if jwt_secret:
            payload = pyjwt.decode(
                token,
                jwt_secret,
                algorithms=['HS256'],
                options={'verify_aud': False},
            )
            return payload.get('sub')
    except pyjwt.ExpiredSignatureError:
        print("JWT Expired")
        return None
    except pyjwt.InvalidTokenError:
        pass  # Fall through to ES256 JWKS verification
    except Exception as e:
        print(f"HS256 error: {e}")

    # ── Try ES256 via JWKS (new Supabase tokens) ─────────────────────────────
    try:
        jwks_client = _get_jwks_client()
        if jwks_client:
            signing_key = jwks_client.get_signing_key_from_jwt(token)
            payload = pyjwt.decode(
                token,
                signing_key.key,
                algorithms=['ES256', 'RS256'],
                options={'verify_aud': False},
            )
            return payload.get('sub')
    except pyjwt.ExpiredSignatureError:
        print("JWT Expired (ES256)")
        return None
    except Exception as e:
        print(f"ES256/JWKS error: {e}")

    return None


def supabase_required(f):
    """Decorator — returns 401 if no valid Supabase JWT present."""
    @wraps(f)
    def decorated(*args, **kwargs):
        user_id = get_user_id_from_request()
        if not user_id:
            return jsonify({'message': 'Authentication required. Please log in.'}), 401
        return f(*args, **kwargs)
    return decorated
