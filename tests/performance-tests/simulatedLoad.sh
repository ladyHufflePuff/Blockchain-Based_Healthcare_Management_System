#!/bin/bash


CONCURRENT_USERS=100

# Function that simulates one user loop
simulate_user() {
  while true; do
    echo "[$(date '+%H:%M:%S')] Request from PID $$"
    curl -s -X POST http://127.0.0.1:5000/api/v1/namespaces/default/apis/identity/invoke/getIdentity \
      -H "Content-Type: application/json" \
      -d '{
            "input": {
              "did": "did:a509b91d-d338-4ef9-80d1-b2d5031a880a"
            }
          }' > /dev/null
    sleep 0.5  # Optional delay to mimic realistic usage
  done
}

# Launch N users in background
for ((i=1; i<=CONCURRENT_USERS; i++)); do
  simulate_user &
done

# Wait forever (or press Ctrl+C to kill)
wait


