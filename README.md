[README.md](https://github.com/user-attachments/files/26140742/README.md)
# 🏦 Master Data Management System (Admin Dashboard)

A scalable and modular **React + Redux based Admin Dashboard** developed as part of an internship project.  
This application manages core master data such as **Purpose of Loan, Purpose of Loan Type, Economic Activity, and Economic Activity Type** with advanced features like authentication workflows, role-based access control, and dynamic form handling.

---

## 🚀 Project Overview

This project is a **feature-based enterprise frontend system** designed to handle master data operations with a consistent and reusable architecture.  

It includes:
- CRUD operations for multiple modules
- Role-based UI control
- Authentication before critical actions
- Dynamic forms with batch submission
- Optimized UX using modern UI patterns

---

## 🧠 Tech Stack

- **Frontend:** React (Functional Components + Hooks)
- **State Management:** Redux
- **Form Handling:** Formik
- **Language:** TypeScript
- **UI Components:** Custom Bootstrap-based components
- **Notifications & Alerts:** SweetAlert + Custom Notification System

---

## 🏗️ Architecture

### 🔹 Feature-Based Modular Structure

src/
 ├── redux/
 │    ├── master/
 │    │    ├── purpose-of-loan/
 │    │    ├── purpose-of-loan-type/
 │    │    ├── economicActivity/
 │    │    └── economic-activity-type/
 │
 ├── components/
 │    ├── bootstrap/
 │    └── _common/
 │
 ├── pages/
 │    ├── purpose-of-loan/
 │    ├── purpose-of-loan-type/
 │    ├── economicActivity/
 │    └── economic-activity-type/

---

### 🔄 Data Flow

UI → Dispatch Action → Redux → API → Store → Selector → UI Update

---

## 🧩 Modules & Features

### 📌 Purpose of Loan
- Add / Edit / Delete
- Publish / Unpublish toggle
- Category mapping
- Form validation (Formik)
- Authentication before actions

### 📌 Purpose of Loan Type
- Full CRUD operations
- Dependency validation
- Search & Pagination
- Authentication modal

### 📌 Economic Activity
- CRUD operations
- Mapping with Activity Type
- Dynamic multi-row form support
- Batch API submission

### 📌 Economic Activity Type
- CRUD operations
- Dependency protection
- Search & Pagination
- Formik validation

---

## 🔥 Key Features

### Dynamic Form Handling
- Multi-row input support
- Add/remove entries dynamically
- Batch API submission

### Role-Based Access Control
- Controlled UI visibility based on user roles

### Authentication Workflow
- Required before sensitive actions
- Modal-based verification

### Advanced UX
- OffCanvas forms
- Confirmation dialogs
- Keyboard support
- Loading indicators

---

## ⚙️ Setup

git clone <your-repo-url>
cd project-folder
npm install
npm start

---

## 👨‍💻 My Contribution

As a Frontend Developer Intern, I:
- Developed multiple modules with CRUD operations
- Implemented Redux-based architecture
- Built reusable components
- Added authentication & access control
- Designed dynamic forms and validations

---

## 📌 Conclusion

This project demonstrates a scalable and enterprise-ready frontend system.
