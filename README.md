# Finance Data Processing Backend

A robust, type-safe API for managing financial records and roles.

## Tech Stack
- **TypeScript + Node.js**
- **Express.js** 
- **Prisma ORM**
- **SQLite**
- **Zod** (Validation)
- **JWT & bcrypt** (Authentication & Storage)

## Setup & Execution

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Database Migrations
```bash
npx prisma db push
```

### 3. Start the Server
```bash
npm run dev
```
*The server will start on port 3000.*

## Live API Endpoint  
<a href="https://finance-backend-api-gshn.onrender.com/" target="_blank">
  https://finance-backend-api-gshn.onrender.com/
</a>

## For Testing Purpose  
You can use: http://127.0.0.1:5500/sandbox.html

## Role & Permission Matrix

| Endpoint | Role | Description |
|---|---|---|
| `GET /api/dashboard/summary` | **VIEWER, ANALYST, ADMIN** | View aggregated metric figures (Income, Expenses, netBalance). |
| `GET /api/records` | **ANALYST, ADMIN** | List raw financial entries. Filterable by date or category. |
| `GET /api/records/:id` | **ANALYST, ADMIN** | View a single financial record. |
| `POST, PUT, DELETE /api/records` | **ADMIN** | Full CRUD over records. `DELETE` enforces soft-deletion (`deletedAt`). |
| `GET /api/users` | **ADMIN** | Can list all platform users. |
| `PUT /api/users/:id/status` | **ADMIN** | Can toggle user access loops or promote roles. |

## Assumptions and Tradeoffs

- **Registration Overrides**: The `role` property in the `/api/auth/register` payload is intentionally left unshielded purely for **development convenience** so testing instances can bootstrap an `ADMIN` instantly. In production, registration would default to `VIEWER` and only verified `ADMIN` accounts or direct database seeding could assign escalated roles.
- **Float vs Cents Storage**: Due to simplistic metric requirements, currency relies on `Float`. A production environment interacting deeply with financial compliance rules would serialize numbers out to integers representing flat cents before persistence to avoid IEEE floating-point precision issues.
- **SQLite For Evaluator Zero-Setup**: This stack uses local filesystem `dev.db` storage. A true deployment topology handling actual load would detach data persistence through `PostgresSQL`.
- **Soft Deletes Context**: A `deletedAt` field governs `DELETE` operations keeping financial ledgers immutable while stripping them cleanly from the Dashboard Services or API hooks dynamically.

## Evaluation Sandbox Screenshots

Here is visual documentation of the API behaving identically to our integration tests during manual testing:

### 1. Authentication Configuration
After entering credentials into the `/api/auth/register` and `/api/auth/login` layers, an active JSON Web Token successfully bootstraps the current session:
<img width="1440" height="752" alt="Screenshot 2026-04-01 at 4 33 54 PM" src="https://github.com/user-attachments/assets/3b0055e0-4c2c-4d60-851c-d17d7250d893" />
<img width="1440" height="781" alt="Screenshot 2026-04-01 at 4 34 04 PM" src="https://github.com/user-attachments/assets/a541b2e3-a7de-420c-bc62-703e15f03aa8" />



### 2. Creating a Financial Record (ADMIN)
An `ADMIN` role can cleanly populate the raw ledger. An `INCOME` payload is drafted and correctly fires the `POST /api/records` route, logging exactly as modelled in Prisma:
<img width="1440" height="760" alt="Screenshot 2026-04-01 at 4 34 34 PM" src="https://github.com/user-attachments/assets/10dad361-226d-4df1-99f1-0adecbbe44b5" />



### 3. Fetching Aggregated Dashboards
Any authorized role calling `GET /api/dashboard/summary` triggers our Prisma aggregators. The system totals the income and breaks out nested maps flawlessly:
<img width="1440" height="766" alt="Screenshot 2026-04-01 at 4 34 52 PM" src="https://github.com/user-attachments/assets/4c6dbc19-b884-4e65-814c-2e8cbb0abdd3" />



### 4. RBAC Protection (VIEWER Guard)
When generating a `VIEWER` access token, a deliberate structural protection rejects mutative queries. The `POST /api/records` route traps the request returning a strict `404` status:
<img width="1440" height="779" alt="Screenshot 2026-04-01 at 4 35 39 PM" src="https://github.com/user-attachments/assets/1677df11-0c2f-42dd-aa12-5745ad95fcb6" />

