import { useState, useEffect } from "react";
import { Space, Table, Button, Col, Row, Divider, message ,Card,Statistic} from "antd";
import { PlusOutlined, DeleteOutlined , EditOutlined} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { GetMember, DeleteMemberById } from "../../services/https/index";
import { MemberInterface } from "../../interfaces/Member";
import { Link, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
function Member() {
  const navigate = useNavigate();
  const [member , setMember] = useState<MemberInterface[]>([]);
  const [messageApi, contextHolder] = message.useMessage();
  const myId = localStorage.getItem("id");

  // const navigate = useNavigate();
  // const [Promotion , setPromotion] = useState<PromotionInterface[]>([]);
  // const [messageApi, contextHolder] = message.useMessage();
  const columns: ColumnsType<MemberInterface> = [
    {
      title: "ลำดับ",
      dataIndex: "ID",
      key: "id",
    },
    {
      title: "ชื่อ",
      dataIndex: "frist_name",
      key: "frist_name",
    },
    {
      title: "นามสกุล",
      dataIndex: "last_name",
      key: "last_name",
    },
    {
      title: "อีเมล",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "เบอร์โทรศัพท์",
      dataIndex: "phone_number",
      key: "phone_number",
    },
    {
        title: "สถานะ",
        dataIndex: "Status",
        key: "status",
        render: (item) => Object.values(item.status_name),
    },
    {
      title: "วันเกิด",
      key: "date_of_birth",
      render: (record) => <>{dayjs(record.exp_date).format("DD/MM/YYYY")}</>,
    },
    {
      title: "วันเริ่มเป็นสมาชิก",
      key: "start_date",
      render: (record) => <>{dayjs(record.exp_date).format("DD/MM/YYYY")}</>,
    },
    {
      title: "วันสิ้นสุดการเป็นสมาชิก",
      key: "end_date",
      render: (record) => <>{dayjs(record.exp_date).format("DD/MM/YYYY")}</>,
    },
    {
      title: "แต้ม",
      dataIndex: "points",
      key: "points",
    },

    {
      title: "เพศ",
      dataIndex: "Genders",
      key: "genders",
      render: (item) => Object.values(item.gender),
    },

    {
      title: "",
      render: (record) => (
        <>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => navigate(`/member/edit/${record.ID}`)}
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
                onClick={() => deleteMemberById(record.ID)}
              ></Button>
            )}
          </>
        ),
      },
  ];
  const deleteMemberById = async (id: string) => {
    let res = await DeleteMemberById(id);
    if (res.status == 200) {
      messageApi.open({
        type: "success",
        content: res.data.message,
      });
      await getMember();
    } else {
      messageApi.open({
        type: "error",
        content: res.data.error,
      });
    }
  };
  const getMember = async () => {
    let res = await GetMember();
    if (res.status == 200) {
      setMember(res.data);
    } else {
      setMember([]);
      messageApi.open({
        type: "error",
        content: res.data.error,
      });
    }
  };
  useEffect(() => {
    getMember();
  }, []);
  return (
    <>
      {contextHolder}
      <Row>
        <Col span={12}>
          <h2>จัดการสมาชิก</h2>
        </Col>
        <Col span={12} style={{ textAlign: "end", alignSelf: "center" }}>
          <Space>
            <Link to="/member/create">
              <Button className = "btn-1" type="primary" icon={<PlusOutlined />}>
                สมัครสมาชิก
              </Button>
            </Link>
          </Space>
        </Col>
      </Row>
      <Row>
        <Col span={5}>
            <Card bordered={false}
                  style={{
                    boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
                  }}
                >
              <Statistic title="Total Members" value={3000} valueStyle={{ color: "black" }}  />
            </Card>
        </Col>
        <Col span={5}>
            <Card bordered={false}
                  style={{
                    boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
                  }}
                >
              <Statistic title="Active Members" value={3000} valueStyle={{ color: "black" }}  />
            </Card>
        </Col>
        <Col span={5}>
        <Card bordered={false}
                  style={{
                    boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
                  }}
                >
              <Statistic title="Inactive Members" value={3000} valueStyle={{ color: "black" }}  />
            </Card>
        </Col>
        <Col span={5}>
        <Card bordered={false}
                  style={{
                    boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
                  }}
                >
              <Statistic title="New This Month" value={3000} valueStyle={{ color: "black" }}  />
            </Card>
        </Col>
      </Row>
      <Divider />
      <div style={{ marginTop: 20 }}>
        <Table
          rowKey="ID"
          columns={columns}
          dataSource={member}
          style={{ width: "100%", overflow: "scroll" }}
        />
      </div>
    </>
  );
}
export default Member;