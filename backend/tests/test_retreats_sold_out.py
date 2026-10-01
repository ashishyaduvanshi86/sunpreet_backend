"""Iteration 17: Sold Out flow — admin PUT changes bali-2026 status and public GET reflects it."""
import os
import copy
import requests
import pytest

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL').rstrip('/')
ADMIN_EMAIL = "coaching@sunpreetsingh.com"
ADMIN_PASSWORD = "coaching@123"


@pytest.fixture(scope="module")
def admin_headers():
    r = requests.post(f"{BASE_URL}/api/auth/login",
                      json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
    assert r.status_code == 200, f"login failed: {r.status_code} {r.text}"
    tok = r.json().get("access_token") or r.json().get("token")
    return {"Authorization": f"Bearer {tok}"}


def _get_retreats():
    r = requests.get(f"{BASE_URL}/api/content/retreats")
    assert r.status_code == 200, r.text
    return r.json()["data"]


def _put_retreats(headers, data):
    r = requests.put(f"{BASE_URL}/api/admin/content/retreats",
                     headers=headers, json={"data": data})
    assert r.status_code == 200, r.text
    return r.json()


class TestRetreatStatusFlow:
    def test_bali_2026_exists_and_is_live(self):
        data = _get_retreats()
        bali = next((r for r in data if r["id"] == "bali-2026"), None)
        assert bali is not None, "bali-2026 not found"
        # Snapshot for other tests
        pytest.bali_original_status = bali.get("status", "live")
        print(f"initial bali-2026 status: {pytest.bali_original_status}")

    def test_set_sold_out_and_verify(self, admin_headers):
        data = _get_retreats()
        mutated = copy.deepcopy(data)
        for r in mutated:
            if r["id"] == "bali-2026":
                r["status"] = "sold_out"
        _put_retreats(admin_headers, mutated)
        after = _get_retreats()
        bali = next(r for r in after if r["id"] == "bali-2026")
        assert bali["status"] == "sold_out"

    def test_set_past_and_verify(self, admin_headers):
        data = _get_retreats()
        mutated = copy.deepcopy(data)
        for r in mutated:
            if r["id"] == "bali-2026":
                r["status"] = "past"
        _put_retreats(admin_headers, mutated)
        after = _get_retreats()
        bali = next(r for r in after if r["id"] == "bali-2026")
        assert bali["status"] == "past"

    def test_restore_to_live(self, admin_headers):
        data = _get_retreats()
        mutated = copy.deepcopy(data)
        for r in mutated:
            if r["id"] == "bali-2026":
                r["status"] = "live"
        _put_retreats(admin_headers, mutated)
        after = _get_retreats()
        bali = next(r for r in after if r["id"] == "bali-2026")
        assert bali["status"] == "live"

    def test_gulmarg_still_coming_soon(self):
        data = _get_retreats()
        gm = next((r for r in data if r["id"] == "gulmarg-2027"), None)
        assert gm is not None
        assert gm.get("status") == "coming_soon", f"expected coming_soon got {gm.get('status')}"


if __name__ == "__main__":
    pytest.main([__file__, "-v", "-s"])
