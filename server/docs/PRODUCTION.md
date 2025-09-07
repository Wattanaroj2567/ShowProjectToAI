# Deployment & Production Guide

This guide covers recommended deployment practices and production concerns.

## Deployment Options

- Node process manager: Use PM2 or systemd to manage the Node process (start, restart, log rotation).
- Containers: Package as a Docker image; orchestrate with Kubernetes or ECS for horizontal scaling.
- Health checks: Expose liveness/readiness probes (e.g., lightweight GET endpoint).
- Migrations: Do NOT rely on `sequelize.sync()` in production. Use a migration tool (e.g., `sequelize-cli`) as a separate deployment step.

## Configuration

- Configure all environment variables (DB, JWT, mail, CORS). Never commit secrets to VCS.
- Production NODE_ENV: set `NODE_ENV=production`.
- CORS: Restrict `CLIENT_ORIGINS` to trusted domains only.

## Performance

- Horizontal scaling: Run multiple instances behind a load balancer.
- DB tuning: Add indexes where appropriate; review slow queries.
- Caching: Consider Redis for frequently accessed lists (e.g., books index) if needed.
- Compression: Enable gzip/br compression at the proxy (e.g., Nginx) or via middleware.

## Monitoring & Logging

- Centralized logs: Ship logs to ELK/Opensearch or Grafana Loki. Consider structured logging if scaling up.
- APM: Use New Relic, Datadog, or OpenTelemetry to track latency and errors.
- Alerts: Monitor error rates, latency, 5xx counts, and DB health.

## File Storage

- Offload files to object storage (e.g., S3); save only paths/metadata in DB.
- Serve static files via CDN for lower latency.
- Cleanup policy for orphaned files (lifecycle rules or periodic jobs).

## Security & Hardening

- Run as non-root; drop privileges in containers.
- Limit attack surface: only expose required ports; set strict firewall rules.
- Patch dependencies regularly; automate scans in CI.

## Backup & Recovery

- Back up the database regularly; test restore procedures.
- Document RPO/RTO targets and verify they are met.

---

Adapt these recommendations to your actual infrastructure, risk profile, and compliance needs.
