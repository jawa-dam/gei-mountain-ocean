# V2.0.29 — Economy Security Regression Gate

V2.0.29 promotes the V2.0.28 chaos suite from a one-time verification tool into a release-blocking regression gate.

## Run

```bash
node tools/v2-chaos/regression-gate.mjs
```

The gate:

1. Confirms the V2.0.28 chaos engine exists.
2. Executes the full deterministic-safe-chaos suite.
3. Requires every scenario to pass.
4. Requires zero production data access.
5. Requires zero production money access.
6. Verifies the complete security chain:
   `ATTACK → DETECT → BLOCK → PRESERVE → RECOVER → VERIFY`
7. Exits with a non-zero status if any security regression appears.

## Release contract

A release is **blocked** when:

- a chaos test fails;
- the chaos engine reports a failure;
- the expected engine version changes unexpectedly;
- production-data or production-money flags are not explicitly false;
- the expected security chain changes.

This gate is deliberately local and deterministic. It does not replace live PayPal sandbox verification, production runtime verification, or infrastructure health checks.

## Security principle

The existing production economy remains the authority. V2.0.29 only verifies that future code changes continue to respect that authority.
