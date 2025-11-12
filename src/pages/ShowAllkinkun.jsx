import React from 'react'
import bibimbap from "../assets/bibimbap.png";
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import Swal from 'sweetalert2';

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
          // ใช้ Swal.fire แทน alert
          Swal.fire({
            icon: 'error',
            title: 'เกิดข้อผิดพลาด',
            text: 'ไม่สามารถดึงข้อมูลได้: ' + error.message,
          });
          console.error('Fetch kinkuns error:', error);
        }else{
          setkinkuns(data);
        }

    };

    // เรียกใช้ฟังก์ชันเพื่อดึงข้อมูล

    fetchkinkuns();
    }catch (error) {
      // (แก้ไข) เปลี่ยน ex เป็น error
      console.error('Fetch kinkuns error:', error); 
      Swal.fire({
            icon: 'error',
            title: 'เกิดข้อผิดพลาด',
            text: 'เกิดข้อผิดพลาดในการดึงข้อมูล: ' + error.message,
          });
    }

  },[])

  // ปุ่มลบ 
  const handleDeleteClick = async (id, food_image_url) => {
  const result = await Swal.fire({
    icon: 'question',
    iconColor: 'orange',
    title: 'คุณแน่ใจหรือไม่ที่จะลบข้อมูลนี้?',
    showConfirmButton: true,
    confirmButtonText: 'ตกลง',
    confirmButtonColor: 'orange',
    showCancelButton: true,
    cancelButtonText: 'ยกเลิก',
    cancelButtonColor: 'red',
  });

  // ✅ เช็คว่าผู้ใช้กด "ตกลง"
  if (result.isConfirmed) {
    // ลบรูปจาก Supabase Storage ถ้ามี
    if (food_image_url && food_image_url !== '') {
      const image_name = food_image_url.split('/').pop();

      const { error: imageError } = await supabase.storage
        .from('kinkun_bk')
        .remove([image_name]);

      if (imageError) {
        Swal.fire({
          icon: 'error',
          title: 'เกิดข้อผิดพลาดในการลบรูปภาพ',
          text: imageError.message,
        });
        return;
      }
    }

    // ลบข้อมูลจาก Table
    const { error: deleteError } = await supabase
      .from('kinkun_tb')
      .delete()
      .eq('id', id);

    if (deleteError) {
      Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาดในการลบข้อมูล',
        text: deleteError.message,
      });
      return;
    }

    // ✅ ลบสำเร็จ (อัปเดต State แทนการ reload)
    setkinkuns(kinkuns.filter(k => k.id !== id));

    Swal.fire({
      icon: 'success',
      title: 'ลบข้อมูลเรียบร้อยแล้ว',
      confirmButtonColor: 'green',
      confirmButtonText: 'ตกลง',
    });
    // .then(() => {
    //   window.location.reload(); // รีเฟรชหน้า (เปลี่ยนเป็นอัปเดต state แทนดีกว่า)
    // });
  }
};


  return (
    <div>
      <div className="w-10/12 mx-auto border-gray-300 p-6 my-20 shadow-md">
              <h1 className="text-2xl font-bold text-center text-blue-700">
                Kinkun-Supabase-app
              </h1>
      
              <h1 className="text-2xl font-bold text-center text-blue-700">
                บันทึกข้อมูลการกิน
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
                        kinkun.food_file_url == '' || kinkun.food_file_url == null 
                        ? '-'
                       : <img src={kinkun.food_file_url} alt="รูปอาหาร" className='w-20 mx-auto'/>
                      }
                       </td>
                      
                    <td className='border border-gray-600 p-2'>{kinkun.food_name}</td>
                    <td className='border border-gray-600 p-2'>{kinkun.food_where}</td>
                    <td className='border border-gray-600 p-2'>{kinkun.food_pay}</td>
                    <td className='border border-gray-600 p-2'>
                      {new Date (kinkun.created_at).toLocaleDateString('th-TH')}
                    </td>
                    <td className='border border-gray-600 p-2'>
                      {/* (แก้ไข) เปลี่ยน Link เป็น Editkinkun (ไม่มี d) */}
                      <Link className='text-green-600 underline mx-2 cursor-pointer' to={'/Editkinkun/' + kinkun.id}>
                        แก้ไขข้อมูลการกิน
                      </Link>
                      |
                      <button className='text-red-700 underline mx-2 cursor-pointer'
                              onClick={() => handleDeleteClick(kinkun.id, kinkun.food_file_url )}>
                        ลบ 
                      </button>
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