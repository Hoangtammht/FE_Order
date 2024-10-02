import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Login, SignUp } from '../screens';
import { Typography } from 'antd';
import AdminDashboardContent from '../screens/admin/AdminDashboard';
import Management from '../screens/admin/Management';
const { Title } = Typography;


const AuthRouter = () => {
    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col d-none d-lg-block text-center" style={{ marginTop: '15%' }}>
                    <div className="mb-4">
                        <img
                            style={{
                                width: 256,
                                objectFit: 'cover',
                            }}
                            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTchMBh57b7ExzD_5Tnf_RvKU8nQmB4RbE5Vw&s" alt="Logo" />
                    </div>
                    <div>
                        <Title className='text-primary'>Order Application</Title>
                    </div>
                </div>
                <div className="col content-center">
                    <BrowserRouter>
                        <Routes>
                            <Route path='/' element={<Login />} />
                            <Route path='/sign-up' element={<SignUp />} />
                        </Routes>
                    </BrowserRouter>
                </div>
            </div>
        </div>

    )
}

export default AuthRouter