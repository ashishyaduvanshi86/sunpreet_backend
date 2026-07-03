"""Tests for primary bug fix: rich programs CMS + P2 about/coaching fields."""
import os
import requests
import pytest

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL').rstrip('/')
ADMIN_EMAIL = "coaching@sunpreetsingh.com"
ADMIN_PASSWORD = "coaching@123"


@pytest.fixture(scope="module")
def admin_token():
    r = requests.post(f"{BASE_URL}/api/auth/login",
                      json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
    assert r.status_code == 200, f"login failed: {r.status_code} {r.text}"
    return r.json().get("access_token") or r.json().get("token")


@pytest.fixture(scope="module")
def auth_headers(admin_token):
    if not admin_token:
        pytest.skip("no admin token")
    return {"Authorization": f"Bearer {admin_token}"}


# === PROGRAMS rich content ===
class TestProgramsContent:
    def test_get_programs_returns_three(self):
        r = requests.get(f"{BASE_URL}/api/content/programs")
        assert r.status_code == 200
        data = r.json().get("data", [])
        assert len(data) == 3
        ids = {p["id"] for p in data}
        assert ids == {"foundations", "beginner", "intermediate"}

    def test_beginner_has_full_rich_fields(self):
        r = requests.get(f"{BASE_URL}/api/content/programs")
        progs = {p["id"]: p for p in r.json()["data"]}
        b = progs["beginner"]
        assert b["problem"]["headline"] == "Why Progress Stalls After the Basics"
        assert len(b["problem"]["points"]) == 4
        assert b["overview"]["headline"] == "What You'll Develop"
        assert len(b["overview"]["features"]) == 6
        assert len(b["testimonials"]) == 2
        assert b["testimonials"][0]["name"] == "Vikram"
        assert "text" in b["testimonials"][0]
        assert len(b["faq"]) == 11
        for f in b["faq"]:
            assert "q" in f and "a" in f
        # Card-tab extras
        assert b["status"] == "live"
        assert b["sessions"]
        assert b["setting"]
        assert isinstance(b["primaryFocus"], list) and len(b["primaryFocus"]) > 0

    def test_intermediate_faq_count(self):
        r = requests.get(f"{BASE_URL}/api/content/programs")
        progs = {p["id"]: p for p in r.json()["data"]}
        assert len(progs["intermediate"]["faq"]) == 9
        assert len(progs["foundations"]["faq"]) == 7


# === Admin Save Round-Trip ===
class TestAdminSaveRoundTrip:
    def test_programs_put_persists(self, auth_headers):
        # GET current
        cur = requests.get(f"{BASE_URL}/api/content/programs").json()["data"]
        original_tagline = next(p for p in cur if p["id"] == "beginner")["tagline"]
        sentinel = "TEST_ROUNDTRIP_TAGLINE"
        # Modify beginner tagline
        for p in cur:
            if p["id"] == "beginner":
                p["tagline"] = sentinel
        put = requests.put(f"{BASE_URL}/api/admin/content/programs",
                           headers=auth_headers, json={"data": cur})
        assert put.status_code == 200, put.text
        # Re-fetch
        after = requests.get(f"{BASE_URL}/api/content/programs").json()["data"]
        new_tagline = next(p for p in after if p["id"] == "beginner")["tagline"]
        assert new_tagline == sentinel
        # Verify rich faq still intact (no data loss)
        assert len(next(p for p in after if p["id"] == "beginner")["faq"]) == 11
        # Restore
        for p in after:
            if p["id"] == "beginner":
                p["tagline"] = original_tagline
        requests.put(f"{BASE_URL}/api/admin/content/programs",
                     headers=auth_headers, json={"data": after})


# === P2 About & Coaching ===
class TestAboutCoachingContent:
    def test_about_endpoint(self):
        r = requests.get(f"{BASE_URL}/api/content/about")
        assert r.status_code == 200
        # may be empty; UI uses fallbacks
        assert "data" in r.json()

    def test_coaching_endpoint(self):
        r = requests.get(f"{BASE_URL}/api/content/coaching")
        assert r.status_code == 200
        assert "data" in r.json()

    def test_about_put_round_trip(self, auth_headers):
        cur_resp = requests.get(f"{BASE_URL}/api/content/about").json()
        cur = cur_resp.get("data") or {}
        # capture original
        orig_phil = cur.get("philosophy", {}).copy() if isinstance(cur.get("philosophy"), dict) else None
        new_data = dict(cur) if isinstance(cur, dict) else {}
        new_data["philosophy"] = {**(new_data.get("philosophy") or {}),
                                  "headline": "TEST_PHILOSOPHY_HEADLINE"}
        put = requests.put(f"{BASE_URL}/api/admin/content/about",
                           headers=auth_headers, json={"data": new_data})
        assert put.status_code == 200, put.text
        after = requests.get(f"{BASE_URL}/api/content/about").json().get("data", {})
        assert after.get("philosophy", {}).get("headline") == "TEST_PHILOSOPHY_HEADLINE"
        # Restore
        restored = dict(after)
        if orig_phil is None:
            restored.pop("philosophy", None)
        else:
            restored["philosophy"] = orig_phil
        requests.put(f"{BASE_URL}/api/admin/content/about",
                     headers=auth_headers, json={"data": restored})
