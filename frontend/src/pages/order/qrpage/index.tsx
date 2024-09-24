import React from 'react';
import { useLocation } from 'react-router-dom';
// import './QrPage.css'; // ตรวจสอบให้แน่ใจว่าคุณนำเข้าไฟล์ CSS ที่มีการกำหนดสไตล์

function QrPage() {
  const location = useLocation();
  const { totalAmount, orderItems, showQRCode } = location.state || {};

  return (
    <div className="qr-container">
      <h1>รายละเอียดคำสั่งซื้อ</h1>
      <p>ราคารวม: {totalAmount} บาท</p>

      {showQRCode && (
        <div>
          <h2>QR Code</h2>
          {/* แสดง QR Code */}
          <img style={{height:"400px"}}
            src="/public/images/qr1.png" 
            alt="QR Code" 
            className="qr-image" 
          />
        </div>
      )}
    </div>
  );
}

export default QrPage;
