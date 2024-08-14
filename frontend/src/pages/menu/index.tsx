import { useState, useEffect } from "react";
import { Space, Table, Button, Col, Row, Divider, message } from "antd";
import { PlusOutlined, DeleteOutlined , EditOutlined} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { GetMenu, DeleteMenuById } from "../../services/https/index";
import { MenuInterface } from "../../interfaces/Menu";
import { Link, useNavigate } from "react-router-dom";
import dayjs from "dayjs";

function Menus() {
  const navigate = useNavigate();
  const [ingredients , setMenu] = useState<MenuInterface[]>([]);
  const [messageApi, contextHolder] = message.useMessage();
  const myId = localStorage.getItem("id");

  const columns: ColumnsType<MenuInterface> = [


    {
      title: "ลำดับ",
      dataIndex: "ID",
      key: "id",
    },

    {
      title: "ชื่อ",
      dataIndex: "PromotionName",
      key: "PromotionName",
    },

    {
      title: "คำอธิบาย",
      dataIndex: "Description",
      key: "Description",
    },

    
    
    {
        title: "จำนวน",
        dataIndex: "DiscountValue",
        key: "DiscountValue",
    },
    {
        title: "ประเภท",
        key: "DiscountType",
        render: (record) => <>{record?.class?.class}</>,
    },
    {
    title: "สถานะ",
    key: "Status",
    render: (record) => <>{record?.class?.class}</>,
    },
    {
      title: "",
      render: (record) => (
        <>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => navigate(`/menu/edit/${record.ID}`)}
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
                onClick={() => deleteMenuById(record.ID)}
              ></Button>
            )}
          </>
        ),
      },
  ];

  const deleteMenuById = async (id: string) => {
    let res = await DeleteMenuById(id);

    if (res.status == 200) {
      messageApi.open({
        type: "success",
        content: res.data.message,
      });
      await getMenu();
    } else {
      messageApi.open({
        type: "error",
        content: res.data.error,
      });
    }
  };

  const getMenu = async () => {
    let res = await GetMenu();
    if (res.status == 200) {
      setMenu(res.data);
    } else {
      setMenu([]);
      messageApi.open({
        type: "error",
        content: res.data.error,
      });
    }
  };

  useEffect(() => {
    getMenu();
  }, []);

  return (
    <>
      {contextHolder}
      <Row>
        <Col span={12}>
          <h2>จัดการเมนู</h2>
        </Col>
        <Col span={12} style={{ textAlign: "end", alignSelf: "center" }}>
          <Space>
            <Link to="/ingredient/create">
              <Button type="primary" icon={<PlusOutlined />}>
                เพิ่มวัตถุดิบ
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
          dataSource={ingredients}
          style={{ width: "100%", overflow: "scroll" }}
        />
      </div>
    </>
  );
}
export default Menus;