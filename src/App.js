import React from 'react';
import { Button, Divider, Form, Input, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import './App.css';

async function savePublicKey(username, publicKeyBase64) {
  const response = await fetch('http://localhost:5000/users', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username: username,
      public_key: publicKeyBase64,
    }),
  });
  
  const data = await response.json();
  console.log(data);
}

async function updatePublicKey(publicKeyBase64) {
  // Recuperar el username desde el sessionStorage
  const username = sessionStorage.getItem('username');
  const response = await fetch(`http://localhost:5000/users/${username}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      public_key: publicKeyBase64,
    }),
  });
  
  const data = await response.json();
  console.log(data);
}


function App() {
  const navigate = useNavigate();

  const generateAndStoreKeys = async () => {
    const keyPair = await window.crypto.subtle.generateKey(
      {
        name: "RSA-OAEP",
        modulusLength: 2048,
        publicExponent: new Uint8Array([1, 0, 1]),
        hash: {name: "SHA-256"},
      },
      true,
      ["encrypt", "decrypt"]
    );

    const exportedPublicKey = await window.crypto.subtle.exportKey("spki", keyPair.publicKey);
    const exportedPrivateKey = await window.crypto.subtle.exportKey("pkcs8", keyPair.privateKey);

    const publicKeyBase64 = btoa(String.fromCharCode(...new Uint8Array(exportedPublicKey)));
    const privateKeyBase64 = btoa(String.fromCharCode(...new Uint8Array(exportedPrivateKey)));

    sessionStorage.setItem('privateKey', privateKeyBase64);
    return publicKeyBase64;
  };

  const onFinishRegister = async (values) => {
    try {
      const publicKeyBase64 = await generateAndStoreKeys();
      // Guardar el username en sessionStorage
      sessionStorage.setItem('username', values.username);
      await savePublicKey(values.username, publicKeyBase64);
      message.success('Registration successful');
      navigate('/messages');
    } catch (error) {
      message.error('Registration failed');
      console.error('Registration Failed:', error);
    }
  };
  
  const onFinishLogin = async (values) => {
    try {
      const publicKeyBase64 = await generateAndStoreKeys();
      // Guardar el username en sessionStorage
      sessionStorage.setItem('username', values.username);
      await updatePublicKey(publicKeyBase64);
      message.success('Login successful, keys updated.');
      navigate('/messages');
    } catch (error) {
      message.error('Login failed. Could not update keys.');
      console.error('Login Failed:', error);
    }
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
          onFinish={onFinishRegister}
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
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('The two passwords do not match'));
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
          onFinish={onFinishLogin}
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
            // Continue from the 'Password' Form.Item
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
