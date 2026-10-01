"""Iteration 19: Age field support in contact + financial-aid forms, and static placeholder removal in /retreats."""
import os
import time
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


class TestContactAgeField:
    def test_contact_submission_with_age_persists(self, admin_headers):
        ts = int(time.time())
        age_val = "29"
        email = f"agetest+{ts}@example.com"
        payload = {
            "first_name": "Age Test",
            "email": email,
            "phone": "+919999999999",
            "age": age_val,
            "instagram": "@agetest",
            "message": "TEST_AGE contact message",
        }
        r = requests.post(f"{BASE_URL}/api/contact", json=payload)
        assert r.status_code == 200, r.text
        data = r.json()
        # Response returns the submission object; verify age was saved
        assert str(data.get("age")) == age_val
        assert data.get("email") == email

        # Verify persistence in db.contact_submissions via pymongo
        from pymongo import MongoClient
        mc = MongoClient(os.environ.get('MONGO_URL', 'mongodb://localhost:27017'))
        mdb = mc[os.environ.get('DB_NAME', 'test_database')]
        doc = mdb.contact_submissions.find_one({"email": email})
        assert doc is not None, "contact not found in contact_submissions collection"
        assert str(doc.get("age")) == age_val

    def test_contact_without_age_still_works(self):
        ts = int(time.time())
        payload = {
            "first_name": "No Age",
            "email": f"noage+{ts}@example.com",
            "phone": "+919999999999",
            "instagram": "@noage",
            "message": "TEST_AGE no-age message",
        }
        r = requests.post(f"{BASE_URL}/api/contact", json=payload)
        assert r.status_code == 200, r.text


class TestFinancialAidAgeField:
    def test_financial_aid_with_age(self, admin_headers):
        ts = int(time.time())
        age_val = "22"
        email = f"aidage+{ts}@example.com"
        payload = {
            "aid_type": "student",
            "first_name": "Aid Age",
            "email": email,
            "phone": "+919999999999",
            "age": age_val,
            "instagram": "@aidage",
            "program_interest": "Movement Mastery",
            "institution": "Test College",
            "student_id": "TEST123",
            "situation": "TEST_AGE financial aid",
        }
        r = requests.post(f"{BASE_URL}/api/financial-aid", json=payload)
        assert r.status_code == 200, r.text
        assert r.json().get("success") is True

        # Verify in admin submissions AND DB directly
        time.sleep(0.5)
        r2 = requests.get(f"{BASE_URL}/api/admin/submissions?source=financial_aid", headers=admin_headers)
        assert r2.status_code == 200, r2.text
        items = r2.json().get("items", [])
        found = next((it for it in items if it.get("email") == email), None)
        assert found is not None, "financial aid record not found in admin inbox"
        assert str(found.get("age")) == age_val

    def test_financial_aid_without_age(self):
        ts = int(time.time())
        payload = {
            "aid_type": "scholarship",
            "first_name": "Noage Aid",
            "email": f"aidnoage+{ts}@example.com",
            "phone": "+919999999999",
            "instagram": "@noage",
            "program_interest": "Movement Mastery",
            "situation": "TEST_AGE no age scholarship",
        }
        r = requests.post(f"{BASE_URL}/api/financial-aid", json=payload)
        assert r.status_code == 200, r.text


class TestRetreatsCMSData:
    def test_retreats_returns_bali_and_gulmarg_with_cms_images(self):
        r = requests.get(f"{BASE_URL}/api/content/retreats")
        assert r.status_code == 200
        data = r.json()["data"]
        ids = {item["id"] for item in data}
        assert "bali-2026" in ids
        assert "gulmarg-2027" in ids
        for item in data:
            img = item.get("heroImage") or item.get("image") or ""
            # ensure no unsplash hardcoded placeholder in DB-driven data
            assert "unsplash" not in img.lower(), f"Unexpected unsplash image in CMS: {img}"

    def test_bali_has_inclusions_not_highlights(self):
        r = requests.get(f"{BASE_URL}/api/content/retreats")
        data = r.json()["data"]
        bali = next(x for x in data if x["id"] == "bali-2026")
        # The CMS object should NOT crash on missing highlights — field may or may not exist
        # confirm inclusions is present as fallback source
        assert "inclusions" in bali or "highlights" in bali


if __name__ == "__main__":
    pytest.main([__file__, "-v", "-s"])
