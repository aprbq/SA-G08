import { useState, useEffect } from "react";
import { Space, Table, Button, Col, Row, Divider, message } from "antd";
import { PlusOutlined, DeleteOutlined , EditOutlined} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { GetIngredients, DeleteIngredientsById } from "../../services/https/index";
import { IngredientInterface } from "../../interfaces/Ingre";
import { Link, useNavigate } from "react-router-dom";
import dayjs from "dayjs";

function Ingredients() {
  const navigate = useNavigate();
  const [ingredients , setIngredients] = useState<IngredientInterface[]>([]);
  const [messageApi, contextHolder] = message.useMessage();
  //const myId = localStorage.getItem("id");

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
      dataIndex: "supplier",
      key: "supplier",
    },
    {
      title: "วัน/เดือน/ปี หมดอายุ",
      key: "exp_date",
      render: (record) => <>{dayjs(record.exp_date).format("DD/MM/YYYY")}</>,
    },
    {
      title: "ประเภท",
      key: "class",
      render: (record) => <>{record?.class?.class}</>,
    },

    {
      title: "",
      render: (record) => (
        <>
          <Button
          onClick={() => navigate(`/ingredient/edit/${record.ID}`)}
            type="primary" 
            className='btn-1'
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
              onClick={() => deleteIngredientsById(record.ID)}
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
    <>
      {contextHolder}
      <Row>
        <Col span={12}>
          <h2>จัดการวัตถุดิบ</h2>
        </Col>
        <Col span={12} style={{ textAlign: "end", alignSelf: "center" }}>
          <Space>
            <Link to="/ingredient/create">
              <Button className='btn-1' type="primary" icon={<PlusOutlined />} >
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
export default Ingredients;