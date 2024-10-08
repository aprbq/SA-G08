import { useState, useEffect } from "react";
import { Space, Table, Button, Col, Row, Divider, message, Modal } from "antd";
import { PlusOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { GetEmployee, DeleteEmployeeById } from "../../services/https/index";
import { EmployeeInterface } from "../../interfaces/Employee";
import { Link, useNavigate } from "react-router-dom";

const { confirm } = Modal;

function Employee() {
  const navigate = useNavigate();
  const [employee, setEmployee] = useState<EmployeeInterface[]>([]);
  const [messageApi, contextHolder] = message.useMessage();
  const myId = localStorage.getItem("id"); // Get the logged-in user ID

  const columns: ColumnsType<EmployeeInterface> = [
    {
      title: "ลำดับ",
      dataIndex: "ID",
      key: "id",
    },
    {
      title: "รูป",
      dataIndex: "picture_employee",
      key: "picture",
      className: "front-1",
      width: "15%",
      render: (text, record) => (
        <img src={record.picture_employee} className="w3-left w3-circle w3-margin-right" width="100%" />
      ),
    },
    {
      title: "ชื่อ",
      dataIndex: "first_name",
      key: "first_name",
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
      title: "เพศ",
      dataIndex: "gender",
      render: (item) => Object.values(item.gender_name),
    },
    {
      title: "ตำแหน่งงาน",
      dataIndex: "role",
      render: (item) => Object.values(item.role_name),
    },
    {
      key: "action",
      render: (text, record) => (
        myId === "1" && record.ID !== 1 ? ( // Ensure that ID 1 cannot be edited or deleted
          <Space size="middle">
            <Button
              onClick={() => {
                navigate(`/employee/edit/${record.ID}`);
              }}
              icon={<EditOutlined />}
              type="link"
            >
              แก้ไข
            </Button>
            <Button
              onClick={() => {
                confirm({
                  title: 'ต้องการลบข้อมูลนี้หรือไม่?',
                  onOk: () => deleteEmployeeById(String(record.ID)),
                });
              }}
              icon={<DeleteOutlined />}
              type="link"
              danger
            >
              ลบ
            </Button>
          </Space>
        ) : null // Return null if the employee is ID 1 or logged-in ID is not 1
      ),
    },
  ];

  const deleteEmployeeById = async (id: string) => {
    let res = await DeleteEmployeeById(id);
    if (res.status == 200) {
      messageApi.open({
        type: "success",
        content: res.data.message,
      });
      await getEmployee();
    } else {
      messageApi.open({
        type: "error",
        content: res.data.error,
      });
    }
  };

  const getEmployee = async () => {
    let res = await GetEmployee();
    if (res.status == 200) {
      setEmployee(res.data);
    } else {
      setEmployee([]);
      messageApi.open({
        type: "error",
        content: res.data.error,
      });
    }
  };

  useEffect(() => {
    getEmployee();
  }, []);

  return (
    <>
      {contextHolder}
      <Row>
        <Col className="name-table" span={12}>
          <h2>จัดการข้อมูลสมาชิก</h2>
        </Col>
        <Col span={12} style={{ textAlign: "end", alignSelf: "center" }}>
          <Space>
            <Link to="/employee/create">
              <Button type="primary" className="btn-1" icon={<PlusOutlined />}>
                สร้างข้อมูล
              </Button>
            </Link>
          </Space>
        </Col>
      </Row>
      <Divider />
      <div style={{ marginTop: 20 }}>
        <Table
          rowKey="ID"
          className="custom-table"
          rowClassName={(record, index) =>
            index % 2 === 0 ? "table-row-light table-row-hover" : "table-row-dark table-row-hover"
          }
          columns={columns}
          dataSource={employee}
        />
      </div>
    </>
  );
}

export default Employee;
