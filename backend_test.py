#!/usr/bin/env python3
"""
Backend API Testing for Sunpreet Coaching Website
Tests all endpoints including contact form, retreats, and testimonials
"""

import requests
import json
import sys
from datetime import datetime, timedelta


class SunpreetAPITester:
    def __init__(self, base_url="https://coaching-retreat-dev.preview.emergentagent.com/api"):
        self.base_url = base_url
        self.tests_run = 0
        self.tests_passed = 0
        self.test_results = {}

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None):
        """Run a single API test"""
        url = f"{self.base_url}{endpoint}"
        if headers is None:
            headers = {'Content-Type': 'application/json'}

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=10)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=headers, timeout=10)
            elif method == 'DELETE':
                response = requests.delete(url, headers=headers, timeout=10)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ PASSED - Status: {response.status_code}")
                try:
                    response_data = response.json()
                    print(f"   Response: {json.dumps(response_data, indent=2)[:200]}...")
                except:
                    print(f"   Response: {response.text[:200]}...")
            else:
                print(f"❌ FAILED - Expected {expected_status}, got {response.status_code}")
                print(f"   Response: {response.text}")

            self.test_results[name] = {
                'success': success,
                'status_code': response.status_code,
                'expected_status': expected_status,
                'response_preview': response.text[:200]
            }

            return success, response.json() if success and response.headers.get('content-type', '').startswith('application/json') else response.text

        except Exception as e:
            print(f"❌ FAILED - Error: {str(e)}")
            self.test_results[name] = {
                'success': False,
                'error': str(e)
            }
            return False, {}

    def test_api_root(self):
        """Test API root endpoint"""
        return self.run_test(
            "API Root",
            "GET",
            "/",
            200
        )

    def test_get_testimonials(self):
        """Test testimonials endpoint"""
        success, data = self.run_test(
            "Get Testimonials",
            "GET",
            "/testimonials",
            200
        )
        
        if success and isinstance(data, list) and len(data) > 0:
            print(f"   Found {len(data)} testimonials")
            # Check structure of first testimonial
            if 'name' in data[0] and 'content' in data[0]:
                print("   ✓ Testimonial structure looks correct")
            else:
                print("   ⚠️  Testimonial structure might be incomplete")
        
        return success, data

    def test_get_retreats(self):
        """Test retreats endpoint"""
        success, data = self.run_test(
            "Get Retreats",
            "GET",
            "/retreats",
            200
        )
        
        if success and isinstance(data, list) and len(data) > 0:
            print(f"   Found {len(data)} retreats")
            # Check structure of first retreat
            if 'title' in data[0] and 'images' in data[0]:
                print("   ✓ Retreat structure looks correct")
                print(f"   First retreat has {len(data[0]['images'])} images")
            else:
                print("   ⚠️  Retreat structure might be incomplete")
        
        return success, data

    def test_contact_form_valid(self):
        """Test contact form with valid data"""
        future_date = (datetime.now() + timedelta(days=7)).strftime('%Y-%m-%d')
        
        test_data = {
            "first_name": "Test User",
            "email": "test@example.com",
            "phone": "+91 9876543210",
            "message": "This is a test message for coaching inquiry. I would like to know more about your programs.",
            "preferred_date": future_date,
            "preferred_time": "10:00 AM"
        }
        
        success, data = self.run_test(
            "Contact Form (Valid)",
            "POST",
            "/contact",
            200,
            test_data
        )
        
        if success and isinstance(data, dict):
            if 'id' in data and 'email_sent' in data:
                print("   ✓ Contact form response structure looks correct")
                print(f"   Email sent status: {data.get('email_sent', 'unknown')}")
            else:
                print("   ⚠️  Contact form response structure incomplete")
        
        return success, data

    def test_contact_form_minimal(self):
        """Test contact form with minimal required data"""
        test_data = {
            "first_name": "Jane Doe",
            "email": "jane@example.com",
            "message": "Interested in 1:1 coaching sessions."
        }
        
        return self.run_test(
            "Contact Form (Minimal)",
            "POST",
            "/contact",
            200,
            test_data
        )

    def test_contact_form_invalid(self):
        """Test contact form with invalid data"""
        test_data = {
            "first_name": "Test",
            "email": "invalid-email",  # Invalid email format
            "message": "Test message"
        }
        
        # This should fail validation (422 or 400)
        return self.run_test(
            "Contact Form (Invalid Email)",
            "POST",
            "/contact",
            422,
            test_data
        )

    def test_status_endpoints(self):
        """Test status check endpoints"""
        # Test POST status
        test_data = {
            "client_name": "API Test Client"
        }
        
        success1, _ = self.run_test(
            "Create Status Check",
            "POST",
            "/status",
            200,
            test_data
        )
        
        # Test GET status
        success2, _ = self.run_test(
            "Get Status Checks",
            "GET",
            "/status",
            200
        )
        
        return success1 and success2

    def run_all_tests(self):
        """Run complete backend test suite"""
        print("🚀 Starting Sunpreet Coaching Backend API Tests")
        print(f"📡 Testing API at: {self.base_url}")
        print("=" * 60)
        
        # Test API root
        self.test_api_root()
        
        # Test data endpoints
        self.test_get_testimonials()
        self.test_get_retreats()
        
        # Test contact form
        self.test_contact_form_valid()
        self.test_contact_form_minimal()
        self.test_contact_form_invalid()
        
        # Test status endpoints
        self.test_status_endpoints()
        
        # Print summary
        print("\n" + "=" * 60)
        print(f"📊 TEST SUMMARY")
        print(f"Tests Run: {self.tests_run}")
        print(f"Tests Passed: {self.tests_passed}")
        print(f"Success Rate: {(self.tests_passed/self.tests_run*100):.1f}%")
        
        if self.tests_passed == self.tests_run:
            print("🎉 All tests passed!")
            return True
        else:
            print("❌ Some tests failed")
            # Print failed tests
            print("\nFailed Tests:")
            for test_name, result in self.test_results.items():
                if not result.get('success', False):
                    error_msg = result.get('error', f'Status {result.get("status_code", "unknown")}')
                    print(f"  - {test_name}: {error_msg}")
            
            return False


def main():
    """Main test execution"""
    tester = SunpreetAPITester()
    all_passed = tester.run_all_tests()
    
    # Save test results to file
    with open('/app/backend_test_results.json', 'w') as f:
        json.dump({
            'timestamp': datetime.now().isoformat(),
            'tests_run': tester.tests_run,
            'tests_passed': tester.tests_passed,
            'success_rate': tester.tests_passed/tester.tests_run*100,
            'all_passed': all_passed,
            'detailed_results': tester.test_results
        }, f, indent=2)
    
    return 0 if all_passed else 1


if __name__ == "__main__":
    sys.exit(main())