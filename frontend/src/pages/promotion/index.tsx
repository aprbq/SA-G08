import { useState, useEffect } from "react";
import { Space, Table, Button, Col, Row, Divider, message } from "antd";
import { PlusOutlined, DeleteOutlined , EditOutlined} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { GetIngredients, DeleteIngredientsById } from "../../services/https/index";
import { PromotionInterface } from "../../interfaces/Promotion";
import { Link, useNavigate } from "react-router-dom";
import dayjs from "dayjs";

function Promotion() {
  const navigate = useNavigate();
  const [ingredients , setPromotion] = useState<PromotionInterface[]>([]);
  const [messageApi, contextHolder] = message.useMessage();
  const myId = localStorage.getItem("id");

  const columns: ColumnsType<PromotionInterface> = [


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
      title: "วันเริ่ม",
      key: "StartDate",
      render: (record) => <>{dayjs(record.exp_date).format("DD/MM/YYYY")}</>,
    },
    {
      title: "วันสิ้นสุด",
      key: "EndDate",
      render: (record) => <>{dayjs(record.exp_date).format("DD/MM/YYYY")}</>,
    },
    {
      title: "ได้แต้ม",
      dataIndex: "PointsAdded",
      key: "PointsAdded",
    },
    {
      title: "ใช้แต้ม",
      dataIndex: "PointsUse",
      key: "PointsUse",
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
      title: "",
      render: (record) => (
        <>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => navigate(`/ingredient/edit/${record.ID}`)}
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
                onClick={() => deleteIngredientsById(record.ID)}
              ></Button>
            )}
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
export default Ingredients;