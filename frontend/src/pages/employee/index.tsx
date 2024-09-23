import { useState, useEffect } from "react";
import { Space, Table, Button, Col, Row, Divider, message } from "antd";
import { PlusOutlined, DeleteOutlined,EditOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { GetEmployee, DeleteEmployeeById } from "../../services/https/index";
import { EmployeeInterface } from "../../interfaces/Employee";
import { Link, useNavigate } from "react-router-dom";

function Employee() {
  const navigate = useNavigate();
  const [employee, setEmployee] = useState<EmployeeInterface[]>([]);
  const [messageApi, contextHolder] = message.useMessage();
  const myId = localStorage.getItem("id");

  const columns: ColumnsType<EmployeeInterface> = [


    {
      title: "ลำดับ",
      dataIndex: "ID",
      key: "id",
    },

    {
      title: "ชื่อ",
      dataIndex: "first_name",
      key: "first_name",
    },

    {
      title: "นามสกุุล",
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
      key: "role",
      render: (item) => Object.values(item.role_name),
    },

    {
      title: "",
      render: (record) => (
        <>
          <Button
            type="primary"
            icon={<EditOutlined />}
            className="btn-1"
            onClick={() => navigate(`/employee/edit/${record.ID}`)}
            style={{ marginRight: "8px" }}
          >
            แก้ไขข้อมูล
          </Button>
          {myId == record?.ID ? (
            <></>
          ) : (
            <Button
              className="btn-delete"
              icon={<DeleteOutlined />}
              onClick={() => deleteEmployeeById(record.ID)}
            ></Button>
          )}
        </>
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
        <Col className = "name-table" span={12}>
          <h2>จัดการข้อมูลสมาชิก</h2>
        </Col>
        <Col span={12} style={{ textAlign: "end", alignSelf: "center" }}>
          <Space>
            <Link to="/employee/create">
              <Button type="primary" className = "btn-1" icon={<PlusOutlined />}>
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