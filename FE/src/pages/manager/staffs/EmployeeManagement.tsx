import { DashboardUserItem, getDashboardUsers } from '@/apis/dashboard.api';

import { Button, Card, Form, Input, message, Modal, Select, Space, Table, Tag } from 'antd';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import React, { useEffect, useMemo, useState } from 'react';

import { EyeOutlined, SearchOutlined } from '@ant-design/icons';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault(dayjs.tz.guess());

const { Option } = Select;

interface Employee {
  employeeId: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  role: string;
  joinDate: string;
  dateOfBirth?: string;
  address?: string;
  avatarUrl?: string;
  status: 'active' | 'inactive';
}

const EmployeeManagement: React.FC = () => {
  const [employees, setEmployees] = useState<DashboardUserItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  window.scrollTo(0, 0);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const res = await getDashboardUsers(page - 1, pageSize);
      setEmployees(res.data.content);
      setTotal(res.data.totalElements);
    } catch (error) {
      setEmployees([]);
      message.error('Không thể tải danh sách nhân viên!');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, [page, pageSize]);

  const [searchText, setSearchText] = useState('');
  const [filterRole, setFilterRole] = useState<string>('Tất cả');
  const [_modalVisible, setModalVisible] = useState(false);
  const [_editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [_selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [_modalMode, setModalMode] = useState<'view' | 'add' | 'edit'>('view');
  const [reportModalVisible, setReportModalVisible] = useState(false);
  const [reportForm] = Form.useForm();
  const [selectedReportEmployee] = useState<Employee | null>(null);
  const [_reports, setReports] = useState<any[]>([]);

  const filteredEmployees = useMemo(() => {
    return employees
      .filter((emp) => {
        const searchTextLower = searchText.toLowerCase();
        return (
          emp.fullName.toLowerCase().includes(searchTextLower) ||
          emp.email.toLowerCase().includes(searchTextLower) ||
          emp.phone.includes(searchTextLower)
        );
      })
      .filter((emp) => filterRole === 'Tất cả' || emp.role === filterRole);
  }, [employees, searchText, filterRole]);

  const handleView = (employee: DashboardUserItem) => {
    setSelectedEmployee(employee as any);
    setEditingEmployee(null);
    setModalMode('view');
    setModalVisible(true);
  };

  const handleSendReport = async () => {
    try {
      const values = await reportForm.validateFields();
      const report = {
        ...values,
        employeeId: selectedReportEmployee?.employeeId,
        employeeName: selectedReportEmployee?.fullName,
        date: new Date().toLocaleString(),
      };
      setReports((prev) => [...prev, report]);
      setReportModalVisible(false);
      reportForm.resetFields();
      message.success('Đã gửi báo cáo thành công!');
    } catch (err) {
      console.error('Error sending report:', err);
      message.error('Gửi báo cáo thất bại. Vui lòng kiểm tra lại thông tin.');
    }
  };

  const headerColor = '#A05A2C';
  const headerBgColor = '#F9E4B7';
  const evenRowBgColor = '#FFFDF5';
  const oddRowBgColor = '#FFF7E6';
  const cellTextColor = '#5D4037';
  const borderColor = '#F5EAD9';
  const tableBorderColor = '#E9C97B';

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
      sorter: (a: DashboardUserItem, b: DashboardUserItem) => a.id - b.id,
    },
    {
      title: 'Họ tên',
      dataIndex: 'fullName',
      key: 'fullName',
      sorter: (a: DashboardUserItem, b: DashboardUserItem) => a.fullName.localeCompare(b.fullName),
      render: (name: string) => <span style={{ fontWeight: 500, color: cellTextColor }}>{name}</span>,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      width: 200,
      sorter: (a: DashboardUserItem, b: DashboardUserItem) => a.email.localeCompare(b.email),
      render: (email: string) => <span style={{ color: cellTextColor }}>{email}</span>,
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phone',
      key: 'phone',
      sorter: (a: DashboardUserItem, b: DashboardUserItem) => a.phone.localeCompare(b.phone),
      render: (phone: string) => <span style={{ color: cellTextColor }}>{phone}</span>,
    },
    {
      title: 'Vai trò',
      dataIndex: 'role',
      key: 'role',
      render: (role: string) => (
        <Tag
          color={role === 'SHIPPER' ? 'blue' : 'green'}
          style={{
            borderRadius: 12,
            padding: '2px 12px',
            minWidth: '50px',
            textAlign: 'center',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          {role}
        </Tag>
      ),
    },
    {
      title: 'Ngày sinh',
      dataIndex: 'dateOfBirth',
      key: 'dateOfBirth',
      render: (date: string) => dayjs(date).format('DD/MM/YYYY'),
    },
    {
      title: 'Hành động',
      key: 'actions',
      align: 'center' as const,
      width: 150,
      fixed: 'right' as const,
      render: (_: any, record: DashboardUserItem) => (
        <Space size='small'>
          <Button
            type='link'
            icon={<EyeOutlined />}
            onClick={() => handleView(record)}
            style={{
              color: '#D97B41',
              fontWeight: 600,
              padding: 0,
              outline: 'none',
              boxShadow: 'none',
              border: 'none',
            }}
            className='action-button'
          >
            Chi tiết
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ minHeight: '90vh', background: '#FFF9F0', padding: '20px 30px 0 30px' }}>
      <style>{`
        /* Your CSS styles remain the same */
        .ant-table-thead > tr > th { background-color: ${headerBgColor} !important; color: ${headerColor} !important; font-weight: bold !important; border-right: 1px solid ${borderColor} !important; border-bottom: 2px solid ${tableBorderColor} !important; }
        .ant-table-thead > tr > th.ant-table-cell-fix-right:last-child { border-right: none !important; }
        .promo-table .ant-table-tbody > tr.even-row-promo > td { background-color: ${evenRowBgColor}; color: ${cellTextColor}; border-right: 1px solid ${borderColor}; border-bottom: 1px solid ${borderColor}; }
        .promo-table .ant-table-tbody > tr.odd-row-promo > td { background-color: ${oddRowBgColor}; color: ${cellTextColor}; border-right: 1px solid ${borderColor}; border-bottom: 1px solid ${borderColor}; }
        .promo-table .ant-table-tbody > tr > td:last-child:not(.ant-table-selection-column) { border-right: none; }
        .promo-table .ant-table-tbody > tr:hover > td { background-color: #FDEBC8 !important; }
        .promo-table .ant-table-cell-fix-right { background: inherit !important; }
        .promo-table .ant-table-thead > tr > th.ant-table-cell-fix-right { background-color: ${headerBgColor} !important; }
        .ant-input-number:focus, .ant-input-number-focused, .ant-input-number:hover,
        .ant-select-focused .ant-select-selector, .ant-select-selector:focus, .ant-select-selector:hover,
        .ant-picker:focus, .ant-picker:hover, .ant-input:focus, .ant-input:hover,
        .ant-input-affix-wrapper:focus, .ant-input-affix-wrapper-focused, .ant-input-affix-wrapper:hover, .ant-input-affix-wrapper:focus-within {
          border-color: #D97B41 !important; box-shadow: none !important;
        }
        .ant-pagination .ant-pagination-item-active, .ant-pagination .ant-pagination-item-active a { border-color: #D97B41 !important; color: #D97B41 !important; }
        .ant-select-selector { border-color: #E9C97B !important; }
        .ant-select-selector:hover { border-color: #D97B41 !important; }
      `}</style>

      <div style={{ maxWidth: 1300, margin: '0 auto' }}>
        <h1 style={{ margin: 0, fontWeight: 700, color: '#A05A2C', fontSize: 40, textAlign: 'left', marginBottom: 24 }}>
          Quản lý Nhân viên
        </h1>
        <Card
          style={{
            background: '#fff',
            borderRadius: 12,
            boxShadow: '0 6px 16px rgba(160, 90, 44, 0.08)',
            padding: '16px 24px',
            border: `1px solid ${tableBorderColor}`,
            marginBottom: 24,
          }}
        >
          <div
            style={{
              marginBottom: 24,
              display: 'flex',
              gap: 16,
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Space size='middle'>
              <Input
                placeholder='Tìm theo tên, email, SĐT...'
                prefix={<SearchOutlined style={{ color: '#A05A2C' }} />}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                style={{
                  width: 280,
                  borderRadius: 6,
                  borderColor: '#E9C97B',
                  height: 32,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: 'none',
                }}
                allowClear
              />
              <Select
                className='custom-select'
                value={filterRole}
                onChange={setFilterRole}
                style={{ width: 160, borderRadius: 6, height: 32 }}
                options={[
                  { value: 'Tất cả', label: 'Tất cả vai trò' },
                  { value: 'MANAGER', label: 'Manager' },
                  { value: 'ADMIN', label: 'Admin' },
                  { value: 'SHIPPER', label: 'Shipper' },
                ]}
              />
            </Space>
          </div>
          <Table
            className='employee-table'
            columns={columns as any}
            dataSource={filteredEmployees}
            loading={loading}
            rowKey='id'
            style={{ borderRadius: 8, border: `1px solid ${tableBorderColor}`, overflow: 'hidden' }}
            rowClassName={(_, index) => (index % 2 === 0 ? 'even-row-emp' : 'odd-row-emp')}
            sticky
            pagination={{
              current: page,
              pageSize: pageSize,
              total: total,
              onChange: (p, ps) => {
                setPage(p);
                setPageSize(ps);
              },
              showSizeChanger: true,
            }}
          />
        </Card>

        <Modal
          open={reportModalVisible}
          title={<span style={{ color: '#A05A2C', fontWeight: 600, fontSize: 20 }}>Gửi báo cáo về nhân viên</span>}
          onCancel={() => setReportModalVisible(false)}
          onOk={handleSendReport}
          okText='Gửi báo cáo'
          styles={{
            body: { background: '#FFF9F0', borderRadius: '0 0 12px 12px', padding: '24px' },
            header: { borderBottom: `1px solid ${tableBorderColor}`, paddingTop: 16, paddingBottom: 16 },
          }}
          style={{ borderRadius: 12, top: 20 }}
        >
          <Form form={reportForm} layout='vertical'>
            <Form.Item
              name='type'
              label='Loại báo cáo'
              rules={[{ required: true, message: 'Vui lòng chọn loại báo cáo!' }]}
            >
              <Select placeholder='Chọn loại báo cáo'>
                <Option value='performance'>Hiệu suất làm việc</Option>
                <Option value='violation'>Vi phạm/quên quy trình</Option>
                <Option value='suggestion'>Đề xuất thưởng/phạt</Option>
              </Select>
            </Form.Item>
            <Form.Item
              name='content'
              label='Nội dung báo cáo'
              rules={[{ required: true, message: 'Vui lòng nhập nội dung báo cáo!' }]}
            >
              <Input.TextArea rows={4} placeholder='Nhập nội dung báo cáo...' />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default EmployeeManagement;
