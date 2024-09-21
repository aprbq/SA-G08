import { useState, useEffect } from "react";
import { Space, Table, Button, Col, Row, Divider, message, Modal } from "antd";
import { PlusOutlined, DeleteOutlined , EditOutlined} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { GetSuppliers, DeleteSupplierById } from "../../services/https/index";
import { SupplierInterface } from "../../interfaces/Supplier";
import { Link, useNavigate } from "react-router-dom";

const { confirm } = Modal;

function Supplier() {
  const navigate = useNavigate();
  const [supplier , setSupplier] = useState<SupplierInterface[]>([]);
  const [messageApi, contextHolder] = message.useMessage();

  const columns: ColumnsType<SupplierInterface> = [
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
      title: "ที่อยู่ผู้ผลิต",
      dataIndex: "address",
      key: "address",
    },

    {
      title: "เบอร์โทร",
      dataIndex: "tel",
      key: "tel",
    },
    {
      title: "แก้ไข/ลบข้อมูล",
      render: (record) => (
        <>
          <Button
          onClick={() => navigate(`/supplier/edit/${record.ID}`)}
            type="primary" 
            className='btn-1'
            icon={<EditOutlined />}
          >
          </Button>
          <Button type="primary" className="btn-delete" icon={<DeleteOutlined />}
              onClick={() => showDeleteConfirm(record.ID)}
            ></Button>
        </>
      ),
    },
  ];

  const deleteSupplierById = async (id: string) => {
    let res = await DeleteSupplierById(id);

    if (res.status == 200) {
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
    })};

  const getSupplier = async () => {
    let res = await GetSuppliers();
    if (res.status == 200) {
      setSupplier(res.data);
    } else {
      setSupplier([]);
      messageApi.open({
        type: "error",
        content: res.data.error,
      });
    }
  };

  useEffect(() => {
    getSupplier();
  }, []);

  return (
    <div>
      <Row>
        <Col span={12}>
          <h2>จัดการข้อมูลผู้ผลิต</h2>
        </Col>
        <Col span={12} style={{ textAlign: "end", alignSelf: "center" }}>
          <Space>
            <Link to="/supplier/create">
              <Button type="primary" icon={<PlusOutlined />}>
                เพิ่มผู้ผลิต
              </Button>
            </Link>
          </Space>
        </Col>
      </Row>
      <Divider />
      <div className="card-data" style={{ marginTop: 20 }}>
        <Table
          rowKey="ID"
          columns={columns}
          dataSource={supplier}
          style={{ width: "100%", overflow: "scroll" }}
        />
      </div>
    </div>
  );
}
export default Supplier;