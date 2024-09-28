import { Col, Row, Card, Statistic } from "antd";
import { Link } from "react-router-dom";
import { 
  AuditOutlined, 
  UserOutlined, 
  PieChartOutlined, 
  StockOutlined 
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { 
  GetRowMenu, 
  GetRowIngredient, 
  GetRowEmp, 
  GetRowMember, 
  GetRowPromotion,
  GetRowOrder  
} from "../../services/https/index";
import { useEffect, useState } from "react";

interface DataType {
  key: string;
  name: string;
  age: number;
  address: string;
  tags: string[];
}

export default function Index() {
  const [rowMenu, setRowMenu] = useState<number>(0); 
  const [rowIngredient, setRowIngredient] = useState<number>(0); 
  const [rowEmployee, setRowEmployee] = useState<number | undefined>(0);
  const [rowPromotion, setRowPromotion] = useState<number | undefined>(0);
  const [rowMember, setRowMember] = useState<number | undefined>(0);
  const [rowOrder, setRowOrder] = useState<number | undefined>(0);

  const getRowMenu = async () => {
    let res = await GetRowMenu();
    setRowMenu(res?.status === 200 ? res.data : 0);
  };

  const getRowIngredient = async () => {
    let res = await GetRowIngredient();
    setRowIngredient(res?.status === 200 ? res.data : 0);
  };

  const getRowEmployee = async () => {
    let res = await GetRowEmp();
    setRowEmployee(res?.status === 200 ? res.data : 0);
  };

  const getRowPromotion = async () => {
    let res = await GetRowPromotion();
    setRowPromotion(res?.status === 200 ? res.data : 0);
  };

  const getRowMember = async () => {
    let res = await GetRowMember();
    setRowMember(res?.status === 200 ? res.data : 0);
  };

  const getRowOrder = async () => {
    let res = await GetRowOrder();
    setRowOrder(res?.status === 200 ? res.data : 0);
  };

  useEffect(() => {
    getRowMenu();
    getRowIngredient();
    getRowEmployee();
    getRowPromotion();
    getRowMember();
    getRowOrder();
  }, []);

  useEffect(() => {
    console.log("hee", rowOrder)
  }, []);
  return (
    <div className = "dashboard" >
      <Row gutter={[16, 16]}>
        <Col className = "name-das"xs={24}>
          <h2 style={{ textAlign: "center", marginBottom: "20px" }}>แดชบอร์ด</h2>
        </Col>
        <Col xs={24}>
          <Card className="dashboard-card">
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} lg={12}>
              <Link to ="/menus">
                <Card className="dashboard-item"
                  bordered={false}
                  style={{ 
                    boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
                    textAlign: "center",
                  }}
                >
                  <Statistic 
                    title="เมนู"
                    className="front-1" 
                    value={`${rowMenu?.data || 0} เมนู`} 
                    prefix={<StockOutlined />} 
                  />
                </Card>
                </Link>
              </Col>
              <Col xs={24} sm={12} lg={12}>
              <Link to ="/ingredient">
                <Card 
                  bordered={false}
                  className="dashboard-item"
                  style={{ 
                    boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
                    textAlign: "center",
                  }}
                >
                  <Statistic 
                    title="วัตถุดิบ" 
                    className="front-1"
                    value={`${rowIngredient?.data || 0} รายการ`} 
                    prefix={<AuditOutlined />} 
                  />
                </Card>
                </Link>
              </Col>
              <Col xs={24} sm={12} lg={6}>
              <Link to ="/employee">
                <Card 
                  bordered={false}
                  style={{ 
                    backgroundColor: "#83613f",
                    boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
                    textAlign: "center",
                  }}
                >
                  <Statistic 
                    title="พนักงาน" 
                    className="front-1"
                    value={`${rowEmployee?.data || 0} คน`} 
                    prefix={<PieChartOutlined />} 
                  />
                </Card>
                </Link>
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <Card 
                  bordered={false}
                  style={{ 
                    backgroundColor: "#83613f",
                    boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
                    textAlign: "center",
                  }}
                >
                  <Statistic 
                    title="สมาชิก" 
                    className="front-1"
                    value={`${rowMember?.data || 0} คน`} 
                    prefix={<UserOutlined />} 
                  />
                </Card>
              </Col>
              
              <Col xs={24} sm={12} lg={6}>
              <Link to = "/promotion">
                <Card 
                  bordered={false}
                  style={{ 
                    backgroundColor: "#83613f",
                    boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
                    textAlign: "center",
                  }}
                >
                  <Statistic 
                    title="โปรโมชั่น" 
                    className="front-1"
                    value={`${rowPromotion?.data || 0} โปรโมชั่น`} 
                    prefix={<UserOutlined />} 
                  />
                </Card>
                </Link>
              </Col>
              <Col xs={24} sm={12} lg={6}>
              <Link to = "/order">
                <Card 
                  bordered={false}
                  style={{ 
                    backgroundColor: "#83613f",
                    boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
                    textAlign: "center",
                  }}
                >
                  <Statistic 
                    title="ออเดอร์" 
                    className="front-1"
                    value={`${rowOrder?.data || 0} ออเดอร์`} 
                    prefix={<UserOutlined />} 
                  />
                </Card>
                </Link>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
