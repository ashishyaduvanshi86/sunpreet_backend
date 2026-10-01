import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
const CACHE_TTL_MS = 60 * 1000; // 60 seconds (down from 5 min)
const cacheKey = (key) => `content_${key}`;
const eventName = (key) => `content-invalidated:${key}`;

/**
 * Imperatively invalidate the localStorage cache for a CMS key and
 * notify any mounted `useContent` hooks to refetch immediately.
 * Call this right after a successful admin PUT to /admin/content/{key}.
 */
export function invalidateContent(key) {
  try { localStorage.removeItem(cacheKey(key)); } catch (_) { /* noop */ }
  try { window.dispatchEvent(new CustomEvent(eventName(key))); } catch (_) { /* noop */ }
}

/**
 * Fetch admin-managed content with a short localStorage cache.
 * Listens for `content-invalidated:<key>` to refetch when admin saves.
 */
export function useContent(key, fallback = null) {
  const [data, setData] = useState(() => {
    try {
      const cached = JSON.parse(localStorage.getItem(cacheKey(key)) || 'null');
      if (cached && Date.now() - cached.ts < CACHE_TTL_MS) return cached.data;
    } catch (_) { /* noop */ }
    return fallback;
  });
  const [loading, setLoading] = useState(data === fallback);

  const refetch = useCallback(() => {
    let cancelled = false;
    axios.get(`${API}/content/${key}`)
      .then(res => {
        if (cancelled) return;
        const payload = res.data?.data ?? fallback;
        setData(payload);
        try {
          localStorage.setItem(cacheKey(key), JSON.stringify({ ts: Date.now(), data: payload }));
        } catch (_) { /* noop */ }
      })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [key]);

  useEffect(() => {
    const cleanup = refetch();
    const handler = () => refetch();
    window.addEventListener(eventName(key), handler);
    return () => {
      if (typeof cleanup === 'function') cleanup();
      window.removeEventListener(eventName(key), handler);
    };
  }, [key, refetch]);

  return { data, loading, refetch };
}
