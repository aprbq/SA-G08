import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { message } from 'antd';
import { OrderItemInterface } from '../../../interfaces/OrderItem';
import { MenuInterface } from "../../../interfaces/Menu";
import { OrdersweetInterface } from '../../../interfaces/Ordersweet';
import { GetMenu, GetOrderitem, GetOrdersweet } from '../../../services/https/index';

function QrPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const [menus, setMenu] = useState<MenuInterface[]>([]);
  const [orderitem, setOrderitem] = useState<OrderItemInterface[]>([]);
  const [ordersweet, setOrdersweet] = useState<OrdersweetInterface[]>([]);
  const { totalAmount, orderItems, showQRCode } = location.state as { 
    totalAmount: number; 
    orderItems: OrderItemInterface[]; 
    showQRCode: boolean; 
  } || {};

  const getOrderitem = async () => {
    try {
      let res = await GetOrderitem();
      if (res.status === 200) {
        setOrderitem(res.data);
      } else {
        setOrderitem([]);
        messageApi.open({
          type: 'error',
          content: 'ไม่สามารถดึงข้อมูล order item ได้',
        });
      }
    } catch (error) {
      console.error("Error fetching order item data:", error);
    }
  };

  const getOrdersweet = async () => {
    try {
      let res = await GetOrdersweet();
      if (res.status === 200) {
        setOrdersweet(res.data);
      } else {
        setOrdersweet([]);
        messageApi.open({
          type: 'error',
          content: 'ไม่สามารถดึงข้อมูลระดับความหวานได้',
        });
      }
    } catch (error) {
      console.error("Error fetching ordersweet data:", error);
    }
  };

  const getMenu = async () => {
    let res = await GetMenu();
    if (res.status === 200) {
      setMenu(res.data);
    } else {
      setMenu([]);
      messageApi.open({
        type: "error",
        content: res.data.error,
      });
    }
  };

  const handleFinishOrder = () => {
    setOrderitem([]); 
    navigate('/Order/create'); 
  };

  // ฟังก์ชันเพื่อหา sweetness level name จาก id
  // ฟังก์ชันเพื่อหา sweetness level name จาก id
const getSweetnessLevelName = (sweetnessLevelId: number | undefined) => {
  const validSweetnessId = sweetnessLevelId ?? 0; // ถ้า sweetnessLevelId เป็น undefined ให้ใช้ 0
  const sweetness = ordersweet.find(sweet => sweet.ID === validSweetnessId);
  return sweetness ? sweetness.order_sweet_name : 'ไม่ระบุ';
};


  // ฟังก์ชันเพื่อหาเมนู name จาก id
  const getMenuName = (menuId: number | undefined) => {
    const validMenuId = menuId ?? 0; // ถ้า menuId เป็น undefined ให้ใช้ 0 แทน
    const menu = menus.find(menu => menu.ID === validMenuId);
    return menu ? menu.name : 'ไม่ระบุ';
  };

  useEffect(() => {
    getOrderitem();
    getMenu();
    getOrdersweet();
  }, []);

  return (
    <div className="qr-container" style={{ textAlign: 'center', padding: '20px', position: 'relative' }}>
      {contextHolder}
      <button 
        onClick={handleFinishOrder} 
        style={{ position: 'absolute', top: '20px', right: '20px', padding: '10px 20px', fontSize: '16px' }}
      >
        รายการเสร็จสิ้น
      </button>

      <h1>รายละเอียดคำสั่งซื้อ</h1>
      <p style={{ fontSize: '24px', margin: '20px 0' }}>ราคารวม: {totalAmount} บาท</p>

      <h2>รายการสั่งซื้อ</h2>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {orderItems && orderItems.map((item, index) => (
          <li key={index}>
            <span>{getMenuName(item.menu_id)}</span> {/* แสดงชื่อเมนู */}
            <span style={{ marginLeft: '10px' }}>จำนวน: {item.order_quantity} แก้ว</span>
            <span style={{ marginLeft: '10px' }}>ระดับความหวาน: {getSweetnessLevelName(item.ordersweet_id)}</span>
            {/* <span style={{ marginLeft: '10px' }}>ราคา: {item.price} บาท</span> */}
          </li>
        ))}
      </ul>

      {showQRCode && (
        <div style={{ margin: '20px 0' }}>
          <h2>QR Code</h2>
          <img 
            style={{ height: "200px", maxWidth: '100%', objectFit: 'contain' }}
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
