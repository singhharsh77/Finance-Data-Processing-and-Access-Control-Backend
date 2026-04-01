#!/bin/bash

# ==========================================
# TEST SCRIPT FOR FINANCE API BACKEND
# ==========================================

echo "1. Registering an ADMIN user..."
curl -s -X POST http://localhost:3000/api/auth/register \
-H "Content-Type: application/json" \
-d '{"email":"admin2@zorvyn.com", "password":"password123", "role":"ADMIN"}' | jq

echo -e "\n\n2. Logging in as ADMIN..."
ADMIN_LOGIN=$(curl -s -X POST http://localhost:3000/api/auth/login \
-H "Content-Type: application/json" \
-d '{"email":"admin2@zorvyn.com", "password":"password123"}')
echo $ADMIN_LOGIN | jq
ADMIN_TOKEN=$(echo $ADMIN_LOGIN | jq -r .token)

echo -e "\n\n3. Registering a VIEWER user..."
curl -s -X POST http://localhost:3000/api/auth/register \
-H "Content-Type: application/json" \
-d '{"email":"viewer2@zorvyn.com", "password":"password123", "role":"VIEWER"}' | jq

echo -e "\n\n4. Logging in as VIEWER..."
VIEWER_LOGIN=$(curl -s -X POST http://localhost:3000/api/auth/login \
-H "Content-Type: application/json" \
-d '{"email":"viewer2@zorvyn.com", "password":"password123"}')
echo $VIEWER_LOGIN | jq
VIEWER_TOKEN=$(echo $VIEWER_LOGIN | jq -r .token)

echo -e "\n\n5. VIEWER attempts to create a record (EXPECTING 403 FORBIDDEN)..."
curl -s -X POST http://localhost:3000/api/records \
-H "Authorization: Bearer $VIEWER_TOKEN" \
-H "Content-Type: application/json" \
-d '{
  "amount": 500,
  "type": "INCOME",
  "category": "Salary",
  "date": "2026-04-01T10:00:00.000Z"
}' | jq

echo -e "\n\n6. ADMIN successfully creates a record..."
RECORD_RES=$(curl -s -X POST http://localhost:3000/api/records \
-H "Authorization: Bearer $ADMIN_TOKEN" \
-H "Content-Type: application/json" \
-d '{
  "amount": 1500,
  "type": "INCOME",
  "category": "Salary",
  "date": "2026-04-01T10:00:00.000Z",
  "description": "Monthly paycheck"
}')
echo $RECORD_RES | jq
RECORD_ID=$(echo $RECORD_RES | jq -r .id)

echo -e "\n\n7. Both roles can view the Dashboard Summary..."
echo "--> As VIEWER:"
curl -s -X GET http://localhost:3000/api/dashboard/summary \
-H "Authorization: Bearer $VIEWER_TOKEN" | jq

echo -e "\n8. ADMIN soft deletes the record..."
curl -s -X DELETE http://localhost:3000/api/records/$RECORD_ID \
-H "Authorization: Bearer $ADMIN_TOKEN"
echo "(Record Deleted!)"

echo -e "\n9. ADMIN checks records (EXPECTING EMPTY JSON DUE TO SOFT DELETE)..."
curl -s -X GET http://localhost:3000/api/records \
-H "Authorization: Bearer $ADMIN_TOKEN" | jq

echo -e "\nAll Tests Complete!"
