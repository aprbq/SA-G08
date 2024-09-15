import { useState, useEffect } from "react";
import { Space, Table, Button, Col, Row, Divider, message } from "antd";
import { PlusOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { GetOrder, DeleteOrderById } from "../../services/https/index";
import { OrderInterface } from "../../interfaces/Order";
import { OrderItemInterface } from "../../interfaces/OrderItem";
import { Link, useNavigate } from "react-router-dom";
import dayjs from "dayjs";

function Order() {
  const navigate = useNavigate();
  const [Order, setOrder] = useState<OrderInterface[]>([]);
  const [messageApi, contextHolder] = message.useMessage();

  const orderItemsList: OrderItemInterface[] = [
    // ตัวอย่างข้อมูล orderItems
    { ID: 1, name: "เมนู 1", order_quantity: 2, price: 100, total_item: 200 },
    { ID: 2, name: "เมนู 2", order_quantity: 1, price: 150, total_item: 150 },
  ];

  //const selectedPromotionId = 1; // หรือ undefined หากไม่มีการเลือกโปรโมชั่น
  //const selectedPaymentMethodId = 2; // หรือ undefined หากไม่มีการเลือกวิธีการชำระเงิน
  const totalOrderPrice = orderItemsList.reduce(
    (total, item) => total + (item.total_item || 0), // ตรวจสอบ item.total_item เป็น 0 ถ้า undefined
    0
  ); // ราคารวม


  const columns: ColumnsType<OrderInterface> = [
    {
      title: "รายการที่",
      dataIndex: "ID",
      key: "id",
    },
    
    {
      title: "ราคารวมของเมนู",
      dataIndex: "payment_amount",
      key: "payment_amount",
    },
    {
      title: "วิธีการชำระเงิน",
      dataIndex: "paymentmethod",
      key: "paymentmethod_id", // แสดงวิธีการชำระเงินที่เลือก
      render: (item) => Object.values(item.payment_methods),
    },
    {
      title: "โปรโมชั่นที่เลือกใช้",
      dataIndex: "promotion",
      key: "promotion_id", // แสดงโปรโมชั่นที่เลือก
      render: (item) => Object.values(item.promotion_name),
    },
    {
      title: "วันทำรายการ",
      key: "order_date",
      render: (record) => <>{dayjs(record.order_date).format("DD/MM/YYYY")}</>,
    },

    {
      title: "",
      render: (record) => (
        <>
          <Button
            className="btn-1"
            type="primary"
            icon={<EditOutlined />}
            onClick={() => navigate(`/order/edit/${record.ID}`)}
          >
            แก้ไขข้อมูล
          </Button>
        </>
      ),
    },
    {
      title: "",
      render: (record) => (
        <>
          <Button
            type="primary"
            className="btn-delete"
            icon={<DeleteOutlined />}
            onClick={() => deleteOrderById(record.ID)}
          ></Button>
        </>
      ),
    },
  ];

  const deleteOrderById = async (id: string) => {
    let res = await DeleteOrderById(id);

    if (res) {
      messageApi.open({
        type: "success",
        content: "ลบออเดอร์สำเร็จ",
      });
      await getOrder();
    } else {
      messageApi.open({
        type: "error",
        content: "เกิดข้อผิดพลาดในการลบ",
      });
    }
  };

  const getOrder = async () => {
    let res = await GetOrder();

    if (res.status === 200) {
      setOrder(res.data);
    } else {
      setOrder([]);
      messageApi.open({
        type: "error",
        content: res.data.error,
      });
    }
  };

  useEffect(() => {
    getOrder();
  }, []);

  return (
    <>
      {contextHolder}
      <Row>
        <Col className="name-table" span={12}>
          <h2>จัดการออเดอร์</h2>
        </Col>
        <Col span={12} style={{ textAlign: "end", alignSelf: "center" }}>
          <Space>
            <Link to="/order/create">
              <Button className="btn-1" type="primary" icon={<PlusOutlined />}>
                สร้างออเดอร์
              </Button>
            </Link>
          </Space>
        </Col>
      </Row>
      <Divider />
      <div style={{ marginTop: 20 }}>
        <Table
          rowKey="ID"
          columns={columns}
          dataSource={Order}
          style={{ width: "100%", overflow: "scroll" }}
        />
      </div>
    </>
  );
}
export default Order;
