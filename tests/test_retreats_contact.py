"""
Backend API tests for Retreats page contact form submissions
Tests the /api/contact endpoint used by Apply Now and Enquire Now forms
"""
import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')


class TestContactEndpoint:
    """Tests for /api/contact endpoint - used by retreat application and enquiry forms"""
    
    def test_retreat_application_submission(self):
        """Test retreat application form submission (Apply Now modal)"""
        payload = {
            "first_name": "TEST_RetreatApplicant",
            "email": "test_retreat@example.com",
            "phone": "+91 98765 43210",
            "message": "RETREAT APPLICATION for Bali Movement Camp\nDate: 1st – 7th September 2026\nLocation: Bali, Indonesia\n\nI am interested in joining the retreat."
        }
        
        response = requests.post(f"{BASE_URL}/api/contact", json=payload)
        
        # Status code assertion
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        
        # Data assertions
        data = response.json()
        assert "id" in data, "Response should contain 'id'"
        assert data["first_name"] == payload["first_name"], "first_name should match"
        assert data["email"] == payload["email"], "email should match"
        assert data["phone"] == payload["phone"], "phone should match"
        assert "RETREAT APPLICATION" in data["message"], "message should contain retreat application prefix"
        assert "submitted_at" in data, "Response should contain 'submitted_at'"
        assert "email_sent" in data, "Response should contain 'email_sent'"
        
        print(f"✓ Retreat application submitted successfully with ID: {data['id']}")
    
    def test_private_retreat_enquiry_submission(self):
        """Test private/corporate retreat enquiry form submission (Enquire Now modal)"""
        payload = {
            "first_name": "TEST_CorporateEnquiry",
            "email": "corporate@example.com",
            "phone": "+91 12345 67890",
            "message": "PRIVATE/CORPORATE RETREAT ENQUIRY\n\nWe are interested in a corporate retreat for 25 people in Goa."
        }
        
        response = requests.post(f"{BASE_URL}/api/contact", json=payload)
        
        # Status code assertion
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        
        # Data assertions
        data = response.json()
        assert "id" in data, "Response should contain 'id'"
        assert data["first_name"] == payload["first_name"], "first_name should match"
        assert data["email"] == payload["email"], "email should match"
        assert "PRIVATE/CORPORATE RETREAT ENQUIRY" in data["message"], "message should contain enquiry prefix"
        
        print(f"✓ Corporate enquiry submitted successfully with ID: {data['id']}")
    
    def test_contact_form_required_fields(self):
        """Test that required fields are validated"""
        # Missing email
        payload = {
            "first_name": "TEST_MissingEmail",
            "message": "Test message"
        }
        
        response = requests.post(f"{BASE_URL}/api/contact", json=payload)
        
        # Should fail validation (422 Unprocessable Entity)
        assert response.status_code == 422, f"Expected 422 for missing email, got {response.status_code}"
        print("✓ Missing email validation works correctly")
    
    def test_contact_form_invalid_email(self):
        """Test that invalid email format is rejected"""
        payload = {
            "first_name": "TEST_InvalidEmail",
            "email": "not-an-email",
            "message": "Test message"
        }
        
        response = requests.post(f"{BASE_URL}/api/contact", json=payload)
        
        # Should fail validation (422 Unprocessable Entity)
        assert response.status_code == 422, f"Expected 422 for invalid email, got {response.status_code}"
        print("✓ Invalid email validation works correctly")
    
    def test_contact_form_optional_fields(self):
        """Test that optional fields (phone, preferred_date, preferred_time) can be null"""
        payload = {
            "first_name": "TEST_OptionalFields",
            "email": "optional@example.com",
            "message": "Test message with no optional fields"
        }
        
        response = requests.post(f"{BASE_URL}/api/contact", json=payload)
        
        # Status code assertion
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        
        # Data assertions
        data = response.json()
        assert data["phone"] is None, "phone should be null when not provided"
        assert data["preferred_date"] is None, "preferred_date should be null when not provided"
        assert data["preferred_time"] is None, "preferred_time should be null when not provided"
        
        print("✓ Optional fields handled correctly")


class TestRetreatsEndpoint:
    """Tests for /api/retreats endpoint"""
    
    def test_get_retreats(self):
        """Test fetching retreats list"""
        response = requests.get(f"{BASE_URL}/api/retreats")
        
        # Status code assertion
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        
        # Data assertions
        data = response.json()
        assert isinstance(data, list), "Response should be a list"
        assert len(data) > 0, "Should return at least one retreat"
        
        # Check retreat structure
        retreat = data[0]
        assert "id" in retreat, "Retreat should have 'id'"
        assert "title" in retreat, "Retreat should have 'title'"
        assert "location" in retreat, "Retreat should have 'location'"
        assert "date" in retreat, "Retreat should have 'date'"
        assert "images" in retreat, "Retreat should have 'images'"
        
        print(f"✓ Retreats endpoint returned {len(data)} retreats")


class TestTestimonialsEndpoint:
    """Tests for /api/testimonials endpoint"""
    
    def test_get_testimonials(self):
        """Test fetching testimonials list"""
        response = requests.get(f"{BASE_URL}/api/testimonials")
        
        # Status code assertion
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        
        # Data assertions
        data = response.json()
        assert isinstance(data, list), "Response should be a list"
        assert len(data) > 0, "Should return at least one testimonial"
        
        # Check testimonial structure
        testimonial = data[0]
        assert "id" in testimonial, "Testimonial should have 'id'"
        assert "name" in testimonial, "Testimonial should have 'name'"
        assert "content" in testimonial, "Testimonial should have 'content'"
        
        print(f"✓ Testimonials endpoint returned {len(data)} testimonials")


class TestHealthEndpoint:
    """Tests for API health check"""
    
    def test_api_root(self):
        """Test API root endpoint"""
        response = requests.get(f"{BASE_URL}/api/")
        
        # Status code assertion
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        
        # Data assertions
        data = response.json()
        assert "message" in data, "Response should contain 'message'"
        
        print("✓ API root endpoint is healthy")


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
