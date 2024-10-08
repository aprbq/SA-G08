import { useState, useEffect } from "react";
import { Space, Table, Button, Col, Row, Divider, message ,Modal,Card,Statistic, Input,Typography } from "antd";
import { PlusOutlined, DeleteOutlined , EditOutlined,EyeOutlined} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { GetMember, DeleteMemberById ,UpdateMemberStatusById,UpdateMemberPointsById} from "../../services/https/index";
import { MemberInterface } from "../../interfaces/Member";
import { Link, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
const { confirm } = Modal;
function Member() {
  const navigate = useNavigate();
  const [member , setMember] = useState<MemberInterface[]>([]);
  const [messageApi, contextHolder] = message.useMessage();
  const [searchId, setSearchId] = useState<string>("");
  const activeMembers = member.filter((m) => m.Status.status_name === "Active");
  const myId = localStorage.getItem("id");
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
        render: (item) => {
          const statusColor = item.status_name.toLowerCase() === "active" ? "green" : 
                              item.status_name.toLowerCase() === "unactive" ? "red" : "";
          return (
            <span
              style={{
                backgroundColor: statusColor,
                padding: "4px 8px",
                borderRadius: "4px",
                color: "white",
              }}
            >
              {item.status_name}
            </span>
          );
        },
    },
    {
      title: "วันเกิด",
      key: "date_of_birth",
      render: (record) => <>{dayjs(record.date_of_birth).format("DD/MM/YYYY")}</>,
    },
    {
      title: "วันเริ่มเป็นสมาชิก",
      key: "start_date",
      render: (record) => <>{dayjs(record.start_date).format("DD/MM/YYYY")}</>,
    },
    {
      title: "วันสิ้นสุดการเป็นสมาชิก",
      key: "end_date",
      render: (record) => {
        console.log("end_date:", record.end_date);
        return record.end_date === "0001-01-01T00:00:00Z"
          ? <>ยังไม่ยกเลิก</>
          : <>{dayjs(record.end_date).format("DD/MM/YYYY")}</>;
      },
    },
    {
      title: "แต้ม",
      dataIndex: "points",
      key: "points",
    },
    {
      title: "เพศ",
      dataIndex: "Gender",
      key: "gender",
      render: (item) => Object.values(item.gender_name),
    },
    {
      title: "แก้ไขข้อมูล",
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
      title: "ดูประวัติการซื้อ",
      render: (record) => (
        <>
            <Button
          type="default"
          className=  "front-1"
          icon={<EyeOutlined />}
          onClick={() => navigate(`/member/memberorderhistory/${record.ID}`)}
          >
          ดูประวัติการซื้อ
        </Button>
        </>
      ),
    },
    {
        title: "ยกเลิกสมาชิก",
        render: (record) => (
          <>
            {record?.ID === 1 ? (
            <></>
            ) : (
              <Button
            type="primary"
            className="btn-delete"
            icon={<EditOutlined />}
            onClick={() => showCancelConfirm(record.ID)}
            />
          )} 
          </>
        ),
      },
      {
        title: "ลบ",
        render: (record) => (
          <>
            {record?.ID === 1 ? (
            <></>
            ) : (
              <Button
            type="primary"
            className="btn-delete"
            icon={<DeleteOutlined />}
            onClick={() => showDeleteConfirm(record.ID)}
            />
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
  const updateMemberStatusById = async (id: string ) => {
    const currentdate = new Date();
    let res = await UpdateMemberStatusById(id,2,currentdate);
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
  const Updatememberpointsbyid = async (id: string ,pointsDelta: number) => {
    let res = await UpdateMemberPointsById(id,pointsDelta);
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
  const showDeleteConfirm = (id: string) => {
    confirm({
      title: "คุณแน่ใจหรือว่าต้องการลบข้อมูลสมาชิกลูกค้านี้?",
      content: "การลบจะไม่สามารถยกเลิกได้",
      okText: "ยืนยัน",
      okType: "danger",
      cancelText: "ยกเลิก",
      onOk() {
        deleteMemberById(id);
      },
      onCancel() {
        console.log("ยกเลิกการลบ");
      },
    });
  };
  const showCancelConfirm = (id: string) => {
    confirm({
      title: "คุณแน่ใจหรือว่าต้องการยกเลิกสมาชิกของลูกค้าคนนี้?",
      content: "การยกเลิกสมาชิกของลูกค้าคนนี้จะทำการเปลี่ยนสถานะของลูกค้าคนนี้",
      okText: "ยืนยัน",
      okType: "danger",
      cancelText: "ยกเลิก",
      onOk() {
        updateMemberStatusById(id);
      },
      onCancel() {
        console.log("ยกเลิกการลบ");
      },
    });
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
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchId(e.target.value); // อัปเดตการค้นหา
  };
  const filteredMembers = member.filter((m) =>
    m.ID.toString().includes(searchId) // กรองสมาชิกตาม ID
  );
  return (
    <div style={{ backgroundColor: "#e3d0b6", minHeight: "100vh" }}>
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
                    backgroundColor: "#dafafa",
                    boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
                    margin: "0 10px" 
                  }}
                >
                <Typography.Text style={{ color: "black", fontWeight: "bold" }}>
                    Total Members
                </Typography.Text>
                <Statistic 
                  value={member.length} valueStyle={{ color: "black" }}  />
            </Card>
        </Col>
        <Col span={5}>
            <Card bordered={false}
                  style={{
                    backgroundColor: "#e4f3d8",
                    boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
                    margin: "0 10px" 
                  }}
                >
              <Typography.Text style={{ color: "black", fontWeight: "bold" }}>
              Active Members
                </Typography.Text>
              <Statistic   value={activeMembers.length} valueStyle={{ color: "black" }}  />
            </Card>
        </Col>
        <Col span={5}>
        <Card bordered={false}
                  style={{
                    backgroundColor: "#fc9994",
                    boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
                    margin: "0 10px" 
                  }}
                >
              <Typography.Text style={{ color: "black", fontWeight: "bold" }}>
              Unactive Members
                </Typography.Text>
              <Statistic  value={member.length-activeMembers.length} valueStyle={{ color: "black" }}   />
            </Card>
        </Col>
      </Row>

      <Row style={{ marginTop: 20 }}>
        <Col span={12}>
          <Input
            placeholder="ค้นหาด้วย ID"
            value={searchId}
            onChange={handleSearch}
            style={{ width: "50%" }}
          />
        </Col>
      </Row>

      <Divider />
      <div style={{ marginTop: 20 }}>
      <Table
        rowKey="ID"
        columns={columns}
        dataSource={filteredMembers}
        className="custom-table"
        style={{ width: "100%", overflowX: "auto" }}
        rowClassName="table-row-light table-row-hover"
        scroll={{ x: 'max-content' }} 
      />
      </div>
    </div>
  );
}
export default Member;