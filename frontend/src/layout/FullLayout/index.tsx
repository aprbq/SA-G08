import React, { useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import "../../App.css";
import { UserOutlined, DashboardOutlined, ShoppingOutlined, LogoutOutlined, StarOutlined } from "@ant-design/icons";
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

import Order from "../../pages/order";
import OrderCreate from "../../pages/order/create";
import OrderEdit from "../../pages/order/edit";

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
        <Header className="header" style={{ backgroundColor: "#745F47", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ width: "95px", height:"75px"}}>
            <img src={logo} alt="Logo" style={{ width: "75px", height:"75px" }} />
          </div>
          <div className="header-buttons">
            <Button
              type={page === "dashboard" ? "primary" : "default"}
              onClick={() => setCurrentPage("dashboard")}
              icon={<DashboardOutlined />}
              className="btn-1" 
              
            >
              <Link to="/">แดชบอร์ด</Link>
            </Button>
            <Button
              type={page === "customer" ? "primary" : "default"}
              onClick={() => setCurrentPage("customer")}
              icon={<UserOutlined />}
              className="btn-1"
            >
              <Link to="/customer">ข้อมูลสมาชิก</Link>
            </Button>
            <Button
              type={page === "menu" ? "primary" : "default"}
              onClick={() => setCurrentPage("menu")}
              icon={<ShoppingOutlined />}
              className="btn-1"
            >
              <Link to="/menus">เมนู</Link>
            </Button>
            <Button
              type={page === "ingredient" ? "primary" : "default"}
              onClick={() => setCurrentPage("ingredient")}
              icon={<ShoppingOutlined />}
              className="btn-1"
            >
              <Link to="/ingredient">วัตถุดิบ</Link>
            </Button>
            <Button
              type={page === "Order" ? "primary" : "default"}
              onClick={() => setCurrentPage("Order")}
              icon={<ShoppingOutlined />}
              className="btn-1"
            >
              <Link to="/Order">รายการสั่งซื้อ</Link>
            </Button>
            <Button
              type={page === "promotion" ? "primary" : "default"}
              onClick={() => setCurrentPage("promotion")}
              icon={<StarOutlined />}
              className="btn-1"
            >
              <Link to="/promotion">โปรโมชั่น</Link>
            </Button>
            <Button
              type={page === "member" ? "primary" : "default"}
              onClick={() => setCurrentPage("member")}
              icon={<UserOutlined />}
              className="btn-1"
            >
              <Link to="/member">สมาชิก</Link>
            </Button>
          </div>
          <Button className="logout-button" onClick={Logout} icon={<LogoutOutlined />}>
            ออกจากระบบ
          </Button>
        </Header>
        <Content style={{ margin: "0px", paddingTop: "20px" }}>
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
              <Route path="/order/edit/:id" element={<OrderEdit />} />
              <Route path="/promotion" element={<Promotion />} />
              <Route path="/promotion/create" element={<PromotionCreate />} />
              <Route path="/promotion/edit/:id" element={<PromotionEdit />} />
              <Route path="/member" element={<Member />} />
              <Route path="/member/create" element={<MemberCreate />} />
              <Route path="/member/edit/:id" element={<MemberEdit />} />
            </Routes>
          </div>
        </Content>
        <Footer style={{ textAlign: "center", backgroundColor: "#948979", color: "#5B4C43" }}>
          System Analysis and Design 1/67
        </Footer>
      </Layout>
    </Layout>
  );
};

export default FullLayout;