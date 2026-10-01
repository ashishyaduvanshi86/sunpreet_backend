# Test Credentials

## Admin Panel
- **URL**: https://coaching-retreat-dev.preview.emergentagent.com/admin
- **Email**: coaching@sunpreetsingh.com
- **Password**: coaching@123
- **Role**: admin

## Auth Endpoints
- `POST /api/auth/login` — body: `{ email, password }`
- `GET /api/auth/me` — Bearer token in Authorization header
- `POST /api/auth/logout`
- `POST /api/auth/change-password` — body: `{ current_password, new_password }`
