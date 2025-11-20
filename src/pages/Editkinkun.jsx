import React, { useEffect, useState } from "react";
import bibimbap from "../assets/bibimbap.png";
import Footer from "../components/Footer";
import { Link, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { supabase } from "../lib/supabaseClient";

export default function Editkinkun() {
  const { id } = useParams(); // รับ id จาก URL

  // ---------- State ----------
  const [food_name, setFood_name] = useState("");
  const [food_pay, setFood_pay] = useState("");
  const [food_where, setFood_where] = useState("");
  const [food_file, setFood_file] = useState(null);
  const [foodName, setFoodName] = useState("");
  const [food_image_url, setFood_image_url] = useState(""); // สำหรับเก็บ URL เดิม

  // ---------- SweetAlert ----------
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

  // ---------- โหลดข้อมูลเดิม ----------
  useEffect(() => {
    const fetchKinkun = async () => {
      const { data, error } = await supabase
        .from("kinkun_tb")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Fetch error:", error);
        warningAlert("ไม่สามารถโหลดข้อมูลได้");
      } else {
        setFood_name(data.food_name);
        setFood_pay(data.food_pay);
        setFood_where(data.food_where);
        setFoodName(data.food_file_url); // ใช้แสดงรูปเก่าก่อนแก้ไข
        setFood_image_url(data.food_file_url); // เก็บ URL เดิมไว้ใช้ตอนลบ
      }
    };

    fetchKinkun();
  }, [id]);

  // ---------- เลือกรูปใหม่ ----------
  const handleselectimageandprewiew = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFood_file(file);
      setFoodName(URL.createObjectURL(file));
    }
  };

  // ---------- บันทึกการแก้ไข ----------
 const handleSaveUpdateClick = async (e) => {
    e.preventDefault();

    // 1. ตรวจสอบค่าว่าง
    if (food_name.trim() === "") {
      warningAlert("กรุณากรอกชื่ออาหาร");
      return;
    }
    if (food_where.trim() === "") {
      warningAlert("กรุณากรอกสถานที่");
      return;
    }
    if (food_pay === "" || food_pay === undefined) {
      warningAlert("กรุณากรอกจำนวนเงิน");
      return;
    }

    let food_file_url = food_image_url; // เริ่มต้นใช้ URL เดิม

    // 2. ถ้ามีการเลือกรูปใหม่ ให้ทำกระบวนการลบรูปเก่าและอัปรูปใหม่
    if (food_file) {
      // ลบรูปเก่าออกจาก storage (ถ้ามีรูปเดิม)
      if (food_image_url) {
        const oldFileName = food_image_url.split("/").pop();
        // เช็คว่ามีชื่อไฟล์จริงไหมเพื่อป้องกัน error
        if (oldFileName) {
             await supabase.storage
            .from("running_bk")
            .remove([oldFileName]);
        }
      }

      // ตั้งชื่อไฟล์ใหม่ (วิธีใหม่: เวลา + สุ่มตัวเลข แก้ปัญหาภาษาไทย)
      const fileExt = food_file.name.split('.').pop();
      const newFileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

      // อัปโหลดรูปใหม่
      const { error: uploadError } = await supabase.storage
        .from("running_bk")
        .upload(newFileName, food_file);

      if (uploadError) {
        warningAlert("เกิดข้อผิดพลาดในการอัปโหลดรูปภาพ");
        console.error(uploadError);
        return;
      }

      // ดึง URL รูปใหม่
      const { data } = supabase.storage
        .from("running_bk")
        .getPublicUrl(newFileName);

      food_file_url = data.publicUrl;
    }

    // 3. อัปเดตข้อมูลลงฐานข้อมูล
    const { error: updateError } = await supabase
      .from("kinkun_tb")
      .update({
        food_name: food_name,
        food_pay: Number(food_pay),
        food_where: food_where,
        food_file_url: food_file_url,
      })
      .eq("id", id);

    if (updateError) {
      console.error("Update error:", updateError);
      warningAlert("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
      return;
    }

    // 4. แจ้งเตือนและย้ายหน้า
    successAlert("อัปเดตข้อมูลเรียบร้อยแล้ว");
    
    // ใช้ setTimeout นิดนึงเพื่อให้ Alert ขึ้นทันก่อนเปลี่ยนหน้า
    setTimeout(() => {
         window.location.href = "/showallkinkun";
    }, 1000);
  };

  // ---------- UI ----------
  return (
    <div>
      <div className="w-10/12 mx-auto border-gray-300 p-6 my-20 shadow-md">
        <h1 className="text-2xl font-bold text-center text-blue-700">
          Kinkun-Supabase-app
        </h1>

        <h1 className="text-2xl font-bold text-center text-blue-700">
          แก้ไขข้อมูลการกิน
        </h1>

        <img src={bibimbap} alt="กินกัน" className="block mx-auto w-18 mt-5 " />

        <form onSubmit={handleSaveUpdateClick}>
          <div className="mt-3">
            <label>กินอะไร ?</label>
            <input
              value={food_name}
              onChange={(e) => setFood_name(e.target.value)}
              type="text"
              className="border border-gray-700 w-full p-2 mt-2 rounded"
            />
          </div>

          <div className="mt-3">
            <label>กินที่ไหน ?</label>
            <input
              value={food_where}
              onChange={(e) => setFood_where(e.target.value)}
              type="text"
              className="border border-gray-700 w-full p-2 mt-2 rounded"
            />
          </div>

          <div className="mt-3">
            <label>กินเท่าไหร่ ?</label>
            <input
              value={food_pay}
              onChange={(e) => setFood_pay(e.target.value)}
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
              บันทึกแก้ไขการกิน
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
