"""Verify contact write-path fix: POST /api/contact now writes to db.contacts
so admin inbox, dashboard, and audiences all see the data.
"""
import os
import uuid
import pytest
import requests

def _load_backend_url():
    url = os.environ.get("REACT_APP_BACKEND_URL")
    if not url:
        env_path = "/app/frontend/.env"
        if os.path.exists(env_path):
            with open(env_path) as f:
                for line in f:
                    if line.startswith("REACT_APP_BACKEND_URL="):
                        url = line.split("=", 1)[1].strip()
                        break
    assert url, "REACT_APP_BACKEND_URL not set"
    return url.rstrip("/")

BASE_URL = _load_backend_url()
ADMIN_EMAIL = "coaching@sunpreetsingh.com"
ADMIN_PASSWORD = "coaching@123"


@pytest.fixture(scope="module")
def admin_token():
    r = requests.post(f"{BASE_URL}/api/auth/login",
                      json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD}, timeout=20)
    assert r.status_code == 200, f"Admin login failed: {r.status_code} {r.text}"
    return r.json()["token"]


@pytest.fixture(scope="module")
def auth_headers(admin_token):
    return {"Authorization": f"Bearer {admin_token}"}


# --- Admin submissions inbox returns contacts ---
def test_admin_submissions_contact_has_data(auth_headers):
    r = requests.get(f"{BASE_URL}/api/admin/submissions?source=contact",
                     headers=auth_headers, timeout=20)
    assert r.status_code == 200, r.text
    data = r.json()
    items = data.get("items", data) if isinstance(data, dict) else data
    assert isinstance(items, list)
    assert len(items) >= 46, f"Expected >=46 contact rows after migration, got {len(items)}"
    sample = items[0]
    for k in ("id", "first_name", "email", "message", "submitted_at"):
        assert k in sample, f"Missing field {k} in sample: {sample}"
    # age field present (may be None, must be in schema)
    assert "age" in sample


# --- POST /api/contact persists and is immediately visible to admin ---
def test_post_contact_immediately_visible(auth_headers):
    before = requests.get(f"{BASE_URL}/api/admin/submissions?source=contact",
                          headers=auth_headers, timeout=20).json()
    before_items = before.get("items", before) if isinstance(before, dict) else before
    before_count = len(before_items)

    unique = f"TEST_{uuid.uuid4().hex[:10]}@example.com"
    payload = {
        "first_name": "TestContact",
        "email": unique,
        "phone": "+911234567890",
        "age": "29",
        "instagram": "@testcontact",
        "message": "Automated test contact submission - please ignore.",
        "source": "coaching",
    }
    r = requests.post(f"{BASE_URL}/api/contact", json=payload, timeout=30)
    assert r.status_code == 200, r.text
    body = r.json()
    assert body["email"] == unique
    assert body["age"] == "29"
    new_id = body["id"]

    after = requests.get(f"{BASE_URL}/api/admin/submissions?source=contact",
                         headers=auth_headers, timeout=20).json()
    after_items = after.get("items", after) if isinstance(after, dict) else after
    assert len(after_items) == before_count + 1, (
        f"Count should be +1 (was {before_count}, now {len(after_items)})"
    )
    found = next((i for i in after_items if i.get("id") == new_id), None)
    assert found is not None, "Newly created contact missing from admin inbox"
    assert found["email"] == unique
    assert found.get("age") == "29"


# --- Dashboard contacts_total is non-zero ---
def test_admin_dashboard_contacts_total(auth_headers):
    r = requests.get(f"{BASE_URL}/api/admin/dashboard",
                     headers=auth_headers, timeout=20)
    assert r.status_code == 200, r.text
    d = r.json()
    assert d.get("counts", {}).get("contacts_total", 0) >= 46, f"contacts_total={d.get('counts', {}).get('contacts_total')}"


# --- Audiences returns contacts array ---
def test_admin_audiences_has_contacts(auth_headers):
    r = requests.get(f"{BASE_URL}/api/admin/audiences",
                     headers=auth_headers, timeout=20)
    assert r.status_code == 200, r.text
    aud = r.json()
    segments = aud.get("segments", aud)
    assert "contacts" in segments
    assert isinstance(segments["contacts"], list)
    assert len(segments["contacts"]) > 0, "segments.contacts is empty"
    assert "email" in segments["contacts"][0]


# --- Regression: retreats content ---
def test_retreats_content_regression():
    r = requests.get(f"{BASE_URL}/api/content/retreats", timeout=20)
    assert r.status_code == 200
    data = r.json()
    retreats = data.get("data") if isinstance(data, dict) else data
    assert isinstance(retreats, list)
    assert len(retreats) == 2, f"Expected 2 retreats, got {len(retreats)}"
    statuses = {r.get("status") for r in retreats}
    assert "live" in statuses
    assert "coming_soon" in statuses
