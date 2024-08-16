import { useState, useEffect } from "react";
import { Space, Table, Button, Col, Row, Divider, message } from "antd";
import { PlusOutlined, DeleteOutlined , EditOutlined} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { GetMember, DeleteMemberById } from "../../services/https/index";
import { MemberInterface } from "../../interfaces/Member";
import { Link, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
function Member() {
  const navigate = useNavigate();
  const [ingredients , setMember] = useState<MemberInterface[]>([]);
  const [messageApi, contextHolder] = message.useMessage();
  const myId = localStorage.getItem("id");
  const columns: ColumnsType<MemberInterface> = [
    {
      title: "ลำดับ",
      dataIndex: "ID",
      key: "id",
    },
    {
      title: "ชื่อ",
      dataIndex: "FristName",
      key: "FristName",
    },
    {
      title: "นามสกุล",
      dataIndex: "LastName",
      key: "LastName",
    },
    {
      title: "อีเมล",
      dataIndex: "Email",
      key: "Email",
    },
    {
      title: "เบอร์โทรศัพท์",
      dataIndex: "PhoneNumber",
      key: "PhoneNumber",
    },
    {
        title: "เพศ",
        dataIndex: "Gender",
        key: "Gender",
    },
    {
      title: "วันเกิด",
      key: "DateOfBirth",
      render: (record) => <>{dayjs(record.exp_date).format("DD/MM/YYYY")}</>,
    },
    {
      title: "วันเริ่มเป็นสมาชิก",
      key: "StartDate",
      render: (record) => <>{dayjs(record.exp_date).format("DD/MM/YYYY")}</>,
    },
    {
      title: "วันสิ้นสุดการเป็นสมาชิก",
      key: "EndDate",
      render: (record) => <>{dayjs(record.exp_date).format("DD/MM/YYYY")}</>,
    },
    {
      title: "แต้ม",
      dataIndex: "Points",
      key: "Points",
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
              <Button className = "add-button" type="primary" icon={<PlusOutlined />}>
                สมัครสมาชิก
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
export default Member;