# Security Specification & Invariants - Dar El Chabab Rouina Timebank

## 1. Core Data Invariants
- **Identity Integrity**: Volunteers can only update their own profile; balance modifications must correspond to legitimate logged transactions or admin operations.
- **Creator Exclusivity**: An opportunity can only be updated or finalized by its original supervisor/creator (`creatorVolunteerId == request.auth.uid` or admin).
- **Campaign State Locking**: Once an opportunity status is marked as 'منتهية' (completed) or 'معطلة', non-admin users cannot alter core campaign details.
- **Bounded Collections**: Volunteers cannot inject arbitrary array sizes or unbounded lists.
- **Verified Ledger Entries**: Transactions recording earned or redeemed hours must have valid timestamps, valid hour quantities, and strict schema keys.
- **Admin Privilege**: Administrator operations are strictly bound to verified admin email `farouqse13@gmail.com`.

## 2. The Dirty Dozen Payloads
1. **Unauthenticated Profile Injection**: An unauthenticated user attempts to create a volunteer record. (Expected: DENIED)
2. **Identity Spoofing in Opportunities**: Volunteer A tries to modify an opportunity created by Volunteer B. (Expected: DENIED)
3. **ID Poisoning Attack**: An attacker attempts to create a document with a 2000-character malicious string ID. (Expected: DENIED)
4. **Denial of Wallet via Huge String**: A payload containing a 10MB description string in an opportunity. (Expected: DENIED)
5. **Ghost Field / Shadow Update**: Attempt to inject unapproved RBAC fields (e.g. `isAdmin: true` or `isSuperUser: true`) into a volunteer document. (Expected: DENIED)
6. **Negative / Unreasonable Hours Manipulation**: Attempt to log 500,000 volunteer hours in a single transaction. (Expected: DENIED)
7. **Certificate Counterfeiting**: Generating a certificate claiming to be issued by Dar El Chabab without matching an existing volunteer ID. (Expected: DENIED)
8. **Admin Privilege Escalation without Verified Email**: An attacker providing a fabricated token with unverified email attempting admin overrides. (Expected: DENIED)
9. **Tampering with Terminal State**: Changing an opportunity status from 'منتهية' back to 'مفتوحة' by a non-creator/non-admin. (Expected: DENIED)
10. **Array Overflow Exploit**: Injecting an array of 5,000 registered volunteer IDs into an opportunity document. (Expected: DENIED)
11. **Client-Side Query Scraping**: Attempting a blanket query without appropriate authentication or constraints. (Expected: DENIED)
12. **PII Blanket Extraction**: Unauthorized public reading of private contact fields of other volunteers. (Expected: DENIED)
