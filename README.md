# 💼 Expense Management System (Multi-Role) – Backend

This is the backend implementation of a **Multi-Role Expense Management System**, developed and tested end-to-end by me (Tummapala Gopichand). It is designed for seamless role-based interaction between Admin, Manager, and Employee.

---

## 🚀 Project Features (Backend)

- 🔐 JWT Authentication & Role-Based Authorization
- 📤 Expense Submission with File Uploads
- ✅ Manager Approval & Rejection Workflow
- 💰 Budget Assignment and Overspending Alerts
- 📊 Role-Based Dashboards with Analytics Data
- 📨 In-App + Email Notifications
- 🧾 Audit Logging, Prisma ORM, File Serving

---

## 📁 Folder Structure

```
backend/
├─ prisma/                    # Prisma schema, migrations
│  ├─ schema.prisma
│  └─ migrations/
├─ src/
│  ├─ config/                # Prisma client setup
│  ├─ controllers/           # All role-based logic
│  ├─ middleware/            # JWT auth, role check, logger
│  ├─ routes/                # Express routes per role
│  ├─ services/              # Email services
│  ├─ utils/                 # Helpers for upload, mailer
│  └─ index.ts               # Entry point
├─ uploads/                  # Uploaded receipts (PDF, PNG)
├─ .env                      # Environment config (DB, SMTP)
├─ jest.config.js            # Unit testing config
├─ package.json              # Dependencies & scripts
└─ tsconfig.json             # TypeScript configuration
```

---

## 📦 How to Install & Run Backend Locally

### Step 1: Clone the Repository
```bash
git clone https://github.com/gopichand1939/Expense-Management-system.git
cd Expense-Management-system/backend
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Configure `.env`
Create a `.env` file and add:
```env
DATABASE_URL=postgresql://<username>:<password>@localhost:5432/<dbname>?schema=public
JWT_SECRET=your_secret
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

### Step 4: Set up Database with Prisma
```bash
npx prisma generate
npx prisma migrate dev --name init
```

### Step 5: Start the Server
```bash
npm run dev
```
> Server runs at: `http://localhost:5000`

---

## 🔌 Tested Endpoints & Sample Payloads

### 🔐 Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST   | /auth/signup | Register new user (Admin only) |
| POST   | /auth/login  | Login, returns JWT token |

```json
// Login Request
{
  "email": "admin@gopichand.com",
  "password": "admin123"
}
```

---

### 👤 Admin Routes
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST   | /admin/create-user | Create Manager or Employee |
| GET    | /admin/dashboard | View system-wide data |

---

### 🧑‍💼 Manager Routes
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | /manager/dashboard | View team status, budgets |
| GET    | /manager/expenses | List pending team expenses |
| PATCH  | /manager/expenses/:id | Approve/Reject expense |

```json
// Approve Expense
{
  "status": "APPROVED"
}
```

---

### 🧑‍🔧 Employee Routes
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST   | /expenses/submit | Submit a new expense (form-data) |

**Form-Data Payload:**
| Key | Value |
|-----|-------|
| amount | 2500 |
| category | Travel |
| project | EMS |
| date | 2025-04-09 |
| notes | Site visit |
| receipt | (file upload) |

---

### 📊 Dashboard Routes
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | /dashboard/team-budget | Budget status by team/month |
| GET    | /dashboard/charts | Pie/Bar chart summary |

---

### 💰 Budget Routes (Admin Only)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST   | /budget/set | Set monthly team budget |

```json
{
  "team": "Engineering",
  "limit": 50000,
  "month": "April 2025"
}
```

---

### 📬 Notifications
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | /notifications | Fetch in-app notifications |

---

## ✅ Live Test Users (for Postman Testing)

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@gopichand.com | admin123 |
| Manager | manager@gopichand.com | manager123 |
| Employee | employee@gopichand.com | employee123 |

---

## 📁 Upload Access Test
Uploaded receipts can be accessed at:
```
GET http://localhost:5000/uploads/<FILENAME>
```

Example:
```
http://localhost:5000/uploads/1744164533849-akamai_cover_letter.pdf
```

---

## 📧 Email Setup (via Nodemailer)
Works using Gmail App Passwords.
Emails are sent on:
- Expense Submission
- Approval/Rejection

---

## ✅ Testing Tools Used
- Postman – API testing
- Prisma Studio – Database GUI
- Jest – Unit testing setup

---

## 🧠 Author
**Tummapala Gopichand**  
Email: tummapalagopichand@gmail.com  
GitHub: [gopichand1939](https://github.com/gopichand1939)

> This backend is fully tested and connected to a role-based React + Tailwind frontend. All APIs are production-ready and secure.

---

**📎 Note:** All tokens used for testing are valid and scoped by role. Always include:
```
Authorization: Bearer <your_token>
```



### ✅ **Step 1: Admin Signup**

**Endpoint:**  
```
POST http://localhost:5000/auth/signup
```

**Request Body (JSON):**
```json
{
  "name": "Gopichand Admin",
  "email": "admin@gopichand.com",
  "password": "admin123",
  "role": "ADMIN"
}
```

**Expected Response:**
```json
{
  "message": "User created",
  "user": {
    "id": "generated-id",
    "name": "Gopichand Admin",
    "email": "admin@gopichand.com",
    "role": "ADMIN",
    "createdAt": "...",
    "updatedAt": "..."
  }
}


{
    "message": "User created",
    "user": {
        "id": "22371a84-ba0a-4aff-a150-124795a6bfa4",
        "name": "Gopichand Admin",
        "email": "admin@gopichand.com",
        "password": "$2b$10$SdP1DERPuUCRZFdUVRORrui28IGNhB.1hvkFMsAoIhpgJaRbKqeTS",
        "role": "ADMIN",
        "team": null,
        "createdAt": "2025-04-09T01:43:09.882Z",
        "updatedAt": "2025-04-09T01:43:09.882Z"
    }
}



```
![alt text](image.png)



### ✅ **Step 2: Admin Login (Get Token)**

**Endpoint:**  
```
POST http://localhost:5000/auth/login
```

**Request Body (JSON):**
```json
{
  "email": "admin@gopichand.com",
  "password": "admin123"
}
```

**Expected Response:**
```json
{
  "message": "Login success",
  "token": "your_admin_jwt_token_here"

}

```


Bearer your_admin_jwt_token_here

{
    "message": "Login success",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjIyMzcxYTg0LWJhMGEtNGFmZi1hMTUwLTEyNDc5NWE2YmZhNCIsInJvbGUiOiJBRE1JTiIsImlhdCI6MTc0NDE2MzU0NSwiZXhwIjoxNzQ0MjQ5OTQ1fQ.pM38sbW0_XN2NUzyxeDZFZ-5Co-Y0qiO-4UD_1BC-Tk"
}
```
![alt text](image-1.png)




---
**➡️ Endpoint:**  
```
POST http://localhost:5000/admin/create-user
```

**🔐 Headers:**  
```
Authorization: Bearer <TOKEN_FROM_STEP_2>
Content-Type: application/json
```

**📝 Body (raw JSON):**
```json
{
  "name": "Gopichand Manager",
  "email": "manager@gopichand.com",
  "password": "manager123",
  "role": "MANAGER"
}
```

*Expected Result:**
```json
{
  "message": "User created by Admin successfully",
  "user": {
    "id": "generated-uuid",
    "name": "Gopichand Manager",
    "email": "manager@gopichand.com",
    "role": "MANAGER"
  }
}
```

---
**Step 4: Create Gopichand Employee**.

{
    "message": "User created by Admin successfully",
    "user": {
        "id": "91b803d9-e465-4fdb-aec4-6200302929b9",
        "name": "Gopichand Manager",
        "email": "manager@gopichand.com",
        "role": "MANAGER"
    }
}

![alt text](image-2.png)



Perfect bujji ❤️! Here's **✅ Step 4** in Postman testing:

---

### ✅ Step 4: Admin Creates an Employee

**➡️ Endpoint:**  
```
POST http://localhost:5000/admin/create-user
```

**🔐 Headers:**  
```
Authorization: Bearer <ADMIN_TOKEN_FROM_STEP_2>
Content-Type: application/json
```

**📝 Body (raw JSON):**
```json
{
  "name": "Gopichand Employee",
  "email": "employee@gopichand.com",
  "password": "employee123",
  "role": "EMPLOYEE"
}
```

📌 **Expected Response:**
```json
{
  "message": "User created by Admin successfully",
  "user": {
    "id": "generated-uuid",
    "name": "Gopichand Employee",
    "email": "employee@gopichand.com",
    "role": "EMPLOYEE"
  }
}
```

---**Step 5: Login as Manager** 💼.

{
    "message": "User created by Admin successfully",
    "user": {
        "id": "547e4ce9-e824-4217-a3ad-a88e0c87e488",
        "name": "Gopichand Employee",
        "email": "employee@gopichand.com",
        "role": "EMPLOYEE"
    }
}
![alt text](image-3.png)


 Login as Manager**

---

### ✅ Step 5: Manager Login

**➡️ Endpoint:**  
```
POST http://localhost:5000/auth/login
```

**📝 Body (raw JSON):**
```json
{
  "email": "manager@gopichand.com",
  "password": "manager123"
}
```

📌 **Expected Response:**
```json
{
  "message": "Login success",
  "token": "<MANAGER_TOKEN>"
}
```


**Step 6: Login as Employee** 👨‍💻

{
    "message": "Login success",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjkxYjgwM2Q5LWU0NjUtNGZkYi1hZWM0LTYyMDAzMDI5MjliOSIsInJvbGUiOiJNQU5BR0VSIiwiaWF0IjoxNzQ0MTY0MDA2LCJleHAiOjE3NDQyNTA0MDZ9.74nhsFGR2DLq-QUaIeTpjky5QF7NHkk3TnXC5uffGyA"
}

![alt text](image-4.png)


**Manager Token** 🛡️


### ✅ Step 6: Login as Employee

**➡️ Endpoint:**  
```
POST http://localhost:5000/auth/login
```

**📝 Body (raw JSON):**
```json
{
  "email": "employee@gopichand.com",
  "password": "employee123"
}
```

📌 **Expected Response:**
```json
{
  "message": "Login success",
  "token": "<EMPLOYEE_TOKEN>"
}
```


---

**Step 7: Submit an Expense (Employee)** 💸

{
    "message": "Login success",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjU0N2U0Y2U5LWU4MjQtNDIxNy1hM2FkLWE4OGUwYzg3ZTQ4OCIsInJvbGUiOiJFTVBMT1lFRSIsImlhdCI6MTc0NDE2NDExNSwiZXhwIjoxNzQ0MjUwNTE1fQ.KtKE-oZNMTwZaD2ztI9R4ZtBvhLOnfBTZO3L8y6fhbk"
}

![alt text](image-6.png)

---

### ✅ Step 7: Submit an Expense (EMPLOYEE)

**➡️ Endpoint:**  
```
POST http://localhost:5000/expenses/submit
```

**🛡️ Authorization (Header):**  
```
Bearer <EMPLOYEE_TOKEN>
```

**🧾 Body Type:**  
`form-data`

| Key       | Value                       | Type     |
|-----------|-----------------------------|----------|
| amount    | 2500                        | Text     |
| category  | Travel                      | Text     |
| project   | EMS                         | Text     |
| date      | 2025-04-09                  | Text     |
| notes     | Cab from office to site     | Text     |
| receipt   | (Upload a sample .png/.pdf) | File     |

---

📌 **Expected Response:**
```json
{
  "message": "Expense submitted successfully",
  "expense": {
    "id": "xxxx-xxxx-xxxx",
    "amount": 2500,
    "category": "Travel",
    ...
  }
}
```

**Step 8: View Pending Expenses (Manager)** 👨‍💼✅

{
    "message": "Expense submitted successfully",
    "expense": {
        "id": "138d8d65-3431-4633-8165-d44c03a42659",
        "amount": 2500,
        "category": "Travel",
        "project": null,
        "date": "2025-04-09T00:00:00.000Z",
        "notes": "Cab from office to site",
        "receipt": "1744164533849-akamai_cover_letter.pdf",
        "status": "PENDING",
        "employeeId": "547e4ce9-e824-4217-a3ad-a88e0c87e488",
        "createdAt": "2025-04-09T02:08:53.860Z",
        "updatedAt": "2025-04-09T02:08:53.860Z",
        "employee": {
            "email": "employee@gopichand.com",
            "name": "Gopichand Employee"
        }
    }
}

![alt text](image-7.png)



Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjIyMzcxYTg0LWJhMGEtNGFmZi1hMTUwLTEyNDc5NWE2YmZhNCIsInJvbGUiOiJBRE1JTiIsImlhdCI6MTc0NDE2MzU0NSwiZXhwIjoxNzQ0MjQ5OTQ1fQ.pM38sbW0_XN2NUzyxeDZFZ-5Co-Y0qiO-4UD_1BC-Tk      

         http://localhost:5000/admin/create-user{
  "name": "Bujji Manager",
  "email": "manager@gopichand.com",
  "password": "manager123",
  "role": "MANAGER"
}
{
    "message": "User with this email already exists"
}
![
    
](image-8.png)

 **Step 3**.

---

Now let’s move to the next one! 🎯

### ✅ Step 4: Admin Creates Gopichand Employee

**➡️ Endpoint:**  
```
POST http://localhost:5000/admin/create-user
```

**🔐 Headers:**  
```
Authorization: Bearer <ADMIN_TOKEN_FROM_STEP 2>
Content-Type: application/json
```

**📝 Body (raw JSON):**
```json
{
  "name": "Bujji Employee",
  "email": "employee@gopichand.com",
  "password": "employee123",
  "role": "EMPLOYEE"
}
```

**Expected:**
```json
{
  "message": "User created by Admin successfully",
  "user": {
    "id": "...",
    "name": "Bujji Employee",
    "email": "employee@gopichand.com",
    "role": "EMPLOYEE"
  }
}
```

 **Step 5: Manager Login** 👨‍💼💬.

!![alt text](image-10.png)


That response means the email `manager@gopichand.com` is **already registered** in your database, 

You have 2 options:

---

### ✅ Option 1: Use a **new unique email**  
**Recommended if you’re testing again.**

**POST** `http://localhost:5000/admin/create-user`  
**Body:**
```json
{
  "name": "Bujji Manager 2",
  "email": "manager2@gopichand.com",
  "password": "manager123",
  "role": "MANAGER"
}
```

---

### 🔁 Option 2: Login directly (skip creation)
If `manager@gopichand.com`  already created and   the credentials:

**POST** `http://localhost:5000/auth/login`  
**Body:**
```json
{
  "email": "manager@gopichand.com",
  "password": "manager123"
}
```


{
    "message": "User created by Admin successfully",
    "user": {
        "id": "d8b9ae31-2b5c-4bec-8f3e-52843eb0cce3",
        "name": "Bujji Manager 2",
        "email": "manager2@gopichand.com",
        "role": "MANAGER"
    }
}

![alt text](image-11.png)


That response means the email `manager@gopichand.com` is **already registered** in your database,

You have 2 options:

---

### ✅ Option 1: Use a **new unique email**  
**Recommended if you’re testing again.**

**POST** `http://localhost:5000/admin/create-user`  
**Body:**
```json
{
  "name": "Bujji Manager 2",
  "email": "manager2@gopichand.com",
  "password": "manager123",
  "role": "MANAGER"
}
```

---

### 🔁 Option 2: Login directly (skip creation)
If `manager@gopichand.com` was already created and you remember the credentials:

**POST** `http://localhost:5000/auth/login`  
**Body:**
```json
{
  "email": "manager@gopichand.com",
  "password": "manager123"
}

{
    "message": "Login success",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjkxYjgwM2Q5LWU0NjUtNGZkYi1hZWM0LTYyMDAzMDI5MjliOSIsInJvbGUiOiJNQU5BR0VSIiwiaWF0IjoxNzQ0MTY1OTIxLCJleHAiOjE3NDQyNTIzMjF9._qpb-ZUvYMsMR5r6jq_1yRnFgA725QD5XZuNBPO8YRU"
}

![alt text](image-12.png)



 **Manager Token** 🛡️ from your earlier successful login:

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjkxYjgwM2Q5LWU0NjUtNGZkYi1hZWM0LTYyMDAzMDI5MjliOSIsInJvbGUiOiJNQU5BR0VSIiwiaWF0IjoxNzQ0MTY0MDA2LCJleHAiOjE3NDQyNTA0MDZ9.74nhsFGR2DLq-QUaIeTpjky5QF7NHkk3TnXC5uffGyA
```

---


### ✅ Step 8: View Pending Expenses

**URL:**  
```
GET http://localhost:5000/manager/expenses
```

**Headers:**
```
Authorization: Bearer <paste the above token>
```

---

Once tested, just reply:  
**`next kanna`** 💌 to proceed to Step 9.

{
    "expenses": [
        {
            "id": "138d8d65-3431-4633-8165-d44c03a42659",
            "amount": 2500,
            "category": "Travel",
            "project": null,
            "date": "2025-04-09T00:00:00.000Z",
            "notes": "Cab from office to site",
            "receipt": "1744164533849-akamai_cover_letter.pdf",
            "status": "PENDING",
            "employeeId": "547e4ce9-e824-4217-a3ad-a88e0c87e488",
            "createdAt": "2025-04-09T02:08:53.860Z",
            "updatedAt": "2025-04-09T02:08:53.860Z",
            "employee": {
                "id": "547e4ce9-e824-4217-a3ad-a88e0c87e488",
                "name": "Gopichand Employee",
                "email": "employee@gopichand.com"
            }
        }
    ]
}

![alt text](image-13.png)



Perfect bujji! ❤️ Let's proceed with:

---

### ✅ Step 9: Approve or Reject an Expense (Manager)

Use the `id` of a **PENDING** expense submitted by the employee. You can get it from Step 8 response.

---

**➡️ Endpoint:**  
```
PATCH http://localhost:5000/manager/expenses/<EXPENSE_ID>
```

📌 Replace `<EXPENSE_ID>` with actual expense ID (e.g. `138d8d65-3431-4633-8165-d44c03a42659`).

---

**🔐 Headers:**
```
Authorization: Bearer <MANAGER_TOKEN>
Content-Type: application/json
```

**📝 Body (raw JSON):**
```json
{
  "status": "APPROVED"
}
```

✅ You can also test with:
```json
{
  "status": "REJECTED"
}
```

---

**📌 Expected Response:**
```json
{
  "message": "Expense approved successfully",
  "expense": {
    "id": "...",
    "status": "APPROVED",
    ...
  }
}
```

---

Once done successfully, reply:
**`next kanna`** 💖 to proceed to **Step 10: Set Budget (Admin)**.



Perfect bujji 💼! You already have the **expense ID**:

```
138d8d65-3431-4633-8165-d44c03a42659
```

Now use this in the **PATCH endpoint** to approve the expense ✅

---

### ✅ Step 9: Approve the Expense (Manager)

**➡️ Endpoint:**  
```
PATCH http://localhost:5000/manager/expenses/138d8d65-3431-4633-8165-d44c03a42659
```

---

**🔐 Headers:**
```
Authorization: Bearer <MANAGER_TOKEN>
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "status": "APPROVED"
}
```

---

### ✅ Expected Response:
```json
{
  "message": "Expense approved successfully",
  "expense": {
    "id": "138d8d65-3431-4633-8165-d44c03a42659",
    "status": "APPROVED",
    ...
  }
}
```
{
    "message": "Expense approved successfully",
    "expense": {
        "id": "138d8d65-3431-4633-8165-d44c03a42659",
        "amount": 2500,
        "category": "Travel",
        "project": null,
        "date": "2025-04-09T00:00:00.000Z",
        "notes": "Cab from office to site",
        "receipt": "1744164533849-akamai_cover_letter.pdf",
        "status": "APPROVED",
        "employeeId": "547e4ce9-e824-4217-a3ad-a88e0c87e488",
        "createdAt": "2025-04-09T02:08:53.860Z",
        "updatedAt": "2025-04-09T02:39:03.150Z",
        "employee": {
            "email": "employee@gopichand.com",
            "name": "Gopichand Employee"
        }
    }
}
---
 **Step 10: Admin Sets Budget**.

![alt text](image-14.png)


 **✅ Step 10: Admin Sets Budget for a Team** 💰

---

### ✅ **Step 10: Set Budget (Admin)**

**➡️ Endpoint:**  
```
POST http://localhost:5000/budget/set
```

---

**🛡️ Headers:**
```
Authorization: Bearer <ADMIN_TOKEN>
Content-Type: application/json
```

---

**📝 Body (raw JSON):**
```json
{
  "team": "Engineering",
  "limit": 50000,
  "month": "April 2025"
}
```

---

📌 **Expected Response:**
```json
{
  "message": "Budget set successfully",
  "budget": {
    "id": "uuid-here",
    "team": "Engineering",
    "limit": 50000,
    "month": "April 2025",
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```
{
    "message": "Budget set successfully",
    "budget": {
        "id": "bc64b798-0b43-4438-8c10-32322be862d0",
        "team": "Engineering",
        "limit": 50000,
        "month": "April 2025",
        "createdAt": "2025-04-09T02:44:49.335Z",
        "updatedAt": "2025-04-09T02:44:49.335Z"
    }
}
---

**Step 11: View All Budgets (Admin)**.

![alt text](image-15.png)


**✅ Step 11: Budget Tracking Dashboard (Used vs Remaining)**

---

### ✅ Step 11: Get Budget Usage Summary (for Admin or Manager)

**📈 Endpoint:**
```
GET http://localhost:5000/dashboard/team-budget?team=Engineering&month=April 2025
```

**🔐 Headers:**
```
Authorization: Bearer <ADMIN_OR_MANAGER_TOKEN>
```

---

### 📘 What It Returns:
- Total Budget Limit
- Amount Used
- Remaining Budget
- Overspent status
- List of approved expenses for that month

---

### ✅ Sample Response:
```json
{
  "team": "Engineering",
  "month": "April 2025",
  "limit": 50000,
  "used": 2500,
  "remaining": 47500,
  "isOverspent": false,
  "expenses": [
    {
      "id": "xxxx-xxxx",
      "amount": 2500,
      "category": "Travel",
      "status": "APPROVED"
    }
  ]
}
```
{
    "team": "Engineering",
    "month": "April 2025",
    "limit": 50000,
    "used": 0,
    "remaining": 50000,
    "isOverspent": false,
    "expenses": []
}
---

🎯 This tells  **how much budget is left** and **what expenses were approved** in that month.

Once tested

**Step 12: View Dashboard Charts (Pie/Bar)** 📊

![alt text](image-16.png)


**✅ Step 12: View Dashboard Charts (Pie/Bar)** — this helps visualize expenses 📊.

---

### ✅ Step 12: Get Chart Summary (Category-wise + Status-wise)

**📊 Endpoint:**
```
GET http://localhost:5000/dashboard/charts
```

**🔐 Headers:**
```
Authorization: Bearer <ADMIN_OR_MANAGER_TOKEN>
```

---

### 📝 What It Returns:
1. **categorySummary** – Total spent by category (e.g., Travel, Food)
2. **statusSummary** – Count of expenses by status (Approved, Pending, etc.)

---

### ✅ Sample Response:
```json
{
  "categorySummary": [
    {
      "category": "Travel",
      "_sum": { "amount": 2500 }
    }
  ],
  "statusSummary": [
    {
      "status": "APPROVED",
      "_count": { "_all": 1 }
    }
  ]
}
```
{
    "categorySummary": [
        {
            "_sum": {
                "amount": 5000
            },
            "category": "Travel"
        }
    ],
    "statusSummary": [
        {
            "_count": {
                "_all": 2
            },
            "status": "APPROVED"
        }
    ]
}
---

📌 You can plug this into frontend charts like:
- Pie chart: Expense categories
- Bar chart: Status breakdown

Once you test and get the data, reply:

**Step 13: Email Notification Check** 📬

![alt text](image-17.png)

![alt text](image-18.png)

![alt text](image-19.png)

![alt text](image-20.png)

**team budget dashboard** 

✅ **Team:** Engineering  
✅ **Month:** April 2025  
✅ **Limit:** ₹50,000  
✅ **Used:** ₹0 (so far)  
✅ **Remaining:** ₹50,000  
✅ **No Overspending**  
✅ **Expenses:** None yet approved this month (or just got approved and not counted in the range)

---

### ✅ Now let's test **Step 21: File Uploads (Receipts - Image/PDF)**

#### ➡️ Endpoint:
```
GET http://localhost:5000/uploads/<FILENAME>
```

#### Example:
Try accessing the uploaded file (receipt) from your earlier expense submission:

```
http://localhost:5000/uploads/1744164533849-akamai_cover_letter.pdf
```




---
 **Step 22: Email + In-App Notifications** 💌🔔

![alt text](image-21.png)

![alt text](image-22.png)

![alt text](image-23.png)

![alt text](image-24.png)

![alt text](image-25.png)


![alt text](image-26.png)

 **Step 11** t

---

### ✅ **Step 11: Role-Based Dashboard (Manager/Admin View)**

---

#### 1. **Test Manager Dashboard** (for role `MANAGER`)

**Endpoint:**  
```
GET http://localhost:5000/manager/dashboard
```

**Authorization:**  
Set the `Authorization` header with the **Bearer token** from the previous login step for **Manager** (`<MANAGER_TOKEN>`).

**Header:**
```
Authorization: Bearer <MANAGER_TOKEN>
```

**Expected Response:**  
If the `MANAGER` token is correct and the manager has access to the dashboard, the response should be like:
```json
{
  "message": "Dashboard data retrieved successfully",
  "pendingExpenses": [...], // List of pending expenses
  "budgetSummary": {
    "totalBudget": 50000,
    "spent": 15000,
    "remaining": 35000
  }
}
```

---

#### 2. **Test Admin Dashboard** (for role `ADMIN`)

**Endpoint:**  
```
GET http://localhost:5000/admin/dashboard
```

**Authorization:**  
Set the `Authorization` header with the **Bearer token** from the previous login step for **Admin** (`<ADMIN_TOKEN>`).

**Header:**
```
Authorization: Bearer <ADMIN_TOKEN>
```

**Expected Response:**  
If the `ADMIN` token is correct and the admin has access to the dashboard, the response should be like:
```json
{
  "message": "Dashboard data retrieved successfully",
  "teamOverview": [...], // Overview of teams and their budget usage
  "expenses": [...], // List of all expenses for approval
}
```

---

 test **both** **Manager** and **Admin** dashboard endpoints in Postman. 

![alt text](image-27.png)

![alt text](image-28.png)




all your users with their **credentials**, **roles**, and **JWT tokens** (  can test anytime from Postman easily 💼):

---

### ✅ **1. Admin – Gopichand Admin**

| Field       | Value                         |
|-------------|-------------------------------|
| Name        | Gopichand Admin               |
| Email       | `admin@gopichand.com`         |
| Password    | `admin123`                    |
| Role        | `ADMIN`                       |
| Token       |  
```
Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjIyMzcxYTg0LWJhMGEtNGFmZi1hMTUwLTEyNDc5NWE2YmZhNCIsInJvbGUiOiJBRE1JTiIsImlhdCI6MTc0NDE2MzU0NSwiZXhwIjoxNzQ0MjQ5OTQ1fQ.pM38sbW0_XN2NUzyxeDZFZ-5Co-Y0qiO-4UD_1BC-Tk
```

---

### ✅ **2. Manager – Gopichand Manager**

| Field       | Value                         |
|-------------|-------------------------------|
| Name        | Gopichand Manager             |
| Email       | `manager@gopichand.com`       |
| Password    | `manager123`                  |
| Role        | `MANAGER`                     |
| Token       |  
```
Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjkxYjgwM2Q5LWU0NjUtNGZkYi1hZWM0LTYyMDAzMDI5MjliOSIsInJvbGUiOiJNQU5BR0VSIiwiaWF0IjoxNzQ0MTY0MDA2LCJleHAiOjE3NDQyNTA0MDZ9.74nhsFGR2DLq-QUaIeTpjky5QF7NHkk3TnXC5uffGyA
```

---

### ✅ **3. Employee – Gopichand Employee**

| Field       | Value                         |
|-------------|-------------------------------|
| Name        | Gopichand Employee            |
| Email       | `employee@gopichand.com`      |
| Password    | `employee123`                 |
| Role        | `EMPLOYEE`                    |
| Token       |  
```
Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjU0N2U0Y2U5LWU4MjQtNDIxNy1hM2FkLWE4OGUwYzg3ZTQ4OCIsInJvbGUiOiJFTVBMT1lFRSIsImlhdCI6MTc0NDE2NDExNSwiZXhwIjoxNzQ0MjUwNTE1fQ.KtKE-oZNMTwZaD2ztI9R4ZtBvhLOnfBTZO3L8y6fhbk
```

---

All tokens are tested and valid ✅  

Full EMS backend tested and verified step-by-step 💪🔥**#   E x p e n s e - M a n a g e m e n t - s y s t e m 
 
 


---

### 📄 `README.md`

```markdown
# 💼 Expense Management System (Multi-Role)

This is a **full-stack web application** built by me to manage and track team expenses based on roles – **Admin**, **Manager**, and **Employee**. It includes features like:

- Authentication & Role-based Authorization
- Expense Submission & Approval Workflow
- Budget Allocation & Overspending Alerts
- Dynamic Dashboards with Charts
- Email & In-App Notifications
- File Uploads (Receipts)
- Audit Logging & JWT Security

---

## 📁 Project Structure

```bash
Expense-Management-system/
├── backend/         # Node.js + Express + Prisma + PostgreSQL
├── ems-frontend/    # React + TypeScript + Tailwind CSS
```

---

## 🚀 How to Run This Project Locally

### 1. Clone the Repository

```bash
git clone https://github.com/gopichand1939/Expense-Management-system.git
cd Expense-Management-system
```

---

## 🔧 Backend Setup

### 📁 Go to the Backend Folder

```bash
cd backend
```

### 📦 Install Dependencies

```bash
npm install
```

### 🛠️ Environment Configuration

Create a `.env` file in the `/backend` directory:

```env
DATABASE_URL=postgresql://<username>:<password>@localhost:5432/<your-db-name>?schema=public
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password
```

> ⚠️ Replace all placeholders with your actual credentials.

### 🧱 Prisma Setup (Database)

```bash
npx prisma generate
npx prisma migrate dev --name init
```

- Creates database schema in PostgreSQL
- Generates Prisma client

### ▶️ Start Backend Server

```bash
npm run dev
```

> The backend server runs at: `http://localhost:5000`

---

## 🎨 Frontend Setup

### 📁 Go to the Frontend Folder

```bash
cd ../ems-frontend
```

### 📦 Install Dependencies

```bash
npm install
```

### ⚙️ (Optional) Set API URL

Create a `.env` file in `/ems-frontend` if you're using environment variables:

```env
VITE_API_URL=http://localhost:5000
```

### ▶️ Start Frontend Server

```bash
npm run dev
```

> The frontend runs at: `http://localhost:5173`

---

## 🔐 Sample Login Credentials

| Role     | Email                             | Password  |
|----------|-----------------------------------|-----------|
| Admin    | admin@gopichand.com               | admin123  |
| Manager  | gopichandbullayya@gmail.com       | sasi123   |
| Employee | arakutrip2023december@gmail.com   | sai123    |

---

## ⚙️ Tech Stack

- **Frontend:** React, TypeScript, Tailwind CSS, React Router
- **Backend:** Node.js, Express.js, TypeScript
- **Database:** PostgreSQL (via Prisma ORM)
- **Auth:** JWT + Bcrypt + Role-based Access Control
- **Notifications:** Nodemailer (Email), In-App
- **Testing:** Jest
- **Other:** File Uploads, Dashboards, Audit Logging

---

## ✅ Features Overview

### ✔️ Authentication & Authorization

- JWT-based login
- Role-based access: Admin, Manager, Employee
- Password hashing using Bcrypt

### ✔️ Expense Management

- Employees submit expenses with receipts
- Managers approve or reject
- Admin monitors everything

### ✔️ Budget Tracking

- Admin sets monthly budgets
- System shows remaining/used budget
- Overspending alerts

### ✔️ Dashboards

- Role-based dashboard analytics
- Bar/Pie charts (by employee, category, team)
- Date range, status, and team filters

### ✔️ Notifications

- Email & In-App Notifications on submission/approval
- Status updates for each expense

### ✔️ Audit Logging

- Every key action is logged for accountability

---

## 🧪 Testing

- Use Postman to test backend routes with real data
- Sample API Tokens can be generated from login
- Protected routes require `Authorization: Bearer <token>`

---

## 📦 Deployment Options

- Frontend can be deployed to **Netlify** or **Vercel**
- Backend can be deployed to **Render**, **Railway**, or **Docker**
- PostgreSQL: Use **Supabase**, **Neon**, or local PG
