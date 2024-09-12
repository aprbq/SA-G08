import { useState, useEffect } from "react";
import { Space, Table, Button, Col, Row, Divider, message, Modal } from "antd";
import { PlusOutlined, DeleteOutlined, EditOutlined, EyeOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { GetMenu, DeleteMenuById } from "../../services/https/index";
import { MenuInterface } from "../../interfaces/Menu";
import { Link, useNavigate } from "react-router-dom";

const { confirm } = Modal;

function Menus() {
  const navigate = useNavigate();
  const [menus, setMenu] = useState<MenuInterface[]>([]);
  const [messageApi, contextHolder] = message.useMessage();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]); // เก็บข้อมูลวัตถุดิบ

  const columns: ColumnsType<MenuInterface> = [
    {
      title: "ลำดับ",
      dataIndex: "ID",
      key: "id",
    },
    {
      title: "รูปเมนู",
      dataIndex: "Picture",
      key: "picture",
      width: "15%",
      render: (text, record, index) => (
        <img src={record.picture} className="w3-left w3-circle w3-margin-right" width="100%" />
      ),
    },
    {
      title: "ชื่อ",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "คำอธิบาย",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "ราคา",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "ประเภท",
      dataIndex: "Category",
      key: "category_id",
      render: (item) => Object.values(item.category),
    },
    {
      title: "สถานะเมนู",
      dataIndex: "Stock",
      key: "stock_id",
      render: (item) => Object.values(item.stock),
    },
    {
      title: "ดูวัตถุดิบ",
      key: "ingredients",
      render: (record) => (
        <Button
          type="default"
          icon={<EyeOutlined />}
          onClick={() => handleViewIngredients(record.ingredients)} // ฟังก์ชันดูวัตถุดิบ
        >
          ดูวัตถุดิบ
        </Button>
      ),
    },
    {
      title: "",
      render: (record) => (
        <>
          <Button
            onClick={() => navigate(`/menus/edit/${record.ID}`)}
            type="primary"
            className="btn-1"
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
          <Button
            type="primary"
            className="btn-delete"
            icon={<DeleteOutlined />}
            onClick={() => showDeleteConfirm(record.ID)}
          />
        </>
      ),
    },
  ];

  // ฟังก์ชันดูวัตถุดิบ
  const handleViewIngredients = (ingredients: string[]) => {
    setSelectedIngredients(ingredients); // เซ็ตข้อมูลวัตถุดิบที่เลือก
    setIsModalVisible(true); // เปิด Modal
  };

  // ปิด Modal
  const handleCancel = () => {
    setIsModalVisible(false);
  };

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

  const showDeleteConfirm = (id: string) => {
    confirm({
      title: "คุณแน่ใจหรือว่าต้องการลบเมนูนี้?",
      content: "การลบจะไม่สามารถยกเลิกได้",
      okText: "ยืนยัน",
      okType: "danger",
      cancelText: "ยกเลิก",
      onOk() {
        deleteMenuById(id);
      },
      onCancel() {
        console.log("ยกเลิกการลบ");
      },
    });
  };

  useEffect(() => {
    getMenu();
  }, []);

  return (
    <>
      {contextHolder}
      <Row>
        <Col className="name-table" span={12}>
          <h2>จัดการเมนู</h2>
        </Col>
        <Col span={12} style={{ textAlign: "end", alignSelf: "center" }}>
          <Space>
            <Link to="/menus/create">
              <Button className="btn-1" type="primary" icon={<PlusOutlined />}>
                เพิ่มเมนู
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
          dataSource={menus}
          style={{ width: "100%", overflow: "scroll" }}
        />
      </div>

      {/* Modal สำหรับแสดงวัตถุดิบ */}
      <Modal
        title="วัตถุดิบของเมนู"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={[
          <Button key="close" onClick={handleCancel}>
            ปิด
          </Button>,
        ]}
      >
        <ul>
          {selectedIngredients.map((ingredient, index) => (
            <li key={index}>{ingredient}</li>
          ))}
        </ul>
      </Modal>
    </>
  );
}

export default Menus;
