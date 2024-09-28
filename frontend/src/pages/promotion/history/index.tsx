import { useState, useEffect } from "react";
import {
  Space,
  Button,
  Col,
  Row,
  Divider,
  Input,
  Card,
  message,
  Table,
} from "antd";
import { SearchOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { OrderInterface } from '../../../interfaces/Order';
import { GetOrder } from "../../../services/https"; // Import GetOrders service
import { Link } from "react-router-dom";

function PromotionHistory() {
  const [messageApi, contextHolder] = message.useMessage();
  const [orders, setOrders] = useState<any[]>([]); // Store orders from API
  const [filteredOrders, setFilteredOrders] = useState<any[]>([]); // Store filtered results
  const [searchText, setSearchText] = useState<string>(""); // State for search input

  const getOrders = async () => {
    try {
      const res = await GetOrder();
      if (res.status === 200) {
        setOrders(res.data);
        setFilteredOrders(res.data); // Initially show all orders
      } else {
        messageApi.open({
          type: "error",
          content: "Failed to fetch orders",
        });
      }
    } catch (error) {
      messageApi.open({
        type: "error",
        content: "An error occurred while fetching orders",
      });
    }
  };

  useEffect(() => {
    getOrders();
  }, []);

  const handleSearch = (value: string) => {
    setSearchText(value);
    
    const filtered = orders.filter((order) => {
      const promotionName = order.promotion?.promotion_name || ""; // Access promotion name
      return promotionName.toLowerCase().includes(value.toLowerCase());
    });
    
    setFilteredOrders(filtered);
  };

  const columns: ColumnsType<OrderInterface> = [
    {
      title: "Order ID",
      dataIndex: "ID",
      key: "id",
    },
    {
      title: "Promotion Name",
      dataIndex: "promotion",
      render: (promotion) => promotion?.promotion_name||"ลบแล้ว", // Access promotion name directly
    },
    {
      title: "Order Date",
      dataIndex: "order_date",
      key: "order_date",
      render: (order_date: string) => {
        return new Date(order_date).toLocaleDateString(); // Show only date
      },
    },
  ];

  return (
    <div>
      {contextHolder}
      <Card className="card-promotion">
        <h2 className="name-table">ประวัติการใช้งาน</h2>
        <Divider />

        {/* Search Input for Promotion History */}
        <Row gutter={[16, 0]} style={{ marginBottom: "20px" }}>
          <Col span={12} className="front-1">
            <Input
              className="front-1"
              placeholder="Search Promotion History"
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </Col>
        </Row>

        {/* Display Count of Filtered Orders */}
        <Row style={{ marginBottom: "20px" }}>
          <Col>
            <h4 className="front-1">จำนวนข้อมูลประวัติตามชื่อ: {filteredOrders.length} รายการ</h4>
          </Col>
        </Row>

        <Table
          columns={columns}
          dataSource={filteredOrders}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          className="custom-table" 
          rowClassName={(record, index) => 
            index % 2 === 0 ? "table-row-light table-row-hover" : "table-row-dark table-row-hover"
          }
        />

        <Row justify="end">
          <Col style={{ marginTop: "40px" }}>
            <Space>
              <Link to="/promotion">
                <Button className="back-button" htmlType="button">
                  ออก
                </Button>
              </Link>
            </Space>
          </Col>
        </Row>
      </Card>
    </div>
  );
}

export default PromotionHistory;
