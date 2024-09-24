import { useState, useEffect } from "react";
import { Space, Table, Button, Col, Row, Divider, message, Modal, List, Typography } from "antd";
import { PlusOutlined, DeleteOutlined, EditOutlined, EyeOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { GetMenu, GetMenuById, DeleteMenuById, GetMenuIngredientById, GetIngredients, GetIngredientsById, UpdateMenuById, GetUnits } from "../../services/https/index";
import { MenuInterface } from "../../interfaces/Menu";
import { MenuIngredientInterface } from "../../interfaces/MenuIngredient";
import { IngredientInterface } from "../../interfaces/Ingredient";
import { Link, useNavigate } from "react-router-dom";

const { confirm } = Modal;
const { Title, Text } = Typography;

function Menus() {
  const navigate = useNavigate();
  const [menus, setMenu] = useState<MenuInterface[]>([]);
  const [ingredients, setIngredients] = useState<IngredientInterface[]>([]);
  const [messageApi, contextHolder] = message.useMessage();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedIngredients, setSelectedIngredients] = useState<IngredientInterface[]>([]);
  const [menuName, setMenuName] = useState<string>(''); // New state for menu name
  const [units, setUnits] = useState<any[]>([]);

  const columns: ColumnsType<MenuInterface> = [
    {
      title: "ลำดับ",
      dataIndex: "ID",
      key: "id",
      className: "front-1",
    },
    {
      title: "รูปเมนู",
      dataIndex: "Picture",
      key: "picture",
      className: "front-1",
      width: "15%",
      render: (text, record, index) => (
        <img src={record.picture} className="w3-left w3-circle w3-margin-right" width="100%" />
      ),
    },
    {
      title: "ชื่อ",
      dataIndex: "name",
      key: "name",
      className: "front-1",
    },
    {
      title: "คำอธิบาย",
      dataIndex: "description",
      key: "description",
      className: "front-1",
    },
    {
      title: "ราคา",
      dataIndex: "price",
      key: "price",
      className: "front-1",
    },
    {
      title: "ประเภท",
      dataIndex: "Category",
      key: "category_id",
      className: "front-1",
      render: (item) => Object.values(item.category),
    },
    {
      title: "สถานะเมนู",
      dataIndex: "Stock",
      key: "stock_id",
      className: "front-1",
      render: (item) => Object.values(item.stock),
    },

    {
      title: "ดูวัตถุดิบ",
      key: "ingredients",
      className: "front-1",
      render: (record) => (
        <Button
          type="default"
          className="front-1"
          icon={<EyeOutlined />}
          onClick={() => handleViewIngredients(record.ID, record.name)} // Pass the menu name here
        >
          ดูวัตถุดิบ
        </Button>
      ),
    },
    {
      title: "",
      render: (record) => (
        <Button
          onClick={() => navigate(`/menus/edit/${record.ID}`)}
          type="primary"
          className="btn-1"
          icon={<EditOutlined />}
        >
          แก้ไขข้อมูล
        </Button>
      ),
    },
    {
      title: "",
      render: (record) => (
        <Button
          type="primary"
          className="btn-delete"
          icon={<DeleteOutlined />}
          onClick={() => showDeleteConfirm(record.ID)}
        />
      ),
    },
  ];

  const handleViewIngredients = async (menuId: string, name: string) => {
    try {
      const res = await GetMenuIngredientById(menuId);
      console.log('API Response:', res);

      if (res.status === 200) {
        const ingredientsWithUnits = res.data.map((ingredient: IngredientInterface) => {
          // Find the corresponding unit using unit_id from ingredients
          const unit = units.find((u) => u.ID === ingredient.unit_id);
          return {
            ...ingredient,
            unitName: unit ? unit.unit : 'ไม่ระบุ' // Use 'ไม่ระบุ' if unit is not found
          };
        });
        setSelectedIngredients(ingredientsWithUnits);
        setMenuName(name); // Set the menu name here
        setIsModalVisible(true);
      } else if (res.status === 204) {
        messageApi.error("ไม่พบวัตถุดิบ");
      } else {
        messageApi.error("เกิดข้อผิดพลาดในการดึงข้อมูลวัตถุดิบ");
      }
    } catch (error) {
      console.error("Error fetching ingredients:", error);
      messageApi.error("เกิดข้อผิดพลาดในการดึงข้อมูลวัตถุดิบ");
    }
  };


  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const deleteMenuById = async (id: string) => {
    try {
      let res = await DeleteMenuById(id);

      if (res.status === 200) {
        messageApi.open({
          type: "success",
          content: res.data.message,
        });
        await getMenu();  // รีเฟรชเมนู
      } else {
        messageApi.open({
          type: "error",
          content: res.data.error,
        });
      }
    } catch (error) {
      messageApi.open({
        type: "error",
        content: "เกิดข้อผิดพลาดในการลบเมนู",
        className: "front-1",
      });
    }
  };

  const getMenu = async () => {
    let res = await GetMenu();
    if (res.status === 200) {
      const updatedMenus = await Promise.all(
        res.data.map(async (menu: MenuInterface) => {
          const menuIngredientRes = await GetMenuIngredientById(String(menu.ID));

          if (menuIngredientRes.status === 200) {
            const menuIngredients: MenuIngredientInterface[] = menuIngredientRes.data;

            // ดึงข้อมูล Ingredient ที่เกี่ยวข้องกับ Menu นี้
            const ingredientRes = await Promise.all(
              menuIngredients.map(async (menuIngredient) => {
                const ingredientData = await GetIngredientsById(String(menuIngredient.ingredients_id));
                return {
                  ...ingredientData.data,
                  requiredQuantity: menuIngredient.quantity, // Include required quantity
                }; // Ensure ingredientData.data has a defined structure
              })
            );

            // ตรวจสอบว่า ingredients มีวัตถุดิบไหนที่ quantity น้อยกว่าจำนวนที่ต้องการหรือไม่
            const isOutOfStock = ingredientRes.some(
              (ingredient: IngredientInterface) =>
                ingredient.quantity !== undefined && // Check if quantity is defined
                ingredient.quantity < (ingredient.requiredQuantity || 0) // Use 0 as a fallback for undefined requiredQuantity
            );

            const newStockId = isOutOfStock ? 2 : 1;

            // ตรวจสอบว่า stock_id เปลี่ยนแปลงหรือไม่
            if (menu.stock_id !== newStockId) {
              // อัปเดต stock_id ของเมนูใน backend
              await UpdateMenuById(String(menu.ID), { stock_id: newStockId });

              // อัปเดตเมนูใหม่จาก backend ทันทีหลังจากอัปเดต stock_id สำเร็จ
              const updatedMenuRes = await GetMenuById(String(menu.ID)); // ดึงข้อมูลเมนูใหม่หลังจากการอัปเดต
              return updatedMenuRes.data; // ส่งคืนเมนูที่อัปเดตแล้ว
            }

            // ถ้าไม่มีการอัปเดต ส่งคืนเมนูปัจจุบัน
            return { ...menu, stock_id: newStockId };
          }

          return menu; // ถ้าดึงวัตถุดิบไม่ได้, ส่งคืนเมนูเดิม
        })
      );

      setMenu(updatedMenus); // อัปเดตเมนูทั้งหมดใน state
    } else {
      setMenu([]);
      messageApi.open({
        type: "error",
        content: res.data.error,
      });
    }
  };


  const getIngredients = async () => {
    let res = await GetIngredients();
    if (res.status == 200) {
      setIngredients(res.data);
    } else {
      setIngredients([]);
      messageApi.open({
        type: "error",
        content: res.data.error,
      });
    }
  };

  const getUnit = async () => {
    let res = await GetUnits(); // Fetch units from the API
    if (res.status === 200) {
      setUnits(res.data);
    } else {
      setUnits([]);
      messageApi.open({
        type: "error",
        content: res.data.error,
        className: "front-1",
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
      className: "front-1",
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
    getIngredients();
    getUnit();
  }, []);

  return (
    <>
      {contextHolder}
      <Row>
        <Col className="name-table" span={12}>
          <h2 >จัดการเมนู</h2>
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
          pagination={{ pageSize: 10 }}
          className="custom-table"
          rowClassName={(record, index) =>
            index % 2 === 0 ? "table-row-light table-row-hover" : "table-row-dark table-row-hover"
          }
        />
      </div>

      {/* Modal สำหรับแสดงวัตถุดิบ */}
      <Modal
        className="front-1"
        title={<div>วัตถุดิบของเมนู: {menuName}</div>}
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        {selectedIngredients.length > 0 ? (
          <List
            itemLayout="horizontal"
            className="front-1"
            dataSource={selectedIngredients}
            renderItem={(ingredient) => (
              <List.Item>
                <List.Item.Meta
                  title={<Text className="front-blue" strong>{ingredient.name}</Text>}
                  description={`จำนวน: ${ingredient.quantity} ${ingredient.unitName}`} // Display unit name here
                />
              </List.Item>
            )}
          />
        ) : (
          <p className="front-1">ไม่มีวัตถุดิบสำหรับเมนูนี้</p>
        )}
      </Modal>

    </>
  );
}

export default Menus;
