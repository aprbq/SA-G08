import { useState, useEffect } from "react";
import { Space, Table, Button, Col, Row, Divider, message } from "antd";
import { PlusOutlined, DeleteOutlined , EditOutlined} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { GetOrder, DeleteOrderById } from "../../services/https/index";
import { OrderInterface } from "../../interfaces/Order";
import { Link, useNavigate } from "react-router-dom";
import dayjs from "dayjs";

function Order() {
  const navigate = useNavigate();
  const [Order , setOrder] = useState<OrderInterface[]>([]);
  const [messageApi, contextHolder] = message.useMessage();


  const columns: ColumnsType<OrderInterface> = [


    {
      title: "ลำดับ",
      dataIndex: "ID",
      key: "id",
    },

     {
       title: "ชื่อเมนู",
       dataIndex: "name",
       key: "name",
     },

     {
       title: "จำนวน",
       dataIndex: "order_quantity",
       key: "order_quantity",
     },

     {
       title: "ราคา",
       dataIndex: "Price",
       key: "Price",
     },

     {
       title: "ราคารวมของเมนู",
       dataIndex: "total_item",
       key: "total_item",
     },

     {
       title: "วันทำรายการ",
       key: "order_date",
       render: (record) => <>{dayjs(record.exp_date).format("DD/MM/YYYY")}</>,
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
  
    if (res) { // ถ้า res เป็น true
      messageApi.open({
        type: "success",
        content: "ลบออเดอร์สำเร็จ", // ข้อความเมื่อการลบสำเร็จ
      });
      await getOrder(); // โหลดข้อมูลใหม่หลังจากลบสำเร็จ
    } else {
      messageApi.open({
        type: "error",
        content: "เกิดข้อผิดพลาดในการลบ", // ข้อความเมื่อการลบล้มเหลว
      });
    }
  };

  const getOrder = async () => {
    let res = await GetOrder();
    if (res) {
      setOrder(res);
    }
  };

  useEffect(() => {
    getOrder();
  }, []);

  return (
    <>
      {contextHolder}
      <Row>
        <Col className = "name-table" span={12}>
          <h2>จัดการออเดอร์</h2>
        </Col>
        <Col span={12} style={{ textAlign: "end", alignSelf: "center" }}>
          <Space>
            <Link to="/order/create">
              <Button className = "btn-1" type="primary" icon={<PlusOutlined />}>
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