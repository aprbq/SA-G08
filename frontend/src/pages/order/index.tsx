import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Col, Row, Divider, message, Modal, Typography, List } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import type { ColumnsType } from "antd/es/table";
import { GetOrder, DeleteOrderById } from '../../services/https';
import { OrderInterface } from '../../interfaces/Order';
import { MenuInterface } from '../../interfaces/Menu';
import dayjs from 'dayjs';

const { confirm } = Modal;
const { Text } = Typography;

function Order() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<OrderInterface[]>([]);
  const [messageApi, contextHolder] = message.useMessage();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState<MenuInterface[]>([]);

  const columns: ColumnsType<OrderInterface> = [
    {
      title: "รายการที่",
      dataIndex: "ID",
      key: "id",
    },
    {
      title: "วันที่สั่งซื้อ",
      dataIndex: "order_date",
      key: "order_date",
      render: (date) => dayjs(date).format("DD/MM/YYYY"), // แสดงวันที่ในรูปแบบที่ต้องการ
    },
    {
      title: "ราคารวมของเมนู",
      dataIndex: "payment_amount_before",
      key: "payment_amount_before",
      render: (amount) => `${amount.toFixed(2)} บาท`,
    },
    {
      title: "ราคาหลังใช้โปรโมชั่น",
      dataIndex: "payment_amount",
      key: "payment_amount",
      render: (amount) => `${amount.toFixed(2)} บาท`,
    },
    {
      title: "วิธีการชำระเงิน",
      dataIndex: "paymentmethod",
      key: "paymentmethod_id",
      render: (item) => Object.values(item.payment_methods)
    },
    {
      title: "โปรโมชั่นที่เลือกใช้",
      dataIndex: "promotion",
      render: (item) => Object.values(item.promotion_name),
    },

    {
      title: "",
      render: (record) => (
        <Button
          type="primary"
          className="btn-delete"
          icon={<DeleteOutlined />}
          onClick={() => showDeleteConfirm(record.ID)}
        ></Button>
      ),
    },
  ];

  const deleteOrderById = async (id: string) => {
    try {
      let res = await DeleteOrderById(id);
      if (res.status === 200) {
        messageApi.open({
          type: "success",
          content: res.data.message,
        });
        await getOrders(); // รีเฟรชรายการ
      } else {
        messageApi.open({
          type: "error",
          content: res.data.error,
        });
      }
    } catch (error) {
      messageApi.open({
        type: "error",
        content: "เกิดข้อผิดพลาดในการลบออเดอร์",
      });
    }
  };

  const showDeleteConfirm = (id: string) => {
    confirm({
      title: "คุณแน่ใจหรือว่าต้องการลบออเดอร์นี้?",
      content: "การลบจะไม่สามารถยกเลิกได้",
      okText: "ยืนยัน",
      okType: "danger",
      cancelText: "ยกเลิก",
      onOk() {
        deleteOrderById(id);
      },
      onCancel() {
        console.log("ยกเลิกการลบ");
      },
    });
  };

  const getOrders = async () => {
    let res = await GetOrder();
    if (res.status === 200) {
      setOrders(res.data);
    } else {
      setOrders([]);
      messageApi.open({
        type: "error",
        content: res.data.error,
      });
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  useEffect(() => {
    getOrders();
  }, []);

  return (
    <>
      {contextHolder}
      <Row>
        <Col span={12}>
          <h2>ประวัติรายการสั่งซื้อ</h2>
        </Col>
        <Col span={12} style={{ textAlign: "end" }}>
          <Space>
            <Button className="btn-1" type="primary" onClick={() => navigate('/order/create')}>
              สร้างออเดอร์
            </Button>
          </Space>
        </Col>
      </Row>
      <Divider />
      <Table
        rowKey="ID"
        columns={columns}
        dataSource={orders}
        style={{ width: "100%", overflow: "scroll" }}
      />
      <Modal
        title="เมนูเงื่อนไข"
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        {selectedMenu.length > 0 ? (
          <List
            itemLayout="horizontal"
            dataSource={selectedMenu}
            renderItem={(menu) => (
              <List.Item>
                <List.Item.Meta
                  title={<Text strong>{menu.name}</Text>}
                />
              </List.Item>
            )}
          />
        ) : (
          <p>ไม่มีวัตถุดิบสำหรับเมนูนี้</p>
        )}
      </Modal>
    </>
  );
}

export default Order;
