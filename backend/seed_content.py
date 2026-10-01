"""Idempotent content seeding for the admin-managed collections.

This runs on backend startup. If a content key doesn't exist in
db.content_documents, it inserts the default content. Once it exists,
the admin owns the data and we never overwrite it.
"""
from datetime import datetime, timezone


DEFAULT_RETREATS = [
    {
        "id": "bali-2026",
        "status": "live",  # 'live' | 'coming_soon' | 'sold_out' | 'past' | 'draft'
        "title": "Bali Movement Camp",
        "tagline": "Where movement meets the island of gods.",
        "location": "Bali, Indonesia",
        "date": "1st – 6th September 2026, Uluwatu, Bali",
        "duration": "6 Days / 5 Nights",
        "icon": "waves",
        "heroImage": "https://customer-assets.emergentagent.com/job_069d6dd5-2200-4cc6-81fe-4b0e1eaff528/artifacts/jx9iixqr_main-resort-area-s-resorts.jpg",
        "description": "An immersive week combining intensive movement training with Balinese culture and natural beauty. Daily training sessions, mobility work, and adventure.",
        "longDescription": "Step away from the noise and immerse yourself in six days of intentional movement, deep recovery, and Balinese culture. Set against the lush landscapes of Bali, this camp is designed for anyone ready to push their edges — physically and mentally. From morning handstand drills to sunset mobility flows, every session is crafted to help you unlock new potential in your body while connecting with a like-minded community.",
        "atAGlance": [
            {"title": "6 Days / 5 Nights", "desc": "Immersive stay in Bali", "icon": "calendar"},
            {"title": "Breakfast Included", "desc": "Daily breakfast at the resort", "icon": "utensils"},
            {"title": "Movement Training", "desc": "Daily strength, mobility & handstand sessions", "icon": "activity"},
            {"title": "Surf Session", "desc": "Beginner-friendly, tide dependent", "icon": "map"},
            {"title": "Recovery Sessions", "desc": "Stretching, massage & breathwork", "icon": "heart"},
            {"title": "Small Group", "desc": "Intimate group size for personal attention", "icon": "users"},
            {"title": "Airport Transfer", "desc": "One-way transfer included", "icon": "plane"},
            {"title": "Community", "desc": "Fireside talks, journaling & bonding", "icon": "star"},
        ],
        "yourStay": {
            "title": "Your Stay",
            "text": [
                "Uluwatu, Bali. Close to the ocean, the clifftops, and everything worth exploring — but removed enough from the crowd that evenings feel genuinely peaceful.",
                "The retreat is hosted at a boutique property that gives you the best of both: easy access to Uluwatu's beaches, cafés, and sunset spots during the day, and a calm, unhurried space to come back to at night.",
                "40–45 minutes from Denpasar Airport. 10–15 minutes from the best beaches and day clubs in the area.",
                "On-site: three swimming pools, a yoga shala, spa, gym, restaurant, and a complimentary beach shuttle running throughout the day.",
            ],
            "image": "https://customer-assets.emergentagent.com/job_069d6dd5-2200-4cc6-81fe-4b0e1eaff528/artifacts/jx9iixqr_main-resort-area-s-resorts.jpg",
        },
        "rooms": [
            {
                "title": "Standard Room — Twin Sharing",
                "description": "Comfortable standard rooms with two single beds, set within the tropical resort surroundings. Each room comes with air conditioning, an en-suite bathroom, and garden views.",
                "image": "https://customer-assets.emergentagent.com/job_069d6dd5-2200-4cc6-81fe-4b0e1eaff528/artifacts/eyhtwtm7_image.png",
                "amenities": ["Air Conditioning", "En-suite Bathroom", "Garden View", "Daily Housekeeping"],
            },
            {
                "title": "Standard Room — Single Occupancy",
                "description": "The same standard room for those who prefer their own space. Ideal for full rest and recovery after a day of training and surf.",
                "image": "https://customer-assets.emergentagent.com/job_069d6dd5-2200-4cc6-81fe-4b0e1eaff528/artifacts/tam11rrq_image.png",
                "amenities": ["Air Conditioning", "En-suite Bathroom", "Private Space", "Garden View"],
            },
        ],
        "inclusions": [
            "5 nights accommodation (standard rooms)",
            "Daily breakfast",
            "Daily movement & training sessions",
            "Handstand & skill-specific workshops",
            "Mobility & flexibility sessions",
            "Recovery sessions (stretching, breathwork)",
            "Surf session (beginner-friendly, tide dependent)",
            "Airport transfer (one way included)",
            "Uluwatu Sunset Experience (Padang Padang Beach + Uluwatu Temple + Kecak Fire Dance at sunset)",
            "Celebration dinner (final night)",
        ],
        "exclusions": [
            "Flights to and from Bali",
            "Visa fees (if applicable)",
            "Travel insurance",
            "Lunch & dinner",
            "Personal expenses & shopping",
            "Additional spa treatments",
            "Return airport transfer",
            "Activities outside the itinerary",
        ],
        "itinerary": [
            {"day": "Day 1", "title": "Arrive & Settle In", "details": "Airport pickup, check-in, welcome circle, light evening stretch, and group dinner."},
            {"day": "Day 2", "title": "Foundation & Flow", "details": "Morning movement session focusing on strength foundations, afternoon mobility work, and evening cultural exploration."},
            {"day": "Day 3", "title": "Push Your Edges", "details": "Intensive handstand workshop, skill-specific training, afternoon recovery session, and sunset yoga."},
            {"day": "Day 4", "title": "Adventure Day", "details": "Rice terrace trek, waterfall visit, outdoor training session in nature, community dinner."},
            {"day": "Day 5", "title": "Deep Practice", "details": "Advanced movement drills, partner work, mobility deep-dive, farewell bonfire and sharing circle."},
            {"day": "Day 6", "title": "Reflect & Depart", "details": "Sunrise session, closing ceremony, breakfast, and airport transfers."},
        ],
        "gallery": [
            "https://customer-assets.emergentagent.com/job_069d6dd5-2200-4cc6-81fe-4b0e1eaff528/artifacts/2hsdvuw7_Resort_Swimming_Pool_Main_uif6wr.png",
            "https://customer-assets.emergentagent.com/job_069d6dd5-2200-4cc6-81fe-4b0e1eaff528/artifacts/hrcbflbv_Fitness_Centre_2_syhsr1.jpg",
            "https://customer-assets.emergentagent.com/job_069d6dd5-2200-4cc6-81fe-4b0e1eaff528/artifacts/kpxaioqo_Perfect_Wave_Surf_Lessons_fpy398.jpg",
            "https://customer-assets.emergentagent.com/job_069d6dd5-2200-4cc6-81fe-4b0e1eaff528/artifacts/wnboyor2_WhatsApp_Image_2026-01-21_at_1.00.47_PM_uheoec.jpg",
            "https://customer-assets.emergentagent.com/job_069d6dd5-2200-4cc6-81fe-4b0e1eaff528/artifacts/jx9iixqr_main-resort-area-s-resorts.jpg",
            "https://customer-assets.emergentagent.com/job_069d6dd5-2200-4cc6-81fe-4b0e1eaff528/artifacts/eyhtwtm7_image.png",
            "https://customer-assets.emergentagent.com/job_069d6dd5-2200-4cc6-81fe-4b0e1eaff528/artifacts/tam11rrq_image.png",
            "https://customer-assets.emergentagent.com/job_c64c148e-982e-4ddf-b653-a607620581cd/artifacts/ezr3e571_DSC03302%20%281%29.jpg",
            "https://customer-assets.emergentagent.com/job_c64c148e-982e-4ddf-b653-a607620581cd/artifacts/fumsxgn1_DSC02506%20%281%29.jpg",
        ],
        "pricing": {
            "twinSharing": {"price": "₹88,000 + 5% GST", "note": "Per person, twin sharing basis"},
            "singleOccupancy": {"price": "₹1,10,000 + 5% GST", "note": "Per person, private room"},
            "balanceDue": "Full balance due 30 days before the retreat",
        },
        "attendeeCount": None,  # filled when retreat moves to "past" status
    },
    {
        "id": "gulmarg-2027",
        "status": "coming_soon",
        "title": "The Snow Playground",
        "tagline": "A winter escape blending skiing, movement, and mountain living.",
        "location": "Gulmarg, Kashmir",
        "date": "9th – 14th February 2027",
        "duration": "6 Days / 5 Nights",
        "icon": "mountain",
        "heroImage": "https://images.pexels.com/photos/35873485/pexels-photo-35873485.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
        "description": "A winter escape blending skiing, movement, and mountain living in the breathtaking snow-covered peaks of Gulmarg.",
        "longDescription": "Imagine waking up to snow-capped peaks, fresh mountain air, and six days of skiing, snowboarding, and movement training in one of India's most stunning winter destinations.",
        "atAGlance": [],
        "yourStay": {"title": "Your Stay", "text": [], "image": ""},
        "rooms": [],
        "inclusions": [],
        "exclusions": [],
        "itinerary": [],
        "gallery": [],
        "pricing": {
            "twinSharing": {"price": "TBA", "note": "Per person, twin sharing basis"},
            "singleOccupancy": {"price": "TBA", "note": "Per person, private room"},
        },
    },
]


DEFAULT_SETTINGS = {
    "phone": "+91 9717665603",
    "email": "coaching@sunpreetsingh.com",
    "whatsapp": "919717665603",
    "instagram_personal": "https://www.instagram.com/sunpreet_sing/",
    "instagram_brand": "https://www.instagram.com/movement.shala/",
    "spurfit_url": "https://links.spur.fit/r/pY/sunpreet-singh",
}


DEFAULT_PROGRAMS = [
    {
        "id": "beginner",
        "status": "live",
        "level": "Beginner",
        "name": "Strong & Mobile — Beginner",
        "tagline": "Ready to level up from the basics?",
        "shortDesc": "Build real strength and start working towards your first pull-up, better push-ups, and foundational calisthenics skills.",
        "duration": "4 Weeks",
        "price": "₹2999",
        "sessions": "4x per week · 40–60 mins",
        "setting": "Build foundational strength & body control",
        "primaryFocus": ["Pull-ups (progressions)", "Push strength", "Full-body strength", "Mobility & flexibility"],
        "image": "https://customer-assets.emergentagent.com/job_069d6dd5-2200-4cc6-81fe-4b0e1eaff528/artifacts/v416m6jr_IMG_7724.JPG.jpeg",
        "programLink": "https://links.spur.fit/r/qi/sunpreet-singh/strong-n-mobile",
        "bullets": [
            "4 training sessions per week",
            "40–60 minute workouts",
            "Build foundational strength & body control",
            "First pull-up, handstand foundations, pistol squats",
            "Mobility & splits included",
        ],
        "faq": [
            {"q": "What equipment do I need?", "a": "This program is ideally designed for a gym setup.\n\nRecommended equipment:\n• Pull-up bar\n• Dip bars\n• Parallettes (or alternatives)\n• Bench\n• Resistance bands (3 sizes recommended)\n• Light weights (for lower body mobility & overhead work)\n• Chalk (optional)\n\nYou can adapt the program for home if you have access to most of the above."},
            {"q": "How is the program different from 1:1 coaching?", "a": "The program is essentially the same structure I use in my 1:1 coaching.\n\nThe main difference is that in 1:1, I make small adjustments to weights and reps based on your specific strength level — but the overall training structure stays identical.The other thing 1:1 includes is 2 live sessions every week focused on handstands and mobility, where I can give you real-time feedback and corrections."},
            {"q": "How do I know if I'm doing the movements correctly?", "a": "Each exercise includes a simple video demo, step-by-step guidance, and coaching cues so you always understand the goal of the movement and what good form should look like.The program is designed to help you improve technique gradually instead of rushing progressions.And if you're unsure about anything, you can always message me directly through the app. You can also send videos of your training or movements and I'll personally help you correct your form and technique."},
            {"q": "How do I know if I'm a beginner?", "a": "This program is for you if:\n• You're working towards your first pull-up\n• You're building strength in push-ups\n• You're starting mobility work (splits, backbends)\n• You want to build a base for handstands and calisthenics skills\n\nEven if you can't do a pull-up yet, this program is designed to help you get there."},
            {"q": "How does the program work?", "a": "Once you purchase the program, you'll be redirected to the app.\n• Select your start date\n• Open the app and go to \"Today's Workout\"\n• Follow the exercises in order\n• Log your reps and hold times\n\nYour full 4-week schedule will automatically appear in your calendar.\nMissed a workout? You can always go back and complete it anytime."},
            {"q": "How many days per week is the program?", "a": "• 4 days per week\n• Each session lasts 40–60 minutes"},
            {"q": "Do I need to be flexible?", "a": "No.\nYou don't need to be flexible to start — your flexibility will improve as you follow the program."},
            {"q": "Are legs included?", "a": "Yes.\nThe program includes lower-body strength, mobility, and flexibility training."},
            {"q": "What if I travel or miss training for a few days/weeks?", "a": "That's completely normal. The program is flexible, so you can pause, repeat sessions, or continue from where you left off anytime.Missing an occasional workout or even a week happens to everyone. What matters most is staying consistent over time rather than being perfect every single week.If you're able to train regularly most of the time, you'll still make great progress.But if your schedule realistically won't allow consistent training at all, then any structured program will be difficult to follow properly."},
            {"q": "What if I don't achieve pull-ups or splits in 4 weeks?", "a": "Progress depends on your starting point and consistency.\nYou may not master every skill in 4 weeks, but you will build a strong foundation and make measurable progress."},
            {"q": "How can I get support during the program?", "a": "• You'll get access to a Telegram group for community support\n• You can also reach out via email: sunpreetsinghcoaching2@gmail.com"},
            {"q": "What happens after 4 weeks?", "a": "Once you complete the program, you'll be guided to the next progression level inside the app."},
        ],
    },
    {
        "id": "intermediate",
        "status": "live",
        "level": "Intermediate",
        "name": "Strong & Mobile — Intermediate",
        "tagline": "Already have a base? Time to push further.",
        "shortDesc": "Increase strength, refine control, and progress towards advanced calisthenics skills like handstands and higher pull-up capacity.",
        "duration": "4 Weeks",
        "price": "₹2999",
        "sessions": "4x per week · ~90 mins",
        "setting": "Requires push-up & pull-up strength base",
        "primaryFocus": ["Pull-up strength & volume", "Advanced push strength", "Skill work", "Mobility"],
        "image": "https://customer-assets.emergentagent.com/job_069d6dd5-2200-4cc6-81fe-4b0e1eaff528/artifacts/yudcjiuh_IMG_7728.JPG.jpeg",
        "programLink": "https://links.spur.fit/r/qj/sunpreet-singh/strong-n-mobile--intermediate",
        "bullets": [
            "4 training sessions per week",
            "60–90 minute workouts",
            "Requires push-up & pull-up strength base",
            "Advanced strength progressions",
            "Handstands, mobility & splits",
        ],
        "faq": [
            {"q": "What equipment do I need?", "a": "This program is ideally designed for a gym setup.\n\nRecommended equipment:\n• Pull-up bar\n• Dip bars\n• Parallettes (or alternatives)\n• Bench\n• Resistance bands (3 sizes recommended)\n• Weights (for lower body and overhead work)\n• Chalk (optional)"},
            {"q": "How is the program different from 1:1 coaching?", "a": "The program is essentially the same structure I use in my 1:1 coaching.\n\nThe main difference is that in 1:1, I make small adjustments to weights and reps based on your specific strength level — but the overall training structure stays identical.The other thing 1:1 includes is 2 live sessions every week focused on handstands and mobility, where I can give you real-time feedback and corrections."},
            {"q": "What if I'm completely new to working out?", "a": "If you're just starting out, begin with the Beginner Program first."},
            {"q": "How do I know if I'm intermediate?", "a": "This program is for you if:\n• You can already perform pull-ups and are working on increasing reps\n• You have a solid base in push-ups and bodyweight strength\n• You are working on mobility (splits, backbends)\n• You want to progress towards handstands and advanced skills"},
            {"q": "How does the program work?", "a": "Once you purchase the program, you'll be redirected to the app.\n• Select your start date\n• Open the app and go to \"Today's Workout\"\n• Follow the exercises in order\n• Log your reps and hold times\n\nYour full 8-week schedule will automatically appear in your calendar.\nMissed a workout? You can always go back and complete it anytime."},
            {"q": "How many days per week is the program?", "a": "• 4 days per week\n• Each session lasts around 90 minutes"},
            {"q": "Do I need to be flexible?", "a": "No.\nYour mobility will continue to improve as you follow the program."},
            {"q": "How long do I have access to the program?", "a": "You will have 12 weeks to complete the 8-week program."},
            {"q": "How can I get support during the program?", "a": "• You'll get access to a Telegram group for community support\n• You can also reach out via email: sunpreetsinghcoaching2@gmail.com"},
            {"q": "What happens after 4 weeks?", "a": "Once you complete the program, you'll be guided to the next progression level inside the app."},
        ],
    },
]


DEFAULT_HOME = {
    "hero_headline": "Strong. Mobile. Whole.",
    "hero_sub": "Coaching that builds bodies and lives that actually move.",
    "video_url": "https://customer-assets.emergentagent.com/job_069d6dd5-2200-4cc6-81fe-4b0e1eaff528/artifacts/dme5wy9d_WhatsApp%20Video%202026-05-03%20at%2010.27.36%20PM.mp4",
}


DEFAULT_PRODUCTS = [
    {
        "id": "handstand-canes",
        "title": "Handstand Canes (60 CM)",
        "name": "Handstand Canes (60 CM)",
        "tagline": "Built for Balance & Control",
        "price": 7999,
        "currency": "INR",
        "image": "https://images.pexels.com/photos/6571951/pexels-photo-6571951.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
        "images": [
            "https://images.pexels.com/photos/6571951/pexels-photo-6571951.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
        ],
        "description": "Built for balance, control, and serious handstand practice. Designed to give perfect elevation for improving alignment, shoulder strength, and body awareness.",
        "longDescription": "Whether you are working on your first handstand or refining advanced shapes, these canes offer the stability and elevation you need. The 60 CM height provides optimal wrist positioning, reducing strain while enabling deeper control over your balance. Each pair is built to withstand rigorous daily training while remaining portable enough for travel.",
        "features": [
            "Solid and stable construction",
            "Comfortable grip for better control",
            "Ideal for handstand training and progressions",
            "60 CM height for optimal positioning",
        ],
        "specs": {
            "Height": "60 cm",
            "Material": "Premium hardwood",
            "Grip Diameter": "Ergonomic fit",
            "Weight Capacity": "Heavy-duty support",
        },
        "uses": "Designed for handstand practice, alignment drills, shoulder strengthening, and balance training. Suitable for beginners through advanced practitioners working on one-arm handstands and shape transitions.",
        "rating": 4.9,
        "reviews": 28,
        "total_stock": 20,
        "badge": None,
    },
    {
        "id": "fingerboard",
        "title": "Fingerboard (Two-Stones Style)",
        "name": "Fingerboard (Two-Stones Style)",
        "tagline": "Build Unbreakable Grip Strength",
        "price": 4999,
        "currency": "INR",
        "image": "https://customer-assets.emergentagent.com/job_90358a1f-649a-4495-b3f9-6c9aea022b3c/artifacts/z1yve0yy_WhatsApp%20Image%202026-03-29%20at%201.45.07%20PM%20%281%29.jpeg",
        "images": [
            "https://customer-assets.emergentagent.com/job_90358a1f-649a-4495-b3f9-6c9aea022b3c/artifacts/z1yve0yy_WhatsApp%20Image%202026-03-29%20at%201.45.07%20PM%20%281%29.jpeg",
            "https://customer-assets.emergentagent.com/job_90358a1f-649a-4495-b3f9-6c9aea022b3c/artifacts/ko6bfmbj_WhatsApp%20Image%202026-03-29%20at%201.45.07%20PM%20%282%29.jpeg",
            "https://customer-assets.emergentagent.com/job_90358a1f-649a-4495-b3f9-6c9aea022b3c/artifacts/oc1l0wso_WhatsApp%20Image%202026-03-29%20at%201.45.07%20PM.jpeg",
            "https://customer-assets.emergentagent.com/job_90358a1f-649a-4495-b3f9-6c9aea022b3c/artifacts/5edp2vpg_WhatsApp%20Image%202026-03-29%20at%201.45.08%20PM.jpeg",
        ],
        "description": "A versatile fingerboard designed to build finger strength, grip, and tendon resilience. Inspired by the popular two-stones style.",
        "longDescription": "This fingerboard brings precision grip training into your home or gym. Multiple edge depths and pocket sizes let you progress from beginner hangs to advanced one-arm work. The natural wood finish provides excellent skin friction without being harsh on your fingers.",
        "features": [
            "Multiple grip options for progressive training",
            "Strong and durable wooden build",
            "Ideal for grip strength & injury prevention",
            "Two-stones style inspired design",
        ],
        "specs": {
            "Style": "Two-Stones inspired",
            "Material": "Natural hardwood",
            "Mounting": "Wall-mounted (hardware included)",
            "Grip Edges": "Multiple depths & pockets",
        },
        "uses": "Perfect for climbers, calisthenics athletes, and anyone looking to develop serious finger and forearm strength. Use for dead hangs, repeaters, max hangs, and progressive finger training.",
        "rating": 4.8,
        "reviews": 42,
        "total_stock": 20,
        "badge": None,
    },
    {
        "id": "peg-board",
        "title": "Peg Board (4ft x 2ft)",
        "name": "Peg Board (4ft x 2ft)",
        "tagline": "Challenge Your Upper Body",
        "price": 4999,
        "currency": "INR",
        "image": "https://customer-assets.emergentagent.com/job_90358a1f-649a-4495-b3f9-6c9aea022b3c/artifacts/50uxpoao_WhatsApp%20Image%202026-03-29%20at%201.51.30%20PM.jpeg",
        "images": [
            "https://customer-assets.emergentagent.com/job_90358a1f-649a-4495-b3f9-6c9aea022b3c/artifacts/50uxpoao_WhatsApp%20Image%202026-03-29%20at%201.51.30%20PM.jpeg",
        ],
        "description": "A classic upper body strength tool that challenges your pulling power, coordination, and endurance.",
        "longDescription": "The peg board is one of the most effective upper body training tools available. By climbing with alternating pegs, you develop pulling strength, shoulder stability, and grip endurance simultaneously. Our 4ft x 2ft board is sized perfectly for home gyms while providing enough height for a serious workout.",
        "features": [
            "Develops upper body strength & coordination",
            "Functional and challenging training tool",
            "Suitable for home or gym setups",
            "Includes 2 wooden pegs",
        ],
        "specs": {
            "Dimensions": "4ft x 2ft",
            "Material": "Solid wood construction",
            "Peg Holes": "Evenly spaced grid pattern",
            "Includes": "Board + 2 wooden pegs",
        },
        "uses": "Used for peg board climbing, upper body pulling strength, shoulder stability, and grip endurance. A staple in functional fitness, calisthenics, and climbing training.",
        "rating": 4.7,
        "reviews": 19,
        "total_stock": 20,
        "badge": None,
        "imageStyle": "contain",
    },
    {
        "id": "parallettes",
        "title": "Wooden Parallettes",
        "name": "Wooden Parallettes",
        "tagline": "Your Bodyweight Training Essential",
        "price": 1799,
        "currency": "INR",
        "image": "https://customer-assets.emergentagent.com/job_90358a1f-649a-4495-b3f9-6c9aea022b3c/artifacts/fkoxj584_WhatsApp%20Image%202026-03-29%20at%201.45.46%20PM.jpeg",
        "images": [
            "https://customer-assets.emergentagent.com/job_90358a1f-649a-4495-b3f9-6c9aea022b3c/artifacts/fkoxj584_WhatsApp%20Image%202026-03-29%20at%201.45.46%20PM.jpeg",
        ],
        "description": "Compact, durable, and essential for bodyweight training. Perfect for L-sits, planche progressions, push-ups, and handstand work.",
        "longDescription": "These parallettes are the foundation of any serious bodyweight training setup. Low to the ground yet providing enough clearance for full range of motion, they enable L-sits, planche progressions, handstand push-ups, and countless push-up variations. Their compact design makes them easy to store and transport.",
        "features": [
            "Strong and stable design",
            "Comfortable grip for longer sessions",
            "Ideal for beginners to advanced athletes",
            "Compact and portable",
        ],
        "specs": {
            "Material": "Solid wood with steel base",
            "Grip Diameter": "Ergonomic 38mm",
            "Height": "Low-profile design",
            "Weight Capacity": "Up to 150 kg",
        },
        "uses": "Essential for L-sits, planche progressions, push-up variations, handstand push-ups, and general bodyweight strength training. Used by calisthenics athletes, gymnasts, and movement practitioners worldwide.",
        "rating": 4.9,
        "reviews": 64,
        "total_stock": 20,
        "badge": "Best Seller",
    },
]


async def ensure_seed_content(db):
    """Insert default content for any missing keys. Never overwrites existing."""
    defaults = {
        "retreats": DEFAULT_RETREATS,
        "programs": DEFAULT_PROGRAMS,
        "home": DEFAULT_HOME,
        "about": {},
        "coaching": {},
        "settings": DEFAULT_SETTINGS,
        "testimonials": {},
        "products": DEFAULT_PRODUCTS,
    }
    now = datetime.now(timezone.utc).isoformat()
    for key, data in defaults.items():
        existing = await db.content_documents.find_one({"key": key})
        if not existing:
            await db.content_documents.insert_one({
                "key": key,
                "data": data,
                "updated_at": now,
            })
