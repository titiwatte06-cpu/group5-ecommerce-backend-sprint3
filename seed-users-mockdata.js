import "dotenv/config";
import mongoose from "mongoose";

import { connectDB } from "./src/config/mongoDB.js";
import { User } from "./src/modules/user/user.model.js";

const mockUsers = [
  {
    username: "ผู้ใช้งาน หนึ่ง",
    email: "user1.test@example.com",
    password: "pass1234",
    tel: "081-000-0001",
    role: "user",
    address: [
      {
        label: "บ้าน",
        recieveName: "ผู้ใช้งาน หนึ่ง",
        recieveAddress:
          "123 ถนนตัวอย่าง แขวงคลองเตย เขตคลองเตย กรุงเทพมหานคร 10110",
        recieveTel: "081-000-0001",
        isDefault: true,
      },
    ],
  },
  {
    username: "ผู้ใช้งาน สอง",
    email: "user2.test@example.com",
    password: "pass1234",
    tel: "081-000-0002",
    role: "user",
    address: [
      {
        label: "ที่ทำงาน",
        recieveName: "ผู้ใช้งาน สอง",
        recieveAddress: "456 ถนนสมมติ แขวงพญาไท เขตราชเทวี กรุงเทพมหานคร 10400",
        recieveTel: "081-000-0002",
        isDefault: true,
      },
    ],
  },
  {
    username: "ผู้ใช้งาน สาม",
    email: "user3.test@example.com",
    password: "pass1234",
    tel: "081-000-0003",
    role: "user",
    address: [
      {
        label: "บ้าน",
        recieveName: "ผู้ใช้งาน สาม",
        recieveAddress:
          "789 หมู่ 1 ตำบลสุเทพ อำเภอเมืองเชียงใหม่ จังหวัดเชียงใหม่ 50200",
        recieveTel: "081-000-0003",
        isDefault: true,
      },
    ],
  },
  {
    username: "ผู้ใช้งาน สี่",
    email: "user4.test@example.com",
    password: "pass1234",
    tel: "081-000-0004",
    role: "user",
    address: [
      {
        label: "คอนโด",
        recieveName: "ผู้ใช้งาน สี่",
        recieveAddress:
          "101/1 ถนนลาดพร้าว แขวงจอมพล เขตจตุจักร กรุงเทพมหานคร 10900",
        recieveTel: "081-000-0004",
        isDefault: true,
      },
    ],
  },
  {
    username: "ผู้ใช้งาน ห้า",
    email: "user5.test@example.com",
    password: "pass1234",
    tel: "081-000-0005",
    role: "user",
    address: [
      {
        label: "บ้าน",
        recieveName: "ผู้ใช้งาน ห้า",
        recieveAddress:
          "202 ถนนมิตรภาพ ตำบลในเมือง อำเภอเมืองขอนแก่น จังหวัดขอนแก่น 40000",
        recieveTel: "081-000-0005",
        isDefault: true,
      },
    ],
  },
  {
    username: "ผู้ใช้งาน หก",
    email: "user6.test@example.com",
    password: "pass1234",
    tel: "081-000-0006",
    role: "user",
    address: [
      {
        label: "บ้าน",
        recieveName: "ผู้ใช้งาน หก",
        recieveAddress:
          "303 ถนนเพชรเกษม แขวงบางหว้า เขตภาษีเจริญ กรุงเทพมหานคร 10160",
        recieveTel: "081-000-0006",
        isDefault: true,
      },
    ],
  },
  {
    username: "ผู้ใช้งาน เจ็ด",
    email: "user7.test@example.com",
    password: "pass1234",
    tel: "081-000-0007",
    role: "user",
    address: [
      {
        label: "บ้าน",
        recieveName: "ผู้ใช้งาน เจ็ด",
        recieveAddress: "404 หมู่ 2 ตำบลคลองแห อำเภอหาดใหญ่ จังหวัดสงขลา 90110",
        recieveTel: "081-000-0007",
        isDefault: true,
      },
    ],
  },
  {
    username: "ผู้ใช้งาน แปด",
    email: "user8.test@example.com",
    password: "pass1234",
    tel: "081-000-0008",
    role: "user",
    address: [
      {
        label: "บ้าน",
        recieveName: "ผู้ใช้งาน แปด",
        recieveAddress:
          "505 ถนนจอมพล ตำบลในเมือง อำเภอเมืองนครราชสีมา จังหวัดนครราชสีมา 30000",
        recieveTel: "081-000-0008",
        isDefault: true,
      },
    ],
  },
  {
    username: "ผู้ใช้งาน เก้า",
    email: "user9.test@example.com",
    password: "pass1234",
    tel: "081-000-0009",
    role: "user",
    address: [
      {
        label: "คอนโด",
        recieveName: "ผู้ใช้งาน เก้า",
        recieveAddress:
          "606 ถนนกรุงธนบุรี แขวงคลองต้นไทร เขตคลองสาน กรุงเทพมหานคร 10600",
        recieveTel: "081-000-0009",
        isDefault: true,
      },
    ],
  },
  {
    username: "ผู้ใช้งาน สิบ",
    email: "user10.test@example.com",
    password: "pass1234",
    tel: "081-000-0010",
    role: "user",
    address: [
      {
        label: "บ้าน",
        recieveName: "ผู้ใช้งาน สิบ",
        recieveAddress:
          "707 ถนนสุขุมวิท ตำบลแสนสุข อำเภอเมืองชลบุรี จังหวัดชลบุรี 20130",
        recieveTel: "081-000-0010",
        isDefault: true,
      },
    ],
  },
];

const seedUsersData = async () => {
  try {
    console.log("⌛ Connecting MongoDB...");
    await connectDB();

    console.log("⏰ Inserting mock users into database...");
    await User.create(mockUsers);

    console.log(`✅ Finished add ${mockUsers.length} users data to database.`);
    process.exit(0);
  } catch (error) {
    console.error("❌ Insert data failed!", error);
    process.exit(1);
  }
};

seedUsersData();
//Use "npm run userseed" to run file.
