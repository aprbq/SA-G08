import React, { useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import "../../App.css";
import { UserOutlined, DashboardOutlined, ShoppingOutlined, LogoutOutlined, StarOutlined ,} from "@ant-design/icons";
import { Breadcrumb, Layout, Menu, Button, message } from "antd";
import logo from "../../assets/logocafe.png";
import Dashboard from "../../pages/dashboard";
import Customer from "../../pages/customer";
import CustomerCreate from "../../pages/customer/create";
import CustomerEdit from "../../pages/customer/edit";
import Ingredient from "../../pages/ingredient";
import IngredientCreate from "../../pages/ingredient/create";
import IngredientEdit from "../../pages/ingredient/edit";
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

import Member from "../../pages/member";
import MemberCreate from "../../pages/member/create";
import MemberEdit from "../../pages/member/edit";

const { Header, Content, Footer } = Layout;

const FullLayout: React.FC = () => {
  const page = localStorage.getItem("page");
  const [messageApi, contextHolder] = message.useMessage();

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

  return (
    <Layout style={{ minHeight: "100vh" }}>
  {contextHolder}
  <Layout>
    <Header className="header">
      <div className="header-logo">
        <img src={logo} alt="Logo" />
      </div>
      <div className = "text-head">
          <h2>BIG DOOK CAFE</h2>
      </div>
      <div className = "logout" >
        <Button className="btn-3" onClick={Logout} icon={<LogoutOutlined />}>
          ออกจากระบบ
        </Button>
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
        <Menu.Item key="customer" icon={<UserOutlined />}>
          <Link to="/customer">ข้อมูลสมาชิก</Link>
        </Menu.Item>
        <Menu.Item key="menu" icon={<ShoppingOutlined />}>
          <Link to="/menus">เมนู</Link>
        </Menu.Item>
        <Menu.Item key="ingredient" icon={<ShoppingOutlined />}>
          <Link to="/ingredient">วัตถุดิบ</Link>
        </Menu.Item>
        <Menu.Item key="Order" icon={<ShoppingOutlined />}>
          <Link to="/Order">รายการสั่งซื้อ</Link>
        </Menu.Item>
        <Menu.Item key="promotion" icon={<StarOutlined />}>
          <Link to="/promotion">โปรโมชั่น</Link>
        </Menu.Item>
        <Menu.Item key="member" icon={<UserOutlined />}>
          <Link to="/member">สมาชิก</Link>
        </Menu.Item>
      </Menu>
        <Content className="bg" style={{ margin: "0px", paddingTop: "20px"}}>
          <Breadcrumb style={{ margin: "0px 0" }} />
          <div
            className="middle-bg"
            style={{
              padding: 24,
              minHeight: "100%",
            }}
          >
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/customer" element={<Customer />} />
              <Route path="/customer/create" element={<CustomerCreate />} />
              <Route path="/customer/edit/:id" element={<CustomerEdit />} />
              <Route path="/menus" element={<Menus />} />
              <Route path="/menus/create" element={<MenuCreate />} />
              <Route path="/menus/edit/:id" element={<MenuEdit />} />
              <Route path="/ingredient" element={<Ingredient />} />
              <Route path="/ingredient/create" element={<IngredientCreate />} />
              <Route path="/ingredient/edit/:id" element={<IngredientEdit />} />
              <Route path="/order" element={<Order />} />
              <Route path="/order/create" element={<OrderCreate />} />
              <Route path="/order/create/createorder" element={<ConfirmOrder />} />
              <Route path="/order/edit/:id" element={<OrderEdit />} />
              <Route path="/promotion" element={<Promotion />} />
              <Route path="/promotion/create" element={<PromotionCreate />} />
              <Route path="/promotion/edit/:id" element={<PromotionEdit />} />
              <Route path="/promotion/history" element={<PromotionHistory />} />
              <Route path="/member" element={<Member />} />
              <Route path="/member/create" element={<MemberCreate />} />
              <Route path="/member/edit/:id" element={<MemberEdit />} />
            </Routes>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default FullLayout;