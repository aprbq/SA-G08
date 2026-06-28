# 📚 SA-G08: System Analysis and Design
![React](https://img.shields.io/badge/React-19.0.0-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7.2-blue)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.1.11-blue)
![SQLite](https://img.shields.io/badge/SQLite-18.0-blue)
![Golang](https://img.shields.io/badge/Golang-1.24-lightgrey)

> **ENG23 3031: SYSTEM ANALYSIS AND DESIGN**
> 
> มหาวิทยาลัยเทคโนโลยีสุรนารี (Suranaree University of Technology)

## 📖 Project Overview
โปรเจกต์นี้เป็นส่วนหนึ่งของรายวิชา **การวิเคราะห์และออกแบบระบบ (System Analysis and Design)** 
โดยกลุ่ม 08 ได้พัฒนาระบบ `บริหารจัดการร้านคาเฟ่` 
เป้าหมายของโปรเจกต์คือการนำหลักการวิเคราะห์ความต้องการ (Requirements Analysis) และการออกแบบระบบ (UML, ER Diagram) มาประยุกต์ใช้ในการพัฒนาซอฟต์แวร์จริงแบบ Full-Stack

## 📂 Repository Structure
โครงสร้างของโปรเจกต์ถูกแบ่งออกเป็น 2 ส่วนหลัก เพื่อให้ง่ายต่อการพัฒนาและดูแลรักษา:

* **`frontend/`**: ส่วนติดต่อผู้ใช้งาน (User Interface) รับผิดชอบเรื่องการแสดงผลและการโต้ตอบกับผู้ใช้ 
* **`backend/`**: ส่วนจัดการระบบหลังบ้าน (API Server) รับผิดชอบเรื่อง Business Logic และการจัดการฐานข้อมูล

## 🛠️ Technology Stack
เทคโนโลยีที่ใช้ในการพัฒนาระบบนี้ ประกอบด้วย:

**Frontend**
* Framework: React.js
* Language: TypeScript
* UI Library: CSS / Tailwind CSS / Ant Design

**Backend & Database**
* Language: Go (Golang)
* Framework/ORM: GORM, GIN
* Database: SQLite

## 🚀 Getting Started

คำแนะนำเบื้องต้นสำหรับการติดตั้งและรันโปรเจกต์ในเครื่อง Local (Development Environment)

### Prerequisites
* React.js (สำหรับรัน Frontend)
* Go (สำหรับรัน Backend)
* SQLite(สำหรับ Database)

### 1. การรัน Backend
เข้าไปที่โฟลเดอร์ `backend` และทำการรันเซิร์ฟเวอร์
```bash
cd backend
go mod tidy
go run main.go
```
เซิร์ฟเวอร์จะรันอยู่ที่ http://localhost:8000

### 2. การรัน Frontend
เข้าไปที่โฟลเดอร์ `frotnend` และทำการรันเซิร์ฟเวอร์
```bash
cd frontend
npm install
npm run dev
```
หน้า UI จะรันอยู่ที่ http://localhost:5173


## 👥 Contributors
 
| GitHub | Role |
|--------|------|
| [@1stblackblood](https://github.com/1stblackblood) | Developer |
| [@aprbq](https://github.com/aprbq) | Developer |
| [@HirakuHub](https://github.com/HirakuHub) | Developer |
| [@Legion0000x](https://github.com/Legion0000x) | Developer |
| [@MrPh14](https://github.com/MrPh14) | Developer |


 
> See the full [contributor graph](https://github.com/aprbq/SA-G08/graphs/contributors) for all members.
 
---
