# Architecture

The following diagram illustrates the architecture of CivicFix as implemented in the current MVP.

```mermaid
flowchart TD
    A[Citizen] -->|Uploads Image| B[Next.js Client]
    B -->|Compresses Image| C[Client-side Utilities]
    C -->|Base64 Payload| D[Next.js Server Actions]
    D -->|Simulated Request| E[Vision AI Service]
    E -->|Structured JSON| D
    D -->|User Verifies & Submits| F[Data Store]
    F -->|Reads Data| G[Report Tracking]
    F -->|Aggregates Stats| H[Impact Dashboard]
```

### Components Used:
- **Next.js Client**: Handles UI, drag-and-drop, and location tracking.
- **Client-side Utilities**: Canvas API used to compress images locally (max 1600px, WebP) to optimize upload payloads.
- **Next.js Server Actions**: Secure backend functions that process the image and handle database operations.
- **Vision AI Service**: Analyzes the image and returns a strictly typed JSON object (category, severity, description). *(Note: Simulated in the MVP environment for hackathon reliability)*.
- **Data Store**: Manages persistent state for the reports, generating unique `CF-XXXXX` tracking IDs.
