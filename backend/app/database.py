from supabase import create_client, Client
from app.config import get_settings

settings = get_settings()


def get_supabase_client() -> Client:
    """Get Supabase client with anon key for user operations"""
    return create_client(settings.supabase_url, settings.supabase_key)


def get_supabase_admin_client() -> Client:
    """Get Supabase client with service role key for admin operations"""
    return create_client(settings.supabase_url, settings.supabase_service_key)


# Singleton instances
supabase:  Client = get_supabase_client()
supabase_admin: Client = get_supabase_admin_client()