import { Button, Card, Checkbox, Form, Input, message, Space, Typography } from 'antd'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import SocialLogin from './components/SocialLogin'
import LoginHandleApi from '../../apis/LoginHandleApi';
import { useDispatch } from 'react-redux';
import { addAuth } from '../../reduxs/reducers/authReducer';
import { localDataNames } from '../../constants/appInfos';

const { Title, Paragraph, Text } = Typography;


const Login = () => {

        const [isLoading, setIsLoading] = useState(false);
        const [isRemember, setIsRemember] = useState(false);

        const [from] = Form.useForm();

        const dispatch = useDispatch();

        const handleLogin = async (values: { userName: string, password: string }) => {
            setIsLoading(true);
            try {
                const res = await LoginHandleApi('/user/loginUser', values, 'post');
                if (res.data && res.data.User) {
                    localStorage.setItem(localDataNames.authData, JSON.stringify(res.data));
                    dispatch(addAuth({
                        access_token: res.data.access_token,
                        userID: res.data.User.userID,
                        userName: res.data.User.userName,
                        fullName: res.data.User.fullName,
                        role: res.data.User.roleID
                    }));
                }
            } catch (error: any) {
                console.log(error);
                message.error("Tài khoản hoặc mật khẩu không chính xác");
            } finally {
                setIsLoading(false);
            }
        };

    return (
        <>
            <Card style={{
            }}>
                <div className='text-center'>
                    <img 
                    className='mb-3'
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTchMBh57b7ExzD_5Tnf_RvKU8nQmB4RbE5Vw&s" alt="logo" 
                    style={{
                        height: 48,
                        width: 48
                    }}/>
                    <Title level={2}>Log in to your account</Title>
                    <Paragraph type='secondary'>
                        Welcome back ! Please enter your details
                    </Paragraph>
                </div>


                <Form layout='vertical' 
                form={from} 
                onFinish={handleLogin} 
                disabled={isLoading} 
                size='large'>
                    <Form.Item
                        name={'userName'}
                        label="Username"
                        rules={[
                            {
                                required: true,
                                message: 'Please enter your Username',
                            },
                        ]}>
                        <Input placeholder='Enter your Username' allowClear maxLength={100} />
                    </Form.Item>
                    <Form.Item
                        name={'password'}
                        label="Password"
                        rules={[
                            {
                                required: true,
                                message: 'Please enter your password',
                            },
                            () => ({
                                validator: (_,value) => {
                                    if(value.length < 1) {
                                        return Promise.reject(new Error('Mật khẩu phải chứa ít nhất 1 kí tự'))
                                    }else{
                                        return Promise.resolve();
                                    }
                                }
                            })
                        ]}>
                        <Input.Password placeholder='Enter your password' maxLength={100} />
                    </Form.Item>
                </Form>

                <div className='row'>
					<div className='col'>
						<Checkbox
							checked={isRemember}
							onChange={(val) => setIsRemember(val.target.checked)}>
							Remember me
						</Checkbox>
					</div>
					<div className='col text-right'>
						<Link to={'/'}>Forgot password?</Link>
					</div>
				</div>

                <div className="mt-5 mb-3">
                    <Button 
                    loading={isLoading}
                    onClick={() => from.submit()} type='primary' style={{ width: '100%' }} size='large'>
                        Login
                    </Button>
                </div>
                <SocialLogin />
                <div className='mt-4 text-center'>
                    <Space>
                        <Text>Don't have an acount ?</Text>
                        <Link to={'/sign-up'}>Sign up</Link>
                    </Space>
                </div>
            </Card>
        </>
    );
}

export default Login