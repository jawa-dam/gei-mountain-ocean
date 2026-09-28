# V2.0.28 — Economy Security Verification & Chaos Test Engine

This harness attacks the GEI economy logic with deterministic, non-production test data.

## Safety boundary

- Does **not** call PayPal.
- Does **not** call the production entitlement ledger.
- Does **not** create, capture, claim, fulfill, or credit a real purchase.
- Does **not** modify production Redis/KV.
- Uses synthetic invoice, order, capture, claim, and fulfillment identities.

## Verification chain

`ATTACK → DETECT → BLOCK → PRESERVE → RECOVER → VERIFY`

## Attack classes

The engine covers:

1. Canonical authority baseline
2. FL OZ tampering
3. Price tampering
4. Pack ID tampering
5. Currency tampering
6. Stale authority version
7. Corrupted audit metadata
8. Audit-record drift
9. Capture-bound fulfillment ID drift
10. Wrong-capture claim
11. Duplicate claim replay
12. Fulfillment-before-claim
13. Duplicate fulfillment replay
14. Drift during claim
15. Drift during fulfillment
16. Recovery while drift remains
17. Recovery after authoritative repair
18. Client-only wallet-credit bypass attempt

## Run

From the repository root:

```bash
node tools/v2-chaos/economy-chaos.mjs
```

The process exits non-zero if any scenario fails.

The JSON report includes:

- `engine`
- `version`
- `mode`
- `productionDataTouched`
- `productionMoneyTouched`
- `testCount`
- `passed`
- `failed`
- `chain`
- per-test PASS/FAIL results

## Important interpretation

A passing V2.0.28 run verifies the **deterministic security contract** around the economy authority and the expected claim/fulfillment/recovery state transitions. It is not a substitute for PayPal sandbox verification or a live infrastructure health check.
