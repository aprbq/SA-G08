import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { message } from 'antd';
import { OrderItemInterface } from '../../../interfaces/OrderItem';
import { MenuInterface } from "../../../interfaces/Menu";
import { GetMenu, GetOrderitem } from '../../../services/https/index';

interface OrderItem {
  menu_name: string; // เปลี่ยนเป็นชื่อฟิลด์ที่คุณมีใน order item
  order_quantity: number;
}

function QrPage() {
  const location = useLocation();
  const [messageApi, contextHolder] = message.useMessage();
  const [menus, setMenu] = useState<MenuInterface[]>([]);
  const [orderitem, setOrderitem] = useState<OrderItemInterface[]>([]);
  const { totalAmount, orderItems, showQRCode } = location.state as { 
    totalAmount: number; 
    orderItems: OrderItem[]; 
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
          content: 'ไม่สามารถดึงข้อมูลเมนูได้',
        });
      }
    } catch (error) {
      console.error("Error fetching menu data:", error);
    }
  };

  const getMenu = async () => {
    let res = await GetMenu();
    if (res.status === 200) {
      setMenu(res.data); // อัปเดตเมนูทั้งหมดใน state
    } else {
      setMenu([]);
      messageApi.open({
        type: "error",
        content: res.data.error,
      });
    }
  };

  useEffect(() => {
    getOrderitem();
    getMenu();
  }, []);

  return (
    <div className="qr-container">
      <h1>รายละเอียดคำสั่งซื้อ</h1>
      <p>ราคารวม: {totalAmount} บาท</p>

      {orderitem && orderitem.length > 0 && (
        <div>
          <h2>รายการสินค้า</h2>
          <ul>
            {orderitem.map((item: OrderItemInterface, index: number) => {
              // ค้นหาเมนูที่ตรงกับ menu_id
              const matchedMenu = menus.find(menu => menu.ID === item.menu_id);
              return (
                <li key={index}>
                  {matchedMenu ? matchedMenu.name : 'ไม่พบเมนู'} - {item.order_quantity} ชิ้น
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {showQRCode && (
        <div>
          <h2>QR Code</h2>
          <img style={{ height: "400px" }} src="/public/images/qr1.png" alt="QR Code" className="qr-image" />
        </div>
      )}
    </div>
  );
}

export default QrPage;
