import { Button, Card, Form, Input, message, Flex, Row, Col } from "antd";
import { useNavigate } from "react-router-dom";
import { SignIn } from "../../../services/https";
import { SignInInterface } from "../../../interfaces/SignIn";
import logo from "../../../assets/logocafe.png";

function SignInPages() {
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();

  const onFinish = async (values: SignInInterface) => {
    let res = await SignIn(values);

    if (res.status == 200) {
      messageApi.success("Sign-in successful");
      localStorage.setItem("isLogin", "true");
      localStorage.setItem("page", "dashboard");
      localStorage.setItem("token_type", res.data.token_type);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("id", res.data.id);
      setTimeout(() => {
        location.href = "/";
      }, 2000);
    } else {
      messageApi.error(res.data.error);
    }
  };

  return (
    <>
      {contextHolder}
      <Flex justify="center" align="center" className="login">
        <Row className="images-logocafe">
          <img alt="logo"src={logo} className="images"/>
        </Row >
        <Card className="card-login" >
          <Row >
            <Col xs={24} sm={24} md={24} lg={24} xl={24}
            style={{
              display: "flex",          // ใช้ Flexbox
              alignItems: "center",      // จัดแนวแนวตั้งให้ตรงกลาง
              justifyContent: "center",  // จัดวางให้อยู่ตรงกลาง
              marginBottom: "0px"       // กำหนดระยะห่างด้านล่างทั้งหมด
            }}
            >
              <div className = "text-head-login">
                <h2 style={{ marginBottom: "0px" }}>CAFE IN(e)</h2> 
              </div>
            </Col>
            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
              <Form
                name="basic"
                onFinish={onFinish}
                autoComplete="off"
                layout="vertical"
              >
                <Form.Item
                  label="Username"
                  name="username"
                  rules={[
                    { required: true, message: "Please input your username!" },
                  ]}
                  style={{ marginBottom: "10px" }}
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  label="Password"
                  name="password"
                  rules={[
                    { required: true, message: "Please input your password!" },
                  ]}
                  style={{ marginBottom: "10px" }}
                >
                  <Input.Password />
                </Form.Item>

                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    className="login-form-button"
                    style={{ marginBottom: "10px" }}
                  >
                    Log in
                  </Button>
                  Or <a onClick={() => navigate("/signup")}>signup now !</a>
                </Form.Item>
              </Form>
            </Col>
          </Row>
        </Card>
      </Flex>
    </>
  );
}

export default SignInPages;