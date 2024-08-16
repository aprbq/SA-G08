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
  const [order , setOrder] = useState<OrderInterface[]>([]);
  const [messageApi, contextHolder] = message.useMessage();
  const myId = localStorage.getItem("id");

  const columns: ColumnsType<OrderInterface> = [
    {
      title: "ลำดับ",
      dataIndex: "ID",
      key: "id",
    },

    {
      title: "ชื่อ",
      dataIndex: "name",
      key: "name",
    },

    {
      title: "จำนวน",
      dataIndex: "quantity",
      key: "quantity",
    },

    // {
    //   title: "หน่วย",
    //   dataIndex: "unit",
    //   key: "unit",
    // },
    // {
    //   title: "ราคาต่อหน่วย",
    //   dataIndex: "unit_price",
    //   key: "unit_price",
    // },
    // {
    //   title: "ผู้ผลิต",
    //   dataIndex: "supplier",
    //   key: "supplier",
    // },
    // {
    //   title: "วัน/เดือน/ปี หมดอายุ",
    //   key: "exp_date",
    //   render: (record) => <>{dayjs(record.exp_date).format("DD/MM/YYYY")}</>,
    // },
    {
      title: "ประเภท",
      key: "class",
      render: (record) => <>{record?.class?.class}</>,
    },
    
    {
      title: "ราคา",
      dataIndex: "price",
      key: "price",
    },
    
    {
      title: "ราคารวม",
      dataIndex: "total_price",
      key: "total_price",
    },

    {
      title: "",
      render: (record) => (
        <>
          <Button
          onClick={() => navigate(`/order/edit/${record.ID}`)}
            type="primary"
            style={{ 
              backgroundColor: "#A28B73", 
              color: "#F8EDED" 
            }}
            icon={<EditOutlined />}
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
          {myId == record?.ID ? (
            <></>
          ) : (
            <Button
              type="dashed"
              danger
              icon={<DeleteOutlined />}
              onClick={() => deleteOrderById(record.ID)}
            ></Button>
          )}
        </>
      ),
    },
  ];

  const deleteOrderById = async (id: string) => {
    let res = await DeleteOrderById(id);

    if (res.status == 200) {
      messageApi.open({
        type: "success",
        content: res.data.message,
      });
      await getOrder();
    } else {
      messageApi.open({
        type: "error",
        content: res.data.error,
      });
    }
  };

  const getOrder = async () => {
    let res = await GetOrder();
    if (res.status == 200) {
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
        <Col span={12}>
          <h2>จัดการรายการสั่งซื้อ</h2>
        </Col>
        <Col span={12} style={{ textAlign: "end", alignSelf: "center" }}>
          <Space>
            <Link to="/order/create">
              <Button type="primary" icon={<PlusOutlined />}>
                เพิ่มรายการสั่งซื้อ
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
          dataSource={order}
          style={{ width: "100%", overflow: "scroll" }}
        />
      </div>
    </>
  );
}
export default Order;