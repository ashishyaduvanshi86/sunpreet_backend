"""Backend tests for content endpoints (about, coaching, testimonials) + regressions."""
import os
import pytest
import requests

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', 'https://coaching-retreat-dev.preview.emergentagent.com').rstrip('/')
ADMIN_EMAIL = 'coaching@sunpreetsingh.com'
ADMIN_PASS = 'coaching@123'


@pytest.fixture(scope='module')
def admin_token():
    r = requests.post(f"{BASE_URL}/api/auth/login", json={'email': ADMIN_EMAIL, 'password': ADMIN_PASS}, timeout=30)
    assert r.status_code == 200, f"login failed: {r.status_code} {r.text}"
    return r.json().get('access_token') or r.json().get('token')


# Content endpoints
@pytest.mark.parametrize('key', ['about', 'coaching', 'testimonials', 'programs'])
def test_get_content_shape(key):
    r = requests.get(f"{BASE_URL}/api/content/{key}", timeout=30)
    assert r.status_code == 200, f"{key} -> {r.status_code} {r.text}"
    body = r.json()
    assert 'key' in body and body['key'] == key
    assert 'data' in body
    assert 'updated_at' in body


# Regression: products
def test_get_content_products():
    r = requests.get(f"{BASE_URL}/api/content/products", timeout=30)
    assert r.status_code == 200
    body = r.json()
    assert body.get('key') == 'products'
    data = body.get('data')
    assert isinstance(data, list) and len(data) >= 4
    for p in data:
        assert isinstance(p.get('price'), int), f"price must be int, got {p.get('price')} ({type(p.get('price'))})"


# Regression: admin audiences requires auth
def test_admin_audiences_unauth():
    r = requests.get(f"{BASE_URL}/api/admin/audiences", timeout=30)
    assert r.status_code in (401, 403)


def test_admin_audiences_authed(admin_token):
    r = requests.get(f"{BASE_URL}/api/admin/audiences", headers={'Authorization': f'Bearer {admin_token}'}, timeout=30)
    assert r.status_code == 200
    body = r.json()
    assert 'segments' in body and 'counts' in body
    for k in ['contacts', 'retreat_applicants', 'financial_aid_applicants', 'waitlist']:
        assert k in body['segments']
        assert k in body['counts']
        assert body['counts'][k] == len(body['segments'][k])


# Admin can save About hero_title and round-trip
def test_admin_save_about_roundtrip(admin_token):
    headers = {'Authorization': f'Bearer {admin_token}'}
    # Fetch current
    r0 = requests.get(f"{BASE_URL}/api/content/about", timeout=30)
    assert r0.status_code == 200
    original = r0.json().get('data') or {}

    new_data = {**(original if isinstance(original, dict) else {}), 'hero_title': 'TEST_I am Sunpreet Singh.'}
    # Try PUT first then POST
    saved = False
    for method in ('put', 'post'):
        rs = getattr(requests, method)(f"{BASE_URL}/api/admin/content/about", json={'data': new_data}, headers=headers, timeout=30)
        if rs.status_code in (200, 201):
            saved = True
            break
    assert saved, f"could not save admin content (last status {rs.status_code} body {rs.text[:200]})"

    r1 = requests.get(f"{BASE_URL}/api/content/about", timeout=30)
    assert r1.status_code == 200
    persisted = r1.json().get('data') or {}
    assert persisted.get('hero_title') == 'TEST_I am Sunpreet Singh.'

    # Restore
    if isinstance(original, dict) and 'hero_title' in original:
        restore = original
    else:
        restore = {**new_data}
        restore.pop('hero_title', None)
    for method in ('put', 'post'):
        rr = getattr(requests, method)(f"{BASE_URL}/api/admin/content/about", json={'data': restore}, headers=headers, timeout=30)
        if rr.status_code in (200, 201):
            break
