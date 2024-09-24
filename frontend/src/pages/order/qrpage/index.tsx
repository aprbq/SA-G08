import React from 'react';

const QrPage = () => {
  return (
    <div>
      <h2>ชำระเงิน</h2>
      <p>โปรดดำเนินการชำระเงินที่นี่...</p>
      {/* นำภาพ QR Code จาก public มาแสดง */}
      <img src="/images/qr1.png" alt="QR Code" style={{ width: '200px', height: '200px' }} />
      {/* ปรับขนาดภาพตามที่ต้องการ */}
    </div>
  );
};

export default QrPage;
