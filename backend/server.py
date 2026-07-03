from fastapi import FastAPI, APIRouter, HTTPException, Request, Depends
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import razorpay
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional, Any, Dict
import uuid
from datetime import datetime, timezone
import httpx

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Brevo API configuration (default - for retreats)
BREVO_API_KEY = os.environ.get('BREVO_API_KEY')
BREVO_SENDER_EMAIL = os.environ.get('BREVO_SENDER_EMAIL', 'ssccoaching2026@gmail.com')
RECIPIENT_EMAIL = os.environ.get('RECIPIENT_EMAIL', 'ssccoaching2026@gmail.com')

# Brevo API configuration (coaching - for contact & shop)
BREVO_COACHING_API_KEY = os.environ.get('BREVO_COACHING_API_KEY')
BREVO_COACHING_EMAIL = os.environ.get('BREVO_COACHING_EMAIL', 'coaching@sunpreetsingh.com')

# Razorpay configuration (Test Keys)
RAZORPAY_KEY_ID = os.environ.get('RAZORPAY_KEY_ID', 'rzp_test_1DP5mmOlF5G5ag')
RAZORPAY_KEY_SECRET = os.environ.get('RAZORPAY_KEY_SECRET', 'thiswillbereplaced')
razorpay_client = razorpay.Client(auth=(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET))

# Product stock configuration
STOCK_LIMIT = 20
PRODUCT_IDS = ['handstand-canes', 'fingerboard', 'peg-board', 'parallettes']

# Create the main app without a prefix
app = FastAPI()


# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


# Define Models
class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class StatusCheckCreate(BaseModel):
    client_name: str

class ContactFormRequest(BaseModel):
    first_name: str
    email: EmailStr
    phone: str
    instagram: Optional[str] = None
    message: str
    source: Optional[str] = "coaching"
    retreat_id: Optional[str] = None
    retreat_title: Optional[str] = None

class ContactFormResponse(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    first_name: str
    email: str
    phone: str
    instagram: Optional[str] = None
    message: str
    submitted_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    email_sent: bool = False

class RetreatGallery(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    location: str
    date: str
    description: str
    images: List[str]
    videos: List[str] = []

class TestimonialModel(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    role: str
    content: str
    video_url: Optional[str] = None
    image_url: Optional[str] = None

# Payment Models
class OrderItem(BaseModel):
    id: str
    name: str
    price: int
    quantity: int

class CreateOrderRequest(BaseModel):
    items: List[OrderItem]
    customer_name: str
    customer_email: EmailStr
    customer_phone: str
    address: str
    city: str
    pincode: str

class CreateOrderResponse(BaseModel):
    order_id: str
    razorpay_order_id: str
    amount: int
    currency: str
    key_id: str

class VerifyPaymentRequest(BaseModel):
    razorpay_order_id: str
    razorpay_payment_id: str
    razorpay_signature: str
    order_id: str

class NotifyMeRequest(BaseModel):
    email: EmailStr
    product_id: str

class FinancialAidRequest(BaseModel):
    aid_type: str  # 'student' | 'scholarship' | 'custom'
    first_name: str
    email: EmailStr
    phone: str
    instagram: str
    program_interest: str
    institution: Optional[str] = None
    student_id: Optional[str] = None
    discount_requested: Optional[str] = None
    situation: str

class ProductStockResponse(BaseModel):
    product_id: str
    coming_soon: bool
    stock: int
    total_stock: int


# Brevo API Email Utility
async def send_email_async(to_email: str, subject: str, html_content: str, reply_to: str = None, channel: str = "default"):
    """Send email via Brevo HTTP API. channel='coaching' uses coaching@sunpreetsingh.com credentials."""
    if channel == "coaching" and BREVO_COACHING_API_KEY:
        api_key = BREVO_COACHING_API_KEY
        sender_email = BREVO_COACHING_EMAIL
        sender_name = "Sunpreet Singh Coaching"
    else:
        api_key = BREVO_API_KEY
        sender_email = BREVO_SENDER_EMAIL
        sender_name = "Sunpreet Singh Coaching"

    url = "https://api.brevo.com/v3/smtp/email"
    payload = {
        "sender": {"name": sender_name, "email": sender_email},
        "to": [{"email": to_email}],
        "subject": subject,
        "htmlContent": html_content,
    }
    if reply_to:
        payload["replyTo"] = {"email": reply_to}
    headers = {
        "accept": "application/json",
        "api-key": api_key,
        "content-type": "application/json",
    }
    success = False
    error_msg = None
    try:
        async with httpx.AsyncClient() as client:
            resp = await client.post(url, json=payload, headers=headers, timeout=15)
            if resp.status_code == 201:
                logger.info(f"Email sent to {to_email} via Brevo API ({channel})")
                success = True
            else:
                error_msg = f"{resp.status_code}: {resp.text[:200]}"
                logger.error(f"Brevo API error {error_msg}")
    except Exception as e:
        error_msg = str(e)
        logger.error(f"Failed to send email via Brevo API: {error_msg}")

    # Log every email attempt
    try:
        await db.sent_emails.insert_one({
            "id": str(uuid.uuid4()),
            "to_email": to_email,
            "from_email": sender_email,
            "subject": subject,
            "html_content": html_content,
            "reply_to": reply_to,
            "channel": channel,
            "success": success,
            "error": error_msg,
            "sent_at": datetime.now(timezone.utc).isoformat(),
        })
        # Prune to last 500 emails
        count = await db.sent_emails.count_documents({})
        if count > 500:
            oldest = db.sent_emails.find({}, {"_id": 1}).sort("sent_at", 1).limit(count - 500)
            ids = [d["_id"] async for d in oldest]
            if ids:
                await db.sent_emails.delete_many({"_id": {"$in": ids}})
    except Exception as e:
        logger.error(f"Failed to log email: {e}")

    return success


# API Routes
@api_router.get("/")
async def root():
    return {"message": "Sunpreet Coaching API"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.model_dump()
    status_obj = StatusCheck(**status_dict)
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    _ = await db.status_checks.insert_one(doc)
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    for check in status_checks:
        if isinstance(check['timestamp'], str):
            check['timestamp'] = datetime.fromisoformat(check['timestamp'])
    return status_checks


@api_router.post("/contact", response_model=ContactFormResponse)
async def submit_contact_form(request: ContactFormRequest):
    """Handle contact form submission and send email notification"""
    contact_id = str(uuid.uuid4())
    submitted_at = datetime.now(timezone.utc)
    email_sent = False
    is_retreat = request.source == "retreat"

    subject = f"New Retreat Enquiry from {request.first_name}" if is_retreat else f"New Coaching Inquiry from {request.first_name}"
    heading = "New Retreat Enquiry" if is_retreat else "New Coaching Inquiry"

    # Build HTML email for admin
    html_content = f"""
    <html>
    <body style="font-family: 'Manrope', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #FBFBF9; color: #1C1917;">
        <div style="background-color: #1C1917; color: #FBFBF9; padding: 30px; text-align: center;">
            <h1 style="font-family: 'Playfair Display', Georgia, serif; margin: 0; font-size: 28px;">{heading}</h1>
        </div>
        <div style="padding: 30px; background-color: #FFFFFF; border: 1px solid #E7E5E4;">
            <h2 style="font-family: 'Playfair Display', Georgia, serif; color: #1C1917; margin-top: 0;">Contact Details</h2>
            <table style="width: 100%; border-collapse: collapse;">
                <tr>
                    <td style="padding: 10px 0; border-bottom: 1px solid #E7E5E4; font-weight: 600;">Name:</td>
                    <td style="padding: 10px 0; border-bottom: 1px solid #E7E5E4;">{request.first_name}</td>
                </tr>
                <tr>
                    <td style="padding: 10px 0; border-bottom: 1px solid #E7E5E4; font-weight: 600;">Email:</td>
                    <td style="padding: 10px 0; border-bottom: 1px solid #E7E5E4;">{request.email}</td>
                </tr>
                <tr>
                    <td style="padding: 10px 0; border-bottom: 1px solid #E7E5E4; font-weight: 600;">Phone:</td>
                    <td style="padding: 10px 0; border-bottom: 1px solid #E7E5E4;">{request.phone}</td>
                </tr>
                <tr>
                    <td style="padding: 10px 0; border-bottom: 1px solid #E7E5E4; font-weight: 600;">Instagram:</td>
                    <td style="padding: 10px 0; border-bottom: 1px solid #E7E5E4;">{request.instagram or 'Not provided'}</td>
                </tr>
            </table>
            <h3 style="font-family: 'Playfair Display', Georgia, serif; color: #1C1917; margin-top: 25px;">Message:</h3>
            <p style="background-color: #F5F5F4; padding: 20px; border-left: 4px solid #D6C0A6; white-space: pre-line;">{request.message}</p>
        </div>
        <div style="text-align: center; padding: 20px; color: #57534E; font-size: 12px;">
            <p>Submitted on {submitted_at.strftime('%B %d, %Y at %I:%M %p')} UTC</p>
        </div>
    </body>
    </html>
    """

    # Build confirmation email for the applicant
    confirm_heading = "We've Received Your Retreat Application!" if is_retreat else "We've Received Your Inquiry!"
    confirm_msg = (
        "Thank you for your interest in our retreat! We've received your application and our team will review it shortly. "
        "You can expect to hear back from us within 2-3 business days."
    ) if is_retreat else (
        "Thank you for reaching out! We've received your inquiry and Sunpreet will get back to you within 2-3 business days."
    )

    ig_primary = "https://www.instagram.com/movement.shala/" if is_retreat else "https://www.instagram.com/sunpreet_sing/"
    ig_secondary = "https://www.instagram.com/sunpreet_sing/" if is_retreat else "https://www.instagram.com/movement.shala/"
    ig_primary_label = "Movement Shala" if is_retreat else "Sunpreet Singh"
    ig_secondary_label = "Sunpreet Singh" if is_retreat else "Movement Shala"

    confirm_html = f"""
    <html>
    <body style="font-family: 'Manrope', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #FBFBF9; color: #1C1917;">
        <div style="background-color: #1C1917; color: #FBFBF9; padding: 30px; text-align: center;">
            <h1 style="font-family: 'Playfair Display', Georgia, serif; margin: 0; font-size: 24px;">{confirm_heading}</h1>
        </div>
        <div style="padding: 30px; background-color: #FFFFFF; border: 1px solid #E7E5E4;">
            <p>Hi {request.first_name},</p>
            <p>{confirm_msg}</p>
            <p style="margin-top: 20px;">In the meantime, follow us on Instagram for daily movement inspiration:</p>
            <p>
                <a href="{ig_primary}" style="color: #D6C0A6; text-decoration: underline; font-weight: 600;">{ig_primary_label}</a>
                &nbsp;&bull;&nbsp;
                <a href="{ig_secondary}" style="color: #D6C0A6; text-decoration: underline;">{ig_secondary_label}</a>
            </p>
            <p style="margin-top: 30px; color: #57534E; font-size: 13px;">With movement,<br><strong>Sunpreet Singh</strong><br>Movement Shala</p>
        </div>
    </body>
    </html>
    """

    # Determine email channel: coaching for non-retreat, default for retreat
    email_channel = "default" if is_retreat else "coaching"
    admin_email = RECIPIENT_EMAIL if is_retreat else BREVO_COACHING_EMAIL

    # Try to send emails via Brevo
    try:
        await send_email_async(admin_email, subject, html_content, channel=email_channel)
        email_sent = True
        logger.info(f"Email sent successfully via Brevo to {admin_email}")
    except Exception as e:
        logger.error(f"Failed to send email: {str(e)}")
        email_sent = False

    # Send confirmation to applicant
    try:
        confirm_subject = "Your Retreat Application - Sunpreet Singh Coaching" if is_retreat else "Your Inquiry - Sunpreet Singh Coaching"
        await send_email_async(request.email, confirm_subject, confirm_html, channel=email_channel)
        logger.info(f"Confirmation email sent to {request.email}")
    except Exception as e:
        logger.error(f"Failed to send confirmation email to {request.email}: {str(e)}")
    
    # Save to database
    contact_doc = {
    "id": contact_id,
    "first_name": request.first_name,
    "email": request.email,
    "phone": request.phone,
    "instagram": request.instagram,
    "message": request.message,
    "source": request.source,
    "retreat_id": request.retreat_id,
    "retreat_title": request.retreat_title,
    "submitted_at": submitted_at.isoformat(),
    "email_sent": email_sent
}
    await db.contact_submissions.insert_one(contact_doc)
    if is_retreat:
        await db.retreat_applications.insert_one(contact_doc)
    
    return ContactFormResponse(
        id=contact_id,
        first_name=request.first_name,
        email=request.email,
        phone=request.phone,
        instagram=request.instagram,
        message=request.message,
        submitted_at=submitted_at,
        email_sent=email_sent
    )


@api_router.get("/retreats", response_model=List[RetreatGallery])
async def get_retreats():
    """Get all retreat galleries"""
    retreats = await db.retreats.find({}, {"_id": 0}).to_list(100)
    if not retreats:
        # Return demo data if no retreats in DB
        return [
            RetreatGallery(
                id="retreat-1",
                title="Rishikesh Mountain Retreat",
                location="Rishikesh, Uttarakhand",
                date="November 2025",
                description="A transformative 5-day retreat in the Himalayan foothills focusing on mobility, handstands, and mindfulness.",
                images=[
                    "https://images.unsplash.com/photo-1758274526108-49b7e3fc05aa?w=800",
                    "https://images.unsplash.com/photo-1758274526093-23bc5136933f?w=800",
                    "https://images.unsplash.com/photo-1758274526128-90858f16f554?w=800",
                    "https://images.unsplash.com/photo-1758797316165-986ec92e7ad2?w=800"
                ],
                videos=[]
            ),
            RetreatGallery(
                id="retreat-2",
                title="Goa Beach Movement Camp",
                location="Goa, India",
                date="January 2025",
                description="7 days of intensive calisthenics, beach training, and recovery practices by the Arabian Sea.",
                images=[
                    "https://images.unsplash.com/photo-1508050249562-b28a87434496?w=800",
                    "https://images.unsplash.com/photo-1552196563-55cd4e45efb3?w=800",
                    "https://images.unsplash.com/photo-1574406280735-351fc1a7c5e0?w=800"
                ],
                videos=[]
            ),
            RetreatGallery(
                id="retreat-3",
                title="Mumbai Urban Movement Workshop",
                location="Mumbai, Maharashtra",
                date="March 2025",
                description="Weekend intensive focusing on strength foundations and mobility for urban athletes.",
                images=[
                    "https://images.unsplash.com/photo-1601986313624-28c11ac26334?w=800",
                    "https://images.unsplash.com/photo-1562745486-01e13bd17534?w=800"
                ],
                videos=[]
            )
        ]
    return retreats


@api_router.get("/testimonials", response_model=List[TestimonialModel])
async def get_testimonials():
    """Get all testimonials"""
    testimonials = await db.testimonials.find({}, {"_id": 0}).to_list(100)
    if not testimonials:
        # Return demo data
        return [
            TestimonialModel(
                id="test-1",
                name="Alaya F",
                role="Student - 8 months",
                content="Sunpreet's coaching transformed not just my flexibility but my entire approach to movement. His methodical approach gave me the splits I thought were impossible.",
                video_url="https://customer-assets.emergentagent.com/job_075373c5-0904-4300-a194-369619411e36/artifacts/3wogulys_Alaya%20Testimonial%20Video.mp4",
                image_url="/api/static/thumbnails/alaya.jpg"
            ),
            TestimonialModel(
                id="test-2",
                name="Shradha",
                role="Student - 6 months",
                content="What sets Sunpreet apart is his holistic approach. It's not just about achieving poses—it's about understanding your body and moving with intention.",
                video_url="https://customer-assets.emergentagent.com/job_075373c5-0904-4300-a194-369619411e36/artifacts/qhbvhlk1_Shradha%20Video.mp4",
                image_url="/api/static/thumbnails/shradha.jpg"
            ),
            TestimonialModel(
                id="test-3",
                name="Sakhshi",
                role="Student - 1 year",
                content="The patience and attention to detail in every session is remarkable. I went from zero handstand experience to holding a freestanding handstand in 10 months.",
                video_url="https://customer-assets.emergentagent.com/job_075373c5-0904-4300-a194-369619411e36/artifacts/yzh3yfxg_Sakshi%20Video%20.mp4",
                image_url="/api/static/thumbnails/sakshi.jpg"
            )
        ]
    return testimonials


# ===== Product Stock & Notification Routes =====

@api_router.get("/products/stock")
async def get_products_stock():
    """Get stock status for all products"""
    stock_data = {}
    for pid in PRODUCT_IDS:
        doc = await db.product_stock.find_one({"product_id": pid}, {"_id": 0})
        if doc:
            stock_data[pid] = {
                "coming_soon": doc.get("coming_soon", True),
                "stock": doc.get("stock", STOCK_LIMIT),
                "total_stock": doc.get("total_stock", STOCK_LIMIT),
            }
        else:
            stock_data[pid] = {
                "coming_soon": True,
                "stock": STOCK_LIMIT,
                "total_stock": STOCK_LIMIT,
            }
    return stock_data


@api_router.post("/products/notify")
async def notify_me(request: NotifyMeRequest):
    """Subscribe to product notifications (launch or back in stock)"""
    if request.product_id not in PRODUCT_IDS:
        raise HTTPException(status_code=400, detail="Invalid product ID")

    existing = await db.product_notifications.find_one(
        {"email": request.email, "product_id": request.product_id}, {"_id": 0}
    )
    already_subscribed = existing is not None

    if not already_subscribed:
        doc = {
            "id": str(uuid.uuid4()),
            "email": request.email,
            "product_id": request.product_id,
            "subscribed_at": datetime.now(timezone.utc).isoformat(),
            "notified": False,
        }
        await db.product_notifications.insert_one(doc)
        await db.product_waitlist.insert_one(doc)
        logger.info(f"Notification subscription: {request.email} for {request.product_id}")

    # Always send confirmation email
    product_names = {
        'handstand-canes': 'Handstand Canes (60 CM)',
        'fingerboard': 'Fingerboard (Two-Stones Style)',
        'peg-board': 'Peg Board (4ft x 2ft)',
        'parallettes': 'Wooden Parallettes',
    }
    name = product_names.get(request.product_id, request.product_id)
    signed_at = datetime.now(timezone.utc).isoformat()

    confirm_heading = "You're Already on the List!" if already_subscribed else "You're on the List!"
    confirm_body = (
        f"<p>Hey! You're already subscribed to notifications for <strong>{name}</strong> — no worries, we've got you covered.</p>"
        f"<p>We'll send you an email the moment it's available. Sit tight!</p>"
    ) if already_subscribed else (
        f"<p>Hi there!</p>"
        f"<p>You've been added to the notification list for <strong>{name}</strong>.</p>"
        f"<p>We'll send you an email as soon as it's available for purchase. Be among the first to grab yours!</p>"
    )

    confirm_html = f"""
    <html>
    <body style="font-family: 'Manrope', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #FBFBF9; color: #1C1917;">
        <div style="background-color: #1C1917; color: #FBFBF9; padding: 30px; text-align: center;">
            <h1 style="font-family: 'Playfair Display', Georgia, serif; margin: 0; font-size: 24px;">{confirm_heading}</h1>
        </div>
        <div style="padding: 30px; background-color: #FFFFFF; border: 1px solid #E7E5E4;">
            {confirm_body}
            <p style="margin-top: 20px;">In the meantime, follow us on Instagram for updates and movement inspiration:</p>
            <p>
                <a href="https://www.instagram.com/sunpreet_sing/" style="color: #D6C0A6; text-decoration: underline; font-weight: 600;">Sunpreet Singh</a>
                &nbsp;&bull;&nbsp;
                <a href="https://www.instagram.com/movement.shala/" style="color: #D6C0A6; text-decoration: underline;">Movement Shala</a>
            </p>
            <p style="margin-top: 30px; color: #57534E; font-size: 13px;">With movement,<br><strong>Sunpreet Singh</strong><br>Movement Shala</p>
        </div>
    </body>
    </html>
    """
    try:
        await send_email_async(request.email, f"You're on the Waitlist - {name}", confirm_html, channel="coaching")
        logger.info(f"Notify confirmation email sent to {request.email}")
    except Exception as e:
        logger.error(f"Failed to send notify confirmation to {request.email}: {e}")

    # Always send admin notification
    admin_note = f"A returning subscriber just signed up again to be notified for <strong>{name}</strong>." if already_subscribed else f"Someone just signed up to be notified for <strong>{name}</strong>."
    admin_heading = "Repeat Waitlist Interest" if already_subscribed else "New Product Waitlist Signup"

    admin_html = f"""
    <html>
    <body style="font-family: 'Manrope', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #FBFBF9; color: #1C1917;">
        <div style="background-color: #1C1917; color: #FBFBF9; padding: 30px; text-align: center;">
            <h1 style="font-family: 'Playfair Display', Georgia, serif; margin: 0; font-size: 24px;">{admin_heading}</h1>
        </div>
        <div style="padding: 30px; background-color: #FFFFFF; border: 1px solid #E7E5E4;">
            <p>{admin_note}</p>
            <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
                <tr>
                    <td style="padding: 10px 0; border-bottom: 1px solid #E7E5E4; font-weight: 600;">Email:</td>
                    <td style="padding: 10px 0; border-bottom: 1px solid #E7E5E4;">{request.email}</td>
                </tr>
                <tr>
                    <td style="padding: 10px 0; border-bottom: 1px solid #E7E5E4; font-weight: 600;">Product:</td>
                    <td style="padding: 10px 0; border-bottom: 1px solid #E7E5E4;">{name}</td>
                </tr>
                <tr>
                    <td style="padding: 10px 0; font-weight: 600;">Signed up at:</td>
                    <td style="padding: 10px 0;">{signed_at}</td>
                </tr>
            </table>
        </div>
    </body>
    </html>
    """
    try:
        await send_email_async(BREVO_COACHING_EMAIL, f"New Waitlist Signup for {name} - {request.email}", admin_html, channel="coaching")
        logger.info(f"Admin notification sent for waitlist signup: {request.email}")
    except Exception as e:
        logger.error(f"Failed to send admin waitlist notification: {e}")

    msg = "You're already on the list! We've sent you a confirmation." if already_subscribed else "You'll be notified when this product is available!"
    return {"success": True, "message": msg}


@api_router.post("/products/stock/toggle")
async def toggle_coming_soon(product_id: str, coming_soon: bool):
    """Admin: toggle coming_soon flag for a product"""
    if product_id not in PRODUCT_IDS:
        raise HTTPException(status_code=400, detail="Invalid product ID")

    await db.product_stock.update_one(
        {"product_id": product_id},
        {"$set": {"coming_soon": coming_soon}},
        upsert=True,
    )

    # If launching (coming_soon=False), notify all subscribers
    if not coming_soon:
        subscribers = await db.product_notifications.find(
            {"product_id": product_id, "notified": False}, {"_id": 0}
        ).to_list(1000)

        product_names = {
            'handstand-canes': 'Handstand Canes (60 CM)',
            'fingerboard': 'Fingerboard (Two-Stones Style)',
            'peg-board': 'Peg Board (4ft x 2ft)',
            'parallettes': 'Wooden Parallettes',
        }
        name = product_names.get(product_id, product_id)

        for sub in subscribers:
            html = f"""
            <html><body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="background-color: #1C1917; color: #FBFBF9; padding: 30px; text-align: center;">
                    <h1 style="margin: 0; font-size: 24px;">It's Here!</h1>
                </div>
                <div style="padding: 30px; background-color: #FFFFFF;">
                    <p>Hi there!</p>
                    <p>Great news — <strong>{name}</strong> is now available in our store!</p>
                    <p>Be one of the first to grab yours before stock runs out.</p>
                    <p style="text-align: center; margin-top: 20px;">
                        <a href="https://coaching-retreat-dev.preview.emergentagent.com/shop/{product_id}"
                           style="background-color: #1C1917; color: #FBFBF9; padding: 14px 28px; text-decoration: none; text-transform: uppercase; letter-spacing: 2px; font-size: 13px;">
                            Shop Now
                        </a>
                    </p>
                </div>
            </body></html>
            """
            try:
                await send_email_async(sub['email'], f"{name} is Now Available!", html, channel="coaching")
                await db.product_notifications.update_one(
                    {"email": sub['email'], "product_id": product_id},
                    {"$set": {"notified": True}},
                )
            except Exception as e:
                logger.error(f"Failed to notify {sub['email']}: {e}")

    return {"success": True, "product_id": product_id, "coming_soon": coming_soon}


# Payment Routes
@api_router.post("/financial-aid")
async def submit_financial_aid(request: FinancialAidRequest):
    """Handle financial aid applications (student / scholarship / custom)"""
    submitted_at = datetime.now(timezone.utc)
    aid_label_map = {
        "student": "Student Discount (20% off)",
        "scholarship": "Scholarship Application (Free Access for 1 Year)",
        "custom": "Custom Discount Request",
    }
    aid_label = aid_label_map.get(request.aid_type, request.aid_type)

    # Conditional rows
    extra_rows = ""
    if request.aid_type == "student":
        extra_rows += f"""
            <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #E7E5E4; font-weight: 600;">Institution:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #E7E5E4;">{request.institution or 'Not provided'}</td>
            </tr>
            <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #E7E5E4; font-weight: 600;">Student ID:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #E7E5E4;">{request.student_id or 'Not provided'}</td>
            </tr>
        """
    if request.aid_type == "custom" and request.discount_requested:
        extra_rows += f"""
            <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #E7E5E4; font-weight: 600;">Discount Requested:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #E7E5E4;">{request.discount_requested}</td>
            </tr>
        """

    admin_html = f"""
    <html>
    <body style="font-family: 'Manrope', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #FBFBF9; color: #1C1917;">
        <div style="background-color: #1C1917; color: #FBFBF9; padding: 30px; text-align: center;">
            <h1 style="font-family: 'Playfair Display', Georgia, serif; margin: 0; font-size: 24px;">New Financial Aid Application</h1>
            <p style="margin: 8px 0 0; color: #D6C0A6; font-size: 13px; letter-spacing: 2px; text-transform: uppercase;">{aid_label}</p>
        </div>
        <div style="padding: 30px; background-color: #FFFFFF; border: 1px solid #E7E5E4;">
            <h2 style="font-family: 'Playfair Display', Georgia, serif; color: #1C1917; margin-top: 0;">Applicant Details</h2>
            <table style="width: 100%; border-collapse: collapse;">
                <tr>
                    <td style="padding: 10px 0; border-bottom: 1px solid #E7E5E4; font-weight: 600;">Name:</td>
                    <td style="padding: 10px 0; border-bottom: 1px solid #E7E5E4;">{request.first_name}</td>
                </tr>
                <tr>
                    <td style="padding: 10px 0; border-bottom: 1px solid #E7E5E4; font-weight: 600;">Email:</td>
                    <td style="padding: 10px 0; border-bottom: 1px solid #E7E5E4;">{request.email}</td>
                </tr>
                <tr>
                    <td style="padding: 10px 0; border-bottom: 1px solid #E7E5E4; font-weight: 600;">Phone:</td>
                    <td style="padding: 10px 0; border-bottom: 1px solid #E7E5E4;">{request.phone}</td>
                </tr>
                <tr>
                    <td style="padding: 10px 0; border-bottom: 1px solid #E7E5E4; font-weight: 600;">Instagram:</td>
                    <td style="padding: 10px 0; border-bottom: 1px solid #E7E5E4;">{request.instagram}</td>
                </tr>
                <tr>
                    <td style="padding: 10px 0; border-bottom: 1px solid #E7E5E4; font-weight: 600;">Program of Interest:</td>
                    <td style="padding: 10px 0; border-bottom: 1px solid #E7E5E4;">{request.program_interest}</td>
                </tr>
                {extra_rows}
            </table>
            <h3 style="font-family: 'Playfair Display', Georgia, serif; color: #1C1917; margin-top: 25px;">Their Situation:</h3>
            <p style="background-color: #F5F5F4; padding: 20px; border-left: 4px solid #D6C0A6; white-space: pre-line;">{request.situation}</p>
        </div>
        <div style="text-align: center; padding: 20px; color: #57534E; font-size: 12px;">
            <p>Submitted on {submitted_at.strftime('%B %d, %Y at %I:%M %p')} UTC</p>
        </div>
    </body>
    </html>
    """

    confirm_html = f"""
    <html>
    <body style="font-family: 'Manrope', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #FBFBF9; color: #1C1917;">
        <div style="background-color: #1C1917; color: #FBFBF9; padding: 30px; text-align: center;">
            <h1 style="font-family: 'Playfair Display', Georgia, serif; margin: 0; font-size: 24px;">Application Received</h1>
        </div>
        <div style="padding: 30px; background-color: #FFFFFF; border: 1px solid #E7E5E4;">
            <p>Hi {request.first_name},</p>
            <p>Thank you for applying for <strong>{aid_label}</strong>.</p>
            <p>I personally review every application — not just based on what you can afford, but on motivation and how serious you are about showing up. You can expect to hear back from me within 3–5 business days.</p>
            <p>If approved, I'll send you next steps including a discount code or scholarship access link.</p>
            <p style="margin-top: 20px;">In the meantime, follow along for movement inspiration:</p>
            <p>
                <a href="https://www.instagram.com/sunpreet_sing/" style="color: #D6C0A6; text-decoration: underline; font-weight: 600;">@sunpreet_sing</a>
                &nbsp;&bull;&nbsp;
                <a href="https://www.instagram.com/movement.shala/" style="color: #D6C0A6; text-decoration: underline;">@movement.shala</a>
            </p>
            <p style="margin-top: 30px; color: #57534E; font-size: 13px;">With movement,<br><strong>Sunpreet Singh</strong><br>Movement Shala</p>
        </div>
    </body>
    </html>
    """

    # Save to DB
    record = {
        "id": str(uuid.uuid4()),
        "aid_type": request.aid_type,
        "first_name": request.first_name,
        "email": request.email,
        "phone": request.phone,
        "instagram": request.instagram,
        "program_interest": request.program_interest,
        "institution": request.institution,
        "student_id": request.student_id,
        "discount_requested": request.discount_requested,
        "situation": request.situation,
        "submitted_at": submitted_at.isoformat(),
    }
    await db.financial_aid_applications.insert_one(record)

    # Send admin email
    try:
        await send_email_async(
            BREVO_COACHING_EMAIL,
            f"New Financial Aid Application — {aid_label} — {request.first_name}",
            admin_html,
            reply_to=request.email,
            channel="coaching",
        )
    except Exception as e:
        logger.error(f"Failed to send admin financial-aid email: {e}")

    # Send applicant confirmation
    try:
        await send_email_async(
            request.email,
            "Your Financial Aid Application — Sunpreet Singh Coaching",
            confirm_html,
            channel="coaching",
        )
    except Exception as e:
        logger.error(f"Failed to send applicant financial-aid confirmation: {e}")

    return {"success": True, "message": "Application received. Check your email for confirmation."}


# Payment Routes
@api_router.post("/orders/create", response_model=CreateOrderResponse)
async def create_order(request: CreateOrderRequest):
    """Create a Razorpay order for payment"""
    try:
        # Calculate total amount
        total_amount = sum(item.price * item.quantity for item in request.items)
        amount_in_paise = total_amount * 100  # Razorpay expects amount in paise
        
        # Create order ID
        order_id = str(uuid.uuid4())
        
        # Create Razorpay order
        razorpay_order = razorpay_client.order.create({
            "amount": amount_in_paise,
            "currency": "INR",
            "receipt": order_id,
            "notes": {
                "customer_name": request.customer_name,
                "customer_email": request.customer_email,
                "customer_phone": request.customer_phone
            }
        })
        
        # Save order to database
        order_doc = {
            "id": order_id,
            "razorpay_order_id": razorpay_order['id'],
            "items": [item.model_dump() for item in request.items],
            "total_amount": total_amount,
            "customer_name": request.customer_name,
            "customer_email": request.customer_email,
            "customer_phone": request.customer_phone,
            "address": request.address,
            "city": request.city,
            "pincode": request.pincode,
            "status": "pending",
            "created_at": datetime.now(timezone.utc).isoformat()
        }
        await db.orders.insert_one(order_doc)
        
        return CreateOrderResponse(
            order_id=order_id,
            razorpay_order_id=razorpay_order['id'],
            amount=amount_in_paise,
            currency="INR",
            key_id=RAZORPAY_KEY_ID
        )
    except Exception as e:
        logger.error(f"Error creating order: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to create order: {str(e)}")


@api_router.post("/orders/verify")
async def verify_payment(request: VerifyPaymentRequest):
    """Verify Razorpay payment signature and update order status"""
    try:
        # Verify signature
        params_dict = {
            'razorpay_order_id': request.razorpay_order_id,
            'razorpay_payment_id': request.razorpay_payment_id,
            'razorpay_signature': request.razorpay_signature
        }
        
        try:
            razorpay_client.utility.verify_payment_signature(params_dict)
        except Exception as sig_error:
            logger.error(f"Signature verification failed: {str(sig_error)}")
            raise HTTPException(status_code=400, detail="Payment verification failed")
        
        # Update order status
        order = await db.orders.find_one_and_update(
            {"id": request.order_id},
            {"$set": {
                "status": "paid",
                "razorpay_payment_id": request.razorpay_payment_id,
                "paid_at": datetime.now(timezone.utc).isoformat()
            }},
            return_document=True
        )
        
        if not order:
            raise HTTPException(status_code=404, detail="Order not found")

        # Decrement stock for each ordered item
        for item in order['items']:
            await db.product_stock.update_one(
                {"product_id": item['id'], "stock": {"$gt": 0}},
                {"$inc": {"stock": -item['quantity']}},
            )

        # Send confirmation email via Brevo
        try:
            items_html = "".join([
                f"<tr><td style='padding: 8px; border-bottom: 1px solid #E7E5E4;'>{item['name']}</td>"
                f"<td style='padding: 8px; border-bottom: 1px solid #E7E5E4;'>{item['quantity']}</td>"
                f"<td style='padding: 8px; border-bottom: 1px solid #E7E5E4;'>₹{item['price'] * item['quantity']:,}</td></tr>"
                for item in order['items']
            ])

            html_content = f"""
            <html>
            <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="background-color: #1C1917; color: #FBFBF9; padding: 30px; text-align: center;">
                    <h1 style="margin: 0; font-size: 28px;">Order Confirmed!</h1>
                </div>
                <div style="padding: 30px; background-color: #FFFFFF;">
                    <p>Hi {order['customer_name']},</p>
                    <p>Thank you for your order! We've received your payment and your order is being processed.</p>
                    <h3>Order Details</h3>
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr style="background-color: #F5F5F4;">
                            <th style="padding: 8px; text-align: left;">Item</th>
                            <th style="padding: 8px; text-align: left;">Qty</th>
                            <th style="padding: 8px; text-align: left;">Price</th>
                        </tr>
                        {items_html}
                        <tr>
                            <td colspan="2" style="padding: 12px 8px; font-weight: bold;">Total</td>
                            <td style="padding: 12px 8px; font-weight: bold;">₹{order['total_amount']:,}</td>
                        </tr>
                    </table>
                    <h3>Delivery Address</h3>
                    <p>{order['address']}<br>{order['city']} - {order['pincode']}</p>
                    <p style="margin-top: 20px;">Your order will be shipped within 2-3 business days.</p>
                </div>
            </body>
            </html>
            """

            await send_email_async(order['customer_email'], "Order Confirmed - Sunpreet Singh Coaching", html_content, channel="coaching")
            await send_email_async(BREVO_COACHING_EMAIL, f"New Order from {order['customer_name']}", html_content, channel="coaching")
        except Exception as email_error:
            logger.error(f"Failed to send confirmation email: {str(email_error)}")
        
        return {"success": True, "message": "Payment verified successfully", "order_id": request.order_id}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error verifying payment: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Payment verification failed: {str(e)}")


@api_router.get("/razorpay/key")
async def get_razorpay_key():
    """Get Razorpay public key for frontend"""
    return {"key_id": RAZORPAY_KEY_ID}


# ============================================
# HEALTH CHECK (for UptimeRobot pings)
# ============================================
@api_router.get("/health")
async def health_check():
    return {"status": "ok", "ts": datetime.now(timezone.utc).isoformat()}


# ============================================
# AUTH ROUTES
# ============================================
from auth import (
    verify_password, create_access_token, require_admin,
    hash_password, log_activity
)

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str

@api_router.post("/auth/login")
async def admin_login(req: LoginRequest):
    email = req.email.lower().strip()
    user = await db.admin_users.find_one({"email": email})
    if not user or not verify_password(req.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    token = create_access_token(str(user.get("_id")), email)
    await log_activity(db, email, "login", "auth", "Admin logged in")
    return {
        "token": token,
        "user": {
            "email": user["email"],
            "name": user.get("name", "Admin"),
            "role": user.get("role", "admin"),
        }
    }

@api_router.get("/auth/me")
async def auth_me(user: dict = Depends(require_admin)):
    return user

@api_router.post("/auth/change-password")
async def change_password(req: ChangePasswordRequest, user: dict = Depends(require_admin)):
    full = await db.admin_users.find_one({"email": user["email"]})
    if not full or not verify_password(req.current_password, full["password_hash"]):
        raise HTTPException(status_code=400, detail="Current password is incorrect")
    if len(req.new_password) < 6:
        raise HTTPException(status_code=400, detail="New password must be at least 6 characters")
    await db.admin_users.update_one(
        {"email": user["email"]},
        {"$set": {"password_hash": hash_password(req.new_password)}}
    )
    await log_activity(db, user["email"], "change_password", "auth", "Password updated")
    return {"success": True}


# ============================================
# CONTENT ROUTES — public read, admin write
# ============================================
PUBLIC_CONTENT_KEYS = {"retreats", "programs", "home", "about", "coaching", "settings", "testimonials", "products"}

@api_router.get("/content/{key}")
async def get_content(key: str):
    if key not in PUBLIC_CONTENT_KEYS:
        raise HTTPException(status_code=404, detail="Content key not found")
    doc = await db.content_documents.find_one({"key": key}, {"_id": 0})
    if not doc:
        # Return empty default
        return {"key": key, "data": [] if key in ("retreats", "programs") else {}, "updated_at": None}
    return doc

class ContentUpdateRequest(BaseModel):
    data: Any

@api_router.put("/admin/content/{key}")
async def update_content(key: str, req: ContentUpdateRequest, user: dict = Depends(require_admin)):
    if key not in PUBLIC_CONTENT_KEYS:
        raise HTTPException(status_code=404, detail="Content key not found")
    now = datetime.now(timezone.utc).isoformat()
    await db.content_documents.update_one(
        {"key": key},
        {"$set": {"key": key, "data": req.data, "updated_at": now}},
        upsert=True,
    )
    await log_activity(db, user["email"], f"update_content:{key}", key, "Content updated")
    return {"success": True, "key": key, "updated_at": now}


# ============================================
# ADMIN SUBMISSIONS INBOX
# ============================================
@api_router.get("/admin/submissions")
async def admin_submissions(
    source: Optional[str] = None,
    user: dict = Depends(require_admin)
):
    """Unified inbox across all submission types."""
    items: List[Dict[str, Any]] = []

    if source in (None, "contact"):
        async for doc in db.contact_submissions.find({}, {"_id": 0}).sort("submitted_at", -1).limit(200):
            items.append({**doc, "kind": "contact"})

    if source in (None, "retreat"):
        async for doc in db.retreat_applications.find({}, {"_id": 0}).sort("submitted_at", -1).limit(200):
            items.append({**doc, "kind": "retreat"})

    if source in (None, "financial_aid"):
        async for doc in db.financial_aid_applications.find({}, {"_id": 0}).sort("submitted_at", -1).limit(200):
            items.append({**doc, "kind": "financial_aid"})

    if source in (None, "waitlist"):
        async for doc in db.product_waitlist.find({}, {"_id": 0}).sort("subscribed_at", -1).limit(200):
            items.append({**doc, "kind": "waitlist"})

    if source in (None, "order"):
        async for doc in db.orders.find({}, {"_id": 0}).sort("created_at", -1).limit(200):
            items.append({**doc, "kind": "order"})

    # Sort all by best-available timestamp
    def ts_key(d):
        return d.get("submitted_at") or d.get("subscribed_at") or d.get("created_at") or ""
    items.sort(key=ts_key, reverse=True)
    return {"items": items, "count": len(items)}


@api_router.patch("/admin/submissions/{kind}/{item_id}")
async def update_submission_status(kind: str, item_id: str, payload: Dict[str, Any], user: dict = Depends(require_admin)):
    """Update status / notes on a submission."""
    coll_map = {
        "contact": "contacts",
        "retreat": "retreat_applications",
        "financial_aid": "financial_aid_applications",
        "waitlist": "product_waitlist",
        "order": "orders",
    }
    coll_name = coll_map.get(kind)
    if not coll_name:
        raise HTTPException(status_code=400, detail="Invalid submission kind")
    allowed = {k: v for k, v in payload.items() if k in ("status", "notes", "replied")}
    if not allowed:
        raise HTTPException(status_code=400, detail="No valid fields to update")
    result = await db[coll_name].update_one({"id": item_id}, {"$set": allowed})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Submission not found")
    await log_activity(db, user["email"], f"update_submission:{kind}", item_id, str(allowed))
    return {"success": True}


# ============================================
# FINANCIAL AID APPROVE / REJECT
# ============================================
class AidDecisionRequest(BaseModel):
    discount_code: Optional[str] = None  # for approval
    discount_percent: Optional[int] = None
    notes: Optional[str] = None

@api_router.post("/admin/financial-aid/{aid_id}/approve")
async def approve_financial_aid(aid_id: str, req: AidDecisionRequest, user: dict = Depends(require_admin)):
    aid = await db.financial_aid_applications.find_one({"id": aid_id}, {"_id": 0})
    if not aid:
        raise HTTPException(status_code=404, detail="Application not found")
    await db.financial_aid_applications.update_one(
        {"id": aid_id},
        {"$set": {
            "status": "approved",
            "discount_code": req.discount_code or "",
            "discount_percent": req.discount_percent or 0,
            "admin_notes": req.notes or "",
            "decided_at": datetime.now(timezone.utc).isoformat(),
            "decided_by": user["email"],
        }}
    )
    # Send approval email
    try:
        html = f"""
        <html><body style='font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;'>
            <div style='background:#1C1917;color:#FBFBF9;padding:30px;text-align:center;'>
                <h1 style='font-family:Georgia,serif;margin:0;'>Application Approved</h1>
            </div>
            <div style='padding:30px;background:#fff;'>
                <p>Hi {aid.get('first_name', 'there')},</p>
                <p>Great news — your financial aid application has been <strong>approved</strong>.</p>
                {f"<p>Your discount: <strong>{req.discount_percent or ''}% off</strong></p>" if req.discount_percent else ''}
                {f"<p>Use code: <strong style='background:#D6C0A6;padding:8px 16px;font-size:18px;letter-spacing:2px;'>{req.discount_code}</strong></p>" if req.discount_code else ''}
                {f"<p>{req.notes}</p>" if req.notes else ''}
                <p>Looking forward to having you in the community.</p>
                <p style='margin-top:30px;'>With movement,<br><strong>Sunpreet Singh</strong></p>
            </div>
        </body></html>
        """
        await send_email_async(aid["email"], "Your Financial Aid Application is Approved", html, channel="coaching")
    except Exception as e:
        logger.error(f"Failed to send aid approval email: {e}")
    await log_activity(db, user["email"], "approve_financial_aid", aid_id, f"Discount: {req.discount_percent}% / {req.discount_code}")
    return {"success": True}


@api_router.post("/admin/financial-aid/{aid_id}/reject")
async def reject_financial_aid(aid_id: str, req: AidDecisionRequest, user: dict = Depends(require_admin)):
    aid = await db.financial_aid_applications.find_one({"id": aid_id}, {"_id": 0})
    if not aid:
        raise HTTPException(status_code=404, detail="Application not found")
    await db.financial_aid_applications.update_one(
        {"id": aid_id},
        {"$set": {
            "status": "rejected",
            "admin_notes": req.notes or "",
            "decided_at": datetime.now(timezone.utc).isoformat(),
            "decided_by": user["email"],
        }}
    )
    try:
        html = f"""
        <html><body style='font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;'>
            <div style='background:#1C1917;color:#FBFBF9;padding:30px;text-align:center;'>
                <h1 style='font-family:Georgia,serif;margin:0;'>Update on Your Application</h1>
            </div>
            <div style='padding:30px;background:#fff;'>
                <p>Hi {aid.get('first_name', 'there')},</p>
                <p>Thank you for taking the time to apply for financial aid. After reviewing your application, I'm unable to offer a discount at this time.</p>
                {f"<p>{req.notes}</p>" if req.notes else ''}
                <p>I hope this doesn't deter you — please reach out if your circumstances change, and keep moving.</p>
                <p style='margin-top:30px;'>With movement,<br><strong>Sunpreet Singh</strong></p>
            </div>
        </body></html>
        """
        await send_email_async(aid["email"], "Update on Your Financial Aid Application", html, channel="coaching")
    except Exception as e:
        logger.error(f"Failed to send aid rejection email: {e}")
    await log_activity(db, user["email"], "reject_financial_aid", aid_id, req.notes or "")
    return {"success": True}


# ============================================
# DASHBOARD STATS
# ============================================
@api_router.get("/admin/dashboard")
async def admin_dashboard(user: dict = Depends(require_admin)):
    from datetime import timedelta
    now = datetime.now(timezone.utc)
    today_start = now.replace(hour=0, minute=0, second=0, microsecond=0).isoformat()
    week_start = (now - timedelta(days=7)).isoformat()

    counts = {
        "contacts_total": await db.contact_submissions.count_documents({}),
        "contacts_today": await db.contact_submissions.count_documents({"submitted_at": {"$gte": today_start}}),
        "contacts_week": await db.contact_submissions.count_documents({"submitted_at": {"$gte": week_start}}),
        "retreat_apps_total": await db.retreat_applications.count_documents({}),
        "financial_aid_total": await db.financial_aid_applications.count_documents({}),
        "financial_aid_pending": await db.financial_aid_applications.count_documents({"status": {"$exists": False}}) + await db.financial_aid_applications.count_documents({"status": "pending"}),
        "waitlist_total": await db.product_waitlist.count_documents({}),
        "orders_total": await db.orders.count_documents({}),
        "emails_sent_total": await db.sent_emails.count_documents({}),
    }

    # Recent form submissions across ALL sources (last 10)
    recent_submissions = []
    for coll, kind, ts_field in [
        ("contacts", "contact", "submitted_at"),
        ("retreat_applications", "retreat", "submitted_at"),
        ("financial_aid_applications", "financial_aid", "submitted_at"),
        ("product_waitlist", "waitlist", "subscribed_at"),
        ("orders", "order", "created_at"),
    ]:
        async for doc in db[coll].find({}, {"_id": 0}).sort(ts_field, -1).limit(5):
            recent_submissions.append({
                **doc,
                "kind": kind,
                "_ts": doc.get(ts_field, ""),
            })
    recent_submissions.sort(key=lambda x: x.get("_ts", ""), reverse=True)
    recent_submissions = recent_submissions[:10]

    return {"counts": counts, "recent_submissions": recent_submissions}


# ============================================
# EMAILS INBOX
# ============================================
@api_router.get("/admin/emails")
async def admin_emails(limit: int = 100, user: dict = Depends(require_admin)):
    emails = []
    async for doc in db.sent_emails.find({}, {"_id": 0}).sort("sent_at", -1).limit(limit):
        emails.append(doc)
    return {"emails": emails, "count": len(emails)}


# ============================================
# PRODUCTS CRUD (admin-managed catalog)
# ============================================
@api_router.get("/admin/products")
async def admin_list_products(user: dict = Depends(require_admin)):
    doc = await db.content_documents.find_one({"key": "products"}, {"_id": 0})
    products = (doc or {}).get("data") or []
    # Merge live stock counts
    for p in products:
        s = await db.product_stock.find_one({"product_id": p["id"]}, {"_id": 0})
        if s:
            p["stock"] = s.get("stock", 0)
            p["coming_soon"] = s.get("coming_soon", True)
            p["total_stock"] = s.get("total_stock", 0)
    return {"products": products}


@api_router.put("/admin/products")
async def admin_save_products(payload: Dict[str, Any], user: dict = Depends(require_admin)):
    """Save the products list (CRUD). Also creates/updates stock rows for new products."""
    products = payload.get("products") or []
    now = datetime.now(timezone.utc).isoformat()
    # Save catalog
    await db.content_documents.update_one(
        {"key": "products"},
        {"$set": {"key": "products", "data": products, "updated_at": now}},
        upsert=True,
    )
    # Ensure stock row exists for each product
    for p in products:
        if not p.get("id"):
            continue
        existing = await db.product_stock.find_one({"product_id": p["id"]})
        if not existing:
            await db.product_stock.insert_one({
                "product_id": p["id"],
                "coming_soon": True,
                "stock": int(p.get("total_stock", 20)),
                "total_stock": int(p.get("total_stock", 20)),
            })
    await log_activity(db, user["email"], "save_products", "products", f"Saved {len(products)} products")
    return {"success": True}


@api_router.patch("/admin/products/{product_id}/stock")
async def admin_update_stock(product_id: str, payload: Dict[str, Any], user: dict = Depends(require_admin)):
    """Update stock count / total_stock for a product."""
    allowed = {k: v for k, v in payload.items() if k in ("stock", "total_stock", "coming_soon")}
    if not allowed:
        raise HTTPException(status_code=400, detail="No valid fields")
    await db.product_stock.update_one({"product_id": product_id}, {"$set": allowed}, upsert=True)
    await log_activity(db, user["email"], "update_stock", product_id, str(allowed))
    return {"success": True}


# Public products endpoint (replaces static products.js)
@api_router.get("/products")
async def public_list_products():
    doc = await db.content_documents.find_one({"key": "products"}, {"_id": 0})
    products = (doc or {}).get("data") or []
    return {"products": products}


# ============================================
# NEWSLETTER / BROADCAST
# ============================================
@api_router.get("/admin/audiences")
async def admin_audiences(user: dict = Depends(require_admin)):
    """Return email lists for each broadcast audience segment."""
    segments: Dict[str, List[Dict[str, Any]]] = {
        "contacts": [],
        "retreat_applicants": [],
        "financial_aid_applicants": [],
        "waitlist": [],
    }

    async for doc in db.contact_submissions.find({}, {"_id": 0, "email": 1, "first_name": 1, "submitted_at": 1}).sort("submitted_at", -1):
        if doc.get("email"):
            segments["contacts"].append({"email": doc["email"], "name": doc.get("first_name", "")})

    async for doc in db.retreat_applications.find({}, {"_id": 0, "email": 1, "first_name": 1, "name": 1, "retreat_id": 1, "submitted_at": 1}).sort("submitted_at", -1):
        if doc.get("email"):
            segments["retreat_applicants"].append({
                "email": doc["email"],
                "name": doc.get("first_name") or doc.get("name") or "",
                "retreat_id": doc.get("retreat_id", ""),
            })

    async for doc in db.financial_aid_applications.find({}, {"_id": 0, "email": 1, "first_name": 1, "name": 1, "submitted_at": 1}).sort("submitted_at", -1):
        if doc.get("email"):
            segments["financial_aid_applicants"].append({
                "email": doc["email"],
                "name": doc.get("first_name") or doc.get("name") or "",
            })

    async for doc in db.product_waitlist.find({}, {"_id": 0, "email": 1, "product_id": 1, "subscribed_at": 1}).sort("subscribed_at", -1):
        if doc.get("email"):
            segments["waitlist"].append({
                "email": doc["email"],
                "product_id": doc.get("product_id", ""),
            })

    counts = {k: len({s["email"].lower() for s in v}) for k, v in segments.items()}
    return {"segments": segments, "counts": counts}


class NewsletterRequest(BaseModel):
    subject: str
    html: str
    recipients: List[EmailStr]

@api_router.post("/admin/newsletter")
async def send_newsletter(req: NewsletterRequest, user: dict = Depends(require_admin)):
    if not req.subject.strip() or not req.html.strip():
        raise HTTPException(status_code=400, detail="Subject and message are required")
    if not req.recipients:
        raise HTTPException(status_code=400, detail="No recipients")
    sent = 0
    failed = 0
    # Wrap user HTML in branded template
    template = f"""
    <html><body style='font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;background:#FBFBF9;color:#1C1917;'>
      <div style='background:#1C1917;color:#FBFBF9;padding:30px;text-align:center;'>
        <p style='margin:0;font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#D6C0A6;'>Sunpreet Singh Coaching</p>
      </div>
      <div style='padding:30px;background:#fff;border:1px solid #E7E5E4;border-top:0;'>
        {req.html}
      </div>
      <div style='padding:20px;text-align:center;color:#57534E;font-size:11px;'>
        Movement Shala · <a href='https://www.instagram.com/sunpreet_sing/' style='color:#D6C0A6;'>@sunpreet_sing</a>
      </div>
    </body></html>
    """
    for email in req.recipients:
        try:
            ok = await send_email_async(email, req.subject, template, channel="coaching")
            if ok:
                sent += 1
            else:
                failed += 1
        except Exception as e:
            logger.error(f"Newsletter send failure to {email}: {e}")
            failed += 1
    await log_activity(db, user["email"], "newsletter", f"recipients={len(req.recipients)}", f"sent={sent} failed={failed} subject={req.subject[:50]}")
    return {"total": len(req.recipients), "sent_count": sent, "failed_count": failed}


# ============================================
# ACTIVITY LOG
# ============================================
@api_router.get("/admin/activity")
async def admin_activity(user: dict = Depends(require_admin)):
    entries = []
    async for entry in db.activity_log.find({}, {"_id": 0}).sort("ts", -1).limit(100):
        entries.append(entry)
    return {"entries": entries}


# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "https://sunpreetsingh.com",
        "https://www.sunpreetsingh.com",
        "https://transcendent-fudge-cd2149.netlify.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static files for thumbnails
app.mount("/api/static", StaticFiles(directory=str(ROOT_DIR / "static")), name="static")

@app.on_event("startup")
async def startup_init():
    """Initialize product stock records and seed admin user on startup"""
    # Seed admin user (idempotent)
    from auth import seed_admin
    await seed_admin(db)
    # Ensure unique index on admin email
    await db.admin_users.create_index("email", unique=True)
    # Seed default content if missing
    from seed_content import ensure_seed_content
    await ensure_seed_content(db)
    # Initialize product stock
    for pid in PRODUCT_IDS:
        existing = await db.product_stock.find_one({"product_id": pid})
        if not existing:
            await db.product_stock.insert_one({
                "product_id": pid,
                "coming_soon": True,
                "stock": STOCK_LIMIT,
                "total_stock": STOCK_LIMIT,
            })
            logger.info(f"Initialized stock for {pid}")

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
