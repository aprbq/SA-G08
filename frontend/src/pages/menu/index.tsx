import React, { useState, useEffect } from "react";
import { Space, Table, Button, Col, Row, Divider, message, Upload } from "antd";
import { PlusOutlined, DeleteOutlined, EditOutlined, UploadOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { GetMenu, DeleteMenuById } from "../../services/https/index";
import { MenuInterface } from "../../interfaces/Menu";
import { Link, useNavigate } from "react-router-dom";
import dayjs from "dayjs";

function Menus() {
  const navigate = useNavigate();
  const [menus, setMenu] = useState<MenuInterface[]>([]);
  const [messageApi, contextHolder] = message.useMessage();
  const myId = localStorage.getItem("id");

  const columns: ColumnsType<MenuInterface> = [
    {
      title: "ลำดับ",
      dataIndex: "ID",
      key: "id",
    },
    {
      title: "ชื่อ",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "คำอธิบาย",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "ราคา",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "ประเภท",
      key: "category",
      render: (record) => <>{record?.category?.category}</>,
    },
    // {
    //   title: "สถานะ",
    //   key: "Status",
    //   render: (record) => <>{record?.class?.class}</>,
    // },
    // {
    //   title: "รูปภาพ",
    //   key: "image",
    //   render: (record) => (
    //     <img
    //       src={record.imageUrl}
    //       alt={record.PromotionName}
    //       style={{ width: 100, height: 100, objectFit: "cover" }}
    //     />
    //   ),
    // },
    {
      title: "",
      render: (record) => (
        <>
          <Button
          onClick={() => navigate(`/menus/edit/${record.ID}`)}
            type="primary" 
            className='btn-1'
            icon={<EditOutlined />}
          >
            แก้ไขข้อมูล
          </Button>
        </>
      ),
    },
    {
      title: "",
      render: (record) => (
        <>
            <Button
              type="primary"
              className="btn-delete"
              icon={<DeleteOutlined />}
              onClick={() => deleteMenuById(record.ID)}
            ></Button>
        </>
      ),
    },
  ];

  const deleteMenuById = async (id: string) => {
    let res = await DeleteMenuById(id);

    if (res.status == 200) {
      messageApi.open({
        type: "success",
        content: res.data.message,
      });
      await getMenu();
    } else {
      messageApi.open({
        type: "error",
        content: res.data.error,
      });
    }
  };

  const getMenu = async () => {
    let res = await GetMenu();
    if (res.status == 200) {
      setMenu(res.data);
    } else {
      setMenu([]);
      messageApi.open({
        type: "error",
        content: res.data.error,
      });
    }
  };

  const handleImageUpload = async (info: any, record: MenuInterface) => {
    if (info.file.status === "done") {
      const imageUrl = info.file.response.url; // Assuming your server returns the URL of the uploaded image
      // Update the specific menu item with the new image URL
      const updatedMenus = menus.map(menu =>
        menu.ID === record.ID ? { ...menu, imageUrl } : menu
      );
      setMenu(updatedMenus);
      messageApi.open({
        type: "success",
        content: "Image uploaded successfully!",
      });
    } else if (info.file.status === "error") {
      messageApi.open({
        type: "error",
        content: "Image upload failed!",
      });
    }
  };

  useEffect(() => {
    getMenu();
  }, []);

  return (
    <>
      {contextHolder}
      <Row>
        <Col className = "name-table" span={12}>
          <h2>จัดการเมนู</h2>
        </Col>
        <Col span={12} style={{ textAlign: "end", alignSelf: "center" }}>
          <Space>
            <Link to="/menus/create">
              <Button className='btn-1' type="primary" icon={<PlusOutlined />}>
                เพิ่มเมนู
              </Button>
            </Link>
          </Space>
        </Col>
      </Row>
      <Divider />
      <div style={{ marginTop: 20 }}>
        <Table
          rowKey="ID"
          columns={columns}
          dataSource={menus}
          style={{ width: "100%", overflow: "scroll" }}
          expandable={{
            expandedRowRender: record => (
              <Upload
                name="image"
                action="/upload-image-url" // Your image upload URL
                onChange={info => handleImageUpload(info, record)}
                showUploadList={false}
              >
                <Button icon={<UploadOutlined />}>Upload Image</Button>
              </Upload>
            ),
          }}
        />
      </div>
    </>
  );
}

export default Menus;
