import { Col, Row, Card, Statistic, Table } from "antd";
import { AuditOutlined, UserOutlined, PieChartOutlined, StockOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { GetRowMenu, GetRowIngredient, GetRowEmp, GetRowMember, GetRowPromotion  } from "../../services/https/index";
import { useEffect, useState } from "react";

interface DataType {
  key: string;
  name: string;
  age: number;
  address: string;
  tags: string[];
}


const columns: ColumnsType<DataType> = [
  {
    title: "ลำดับ",
    dataIndex: "ID",
    key: "id",
  },
  {
    title: "ชื่อ",
    dataIndex: "FirstName",
    key: "firstname",
  },
  {
    title: "นามสกุุล",
    dataIndex: "LastName",
    key: "lastname",
  },
  {
    title: "อีเมล",
    dataIndex: "Email",
    key: "email",
  },
  {
    title: "ที่อยู่",
    dataIndex: "address",
    key: "address",
  },
  {
    title: "เบอร์โทร",
    dataIndex: "Phone",
    key: "phone",
  },
];

const data: DataType[] = [];

export default function Index() {
  const [rowMenu, setRowMenu] = useState<number>(0); // ตั้งค่าเริ่มต้นเป็น 0
  const [rowIngredient, setRowIngredient] = useState<number>(0); // ตั้งค่าเริ่มต้นเป็น 0
  const [rowEmployee, setRowEmployee] = useState<number | undefined>(0);
  const [rowPromotion, setRowPromotion] = useState<number | undefined>(0);
  const [rowMember, setRowMember] = useState<number | undefined>(0);

  const getRowMenu = async () => {
    let res = await GetRowMenu();
    if (res && res.status === 200) {
      setRowMenu(res.data); // Assuming res.data is the count (a number)
    } else {
      setRowMenu(0); // Fallback to 0 if there's an error
    }
  };

  const getRowIngredient = async () => {
    let res = await GetRowIngredient();
    if (res && res.status === 200) {
      setRowIngredient(res.data); // Assuming res.data is the count (a number)
    } else {
      setRowIngredient(0); // Fallback to 0 if there's an error
    }
  };

  const getRowEmployee = async () => {
    let res = await GetRowEmp();
    if (res && res.status === 200) {
      setRowEmployee(res.data); // Assuming res.data is the count (a number)
    } else {
      setRowEmployee(0); // Fallback to 0 if there's an error
    }
  };

  const getRowPromotion = async () => {
    let res = await GetRowPromotion();
    if (res && res.status === 200) {
      setRowPromotion(res.data); // Assuming res.data is the count (a number)
    } else {
      setRowPromotion(0); // Fallback to 0 if there's an error
    }
  };

  const getRowMember = async () => {
    let res = await GetRowMember();
    if (res && res.status === 200) {
      setRowMember(res.data); // Assuming res.data is the count (a number)
    } else {
      setRowMember(0); // Fallback to 0 if there's an error
    }
  };
  

  useEffect(() => {
    getRowMenu();
    getRowIngredient();
    getRowEmployee();
    getRowPromotion();
    getRowMember();
  }, []);

  useEffect(() => {
    console.log("row menu updated", rowMenu);
    console.log("row ingredient updated", rowIngredient);
    console.log("row member updated", rowMember);
    console.log("row promotion updated", rowPromotion);
    console.log("row employee updated", rowEmployee);
  }, [rowMenu]);

  return (
    <div style={{  minHeight: "100vh" }}>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
          <h2>แดชบอร์ด</h2>
        </Col>

        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
          <Card className="bg-1">
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={24} md={12} lg={12} xl={6}>
                <Card
                  bordered={false}
                  style={{
                    boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
                  }}
                >
                  <Statistic title="เมนู" value={`${rowMenu?.data || 0} เมนู`} prefix={<StockOutlined />} />
                </Card>
              </Col>

              <Col xs={24} sm={24} md={12} lg={12} xl={6}>
                <Card
                  bordered={false}
                  style={{
                    boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
                  }}
                >
                  <Statistic title="วัตถุดิบ" value={`${rowIngredient?.data || 0} อัน`} valueStyle={{ color: "black" }} prefix={<AuditOutlined />} />
                </Card>
              </Col>

              <Col xs={24} sm={24} md={12} lg={12} xl={6}>
                <Card
                  bordered={false}
                  style={{
                    boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
                  }}
                >
                  <Statistic title="พนักงาน" value={`${rowEmployee?.data || 0} คน`} valueStyle={{ color: "black" }} prefix={<PieChartOutlined />} />
                </Card>
              </Col>

              <Col xs={24} sm={24} md={12} lg={12} xl={6}>
                <Card
                  bordered={false}
                  style={{
                    boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
                  }}
                >
                  <Statistic title="สมาชิก" value={`${rowMember?.data || 0} คน`} valueStyle={{ color: "black" }} prefix={<UserOutlined />} />
                </Card>
              </Col>

              <Col xs={24} sm={24} md={12} lg={12} xl={6}>
                <Card
                  bordered={false}
                  style={{
                    boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
                  }}
                >
                  <Statistic title="โปรโมชั่น" value={`${rowPromotion?.data || 0} โปรโมชั่น`} valueStyle={{ color: "black" }} prefix={<UserOutlined />} />
                </Card>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );
}