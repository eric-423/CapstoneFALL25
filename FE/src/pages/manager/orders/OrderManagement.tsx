import { DashboardOrderItem, getDashboardOrders } from '@/apis/dashboard.api';

import { Button, Card, Descriptions, Input, Modal, Select, Space, Table, Tag } from 'antd';
import { ColumnType } from 'antd/es/table';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import React, { useEffect, useMemo, useState } from 'react';

import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  DownloadOutlined,
  EyeOutlined,
  SearchOutlined,
} from '@ant-design/icons';
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault(dayjs.tz.guess());

const OrderManagement: React.FC = () => {
  const [orders, setOrders] = useState<DashboardOrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<DashboardOrderItem | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  window.scrollTo(0, 0);

  useEffect(() => {
    fetchOrders(page - 1, pageSize);
  }, [page, pageSize]);

  const fetchOrders = async (page: number, size: number) => {
    setLoading(true);
    try {
      const res = await getDashboardOrders(page, size);
      setOrders(res.data.content);
      setTotal(res.data.totalElements);
    } catch (error) {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusTheme = (status: string): { tagBg: string; tagText: string; iconColor?: string } => {
    switch (status.toLowerCase()) {
      case 'chờ thanh toán':
        return { tagBg: '#F9E4B7', tagText: '#A05A2C', iconColor: '#A05A2C' };
      case 'đặt hàng thành công':
        return { tagBg: '#81C784', tagText: '#fff', iconColor: '#fff' };
      case 'đã hủy':
        return { tagBg: '#E57373', tagText: '#fff', iconColor: '#fff' };
      default:
        return { tagBg: '#E9C97B', tagText: '#A05A2C' };
    }
  };

  const getStatusIcon = (status: string) => {
    const theme = getStatusTheme(status);
    switch (status.toLowerCase()) {
      case 'chờ thanh toán':
        return <ClockCircleOutlined style={{ color: theme.iconColor }} />;
      case 'đặt hàng thành công':
        return <CheckCircleOutlined style={{ color: theme.iconColor }} />;
      case 'đã hủy':
        return <CloseCircleOutlined style={{ color: theme.iconColor }} />;
      default:
        return null;
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
      title: 'Mã ĐH',
      dataIndex: 'id',
      key: 'id',
      width: 100,
      sorter: (a: DashboardOrderItem, b: DashboardOrderItem) => a.id - b.id,
    },
    {
      title: 'Khách hàng',
      dataIndex: 'customerName',
      key: 'customerName',
      width: 200,
      ellipsis: true,
      sorter: (a: DashboardOrderItem, b: DashboardOrderItem) =>
        (a.customerName || '').localeCompare(b.customerName || ''),
      render: (name: string) => <span style={{ fontWeight: 500 }}>{name || 'Khách hàng'}</span>,
    },
    {
      title: 'Ngày đặt',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 180,
      sorter: (a: DashboardOrderItem, b: DashboardOrderItem) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      render: (date: string) => dayjs(date).format('DD/MM/YYYY HH:mm'),
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'amount',
      key: 'amount',
      width: 150,
      align: 'right' as const,
      sorter: (a: DashboardOrderItem, b: DashboardOrderItem) => a.amount - b.amount,
      render: (amount: number) => `${amount.toLocaleString()}đ`,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 180,
      align: 'center' as const,
      render: (status: string) => {
        const theme = getStatusTheme(status);
        return (
          <Tag
            icon={getStatusIcon(status)}
            style={{
              color: theme.tagText,
              fontWeight: 600,
              background: theme.tagBg,
              borderColor: theme.tagBg,
              borderRadius: 12,
              padding: '2px 12px',
              minWidth: '120px',
              textAlign: 'center',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            {status}
          </Tag>
        );
      },
    },
    {
      title: 'Hành động',
      key: 'actions',
      width: 220,
      align: 'center' as const,
      render: (_: any, record: DashboardOrderItem) => (
        <Space size={12}>
          <Button
            type='link'
            icon={<EyeOutlined />}
            onClick={() => {
              setSelectedOrder(record);
              setIsModalVisible(true);
            }}
            style={{
              color: '#D97B41',
              fontWeight: 600,
              padding: 0,
              outline: 'none',
              boxShadow: 'none',
              border: 'none',
            }}
          >
            Chi tiết
          </Button>
          {/* Nếu có invoiceUrl thì mở, nếu không thì ẩn nút này */}
        </Space>
      ),
    },
  ];

  const filteredOrders = useMemo(
    () =>
      orders.filter((order) => {
        const matchesSearch =
          (order.customerName || '').toLowerCase().includes(searchText.toLowerCase()) ||
          order.id.toString().includes(searchText);
        const matchesStatus = statusFilter === 'all' || (order.status || '').toLowerCase() === statusFilter;
        return matchesSearch && matchesStatus;
      }),
    [orders, searchText, statusFilter],
  );

  return (
    <div style={{ minHeight: '100vh', background: '#FFF9F0', padding: '20px 30px 30px 60px' }}>
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

      <div style={{ height: '100%', margin: '0 auto' }}>
        <h1 style={{ margin: 0, fontWeight: 700, color: '#A05A2C', fontSize: 40, marginBottom: 24 }}>
          Quản lý Đơn hàng
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
            <Space wrap>
              <Input
                placeholder='Tìm theo ID, Tên khách...'
                prefix={<SearchOutlined style={{ color: '#A05A2C' }} />}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                style={{
                  width: 280,
                  borderRadius: 6,
                  border: `1px solid #E9C97B`,
                  height: 32,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: 'none',
                }}
                allowClear
              />
              <Select
                value={statusFilter}
                onChange={setStatusFilter}
                style={{ width: 180, borderRadius: 6, borderColor: '#E9C97B' }}
                options={[
                  { value: 'all', label: 'Tất cả trạng thái' },
                  { value: 'pending', label: 'Chờ xử lý' },
                  { value: 'processing', label: 'Đang xử lý' },
                  { value: 'paid', label: 'Đã thanh toán' },
                  { value: 'cancelled', label: 'Đã hủy' },
                ]}
              />
            </Space>
            <Button
              type='default'
              icon={<DownloadOutlined />}
              style={{
                color: '#D97B41',
                borderColor: '#D97B41',
                background: '#FFF9F0',
                fontWeight: 600,
                borderRadius: 6,
              }}
            >
              Xuất báo cáo
            </Button>
          </div>

          <Table
            className='order-table'
            columns={columns as unknown as ColumnType<DashboardOrderItem>[]}
            dataSource={filteredOrders}
            loading={loading}
            rowKey='id'
            style={{ borderRadius: 8, border: `1px solid ${tableBorderColor}`, overflow: 'hidden' }}
            rowClassName={(_, index) => (index % 2 === 0 ? 'even-row-order' : 'odd-row-order')}
            scroll={{ x: 980 }}
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
          title={<span style={{ color: '#D97B41', fontWeight: 700, fontSize: 22 }}>Chi tiết đơn hàng</span>}
          open={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={[
            <Button
              key='back'
              onClick={() => setIsModalVisible(false)}
              style={{ borderRadius: 6, borderColor: '#D97B41', color: '#D97B41' }}
            >
              Đóng
            </Button>,
          ]}
          width={800}
          styles={{
            body: { background: '#FFF9F0', borderRadius: '0 0 12px 12px', padding: '24px' },
            header: { borderBottom: `1px solid ${tableBorderColor}`, paddingTop: 16, paddingBottom: 16 },
          }}
          style={{ borderRadius: 12, top: 20 }}
        >
          {selectedOrder && (
            <Card
              style={{
                background: '#fff',
                borderRadius: 12,
                boxShadow: '0 2px 8px rgba(217, 123, 65, 0.08)',
                border: `1px solid ${tableBorderColor}`,
                padding: 16,
              }}
            >
              <Descriptions
                bordered
                column={{ xxl: 2, xl: 1, lg: 1, md: 1, sm: 1, xs: 1 }}
                size='default'
                labelStyle={{ color: '#A05A2C', fontWeight: 600, background: '#FFF9F0', width: '160px' }}
                contentStyle={{ color: cellTextColor, background: '#FFFFFF' }}
              >
                <Descriptions.Item label='Mã đơn hàng'>{selectedOrder.id}</Descriptions.Item>
                <Descriptions.Item label='Khách hàng'>{selectedOrder.customerName || 'Khách hàng'}</Descriptions.Item>
                <Descriptions.Item label='Ngày đặt'>
                  {dayjs(selectedOrder.createdAt).format('DD/MM/YYYY HH:mm:ss')}
                </Descriptions.Item>
                <Descriptions.Item label='Trạng thái'>
                  {(() => {
                    const theme = getStatusTheme(selectedOrder.status);
                    return (
                      <Tag
                        icon={getStatusIcon(selectedOrder.status)}
                        style={{
                          color: theme.tagText,
                          fontWeight: 600,
                          background: theme.tagBg,
                          borderColor: theme.tagBg,
                          borderRadius: 12,
                          padding: '2px 12px',
                          minWidth: '120px',
                          textAlign: 'center',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                        }}
                      >
                        {selectedOrder.status}
                      </Tag>
                    );
                  })()}
                </Descriptions.Item>
                <Descriptions.Item label='Tổng tiền' span={2}>
                  <span style={{ color: '#D97B41', fontWeight: 'bold', fontSize: '1.1em' }}>
                    {selectedOrder.amount.toLocaleString()}đ
                  </span>
                </Descriptions.Item>
                <Descriptions.Item label='Phí vận chuyển'>
                  <span style={{ color: cellTextColor }}>{selectedOrder.shippingFee.toLocaleString()}đ</span>
                </Descriptions.Item>
                <Descriptions.Item label='Giảm giá'>
                  <span style={{ color: cellTextColor }}>{selectedOrder.discountValue.toLocaleString()}đ</span>
                </Descriptions.Item>
                <Descriptions.Item label='Phương thức thanh toán'>
                  <span style={{ color: cellTextColor }}>{selectedOrder.payment_code}</span>
                </Descriptions.Item>
                <Descriptions.Item label='Địa chỉ giao hàng'>
                  <span style={{ color: cellTextColor }}>{selectedOrder.address || ''}</span>
                </Descriptions.Item>
                <Descriptions.Item label='Số điện thoại'>
                  <span style={{ color: cellTextColor }}>{selectedOrder.phone}</span>
                </Descriptions.Item>
                {selectedOrder.note && (
                  <Descriptions.Item label='Ghi chú' span={2}>
                    <span style={{ color: cellTextColor }}>{selectedOrder.note}</span>
                  </Descriptions.Item>
                )}
                <Descriptions.Item label='Chi tiết sản phẩm' span={2}>
                  <Table
                    className='order-items-table'
                    dataSource={selectedOrder.orderItems}
                    columns={[
                      {
                        title: 'Tên sản phẩm',
                        dataIndex: 'productName',
                        key: 'productName',
                        render: (text: string) => <span style={{ color: cellTextColor }}>{text}</span>,
                      },
                      {
                        title: 'Số lượng',
                        dataIndex: 'quantity',
                        key: 'quantity',
                        align: 'center' as const,
                        render: (text: number) => <span style={{ color: cellTextColor }}>{text}</span>,
                      },
                      {
                        title: 'Đơn giá',
                        dataIndex: 'price',
                        key: 'price',
                        align: 'right' as const,
                        render: (price: number) => (
                          <span style={{ color: cellTextColor }}>{price.toLocaleString()}đ</span>
                        ),
                      },
                      {
                        title: 'Thành tiền',
                        key: 'subtotal',
                        align: 'right' as const,
                        render: (_: any, item: any) => (
                          <span style={{ color: cellTextColor, fontWeight: 500 }}>
                            {(item.quantity * item.price).toLocaleString()}đ
                          </span>
                        ),
                      },
                    ]}
                    pagination={false}
                    rowKey='productId'
                    size='small'
                    style={{ background: evenRowBgColor, borderRadius: 8, border: `1px solid ${borderColor}` }}
                  />
                </Descriptions.Item>
              </Descriptions>
            </Card>
          )}
        </Modal>
      </div>
      {/* Custom Ant Design theme for brown/orange */}
      <style>{`
        /* Table border */
        .ant-table-thead > tr > th, .ant-table-tbody > tr > td {
          border-color: #F9E4B7 !important;
        }
        /* Pagination active, hover, focus */
        .ant-pagination .ant-pagination-item-active {
          border-color: #D97B41 !important;
          background: #FFF9F0 !important;
        }
        .ant-pagination .ant-pagination-item-active a {
          color: #D97B41 !important;
        }
        .ant-pagination .ant-pagination-item:focus,
        .ant-pagination .ant-pagination-item:hover {
          border-color: #D97B41 !important;
        }
        .ant-pagination .ant-pagination-item a:focus,
        .ant-pagination .ant-pagination-item a:hover {
          color: #D97B41 !important;
        }
        /* Filter icon, sort icon */
        .ant-table-filter-trigger, .anticon-filter {
          color: #D97B41 !important;
        }
        .ant-table-column-sorter-up.active, .ant-table-column-sorter-down.active {
          color: #D97B41 !important;
        }
        /* Filter popup OK/Reset button */
        .ant-table-filter-dropdown-btns .ant-btn-primary {
          background: #D97B41 !important;
          border-color: #D97B41 !important;
        }
        .ant-table-filter-dropdown-btns .ant-btn-primary:hover,
        .ant-table-filter-dropdown-btns .ant-btn-primary:focus {
          background: #A05A2C !important;
          border-color: #A05A2C !important;
        }
        .ant-table-filter-dropdown-btns .ant-btn-link {
          color: #D97B41 !important;
        }
        /* Checkbox checked */
        .ant-checkbox-checked .ant-checkbox-inner {
          background-color: #D97B41 !important;
          border-color: #D97B41 !important;
        }
        .ant-checkbox-checked .ant-checkbox-inner:after {
          border-color: #fff !important;
        }
      `}</style>
    </div>
  );
};

export default OrderManagement;
