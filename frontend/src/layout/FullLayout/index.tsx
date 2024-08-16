import React, { useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import "../../App.css";
import { UserOutlined, DashboardOutlined , ShoppingOutlined,LogoutOutlined,StarOutlined} from "@ant-design/icons";
import { Breadcrumb, Layout, Menu, theme, Button, message } from "antd";
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

const { Header, Content, Footer, Sider } = Layout;

const FullLayout: React.FC = () => {
  const page = localStorage.getItem("page");
  const [messageApi, contextHolder] = message.useMessage();

  const [collapsed, setCollapsed] = useState(false);


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
    <Layout style={{ minHeight: "100vh"}}>
      {contextHolder}
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        <div className="slide-bg"
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            height: "100%",
            background: "#745F47"
          }}
        >
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: 20,
                marginBottom: 20,
              }}
            >
              <img
                src={logo}
                alt="Logo"
                style={{ width: "80%" }}
              />
            </div>
            <Menu
              theme="light"
              defaultSelectedKeys={[page ? page : "dashboard"]}
              mode="inline"
              className="custom-menu"
            >
              <Menu.Item
                key="dashboard"
                onClick={() => setCurrentPage("dashboard")}
              >
                <Link to="/">
                  <DashboardOutlined />
                  <span>แดชบอร์ด</span>
                </Link>
              </Menu.Item>

              <Menu.Item
                key="customer"
                onClick={() => setCurrentPage("customer")}
              >
                <Link to="/customer">
                  <UserOutlined />
                  <span>ข้อมูลสมาชิก</span>
                </Link>
              </Menu.Item>
              <Menu.Item
                key="menu"
                onClick={() => setCurrentPage("menu")}
              >
                <Link to="/menus">
                  <ShoppingOutlined />
                  <span>เมนู</span>
                </Link>
              </Menu.Item>
              <Menu.Item
                key="ingredient"
                onClick={() => setCurrentPage("ingredient")}
              >
                <Link to="/ingredient">
                  <ShoppingOutlined />
                  <span>วัตถุดิบ</span>
                </Link>
              </Menu.Item>
              <Menu.Item
                key="Order"
                onClick={() => setCurrentPage("Order")}
              >
                <Link to="/Order">
                  <ShoppingOutlined />
                  <span>รายการสั่งซื้อ</span>
                </Link>
              </Menu.Item>
              <Menu.Item
                key="promotion"
                onClick={() => setCurrentPage("promotion")}
              >
                <Link to="/promotion">
                  <StarOutlined />
                  <span>โปรโมชั่น</span>
                </Link>
              </Menu.Item>
              
              <Menu.Item
                key="member"
                onClick={() => setCurrentPage("member")}
              >
                <Link to="/member">
                  <UserOutlined />
                  <span>สมาชิก</span>
                </Link>
              </Menu.Item>

            </Menu>
          </div>
        </div>
      </Sider>

      <Layout>
        <Header className = "header" style={{ 
            padding: "0 16px", 
            backgroundColor: "#CEC8B6", 
            display: "flex", 
            justifyContent: "space-between", 
            alignItems: "center",
          }}
        >
          <div />
          <Button className="logout-button"
            onClick={Logout} icon={<LogoutOutlined/>} >
            ออกจากระบบ
          </Button>
        </Header>
        <Content style={{ margin: "0 0px", }}>
          <Breadcrumb style={{ margin: "0px 0", }} />
          <div className="middle-bg"
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