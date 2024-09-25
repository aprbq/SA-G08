import { useState, useEffect } from "react";
import { Space, Table, Button, Col, Row, Divider, message, Modal, Input } from "antd";
import { PlusOutlined, DeleteOutlined , EditOutlined, LeftOutlined, SearchOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { GetSuppliers, DeleteSupplierById } from "../../services/https/index";
import { SupplierInterface } from "../../interfaces/Supplier";
import { Link, useNavigate } from "react-router-dom";
const { confirm } = Modal;

function Supplier() {
  const navigate = useNavigate();
  const [supplier, setSupplier] = useState<SupplierInterface[]>([]);
  const [filteredSupplier, setFilteredSupplier] = useState<SupplierInterface[]>([]);
  const [messageApi, contextHolder] = message.useMessage();
  const [searchText, setSearchText] = useState<string>("");

  const columns: ColumnsType<SupplierInterface> = [
    {
      title: "ลำดับ",
      dataIndex: "ID",
      key: "id",
      className:  "front-1",
    },
    {
      title: "ชื่อ",
      dataIndex: "name",
      key: "name",
      className:  "front-1",
    },
    {
      title: "ที่อยู่ผู้ผลิต",
      dataIndex: "address",
      key: "address",
      className:  "front-1",
    },
    {
      title: "เบอร์โทร",
      dataIndex: "tel",
      key: "tel",
      className:  "front-1",
    },
    {
      title: "แก้ไข/ลบข้อมูล",
      className:  "front-1",
      render: (record) => (
        <>
          <Button
            onClick={() => navigate(`/supplier/edit/${record.ID}`)}
            type="primary"
            className='btn-edit'
            shape="circle"
            icon={<EditOutlined />}
          />
          <Button type="primary" className="btn-delete" icon={<DeleteOutlined />}
            onClick={() => showDeleteConfirm(record.ID)}
          />
        </>
      ),
    },
  ];

  const deleteSupplierById = async (id: string) => {
    let res = await DeleteSupplierById(id);

    if (res.status === 200) {
      messageApi.open({
        type: "success",
        content: res.data.message,
      });
      await getSupplier();
    } else {
      messageApi.open({
        type: "error",
        content: res.data.error,
      });
    }
  };

  const showDeleteConfirm = (id: string) => {
    confirm({
      title: "คุณแน่ใจหรือว่าต้องการลบ'ผู้ผลิต'",
      content: "การลบจะไม่สามารถยกเลิกได้",
      okText: "ยืนยัน",
      okType: "danger",
      cancelText: "ยกเลิก",
      className:  "front-1",
      onOk() {
        deleteSupplierById(id);
      },
      onCancel() {
        console.log("ยกเลิกการลบ");
      },
    });
  };

  const getSupplier = async () => {
    let res = await GetSuppliers();
    if (res.status === 200) {
      setSupplier(res.data);
      setFilteredSupplier(res.data);
    } else {
      setSupplier([]);
      setFilteredSupplier([]);
      messageApi.open({
        type: "error",
        content: res.data.error,
      });
    }
  };

  const handleSearch = (value: string) => {
    setSearchText(value);
    const filteredData = supplier.filter((item) => {
      return (item.name?.toLowerCase() || "").includes(value.toLowerCase()) ||
             (item.address?.toLowerCase() || "").includes(value.toLowerCase()) ||
             (item.tel || "").includes(value);
    });
    setFilteredSupplier(filteredData);
  };
  
  useEffect(() => {
    getSupplier();
  }, []);

  return (
    <div>
      {contextHolder}
      <Row>
        <Col span={12}>
          <Link to="/ingredient">
            <Button className="button-back" icon={<LeftOutlined />}/>
          </Link>
          <h1 className="title">จัดการข้อมูลผู้ผลิต</h1>
        </Col>
        <Col span={12} style={{ textAlign: "end", alignSelf: "center" }}>
          <Space>
            <Link to="/supplier/create">
              <Button type="primary" className='btn-1' icon={<PlusOutlined />}>
                เพิ่มผู้ผลิต
              </Button>
            </Link>
          </Space>
        </Col>
      </Row>
      <Divider />
      { }
      <Row gutter={[16, 0]} style={{ marginBottom: "20px" }}>
        <Col span={6}>
          <Input
            className='input'
            placeholder="Search Supplier"
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </Col>
      </Row>
      <div className="card-data" style={{ marginTop: 20 }}>
        <Table
          rowKey="ID"
          columns={columns}
          dataSource={filteredSupplier}
        />
      </div>
    </div>
  );
}

export default Supplier;
