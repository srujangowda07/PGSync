# PGSync Pro - Enterprise PG Management Suite

PGSync Pro is a high-fidelity SaaS MVP designed for property managers of hostels and PGs. It provides a structured, hierarchical approach to property management, combining operational efficiency with a premium, blue-chip user experience tailored for modern administrators.

---

## Project Vision

The goal of PGSync Pro is to move beyond basic record-keeping into active property orchestration. By modeling real-world constraints—such as room capacities, service add-ons, and maintenance priorities—it allows property owners to visualize their operations in real-time.

---

## Key Modules

### Hierarchical Property Engine
*   **Logical Partitioning**: Organize your property by Blocks (A/B), Floors, and Rooms.
*   **Occupancy Intelligence**: Real-time tracking of beds (e.g., "Room 101: 2/3 beds occupied").
*   **Visual States**: Instant visual feedback on floor-wise availability.

### Advanced Resident Lifecycle
*   **Comprehensive Profiles**: Track phone numbers, check-in dates, and customized service stacks.
*   **Direct Enrollment**: Specialized form to assign residents to vacant rooms with automatic capacity updates.
*   **Add-on Billing**: Specialized support for High-speed Wifi and Premium Mess subscriptions.

### Financial Control Hub
*   **Dynamic Rent Engine**: Auto-calculates totals based on Base Rent + Service Bundles.
*   **Collection Analytics**: Real-time gap analysis between Target Revenue and Actual Collections.
*   **Integration Hub**: (Preview) Coming soon connections for Stripe and Razorpay.

### Maintenance & Audit Trail
*   **Ticket Pipeline**: Priority-based workflow (Low/Med/High) for facility management.
*   **Immutable Logs**: A system-wide activity log capturing every administrative action for total operational transparency.

---

## Strategic Roadmap (Coming Soon)

We are currently building toward the Enterprise 3.0 release, which will include:
*   **Intelligence Hub**: Predictive vacancy modeling using historical checkout data.
*   **Digital KYC**: Automated identity verification via Government ID APIs.
*   **Support Sync**: Direct-to-resident messaging hub for broadcast announcements.
*   **Multi-Site Hub**: Single-login management for property chains/multiple hostels.

---

## Technical Stack

*   **Logic**: React 18 (Vite)
*   **Styling**: Vanilla CSS + Tailwind CSS (Utility-first)
*   **Routing**: React Router DOM (Single Page Application architecture)
*   **Persistence**: Browser-level localStorage (No database setup required for demo)
*   **Icons/Motion**: SVG-driven iconography & CSS Transitions

---

## Getting Started

1.  **Clone the Repository**
2.  **Install Dependencies**:
    ```bash
    npm install
    ```
3.  **Launch the App**:
    ```bash
    npm run dev
    ```
4.  **Automatic Seeding**: 
    The app automatically populates with 10 dummy rooms and 10 demo residents on first launch to showcase all features immediately.

---

## Design Philosophy

1.  **Trust through Transparency**: The Audit Trail ensures every dollar and resident move is tracked.
2.  **Minimalist Precision**: High-contrast UI elements ensure administrators can operate the software in fast-paced environments.
3.  **SaaS-Ready Architecture**: Built with a modular folder structure to facilitate easy migration to a Node.js/PostgreSQL backend in the future.

---
*Developed for the Product Management Assignment Showcase.*
