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

# เปิดพอร์ตที่ server ใช้ (ตามค่าเริ่มต้นใน config คือ 8080)
EXPOSE 8080

# คำสั่งเริ่มต้น
CMD ["node", "server.js"]
