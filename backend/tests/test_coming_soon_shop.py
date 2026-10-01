"""
Backend API Tests for Coming Soon Shop Features
Tests: Product Stock API, Notify Me API, Contact Form API
"""
import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

# Product IDs for testing
PRODUCT_IDS = ['handstand-canes', 'fingerboard', 'peg-board', 'parallettes']


class TestProductStockAPI:
    """Tests for GET /api/products/stock endpoint"""
    
    def test_get_products_stock_returns_200(self):
        """Test that stock endpoint returns 200 OK"""
        response = requests.get(f"{BASE_URL}/api/products/stock")
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        print("✓ GET /api/products/stock returns 200")
    
    def test_get_products_stock_returns_all_products(self):
        """Test that all 4 products are returned"""
        response = requests.get(f"{BASE_URL}/api/products/stock")
        data = response.json()
        
        assert len(data) == 4, f"Expected 4 products, got {len(data)}"
        for pid in PRODUCT_IDS:
            assert pid in data, f"Product {pid} not found in response"
        print("✓ All 4 products returned in stock response")
    
    def test_products_have_coming_soon_true(self):
        """Test that all products have coming_soon: true"""
        response = requests.get(f"{BASE_URL}/api/products/stock")
        data = response.json()
        
        for pid in PRODUCT_IDS:
            assert data[pid]['coming_soon'] == True, f"Product {pid} should have coming_soon=True"
        print("✓ All products have coming_soon: true")
    
    def test_products_have_stock_20(self):
        """Test that all products have stock: 20"""
        response = requests.get(f"{BASE_URL}/api/products/stock")
        data = response.json()
        
        for pid in PRODUCT_IDS:
            assert data[pid]['stock'] == 20, f"Product {pid} should have stock=20, got {data[pid]['stock']}"
            assert data[pid]['total_stock'] == 20, f"Product {pid} should have total_stock=20"
        print("✓ All products have stock: 20 and total_stock: 20")
    
    def test_stock_response_structure(self):
        """Test that each product has correct structure"""
        response = requests.get(f"{BASE_URL}/api/products/stock")
        data = response.json()
        
        for pid in PRODUCT_IDS:
            product = data[pid]
            assert 'coming_soon' in product, f"Product {pid} missing 'coming_soon' field"
            assert 'stock' in product, f"Product {pid} missing 'stock' field"
            assert 'total_stock' in product, f"Product {pid} missing 'total_stock' field"
            assert isinstance(product['coming_soon'], bool), "coming_soon should be boolean"
            assert isinstance(product['stock'], int), "stock should be integer"
            assert isinstance(product['total_stock'], int), "total_stock should be integer"
        print("✓ Stock response has correct structure for all products")


class TestNotifyMeAPI:
    """Tests for POST /api/products/notify endpoint"""
    
    def test_notify_valid_email_and_product(self):
        """Test successful notification subscription"""
        unique_email = f"test_notify_{os.urandom(4).hex()}@example.com"
        response = requests.post(
            f"{BASE_URL}/api/products/notify",
            json={"email": unique_email, "product_id": "parallettes"}
        )
        
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        data = response.json()
        assert data['success'] == True, "Expected success=True"
        assert "notified" in data['message'].lower() or "available" in data['message'].lower(), \
            f"Unexpected message: {data['message']}"
        print(f"✓ Notify subscription successful for {unique_email}")
    
    def test_notify_duplicate_email_returns_already_subscribed(self):
        """Test that duplicate subscription returns appropriate message"""
        test_email = "test_duplicate_check@example.com"
        
        # First subscription
        requests.post(
            f"{BASE_URL}/api/products/notify",
            json={"email": test_email, "product_id": "handstand-canes"}
        )
        
        # Second subscription (duplicate)
        response = requests.post(
            f"{BASE_URL}/api/products/notify",
            json={"email": test_email, "product_id": "handstand-canes"}
        )
        
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        data = response.json()
        assert data['success'] == True, "Expected success=True even for duplicate"
        assert "already" in data['message'].lower(), f"Expected 'already' in message, got: {data['message']}"
        print("✓ Duplicate subscription handled correctly")
    
    def test_notify_invalid_product_id_returns_400(self):
        """Test that invalid product ID returns 400 error"""
        response = requests.post(
            f"{BASE_URL}/api/products/notify",
            json={"email": "test@example.com", "product_id": "invalid-product-xyz"}
        )
        
        assert response.status_code == 400, f"Expected 400, got {response.status_code}"
        data = response.json()
        assert "invalid" in data['detail'].lower(), f"Expected 'invalid' in error, got: {data['detail']}"
        print("✓ Invalid product ID returns 400 error")
    
    def test_notify_invalid_email_format_returns_422(self):
        """Test that invalid email format returns validation error"""
        response = requests.post(
            f"{BASE_URL}/api/products/notify",
            json={"email": "not-an-email", "product_id": "parallettes"}
        )
        
        assert response.status_code == 422, f"Expected 422 for invalid email, got {response.status_code}"
        print("✓ Invalid email format returns 422 validation error")
    
    def test_notify_missing_email_returns_422(self):
        """Test that missing email returns validation error"""
        response = requests.post(
            f"{BASE_URL}/api/products/notify",
            json={"product_id": "parallettes"}
        )
        
        assert response.status_code == 422, f"Expected 422 for missing email, got {response.status_code}"
        print("✓ Missing email returns 422 validation error")
    
    def test_notify_missing_product_id_returns_422(self):
        """Test that missing product_id returns validation error"""
        response = requests.post(
            f"{BASE_URL}/api/products/notify",
            json={"email": "test@example.com"}
        )
        
        assert response.status_code == 422, f"Expected 422 for missing product_id, got {response.status_code}"
        print("✓ Missing product_id returns 422 validation error")
    
    def test_notify_all_valid_product_ids(self):
        """Test notification works for all valid product IDs"""
        for pid in PRODUCT_IDS:
            unique_email = f"test_{pid}_{os.urandom(4).hex()}@example.com"
            response = requests.post(
                f"{BASE_URL}/api/products/notify",
                json={"email": unique_email, "product_id": pid}
            )
            assert response.status_code == 200, f"Failed for product {pid}: {response.status_code}"
            data = response.json()
            assert data['success'] == True, f"Expected success=True for {pid}"
        print("✓ Notify works for all 4 product IDs")


class TestContactFormAPI:
    """Tests for POST /api/contact endpoint"""
    
    def test_contact_form_success(self):
        """Test successful contact form submission"""
        response = requests.post(
            f"{BASE_URL}/api/contact",
            json={
                "first_name": "Test User",
                "email": f"test_contact_{os.urandom(4).hex()}@example.com",
                "phone": "9876543210",
                "instagram": "@testuser",
                "message": "This is a test message from automated testing."
            }
        )
        
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        data = response.json()
        assert 'id' in data, "Response should contain 'id'"
        assert data['first_name'] == "Test User", "first_name mismatch"
        assert 'submitted_at' in data, "Response should contain 'submitted_at'"
        assert 'email_sent' in data, "Response should contain 'email_sent'"
        print("✓ Contact form submission successful")
    
    def test_contact_form_without_instagram(self):
        """Test contact form works without optional instagram field"""
        response = requests.post(
            f"{BASE_URL}/api/contact",
            json={
                "first_name": "No Instagram User",
                "email": f"test_no_ig_{os.urandom(4).hex()}@example.com",
                "phone": "1234567890",
                "message": "Test message without Instagram handle."
            }
        )
        
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        data = response.json()
        assert data['instagram'] is None or data['instagram'] == "", "Instagram should be null/empty"
        print("✓ Contact form works without optional instagram field")
    
    def test_contact_form_invalid_email_returns_422(self):
        """Test that invalid email returns validation error"""
        response = requests.post(
            f"{BASE_URL}/api/contact",
            json={
                "first_name": "Test",
                "email": "invalid-email",
                "phone": "1234567890",
                "message": "Test"
            }
        )
        
        assert response.status_code == 422, f"Expected 422, got {response.status_code}"
        print("✓ Invalid email in contact form returns 422")
    
    def test_contact_form_missing_required_fields(self):
        """Test that missing required fields return validation error"""
        # Missing first_name
        response = requests.post(
            f"{BASE_URL}/api/contact",
            json={
                "email": "test@example.com",
                "phone": "1234567890",
                "message": "Test"
            }
        )
        assert response.status_code == 422, f"Expected 422 for missing first_name, got {response.status_code}"
        
        # Missing message
        response = requests.post(
            f"{BASE_URL}/api/contact",
            json={
                "first_name": "Test",
                "email": "test@example.com",
                "phone": "1234567890"
            }
        )
        assert response.status_code == 422, f"Expected 422 for missing message, got {response.status_code}"
        print("✓ Missing required fields return 422 validation error")


class TestAPIHealth:
    """Basic API health checks"""
    
    def test_api_root_returns_200(self):
        """Test that API root endpoint is accessible"""
        response = requests.get(f"{BASE_URL}/api/")
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        data = response.json()
        assert 'message' in data, "Root should return a message"
        print("✓ API root endpoint accessible")
    
    def test_retreats_endpoint_returns_200(self):
        """Test that retreats endpoint is accessible"""
        response = requests.get(f"{BASE_URL}/api/retreats")
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        data = response.json()
        assert isinstance(data, list), "Retreats should return a list"
        print("✓ Retreats endpoint accessible")
    
    def test_testimonials_endpoint_returns_200(self):
        """Test that testimonials endpoint is accessible"""
        response = requests.get(f"{BASE_URL}/api/testimonials")
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        data = response.json()
        assert isinstance(data, list), "Testimonials should return a list"
        print("✓ Testimonials endpoint accessible")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
