# In-House Goal Setting & Tracking Portal

A comprehensive MERN-stack web application designed for managing employee goals, streamlined approval workflows, and quarterly achievement tracking. The platform utilizes robust Role-Based Access Control (RBAC) across three distinct user layers: **Employee**, **Manager**, and **Admin**.

---

### Stack Breakdown
* **Frontend:** React, TailwindCSS, Axios
* **Backend:** Node.js, Express
* **Database:** MongoDB Atlas
* **Authentication:** JWT-based Role-Based Access Control (RBAC)
* **Hosting:** Render / Vercel / MongoDB Atlas

---

## ⚙️ Features

### 👤 Phase 1 — Goal Creation & Approval
* **Employee Workspace:** Create dynamic performance goals with mandatory attributes: Thrust Area, Target, and Weightage.
* **Strict Validation Rules:**
  * Cumulative goal weightage must equal exactly `100%`.
  * Minimum weightage allocated per single goal must be at least `10%`.
  * A hard limit of maximum `8` goals per employee.
* **Manager Approval Engine:** Managers review incoming targets. Approved goals are immediately locked against manual tampering.

### 📈 Phase 2 — Achievement Tracking
* **Progress Logging:** Employees check in quarterly to update real-world metrics.
* **Status States:** `Not Started` | `On Track` | `Completed`.
* **Computation Engine:** System automatically parses and calculates exact progress scores based on the Unit of Measurement (UoM) schema.
* **Feedback Loops:** Managers can append live check-in comments to any target line item.

### 🛡️ Admin Functions
* **Override Engine:** Ability to unlock finalized goals to allow employee rework.
* **Oversight Tools:** Deep-dive view into real-time audit logs and global completion dashboards.

---

### 👥 Demo Accounts & Test Credentials

Use these pre-configured accounts to test the multi-tier Role-Based Access Control (RBAC) and workflows instantly:

| Role | Email | Password | Department | Core Demo Flow to Test |
| :--- | :--- | :--- | :--- | :--- |
| 🛡️ **Admin** | `admin@test.com` | `admin123` | HR | View global audit logs & unlock locked goals for rework. |
| 💼 **Manager** | `manager@test.com` | `manager123` | Engineering | Review, add feedback comments, and **Approve/Lock** employee goals. |
| 👤 **Employee 1** | `employee1@test.com` | `emp123` | Engineering | Submit a batch of goals (Test the 100% weightage rule) & log quarterly progress. |
| 👤 **Employee 2** | `employee2@test.com` | `emp123` | Engineering | Test multi-user isolation on the Manager/Admin dashboard views. |

> ⚠️ **Note for Judges:** To test the full workflow loop, log in as **Employee 1** to submit goals, log in as **Manager** to approve and lock them, and use **Admin** if you need to override the lock state.

---

## 🧠 Data Models

### User Schema
```js
{
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['Employee', 'Manager', 'Admin'], default: 'Employee' },
  managerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  department: { type: String, required: true }
}
Goal SchemaJavaScript{
  title: { type: String, required: true },
  description: { type: String },
  thrustArea: { type: String, required: true },
  target: { type: Number, required: true },
  weightage: { type: Number, required: true, min: 10, max: 100 },
  uom: { type: String, required: true }, // Unit of Measurement
  status: { type: String, enum: ['Not Started', 'On Track', 'Completed'], default: 'Not Started' },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}
```
---
## 🔐 Authentication
* **Token Generation:** Safe JWT tokens are generated and issued to clients upon successful authentication.
* **Role-Based Access Control (RBAC):** Custom backend routing middleware intercepts incoming requests to verify both active validation tokens and proper hierarchy roles before processing protected API endpoints.

---

## 🧪 Testing Checklist (Demo Protocol)
To validate the setup during your hackathon evaluation, run through the following sequence:

* **Provision Accounts:** Register three test profiles representing each platform layer (`Employee`, `Manager`, `Admin`).
* **Goal Check:** Authenticate as the Employee and try to submit goals violating validation criteria, then submit a valid batch totaling exactly 100%.
* **Manager Audit:** Log in as the Manager to review, comment on, and approve the Employee’s strategy. Verify the records lock instantly upon approval.
* **Track Metric:** Return to the Employee profile and adjust quarterly achievement inputs to check automatic calculation features.
* **System Governance:** Log into the Admin panel to check active output reports and toggle a record unlock.

---

## 🧰 Installation & Local SetupPrerequisite Cloning & InstallationBash# Clone repository locally
* git clone <repo-url>
* cd goal-tracking-portal

## Base root dependencies installation (Backend)
npm install

## Client side dependencies setup (Frontend)
cd client
npm install
Running the AppOpen two terminal windows to boot up your microservices concurrently:Terminal 1 (Backend Server):Bash# From root folder
npm run dev
Terminal 2 (Frontend Client):Bash# From root/client folder
npm start
