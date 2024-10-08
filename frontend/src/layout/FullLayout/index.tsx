import React, { useEffect, useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import "../../App.css";
import { UserOutlined, DashboardOutlined, ShoppingOutlined, LogoutOutlined, StarOutlined, AppstoreOutlined } from "@ant-design/icons";
import { Breadcrumb, Layout, Menu, Button, message, Avatar } from "antd";
import logo from "../../assets/logocafe.png";
import Dashboard from "../../pages/dashboard";
import Employee from "../../pages/employee";
import EmployeeCreate from "../../pages/employee/create";
import EmployeeEdit from "../../pages/employee/edit";
import Ingredient from "../../pages/ingredient";
import IngredientCreate from "../../pages/ingredient/create";
import IngredientEdit from "../../pages/ingredient/edit";

import Supplier from "../../pages/supplier";
import SupplierCreate from "../../pages/supplier/create";
import SupplierEdit from "../../pages/supplier/edit";

import Menus from "../../pages/menu";
import MenuCreate from "../../pages/menu/create";
import MenuEdit from "../../pages/menu/edit";
import Promotion from "../../pages/promotion";
import PromotionCreate from "../../pages/promotion/create";
import PromotionEdit from "../../pages/promotion/edit";
import PromotionHistory from "../../pages/promotion/history";

import Order from "../../pages/order";
import OrderCreate from "../../pages/order/create";
import OrderEdit from "../../pages/order/edit";
import ConfirmOrder from "../../pages/order/create/createorder";
import QrPage from "../../pages/order/qrpage";


import Member from "../../pages/member";
import MemberCreate from "../../pages/member/create";
import MemberEdit from "../../pages/member/edit";
import MemberHistory from "../../pages/member/memberorderhistory";
import { GetEmployeeById, DeleteEmployeeById } from "../../services/https/index";
import { EmployeeInterface } from "../../interfaces/Employee";
const { Header, Content, Footer } = Layout;

const FullLayout: React.FC = () => {
  const page = localStorage.getItem("page");
  const [messageApi, contextHolder] = message.useMessage();
  const [employeeData, setEmployeeData] = useState<EmployeeInterface[]>([]);
  const [accountid, setAccountID] = useState<any>(localStorage.getItem("id"));


  const setCurrentPage = (val: string) => {
    localStorage.setItem("page", val);
  };

  const Logout = () => {
    localStorage.clear();
    messageApi.success("Logout successful");
    setTimeout(() => {
      location.href = "/";
    }, 2000);
  };

  const getEmployeeById = async (id: string) => {
    let res = await GetEmployeeById(id);
    console.log("res", res.data)
    if (res.status == 200) {
      setEmployeeData(res.data);
      console.log("emdata", employeeData)
      console.log("a", setEmployeeData(res.data))
    } else {
      messageApi.error("Employee ID not found");
    }
  };

  useEffect(() => {
    getEmployeeById(accountid);
  }, []);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {contextHolder}
      <Layout>
        <Header className="header">
          <div className="header-logo">
            <img src={logo} alt="Logo" />
          </div>
          <div className="text-head">
            <h2>CAFE IN(e)</h2>
          </div>
          <div className="employee-info" style={{ display: 'flex', alignItems: 'center' }}>
            {/* Display employee picture and other info */}
            {employeeData && (
              <>
                <Link to={`/employee/edit/${employeeData.ID}`}>
                  <Avatar
                    src={employeeData.picture_employee}
                    alt="Employee"
                    size="large"
                    style={{ marginRight: 10, cursor: 'pointer' }} // Add cursor pointer to indicate clickability
                  />
                </Link>
                <span className = "front-white" style={{ marginRight: 10 }}>{employeeData.first_name}</span>
                <span className = "front-white" style={{ marginRight: 10 }}>{employeeData.last_name}</span>
                <Button className="btn-3" onClick={Logout} icon={<LogoutOutlined />}>
                  ออกจากระบบ
                </Button>
              </>
            )}
          </div>

        </Header>
        <Menu
          theme="dark"
          mode="horizontal"
          onClick={({ key }) => setCurrentPage(key)}
          className="header-menu"
        >
          <Menu.Item key="dashboard" icon={<DashboardOutlined />}>
            <Link to="/">แดชบอร์ด</Link>
          </Menu.Item>
          <Menu.Item key="employee" icon={<UserOutlined />}>
            <Link to="/employee">ข้อมูลพนักงาน</Link>
          </Menu.Item>
          <Menu.Item key="menu" icon={<ShoppingOutlined />}>
            <Link to="/menus">เมนู</Link>
          </Menu.Item>
          <Menu.Item key="ingredient" icon={<AppstoreOutlined />}>
            <Link to="/ingredient">วัตถุดิบ</Link>
          </Menu.Item>
          <Menu.Item key="Order" icon={<ShoppingOutlined />}>
            <Link to="/Order/create">รายการสั่งซื้อ</Link>
          </Menu.Item>
          <Menu.Item key="promotion" icon={<StarOutlined />}>
            <Link to="/promotion">โปรโมชั่น</Link>
          </Menu.Item>
          <Menu.Item key="member" icon={<UserOutlined />}>
            <Link to="/member">สมาชิก</Link>
          </Menu.Item>
        </Menu>
        <Content className="middle-bg" style={{ margin: "0px", paddingTop: "0px" }}>
          <Breadcrumb className="middle-bg" style={{ margin: "0px", height: "0px" }} />
          <div
            className="middle-bg"
            style={{
              padding: 24,
              minHeight: "100%",
            }}
          >
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/employee" element={<Employee />} />
              <Route path="/employee/create" element={<EmployeeCreate />} />
              <Route path="/employee/edit/:id" element={<EmployeeEdit />} />
              <Route path="/menus" element={<Menus />} />
              <Route path="/menus/create" element={<MenuCreate />} />
              <Route path="/menus/edit/:id" element={<MenuEdit />} />
              <Route path="/ingredient" element={<Ingredient />} />
              <Route path="/ingredient/create" element={<IngredientCreate />} />
              <Route path="/ingredient/edit/:id" element={<IngredientEdit />} />
              <Route path="/supplier" element={<Supplier />} />
              <Route path="/supplier/create" element={<SupplierCreate />} />
              <Route path="/supplier/edit/:id" element={<SupplierEdit />} />
              <Route path="/order" element={<Order />} />
              <Route path="/order/create" element={<OrderCreate />} />
              <Route path="/order/create/createorder" element={<ConfirmOrder />} />
              <Route path="/order/qrpage" element={<QrPage />} />
              <Route path="/order/edit/:id" element={<OrderEdit />} />
              <Route path="/promotion" element={<Promotion />} />
              <Route path="/promotion/create" element={<PromotionCreate />} />
              <Route path="/promotion/edit/:id" element={<PromotionEdit />} />
              <Route path="/promotion/history" element={<PromotionHistory />} />
              <Route path="/member" element={<Member />} />
              <Route path="/member/create" element={<MemberCreate />} />
              <Route path="/member/edit/:id" element={<MemberEdit />} />
              <Route path="/member/memberorderhistory/:id" element={<MemberHistory />} />
            </Routes>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default FullLayout;