# Audit Integrity Fix — 2026-08-25

The C6 audit page must never fabricate an audit result when the AI audit service fails.

The production-safe implementation now fails closed, shows the actual service error to the user, and only renders an audit result when the AI service returns valid data.

Source: ported from the verified historical production-integrity change without overwriting the newer RemotePay payment boundary on `main`.
