
## What evidence supports the conclusion?

**UAT is the only environment with rising failures** across consecutive runs (50 → 70 → 80).
- All degrading UAT runs include the flag **`jwt_refresh_v2`**, which matches the UAT deployment at **03:10**.
- **Redis CPU alerts** appear minutes after the rollout (03:15, then 04:40), and only in UAT.
- **DEV and PROD stay stable**, so the issue is isolated to UAT.

---

## What other cause could explain the trend?

- **Redis issues alone** could cause slow tests, retries, and failures (alerts at 03:15 and 04:40).
- **Increasing UAT load across runs** (rising metrics), even without deployment impact.
- **UAT-specific configuration or heavier test scenarios**, since only UAT shows consistently higher numbers.




### One action to prevent this issue next time

- **Add automated post‑deployment health checks** (e.g., Redis CPU, service latency) to block UAT test runs if the environment is unstable.

