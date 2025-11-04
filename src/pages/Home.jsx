import React from "react";
import bibimbap from "../assets/bibimbap.png";
import { FaFacebook } from "react-icons/fa";
import { FaGithub } from "react-icons/fa";
import Footer from "../components/Footer";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function Home() {
  const navigate = useNavigate();
  const [secureCode, setSecureCode] = useState("");
  const handleAccessAppClike = (e) => {
    if (secureCode === "") {
      //alert("กรอกรหัสเข้าใช้");
      Swal.fire({
        icon: 'warning',
        iconColor: 'orange',
        title: 'กรอกรหัสเข้าใช้',
        showConfirmButton: true,
        confirmButtonText: 'ตกลง',
        confirmButtonColor: 'orange',
      });
      return;
    }
    
    if (secureCode.toUpperCase() === "SAU") {
      navigate("/showallkinkun");
    } else {
      alert("รหัสไม่ถูกต้อง");
    }
  };

  return (
    <div>
      <div className="w-10/12 mx-auto border-gray-300 p-6 my-20 shadow-md">
        <h1 className="text-2xl font-bold text-center text-blue-700">
          Kinkun-Supabase-app
        </h1>

        <h1 className="text-2xl font-bold text-center text-blue-700">
          บันทึกการกิน
        </h1>

        <img src={bibimbap} alt="กินกัน" className="block mx-auto w-30 mt-5 " />

        <input
          type="text"
          placeholder="Enter secure code"
          value={secureCode}
          onChange={(e) => setSecureCode(e.target.value)}
          className="p-3 border-gray-600 rounded-md mt-5 w-full"
        />

        <button
          onClick={handleAccessAppClike}
          className="w-full bg-blue-800 p-3 rounded-md text-white mt-5
        hover:bg-blue-600 cursor-pointer "
        >
          เข้าใช้งาน
        </button>

        <div className="mt-5 flex justify-center gap-5">
          <a href="#">
            <FaFacebook className="text-3xl text-blue-800 hover:bg-blue-600 cursor-pointer" />
          </a>
          <a href="#">
            <FaGithub className="text-3xl text-blue-800 hover:bg-blue-600 cursor-pointer" />
          </a>
          {/* removed FaLine because it may not exist in the installed icon set */}
        </div>
      </div>
      <Footer />
    </div>
  );
}
