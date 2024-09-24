import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from 'antd'; // นำเข้า Button จาก antd

const QrPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate(); // ใช้ useNavigate สำหรับการนำทาง
  const totalAmount = location.state?.totalAmount; // เข้าถึงยอดรวมจาก state

  const handleConfirm = () => {
    navigate('/order/create'); // นำทางไปยังหน้า OrderitemCreate
  };

  return (
    <div style={styles.container}>
      <Button style={styles.confirmButton} onClick={handleConfirm}>
        ตกลง
      </Button>
      <h2 style={styles.title}>ชำระเงิน</h2>
      <p style={styles.amount}>ยอดรวมที่ต้องชำระ: {totalAmount} บาท</p>
      <p style={styles.instructions}>โปรดดำเนินการชำระเงินที่นี่...</p>
      <img src="/images/qr1.png" alt="QR Code" style={styles.qrCode} />
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: 'flex',
    flexDirection: 'column' as 'column', // ใช้ Type Assertion ที่นี่
    alignItems: 'center',
    justifyContent: 'flex-start', // จัดแนวให้เริ่มต้นที่ด้านบน
    height: '100vh', // ทำให้เต็มความสูงของหน้าจอ
    textAlign: 'center', // จัดข้อความให้อยู่กลาง
    paddingTop: '20px', // เพิ่มช่องว่างด้านบน
    position: 'relative', // ตั้งค่าตำแหน่งเพื่อให้สามารถใช้ absolute ได้
  },
  confirmButton: {
    position: 'absolute',
    top: '20px',
    right: '20px',
    zIndex: 1, // ทำให้ปุ่มอยู่ด้านบน
  },
  title: {
    margin: '0 0 10px 0', // ช่องว่างด้านล่างของหัวเรื่อง
  },
  amount: {
    margin: '0 0 10px 0', // ช่องว่างด้านล่างของยอดรวม
  },
  instructions: {
    margin: '0 0 20px 0', // ช่องว่างด้านล่างของคำแนะนำ
  },
  qrCode: {
    width: '300px', // ขยายขนาด QR Code
    height: '300px',
  },
};

export default QrPage;
