import { useState, useEffect } from "react";
import { Space, Table, Button, Col, Row, Divider, message, Modal } from "antd";
import { PlusOutlined, DeleteOutlined , EditOutlined} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { GetIngredients, DeleteIngredientsById } from "../../services/https/index";
import { IngredientInterface } from "../../interfaces/Ingredient";
import { Link, useNavigate } from "react-router-dom";
import dayjs from "dayjs";

const { confirm } = Modal;

function Ingredients() {
  const navigate = useNavigate();
  const [ingredients , setIngredients] = useState<IngredientInterface[]>([]);
  const [messageApi, contextHolder] = message.useMessage();

  const columns: ColumnsType<IngredientInterface> = [
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

    {
      title: "หน่วย",
      dataIndex: "unit",
      key: "unit",
      render: (item) => Object.values(item.unit),
    },
    {
      title: "ราคาต่อหน่วย",
      dataIndex: "unit_price",
      key: "unit_price",
    },
    {
      title: "ราคา",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "ผู้ผลิต",
      dataIndex: "suppliers",
      key: "supplier_id",
      render: (item) => Object.values(item.name),
    },
    {
      title: "วัน/เดือน/ปี หมดอายุ",
      key: "exp_date",
      render: (record) => <>{dayjs(record.exp_date).format("DD/MM/YYYY")}</>,
    },
    {
      title: "ประเภท",
      dataIndex: "class",
      key: "class",
      render: (item) => Object.values(item.class),
    },

    {
      title: "แก้ไข/ลบข้อมูล",
      render: (record) => (
        <>
          <Button
          onClick={() => navigate(`/ingredient/edit/${record.ID}`)}
            type="primary" 
            className='btn-ok'
            icon={<EditOutlined />}
            shape="circle"
          >
          </Button>
          <Button type="primary" className="btn-delete" icon={<DeleteOutlined />}
              onClick={() => showDeleteConfirm(record.ID)}
            ></Button>
        </>
      ),
    },
  ];

  const deleteIngredientsById = async (id: string) => {
    let res = await DeleteIngredientsById(id);

    if (res.status == 200) {
      messageApi.open({
        type: "success",
        content: res.data.message,
      });
      await getIngredients();
    } else {
      messageApi.open({
        type: "error",
        content: res.data.error,
      });
    }
  };

  const showDeleteConfirm = (id: string) => {
    confirm({
      title: "คุณแน่ใจหรือว่าต้องการลบ'วัตถุดิบ'",
      content: "การลบจะไม่สามารถยกเลิกได้",
      okText: "ยืนยัน",
      okType: "danger",
      cancelText: "ยกเลิก",
      className:  "front-1",
      onOk() {
        deleteIngredientsById(id);
      },
      onCancel() {
        console.log("ยกเลิกการลบ");
      },
    })};

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

  useEffect(() => {
    getIngredients();
  }, []);

  return (
    <div>
      {contextHolder}
      <Row>
        <Col span={12}> 
          <h1 className="title"> จัดการวัตถุดิบ</h1>
        </Col>
        <Col span={12} style={{ textAlign: "end", alignSelf: "center" }}>
          <Space>
            <Link to="/ingredient/create">
              <Button type="primary" className='btn-1' icon={<PlusOutlined />}>
                เพิ่มวัตถุดิบ
              </Button>
            </Link>
            <Link to="/supplier">
              <Button type="primary"  className='button-normal'>
                ดูข้อมูล Supplier
              </Button>
            </Link>
          </Space>
        </Col>
      </Row>
      <Divider />
      <div className="card-data" style={{ marginTop: 20 }}>
        <Table
          rowKey="ID"
          className="custom-table" // ใส่คลาสที่กำหนดให้กับตาราง
          rowClassName={(record, index) => 
            index % 2 === 0 ? "table-row-light table-row-hover" : "table-row-dark table-row-hover"}
          columns={columns}
          dataSource={ingredients}

        />
      </div>
    </div>
  );
}

export default Ingredients;