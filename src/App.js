import './App.css';
import React from 'react';
import { Button, Divider, Form, Input, message } from 'antd';
import { useNavigate } from 'react-router-dom';


function App() {
  const navigate = useNavigate();


  const onFinish = (values) => {
    message.success('Success');
    console.log('Success:', values);
    navigate('/messages');
  };
  
  const onFinishFailed = (errorInfo) => {
    message.error('Failed');
    console.log('Failed:', errorInfo);
  };

  return (
    <div className='AppBg'>
      <div className='app-grouped-forms'>
        <Form
          className='app-form'
          name='register'
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          initialValues={{ remember: true }}
          layout='horizontal'
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete='off'
        >
          <h1>Register</h1>
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: 'Enter your username' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Enter your password' }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            label="Confirm Password"
            name="confirmPassword"
            dependencies={['password']}
            rules={[
              { required: true, message: 'Confirm your password' },
              ({ getFieldValue }) => ({
                validator(rule, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject('The two passwords do not match');
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Register
            </Button>
          </Form.Item>

        </Form>
        <Divider style={{ borderColor: 'black'}}></Divider>
        <Form
          className='app-form'
          name='login'
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          initialValues={{ remember: true }}
          layout='horizontal'
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete='off'
        >
          <h1>Login</h1>
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: 'Enter your username' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Enter your password' }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Login
            </Button>
          </Form.Item>

        </Form>
      </div>
    </div>
  );
}

export default App;
