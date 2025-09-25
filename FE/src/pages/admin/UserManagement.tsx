import {
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Input,
  message,
  Modal,
  Popconfirm,
  Row,
  Select,
  Space,
  Statistic,
  Table,
  Tag,
} from 'antd';
import type { ColumnsType, TableProps } from 'antd/es/table';
import type { FilterValue, SorterResult } from 'antd/es/table/interface';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';

import {
  CheckCircleOutlined,
  EditOutlined,
  SearchOutlined,
  StopOutlined,
  TeamOutlined,
  UserAddOutlined,
  UserOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import { getAllUsers, createUser, updateUser, deleteUser, unbanUser } from '@/apis/user.api';

const { Option } = Select;

interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
  role: 'Admin' | 'Manager' | 'Staff' | 'Shipper' | 'User';
  status: 'active' | 'inactive';
  date_of_birth: string;
  phone_number?: string;
  _apiIsActive?: boolean;
  _apiIsBan?: boolean;
  _apiNote?: string | null;
  _apiMemberPoint?: number;
  _apiMemberRank?: number;
}

interface ApiAccount {
  id: number;
  fullName: string;
  email: string;
  phone_number: string;
  isActive: boolean;
  date_of_birth: string | null;
  note: string | null;
  isBan: boolean;
  member_point: number;
  member_rank: number;
  role: string;
}

const UserManagement: React.FC = () => {
  const [userList, setUserList] = useState<User[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [_filteredTableInfo, setFilteredTableInfo] = useState<Record<string, FilterValue | null>>({});
  const [sortedTableInfo, setSortedTableInfo] = useState<SorterResult<User>>({});
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');

  const mapApiAccountToUser = (apiAccount: ApiAccount): User => {
    let appUserRole: User['role'] = 'User';
    const apiRoleLower = apiAccount.role?.toLowerCase();

    if (apiRoleLower === 'admin') appUserRole = 'Admin';
    else if (apiRoleLower === 'manager') appUserRole = 'Manager';
    else if (apiRoleLower === 'staff') appUserRole = 'Staff';
    else if (apiRoleLower === 'shipper') appUserRole = 'Shipper';
    else if (apiRoleLower === 'user') appUserRole = 'User';
    else {
      console.warn(`Unmapped API role: "${apiAccount.role}". Defaulting to 'user'.`);
    }

    return {
      id: String(apiAccount.id),
      username:
        apiAccount.email && typeof apiAccount.email === 'string'
          ? apiAccount.email.split('@')[0]
          : `user${apiAccount.id}`,
      email: apiAccount.email || '',
      fullName: apiAccount.fullName || '',
      role: appUserRole,
      status: apiAccount.isActive && !apiAccount.isBan ? 'inactive' : 'active',
      date_of_birth: apiAccount.date_of_birth ? dayjs(apiAccount.date_of_birth).format('YYYY-MM-DD') : 'N/A',
      phone_number: apiAccount.phone_number || '',
      _apiIsActive: apiAccount.isActive,
      _apiIsBan: apiAccount.isBan,
      _apiNote: apiAccount.note,
      _apiMemberPoint: apiAccount.member_point,
      _apiMemberRank: apiAccount.member_rank,
    };
  };

  const fetchUserList = async () => {
    setIsLoading(true);
    try {
      const res = await getAllUsers();
      const accountsToMap = res.data?.content || [];
      console.log(accountsToMap);
      const mappedUsers = accountsToMap.map(mapApiAccountToUser);
      setUserList(mappedUsers);
    } catch (error) {
      console.error('Failed to fetch users:', error);
      message.error('Không thể tải danh sách người dùng');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserList();
  }, []);

  const handleTableChange: TableProps<User>['onChange'] = (_pagination, filters, sorter) => {
    setFilteredTableInfo(filters);
    setSortedTableInfo(sorter as SorterResult<User>);
  };

  const columns: ColumnsType<User> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
      align: 'center',
      sorter: (a, b) => parseInt(a.id) - parseInt(b.id),
      sortOrder: sortedTableInfo.columnKey === 'id' ? sortedTableInfo.order : null,
      ellipsis: true,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      width: 220,
      sorter: (a, b) => a.email.localeCompare(b.email),
      sortOrder: sortedTableInfo.columnKey === 'email' ? sortedTableInfo.order : null,
      ellipsis: true,
    },
    {
      title: 'Họ và tên',
      dataIndex: 'fullName',
      key: 'fullName',
      width: 200,
      sorter: (a, b) => a.fullName.localeCompare(b.fullName),
      sortOrder: sortedTableInfo.columnKey === 'fullName' ? sortedTableInfo.order : null,
      ellipsis: true,
    },
    {
      title: 'Vai trò',
      dataIndex: 'role',
      key: 'role',
      width: 120,
      align: 'center',
      render: (role: User['role']) => {
        let color = 'default';
        const displayText = role.toUpperCase();
        switch (role) {
          case 'Admin':
            color = 'red';
            break;
          case 'Manager':
            color = 'blue';
            break;
          case 'Staff':
            color = 'orange';
            break;
          case 'Shipper':
            color = 'cyan';
            break;
          case 'User':
            color = 'green';
            break;
        }
        return <Tag color={color}>{displayText}</Tag>;
      },
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phone_number',
      key: 'phone_number',
      width: 150,
      ellipsis: true,
      align: 'center',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      align: 'center',
      render: (status: User['status']) => (
        <Tag color={status === 'active' ? 'green' : 'red'}>{status.toUpperCase()}</Tag>
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 160,
      fixed: 'right',
      align: 'center',
      render: (_, userRecord) => (
        <Space size='small'>
          <Button
            type='primary'
            icon={<EditOutlined />}
            onClick={() => handleEditUser(userRecord)}
            style={{ background: '#2E7D32', borderColor: '#2E7D32', borderRadius: '6px', outline: 'none' }}
          />
          <Popconfirm
            title={`Bạn có chắc chắn muốn ${userRecord.status === 'active' ? 'khóa' : 'mở khóa'} tài khoản ${userRecord.fullName}?`}
            onConfirm={() => handleToggleUserBanStatus(userRecord)}
            okText='Có'
            cancelText='Không'
            okButtonProps={{
              style: {
                outline: 'none',
                background: userRecord.status === 'active' ? '#d32f2f' : '#2E7D32',
                borderColor: userRecord.status === 'active' ? '#d32f2f' : '#2E7D32',
                borderRadius: '6px',
              },
            }}
            cancelButtonProps={{ style: { borderRadius: '6px', outline: 'none' } }}
          >
            <Button
              danger={userRecord.status === 'active'}
              icon={userRecord.status === 'active' ? <StopOutlined /> : <CheckCircleOutlined />}
              style={{
                borderRadius: '6px',
                background: userRecord.status === 'active' ? '' : '#2E7D32',
                color: userRecord.status === 'active' ? '' : 'white',
                borderColor: userRecord.status === 'active' ? '' : '#2E7D32',
                outline: 'none',
              }}
            >
              {userRecord.status === 'active' ? 'Khóa' : 'Mở khóa'}
            </Button>
          </Popconfirm>
          <Popconfirm
            title={`Bạn có chắc chắn muốn xóa tài khoản ${userRecord.fullName}?`}
            onConfirm={() => handleDeleteUser(userRecord)}
            okText='Có'
            cancelText='Không'
          >
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const handleAddUser = () => {
    setEditingUser(null);
    form.resetFields();
    form.setFieldsValue({
      status: 'active',
      role: 'user',
    });
    setIsModalVisible(true);
  };

  const handleEditUser = (userToEdit: User) => {
    setEditingUser(userToEdit);
    form.setFieldsValue({
      email: userToEdit.email,
      fullName: userToEdit.fullName,
      role: userToEdit.role,
      status: userToEdit.status,
      phone_number: userToEdit.phone_number,
      date_of_birth:
        userToEdit.date_of_birth && userToEdit.date_of_birth !== 'N/A'
          ? dayjs(userToEdit.date_of_birth, 'YYYY-MM-DD')
          : null,
      note: userToEdit._apiNote,
    });
    setIsModalVisible(true);
  };

  const handleToggleUserBanStatus = async (userToToggle: User) => {
    const isCurrentlyActiveAndNotBanned = userToToggle._apiIsActive === true && userToToggle._apiIsBan === false;
    setIsLoading(true);
    try {
      if (isCurrentlyActiveAndNotBanned) {
        // Ban user (update isBan=true)
        await updateUser(Number(userToToggle.id), { isBan: true });
        message.success(`Đã khóa người dùng ${userToToggle.fullName} thành công.`);
      } else {
        // Unban user
        await unbanUser(Number(userToToggle.id));
        message.success(`Đã mở khóa người dùng ${userToToggle.fullName} thành công.`);
      }
      fetchUserList();
    } catch (error) {
      message.error('Lỗi khi cập nhật trạng thái người dùng');
    } finally {
      setIsLoading(false);
    }
  };

  const handleModalSubmit = async () => {
    try {
      const formValues = await form.validateFields();
      setIsLoading(true);
      if (editingUser) {
        // Update user
        await updateUser(Number(editingUser.id), {
          fullName: formValues.fullName,
          phone_number: formValues.phone_number,
          date_of_birth: formValues.date_of_birth ? dayjs(formValues.date_of_birth).format('YYYY-MM-DD') : null,
          role: formValues.role,
          isActive: formValues.status === 'active',
          note: formValues.note,
        });
        message.success('Cập nhật người dùng thành công!');
      } else {
        // Create user
        await createUser({
          email: formValues.email,
          fullName: formValues.fullName,
          phone_number: formValues.phone_number,
          date_of_birth: formValues.date_of_birth ? dayjs(formValues.date_of_birth).format('YYYY-MM-DD') : null,
          role: formValues.role,
          isActive: formValues.status === 'active',
          note: formValues.note,
          password: formValues.password,
        });
        message.success('Thêm người dùng thành công!');
      }
      setIsModalVisible(false);
      form.resetFields();
      fetchUserList();
    } catch (error) {
      if ((error as any).errorFields && (error as any).errorFields.length > 0) {
        message.error('Vui lòng kiểm tra lại các trường đã nhập.');
      } else {
        message.error('Thao tác thất bại');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUser = async (user: User) => {
    setIsLoading(true);
    try {
      await deleteUser(Number(user.id));
      message.success('Xóa người dùng thành công!');
      fetchUserList();
    } catch (error) {
      message.error('Lỗi khi xóa người dùng');
    } finally {
      setIsLoading(false);
    }
  };

  const displayedUserList = userList.filter((user) => {
    const searchTextLower = searchText.toLowerCase();
    const matchesSearch =
      String(user.id).toLowerCase().includes(searchTextLower) ||
      String(user.username).toLowerCase().includes(searchTextLower) ||
      String(user.email).toLowerCase().includes(searchTextLower) ||
      String(user.fullName).toLowerCase().includes(searchTextLower) ||
      String(user.role).toLowerCase().includes(searchTextLower) ||
      String(user.status).toLowerCase().includes(searchTextLower) ||
      String(user.phone_number || '')
        .toLowerCase()
        .includes(searchTextLower);

    const matchesRole = !selectedRole || user.role.toLowerCase() === selectedRole.toLowerCase();
    const matchesStatus = !selectedStatus || user.status === selectedStatus;

    return matchesSearch && matchesRole && matchesStatus;
  });

  const userStats = {
    totalUsers: userList.length,
    activeUsers: userList.filter((user) => user.status === 'active').length,
    managers: userList.filter((user) => user.role === 'Manager').length,
    staffCount: userList.filter((user) => user.role === 'Staff').length,
    shipperCount: userList.filter((user) => user.role === 'Shipper').length,
  };

  const phoneRegex = /^(0[3|5|7|8|9])+([0-9]{8})\b$/;

  return (
    <div style={{ padding: '24px', position: 'relative', minHeight: '80vh' }}>
      <style>{`
        /* Your CSS styles remain the same */
        .ant-input-number:focus, .ant-input-number-focused, .ant-input-number:hover,
        .ant-select-focused .ant-select-selector, .ant-select-selector:focus, .ant-select-selector:hover,
        .ant-picker:focus, .ant-picker:hover, .ant-input:focus, .ant-input:hover,
        .ant-input-affix-wrapper:focus, .ant-input-affix-wrapper-focused, .ant-input-affix-wrapper:hover, .ant-input-affix-wrapper:focus-within {
          border-color: #2e7d32 !important; box-shadow: none !important;
        }
        .ant-table-column-sorter-up.active, .ant-table-column-sorter-down.active { color: #2e7d32 !important; }
        .ant-pagination .ant-pagination-item-active, .ant-pagination .ant-pagination-item-active a { border-color: #2e7d32 !important; color: #2e7d32 !important; }
        .ant-select-selector { border-color: #4CAF50 !important; }
      `}</style>
      <Row gutter={[16, 24]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} md={6}>
          <Card bordered={false}>
            <Statistic title='Tổng số người dùng' value={userStats.totalUsers} prefix={<UserOutlined />} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card bordered={false}>
            <Statistic
              title='Đang hoạt động'
              value={userStats.activeUsers}
              prefix={<CheckCircleOutlined style={{ color: 'green' }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card bordered={false}>
            <Statistic title='Managers' value={userStats.managers} prefix={<TeamOutlined />} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card bordered={false}>
            <Statistic
              title='Staff & Shippers'
              value={userStats.staffCount + userStats.shipperCount}
              prefix={<TeamOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Card bordered={false}>
        <div
          style={{
            marginBottom: '16px',
            display: 'flex',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px',
          }}
        >
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
            <Input
              placeholder='Tìm kiếm ID, Email, Tên,...'
              prefix={<SearchOutlined style={{ color: '#2E7D32' }} />}
              style={{ width: '300px', borderRadius: '6px', borderColor: '#4CAF50' }}
              onChange={(e) => setSearchText(e.target.value)}
              value={searchText}
              allowClear
            />
            <Select
              placeholder='Lọc theo vai trò'
              style={{ width: '150px', borderRadius: '6px' }}
              value={selectedRole}
              onChange={setSelectedRole}
              allowClear
            >
              <Option value=''>Tất cả vai trò</Option>
              <Option value='Admin'>Admin</Option>
              <Option value='Manager'>Manager</Option>
              <Option value='Staff'>Staff</Option>
              <Option value='Shipper'>Shipper</Option>
              <Option value='User'>User</Option>
            </Select>
            <Select
              placeholder='Lọc theo trạng thái'
              style={{ width: '150px', borderRadius: '6px' }}
              value={selectedStatus}
              onChange={setSelectedStatus}
              allowClear
            >
              <Option value=''>Tất cả trạng thái</Option>
              <Option value='active'>Hoạt động</Option>
              <Option value='inactive'>Không hoạt động</Option>
            </Select>
          </div>
          <Button
            type='primary'
            icon={<UserAddOutlined />}
            onClick={handleAddUser}
            style={{ background: '#2E7D32', borderColor: '#2E7D32', borderRadius: '6px', outline: 'none' }}
          >
            Thêm người dùng
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={displayedUserList}
          rowKey='id'
          onChange={handleTableChange}
          locale={{ emptyText: isLoading ? 'Đang tải dữ liệu...' : 'Không có dữ liệu' }}
        />
      </Card>

      <Modal
        className='user-management-form-modal'
        title={editingUser ? 'Chỉnh sửa người dùng' : 'Thêm người dùng mới'}
        open={isModalVisible}
        onOk={handleModalSubmit}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
          setEditingUser(null);
        }}
        width={600}
        okText={editingUser ? 'Cập nhật' : 'Thêm mới'}
        cancelText='Hủy'
        confirmLoading={isLoading}
        okButtonProps={{
          style: { background: '#2E7D32', borderColor: '#2E7D32', borderRadius: '6px', outline: 'none' },
        }}
        cancelButtonProps={{
          style: { borderRadius: '6px', borderColor: '#4CAF50', color: '#2E7D32', outline: 'none' },
        }}
        bodyStyle={{ padding: '24px', background: '#F5F5F5' }}
        style={{ top: 20 }}
        destroyOnClose
      >
        <Form
          form={form}
          layout='vertical'
          style={{ background: '#fff', padding: '24px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
        >
          <Form.Item
            name='email'
            label='Email'
            rules={[
              { required: true, message: 'Vui lòng nhập email' },
              { type: 'email', message: 'Email không hợp lệ' },
            ]}
            style={{ margin: '0px' }}
          >
            <Input placeholder='Nhập email' disabled={!!editingUser} />
          </Form.Item>

          <Form.Item
            name='fullName'
            label='Họ và tên'
            rules={[
              { required: true, message: 'Vui lòng nhập họ và tên' },
              { min: 2, message: 'Họ tên phải có ít nhất 2 ký tự' },
            ]}
            style={{ margin: '0px' }}
          >
            <Input placeholder='Nhập họ và tên' />
          </Form.Item>

          <Form.Item
            name='phone_number'
            label='Số điện thoại'
            rules={[{ pattern: phoneRegex, message: 'Số điện thoại không hợp lệ (VD: 0901234567)' }]}
            style={{ margin: '0px' }}
          >
            <Input placeholder='Nhập số điện thoại (VD: 0901234567)' />
          </Form.Item>
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Form.Item name='role' label='Vai trò' rules={[{ required: true, message: 'Vui lòng chọn vai trò' }]}>
                <Select placeholder='Chọn vai trò'>
                  <Option value='Admin'>Admin</Option>
                  <Option value='Manager'>Manager</Option>
                  <Option value='Staff'>Staff</Option>
                  <Option value='Shipper'>Shipper</Option>
                  <Option value='User'>User</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name='status'
                label='Trạng thái hoạt động'
                rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
              >
                <Select placeholder='Chọn trạng thái'>
                  <Option value='active'>HOẠT ĐỘNG</Option>
                  <Option value='inactive'>KHÔNG HOẠT ĐỘNG</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[16, 16]}>
            {!editingUser && (
              <Col span={12}>
                <Form.Item
                  name='password'
                  label={'Mật khẩu'}
                  rules={[
                    { required: !editingUser, message: 'Vui lòng nhập mật khẩu' },
                    { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự' },
                  ]}
                  style={{ margin: '0px' }}
                  hasFeedback
                >
                  <Input.Password placeholder={'Nhập mật khẩu'} style={{ height: '40px' }} />
                </Form.Item>
              </Col>
            )}
            <Col span={12}>
              <Form.Item name='date_of_birth' label='Ngày sinh' style={{ margin: '0px' }}>
                <DatePicker
                  style={{ width: '100%', height: '40px', outline: 'none' }}
                  placeholder='Chọn ngày sinh (YYYY-MM-DD)'
                  format='YYYY-MM-DD'
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name='note' label='Ghi chú' rules={[{ message: 'Ghi chú không quá 255 ký tự' }]}>
            <Input.TextArea rows={3} placeholder='Nhập ghi chú (nếu có)' />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserManagement;
