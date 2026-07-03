"""Iteration 15: simplified programs schema (2 programs, no problem/overview/testimonials)."""
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


class TestProgramsSimplifiedSchema:
    def test_exactly_two_programs(self):
        r = requests.get(f"{BASE_URL}/api/content/programs")
        assert r.status_code == 200
        data = r.json()["data"]
        assert len(data) == 2
        ids = {p["id"] for p in data}
        assert ids == {"beginner", "intermediate"}

    def test_beginner_fields(self):
        r = requests.get(f"{BASE_URL}/api/content/programs")
        progs = {p["id"]: p for p in r.json()["data"]}
        b = progs["beginner"]
        assert b["price"] == "₹2999"
        assert b["duration"] == "4 Weeks"
        assert len(b["faq"]) == 12
        for f in b["faq"]:
            assert f.get("q") and f.get("a")
        assert len(b["primaryFocus"]) == 4
        assert len(b["bullets"]) == 5
        assert b["status"] == "live"
        assert "Beginner" in (b.get("name") or "") or "Beginner" in (b.get("level") or "")
        assert b.get("sessions")
        assert b.get("setting")

    def test_intermediate_fields(self):
        r = requests.get(f"{BASE_URL}/api/content/programs")
        progs = {p["id"]: p for p in r.json()["data"]}
        m = progs["intermediate"]
        assert m["price"] == "₹2999"
        assert m["duration"] == "4 Weeks"
        assert len(m["faq"]) == 10
        assert len(m["primaryFocus"]) == 4
        assert len(m["bullets"]) == 5

    def test_no_removed_sections(self):
        """Per user request, problem/overview/testimonials must be removed."""
        r = requests.get(f"{BASE_URL}/api/content/programs")
        for p in r.json()["data"]:
            # These may not exist in the document at all, or may exist as
            # leftover empty dicts. Tolerate absence; flag if they have data.
            assert not (p.get("problem") and p["problem"].get("points")), f"{p['id']} still has problem.points"
            assert not (p.get("overview") and p["overview"].get("features")), f"{p['id']} still has overview.features"
            assert not p.get("testimonials"), f"{p['id']} still has testimonials"


class TestAdminRoundTrip:
    def test_programs_put_persists_and_keeps_faq(self, auth_headers):
        cur = requests.get(f"{BASE_URL}/api/content/programs").json()["data"]
        original_tagline = next(p for p in cur if p["id"] == "beginner").get("tagline")
        sentinel = "TEST_V15_TAGLINE"
        for p in cur:
            if p["id"] == "beginner":
                p["tagline"] = sentinel
        put = requests.put(f"{BASE_URL}/api/admin/content/programs",
                           headers=auth_headers, json={"data": cur})
        assert put.status_code == 200, put.text
        after = requests.get(f"{BASE_URL}/api/content/programs").json()["data"]
        b = next(p for p in after if p["id"] == "beginner")
        assert b["tagline"] == sentinel
        assert len(b["faq"]) == 12  # No data loss
        assert b["price"] == "₹2999"
        # restore
        for p in after:
            if p["id"] == "beginner":
                p["tagline"] = original_tagline
        requests.put(f"{BASE_URL}/api/admin/content/programs",
                     headers=auth_headers, json={"data": after})


class TestRegression:
    def test_shop_products_still_4(self):
        r = requests.get(f"{BASE_URL}/api/content/products")
        assert r.status_code == 200
        assert len(r.json()["data"]) == 4

    def test_retreats_endpoint(self):
        r = requests.get(f"{BASE_URL}/api/content/retreats")
        assert r.status_code == 200

    def test_about_endpoint(self):
        r = requests.get(f"{BASE_URL}/api/content/about")
        assert r.status_code == 200

    def test_coaching_endpoint(self):
        r = requests.get(f"{BASE_URL}/api/content/coaching")
        assert r.status_code == 200
