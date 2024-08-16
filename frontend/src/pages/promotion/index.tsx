import { useState, useEffect } from "react";
import { Space, Table, Button, Col, Row, Divider, message } from "antd";
import { PlusOutlined, DeleteOutlined , EditOutlined} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { GetPromotion, DeletePromotionById } from "../../services/https/index";
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
      key: "promotion_name",
    },

    {
      title: "คำอธิบาย",
      dataIndex: "Description",
      key: "description",
    },
    {
      title: "ได้แต้ม",
      dataIndex: "PointsAdded",
      key: "points_added",
    },
    {
      title: "ใช้แต้ม",
      dataIndex: "PointsUse",
      key: "points_use",
    },
    {
        title: "จำนวน",
        dataIndex: "DiscountValue",
        key: "discount_value",
    },
    {
        title: "ประเภท",
        key: "discount_type",
        render: (record) => <>{record?.class?.class}</>,
    },
    {
      title: "วันเริ่ม",
      key: "start_date",
      render: (record) => <>{dayjs(record.exp_date).format("DD/MM/YYYY")}</>,
    },
    {
      title: "วันสิ้นสุด",
      key: "end_date",
      render: (record) => <>{dayjs(record.exp_date).format("DD/MM/YYYY")}</>,
    },
    {
    title: "สถานะ",
    key: "status",
    render: (record) => <>{record?.class?.class}</>,
    },
    {
      title: "",
      render: (record) => (
        <>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => navigate(`/promotion/edit/${record.ID}`)}
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
                onClick={() => deletePromotionById(record.ID)}
              ></Button>
            )}
          </>
        ),
      },
  ];

  const deletePromotionById = async (id: string) => {
    let res = await DeletePromotionById(id);

    if (res.status == 200) {
      messageApi.open({
        type: "success",
        content: res.data.message,
      });
      await getPromotion();
    } else {
      messageApi.open({
        type: "error",
        content: res.data.error,
      });
    }
  };

  const getPromotion = async () => {
    let res = await GetPromotion();
    if (res.status == 200) {
      setPromotion(res.data);
    } else {
      setPromotion([]);
      messageApi.open({
        type: "error",
        content: res.data.error,
      });
    }
  };

  useEffect(() => {
    getPromotion();
  }, []);

  return (
    <>
      {contextHolder}
      <Row>
        <Col className = "name-table" span={12}>
          <h2>จัดการโปรโมชั่น</h2>
        </Col>
        <Col span={12} style={{ textAlign: "end", alignSelf: "center" }}>
          <Space>
            <Link to="/promotion/create">
              <Button className = "btn-1" type="primary" icon={<PlusOutlined />}>
                สร้างโปรโมชั่น
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
export default Promotion;