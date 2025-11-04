import React from 'react'
import bibimbap from "../assets/bibimbap.png";
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function ShowAllkinkun() {

  const [ kinkuns, setkinkuns ] = React.useState([])

  useEffect(() =>{
    try {

    // โค้ดที่จะทำงานเมื่อมี Effect เกิดขึ้นกับ Component 
    // ดึงข้อมูลจาก Supabase มาแสดงผล

    const fetchkinkuns = async () => {
      const { data, error } = await supabase
                              .from('kinkun_tb')
                              .select('*')
                              .order('created_at', { ascending: false });
        // ให้ตรวจสอบว่ามี error หรือไม่
        if (error) {
          alert("เกิดข้อผิดพลาดในการดึงข้อมูล");
          console.error('Fetch kinkuns error:', error);
        }else{
          setkinkuns(data);
        }

    };

    // เรียกใช้ฟังก์ชันเพื่อดึงข้อมูล

    fetchkinkuns();
    }catch (error) {
      alert("เกิดข้อผิดพลาดในการดึงข้อมูล");
      console.error('Fetch kinkuns error:', ex);
    }

  },[])

  return (
    <div>
      <div className="w-10/12 mx-auto border-gray-300 p-6 my-20 shadow-md">
              <h1 className="text-2xl font-bold text-center text-blue-700">
                Kinkun-Supabase-app
              </h1>
      
              <h1 className="text-2xl font-bold text-center text-blue-700">
                บันทึกการกิน
              </h1>
      
              <img src={bibimbap} alt="กินกัน" className="block mx-auto w-18 mt-5 " />

              {/* ส่วนแสดงปุ่มเพิ่ม เพิ่อเปิดหน้าจอ / addkinkun */}
              <div className='my-8 flex justify-end'>
                <Link to="/addkinkun" className='bg-blue-800 p-3 rounded text-white
                        hover:bg-blue-600 '>
                  เพิ่มการกิน
                </Link>
              </div>

              {/* ส่วนแสดงข้อมูลการกินทั้งหมดที่ดึงมาจาก Supabase โดยแสดงเป็นตาราง */}
              <table className='w-full border border-gray-700 text-sm '>

                <thead>
                  <tr className='bg-gray-200'>
                    <th className='border border-gray-600 p-2'>รูป</th>
                    <th className='border border-gray-600 p-2'>กินอะไร</th>
                    <th className='border border-gray-600 p-2'>กินที่ไหน</th>
                    <th className='border border-gray-600 p-2'>กินเท่าไหร่</th>
                    <th className='border border-gray-600 p-2'>กินวันไหน</th>
                    <th className='border border-gray-600 p-2'>ACTION</th>
                  </tr>
                </thead>

                <tbody>
                  {kinkuns.map((kinkun)=>(
                    <tr key={kinkun.id}>
                    <td className='border border-gray-600 p-2'>
                      {
                        kinkun.food_image_url == '' || kinkun.food_image_url == null 
                        ? '-'
                       : <img src={kinkun.food_image_url} alt="รูปอาหาร" className='w-20 mx-auto'/>
                      }
                       </td>
                      
                    <td className='border border-gray-600 p-2'>{kinkun.food_name}</td>
                    <td className='border border-gray-600 p-2'>{kinkun.food_where}</td>
                    <td className='border border-gray-600 p-2'>{kinkun.food_pay}</td>
                    <td className='border border-gray-600 p-2'>
                      {new Date (kinkun.created_at).toLocaleDateString('th-TH')}
                    </td>
                    <td className='border border-gray-600 p-2'>
                      แก้ไข | ลบ
                    </td>
                    </tr>
                  ))}
                </tbody>

              </table>

      </div>
      <Footer/>
    </div>
  )
}
