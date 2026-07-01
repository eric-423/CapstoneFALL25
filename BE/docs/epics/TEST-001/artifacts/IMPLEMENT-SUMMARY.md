# Implementation Summary — Improve Customer Create Endpoint

**Epic ID:** `TEST-001`
**Author:** Developer
**Branch:** `feature/TEST-001-customer-register`
**Status:** Complete
**Created:** 2026-07-01

---

## 1. Branch & PR

| Item   | Value |
|--------|-------|
| Branch | `feature/TEST-001-customer-register` |
| PR     | https://github.com/eric-423/CapstoneFALL25/pull/new/feature/TEST-001-customer-register |
| Base   | `main` |

## 2. Files Changed

| File | Type | Description |
|------|------|-------------|
| `payload/request/CustomerRegisterRequest.java` | Modify | Jakarta Bean Validation (`@NotBlank`, `@Size`, `@Pattern`) |
| `controllers/AuthController.java` | Modify | `@Valid` on register; Swagger `UserDTO` / `ErrorResponse` schemas |
| `services/AuthServiceImpl.java` | Modify | Atomic `customerRegister`, duplicate check, logging, null-safe `convertToDTO` |
| `dto/UserDTO.java` | Modify | Add `phoneVerified` field |
| `exception/GlobalExceptionHandler.java` | Modify | `DataIntegrityViolationException` → 400 duplicate phone |
| `test/.../AuthServiceImplTest.java` | Add | Unit tests TEST-001-UT01–UT12 |
| `test/.../AuthControllerCustomerRegisterTest.java` | Add | Contract tests TEST-001-CT01–CT11 |

## 3. API Surface

| Endpoint | Method | Auth | Request shape | Response shape | Status codes |
|----------|--------|------|---------------|----------------|--------------|
| `/auth/customer/register` | POST | None | `CustomerRegisterRequest` | `UserDTO` | 201 / 400 / 404 / 500 |

### Deviations from Tech Design

- `UserDTO.dateOfBirth` is formatted as `yyyy-MM-dd` (not raw `Date.toString()`) to match PRD AC10 and the documented API contract.

## 4. Data & Migrations

| Item | Detail |
|------|--------|
| Schema changes | None |
| Migration file | N/A |
| Backfill needed | No |
| Rollback plan | Revert BE deployment; no DB rollback |

## 5. Cross-cutting Concerns

- [x] Input validation on every external-facing field
- [x] AuthN/AuthZ enforced on new endpoints (public signup unchanged)
- [x] Errors mapped to correct status codes (no leaking internals)
- [x] Structured logging on registration path (`event=customer_register`)
- [x] Idempotency / retries considered for mutating endpoints (duplicate phone rejected)
- [x] N+1 queries checked; happy path ≤ 3 DB round-trips

## 6. Tests (TDD — written before the code)

| Test file | Cases (`TEST-001-UT*` / `CT*`) | Type |
|-----------|----------------------------------|------|
| `AuthServiceImplTest.java` | UT01–UT12 | happy / error / edge |
| `AuthControllerCustomerRegisterTest.java` | CT01–CT11 | validation / contract |

- [x] Unit tests for business logic
- [x] Contract tests per register endpoint (validation + duplicate)

**AC coverage (unit + contract):** AC01–AC07, AC09–AC16, AC11 (NPE regression). AC08, AC17–AC18 deferred to QA integration/staging execute phase.

## 7. Whole-Project Coverage (re-run after implementation)

| Item | Value |
|------|-------|
| Coverage command | Not configured — `pom.xml` has no JaCoCo or similar plugin |
| Total coverage | N/A |
| Delta vs base | N/A |
| Meets target | N/A (no project coverage tooling) |

**Test command run:** `mvn test -Dtest=AuthServiceImplTest,AuthControllerCustomerRegisterTest` — **23 tests, 0 failures**.

**Pre-existing suite notes:** `CapstoneApplicationTests` requires a live MySQL connection; `OrderServiceImplTest` has 2 pre-existing Mockito failures unrelated to this epic.

## 8. Pre-PR Checklist

- [x] Tests written **before** the implementation (TDD)
- [x] Compile passes (`mvn test -Dtest=AuthServiceImplTest,AuthControllerCustomerRegisterTest`)
- [x] Epic unit + contract tests pass
- [x] Whole-project coverage re-run and recorded in §7 (no tooling)
- [x] Migrations reviewed and reversible (§4)
- [x] API contract documented (§3)
- [x] PR body references epic key `TEST-001`
- [ ] Reviewer assigned

## 9. Known Limitations / Follow-ups

- Concurrent duplicate registration (AC08) and OTP→login chain (AC17–AC18) are planned for QA execute-test on staging.
- `employeeRegister` still uses the legacy multi-save pattern (out of scope per PRD).
- Enable JaCoCo in CI for whole-project coverage reporting.