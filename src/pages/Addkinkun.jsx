import React, { useEffect, useState } from "react";
import bibimbap from "../assets/bibimbap.png";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { supabase } from "../lib/supabaseClient";

export default function Addkinkun() {
  const [food_name, setFood_name] = useState("");
  const [food_pay, setFood_pay] = useState("");
  const [food_where, setFood_where] = useState("");
  const [food_file, setFood_file] = useState(null);
  const [foodName, setFoodName] = useState("");

  // ========== SweetAlert2 ฟังก์ชันแจ้งเตือน ==========
  const warningAlert = (msg) => {
    Swal.fire({
      icon: "warning",
      iconColor: "orange",
      title: msg,
      showConfirmButton: true,
      confirmButtonText: "ตกลง",
      confirmButtonColor: "orange",
    });
  };

  const successAlert = (msg) => {
    Swal.fire({
      icon: "success",
      iconColor: "green",
      title: msg,
      showConfirmButton: true,
      confirmButtonText: "ตกลง",
      confirmButtonColor: "green",
    });
  };
  // =====================================================

  const handleselectimageandprewiew = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFood_file(file);
      setFoodName(URL.createObjectURL(file));
    }
  };

  const handleDeleteClick = async (id, food_image,) => {
    
  }
  const handlesaveClick = async (e) => {
    e.preventDefault();

    // Validate input
    if (food_name.trim().length === 0) {
      warningAlert("กรุณากรอกชื่ออาหาร");
      return;
    } else if (food_where.trim().length === 0) {
      warningAlert("กรุณากรอกสถานที่");
      return;
    } else if (food_pay === "" || food_pay === undefined) {
      warningAlert("กรุณากรอกจำนวนเงิน");
      return;
    }

    let food_file_url = ""; // ตัวแปรเก็บ URL ของรูป

   // อัพโหลดรูปไปที่ Supabase Storage
    if (food_file) {
      // 1. ดึงนามสกุลไฟล์ (เช่น .png, .jpg)
      const fileExt = food_file.name.split('.').pop();
      // 2. ตั้งชื่อใหม่เป็นตัวเลขสุ่ม + เวลา (เพื่อไม่ให้ชื่อซ้ำและเป็นภาษาอังกฤษ)
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      // 3. กำหนด path
      const newFileName = fileName;

      const { error: uploadError } = await supabase.storage
        .from("running_bk")
        .upload(newFileName, food_file);

      // ... (โค้ดส่วนที่เหลือเหมือนเดิม)

      // ดึง URL ของรูปที่อัปโหลดสำเร็จ
      const { data } = supabase.storage
        .from("running_bk")
        .getPublicUrl(newFileName);

      food_file_url = data.publicUrl;
    }

    // บันทึกข้อมูลลง Supabase Table
    const { error: insertError } = await supabase
      .from("kinkun_tb")
      .insert({
        food_name: food_name,
        food_pay: food_pay,
        food_where: food_where,
        food_file_url: food_file_url,
      });

    if (insertError) {
      warningAlert("เกิดข้อผิดพลาดในการเพิ่มข้อมูล กรุณาลองใหม่อีกครั้ง");
      return;
    }

    successAlert("บันทึกข้อมูลการกินเรียบร้อยแล้ว");

    // Redirect
    document.location.href = "/showallkinkun";
  };

  return (
    <div>
      <div className="w-10/12 mx-auto border-gray-300 p-6 my-20 shadow-md">
        <h1 className="text-2xl font-bold text-center text-blue-700">
          Kinkun-Supabase-app
        </h1>

        <h1 className="text-2xl font-bold text-center text-blue-700">
          เพิ่มข้อมูลการกิน
        </h1>

        <img src={bibimbap} alt="กินกัน" className="block mx-auto w-18 mt-5 " />

        <form onSubmit={handlesaveClick}>
          <div className="mt-3">
            <label>กินอะไร ?</label>
            <input
              value={food_name}
              onChange={(e) => setFood_name(e.target.value)}
              placeholder="ข้าวผัด, ก๋วยเตี๋ยว, ส้มตำ"
              type="text"
              className="border border-gray-700 w-full p-2 mt-2 rounded"
            />
          </div>

          <div className="mt-3">
            <label>กินที่ไหน ?</label>
            <input
              value={food_where}
              onChange={(e) => setFood_where(e.target.value)}
              placeholder="พัทยา, สมุทรปราการ"
              type="text"
              className="border border-gray-700 w-full p-2 mt-2 rounded"
            />
          </div>

          <div className="mt-3">
            <label>กินเท่าไหร่ ?</label>
            <input
              value={food_pay}
              onChange={(e) => setFood_pay(e.target.value)}
              placeholder="199, 299, 399"
              type="number"
              className="border border-gray-700 w-full p-2 mt-2 rounded"
            />
          </div>

          <div className="mt-3">
            <label>รูปกิน</label>
            <input
              onChange={handleselectimageandprewiew}
              type="file"
              className="hidden"
              id="imageselect"
              accept="image/*"
            />
            <label
              htmlFor="imageselect"
              className="py-2 px-4 bg-blue-600 hover:bg-blue-800 cursor-pointer text-white rounded block w-32 text-center"
            >
              เลือกรูปภาพ
            </label>
            <div className="mt-3">
              {foodName && (
                <img src={foodName} alt="รูปตัวอย่างอาหาร" className="w-40" />
              )}
            </div>
          </div>

          <div className="mt-4">
            <button className="w-full bg-blue-600 hover:bg-blue-800 text-white py-2 cursor-pointer rounded">
              บันทึกข้อมูลการกิน
            </button>
          </div>
        </form>

        <div className="text-center mt-4">
          <Link to="/showallkinkun" className="hover:text-blue-600">
            กลับไปยังหน้าข้อมูลการกิน
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
}
