#!/usr/bin/env bash
# Smoke test for HarborOS — hits every API endpoint and every page,
# asserts HTTP 200 + a recognizable substring in each response.
#
# Usage:
#   bash scripts/smoke.sh                              # against http://localhost:3000
#   bash scripts/smoke.sh https://harbor.radai-1984.dev
#
# Exit code 0 = all checks passed. Non-zero = at least one check failed.

set -u

BASE="${1:-http://localhost:3000}"
FAIL=0
PASS=0

color() { printf "\033[%sm%s\033[0m" "$1" "$2"; }

check_get_status() {
  local path="$1" expected="$2"
  local code
  code=$(curl -s -o /dev/null -w "%{http_code}" "$BASE$path")
  if [ "$code" = "$expected" ]; then
    color "32" "  PASS"; printf "  %-25s  %s\n" "$path" "$code"
    PASS=$((PASS+1))
  else
    color "31" "  FAIL"; printf "  %-25s  expected %s, got %s\n" "$path" "$expected" "$code"
    FAIL=$((FAIL+1))
  fi
}

check_get_contains() {
  local path="$1" needle="$2"
  local body
  body=$(curl -s "$BASE$path")
  if printf "%s" "$body" | grep -q -- "$needle"; then
    color "32" "  PASS"; printf "  %-25s  contains \"%s\"\n" "$path" "$needle"
    PASS=$((PASS+1))
  else
    color "31" "  FAIL"; printf "  %-25s  did NOT contain \"%s\"\n" "$path" "$needle"
    FAIL=$((FAIL+1))
  fi
}

check_post_contains() {
  local path="$1" payload="$2" needle="$3"
  local body
  body=$(curl -s -X POST -H "Content-Type: application/json" -d "$payload" "$BASE$path")
  if printf "%s" "$body" | grep -q -- "$needle"; then
    color "32" "  PASS"; printf "  %-25s  contains \"%s\"\n" "POST $path" "$needle"
    PASS=$((PASS+1))
  else
    color "31" "  FAIL"; printf "  %-25s  did NOT contain \"%s\"\n" "POST $path" "$needle"
    FAIL=$((FAIL+1))
  fi
}

printf "HarborOS smoke — target: %s\n\n" "$BASE"

printf "API — GET endpoints (status + content):\n"
check_get_contains "/api/vessels"      "Aurora Crest"
check_get_contains "/api/ports"        "Singapore"
check_get_contains "/api/voyages"      "Yantian"
check_get_contains "/api/disruptions"  "Long Beach"

printf "\nAPI — POST endpoints:\n"
check_post_contains "/api/voyages/plan" '{"from":"Yokohama","to":"Hamburg","vessel":"Cygnus Maru"}' "Planned"
check_post_contains "/api/ai/analyze"   '{"question":"weekly brief"}'                              "answer"

printf "\nPages — HTTP status:\n"
for path in / /fleet /ports /voyages /disruptions /settings; do
  check_get_status "$path" "200"
done

printf "\n"
TOTAL=$((PASS+FAIL))
if [ "$FAIL" -eq 0 ]; then
  color "32" "All $TOTAL checks passed."; printf "\n"
  exit 0
else
  color "31" "$FAIL of $TOTAL checks failed."; printf "\n"
  exit 1
fi
