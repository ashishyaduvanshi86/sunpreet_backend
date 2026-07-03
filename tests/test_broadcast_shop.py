"""
Tests for new admin features:
- GET /api/content/products (CMS products)
- GET /api/admin/audiences (broadcast segments + counts)
- Admin auth (login)
"""
import os
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://coaching-retreat-dev.preview.emergentagent.com").rstrip("/")
ADMIN_EMAIL = "coaching@sunpreetsingh.com"
ADMIN_PASSWORD = "coaching@123"

EXPECTED_PRODUCT_PRICES = {
    "handstand-canes": 7999,
    "fingerboard": 4999,
    "peg-board": 4999,
    "parallettes": 1799,
}


@pytest.fixture(scope="module")
def api():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


@pytest.fixture(scope="module")
def admin_token(api):
    r = api.post(f"{BASE_URL}/api/auth/login", json={
        "email": ADMIN_EMAIL,
        "password": ADMIN_PASSWORD,
    })
    assert r.status_code == 200, f"Login failed: {r.status_code} {r.text}"
    data = r.json()
    token = data.get("access_token") or data.get("token")
    assert token, f"No token in login response: {data}"
    return token


@pytest.fixture(scope="module")
def auth_headers(admin_token):
    return {"Authorization": f"Bearer {admin_token}"}


# --- CMS products endpoint ---
class TestContentProducts:
    def test_products_endpoint_returns_4(self, api):
        r = api.get(f"{BASE_URL}/api/content/products")
        assert r.status_code == 200, r.text
        data = r.json()
        # may be wrapped in {"data": [...]} or directly a list
        if isinstance(data, dict):
            products = data.get("data") or data.get("value") or data
        else:
            products = data
        assert isinstance(products, list), f"Unexpected shape: {data}"
        assert len(products) == 4, f"Expected 4 products, got {len(products)}: {[p.get('id') or p.get('slug') for p in products]}"

    def test_product_prices_are_integers(self, api):
        r = api.get(f"{BASE_URL}/api/content/products")
        data = r.json()
        if isinstance(data, dict):
            products = data.get("data") or data.get("value") or data
        else:
            products = data
        ids_seen = {}
        for p in products:
            pid = p.get("id") or p.get("slug")
            ids_seen[pid] = p
            assert "price" in p, f"Product {pid} missing price"
            assert isinstance(p["price"], int), f"Product {pid} price not int: {p['price']} ({type(p['price'])})"
        for pid, expected in EXPECTED_PRODUCT_PRICES.items():
            assert pid in ids_seen, f"Missing product id {pid}; have {list(ids_seen.keys())}"
            assert ids_seen[pid]["price"] == expected, f"{pid} expected {expected} got {ids_seen[pid]['price']}"


# --- Admin audiences endpoint ---
class TestAdminAudiences:
    def test_audiences_requires_auth(self, api):
        r = api.get(f"{BASE_URL}/api/admin/audiences")
        assert r.status_code in (401, 403), f"Expected unauth, got {r.status_code}"

    def test_audiences_returns_expected_shape(self, api, auth_headers):
        r = api.get(f"{BASE_URL}/api/admin/audiences", headers=auth_headers)
        assert r.status_code == 200, r.text
        data = r.json()
        assert "segments" in data, f"Missing 'segments': {data}"
        assert "counts" in data, f"Missing 'counts': {data}"
        expected_keys = {"contacts", "retreat_applicants", "financial_aid_applicants", "waitlist"}
        seg_keys = set(data["segments"].keys())
        cnt_keys = set(data["counts"].keys())
        assert expected_keys.issubset(seg_keys), f"segments missing keys: {expected_keys - seg_keys}"
        assert expected_keys.issubset(cnt_keys), f"counts missing keys: {expected_keys - cnt_keys}"
        # counts must be ints
        for k in expected_keys:
            assert isinstance(data["counts"][k], int), f"counts.{k} not int: {data['counts'][k]}"
            # segments should be lists of emails
            assert isinstance(data["segments"][k], list), f"segments.{k} not list"
            assert data["counts"][k] == len(data["segments"][k]), (
                f"counts.{k}={data['counts'][k]} but segments has {len(data['segments'][k])}"
            )


# --- Auth basic checks ---
class TestAuth:
    def test_login_success(self, api):
        r = api.post(f"{BASE_URL}/api/auth/login", json={
            "email": ADMIN_EMAIL, "password": ADMIN_PASSWORD,
        })
        assert r.status_code == 200
        body = r.json()
        assert body.get("access_token") or body.get("token")

    def test_login_wrong_password(self, api):
        r = api.post(f"{BASE_URL}/api/auth/login", json={
            "email": ADMIN_EMAIL, "password": "wrong-password",
        })
        assert r.status_code in (400, 401), f"Got {r.status_code}: {r.text}"
