# ใช้ Node.js base image
FROM node:22

# ตั้งค่า working directory
WORKDIR /app

# คัดลอกไฟล์ package.json และ package-lock.json
COPY package*.json ./

# ติดตั้ง dependencies
RUN npm install

# คัดลอกโค้ดทั้งหมดไปยัง container
COPY . .

# เปิดพอร์ตที่ Vite ใช้
EXPOSE 5173

# คำสั่งเริ่มต้น
CMD ["npm", "run", "dev"]
