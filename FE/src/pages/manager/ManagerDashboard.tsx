import {
  GET_TOP_PRODUCTS_QUERY_KEY,
  getBranchRevenue,
  getManagerDashboard,
  getMonthlyRevenue,
  getTopProducts,
  getWeeklyRevenue,
} from '@/apis/dashboard.api';
import LatestOrders from '@/components/ui/manager/dashboard/LatestOrders';

import { Avatar, Button, Card, Col, List, Progress, Row, Select, Statistic, Typography } from 'antd';
import React, { useState } from 'react';
import type { TooltipProps } from 'recharts';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { DollarOutlined, DownloadOutlined, ShoppingOutlined, TrophyOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';

const { Title, Text } = Typography;

const currentYear = new Date().getFullYear();
const startYear = 2025;

const yearList: number[] = [];
for (let y = startYear; y <= currentYear; y++) {
  yearList.push(y);
}

const customerTypeData = [
  { name: 'Mang đi', value: 120 },
  { name: 'Ăn tại chỗ', value: 180 },
  { name: 'Đặt online', value: 60 },
];
const customerTypeColors = ['#D97B41', '#A05A2C', '#faad14'];

const renderCustomerTypeLabel = ({
  cx,
  cy,
  midAngle,
  outerRadius,
  value,
}: {
  cx: number;
  cy: number;
  midAngle: number;
  outerRadius: number;
  value: number;
}) => {
  const RADIAN = Math.PI / 180;
  const radius = outerRadius + 24;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text
      x={x}
      y={y}
      fill='#A05A2C'
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline='central'
      fontSize={15}
      fontWeight={600}
    >
      {value}
    </text>
  );
};

const CustomCustomerTypeTooltip = (props: TooltipProps<number, string>) => {
  const { active, payload } = props;
  if (active && payload && payload.length) {
    const { name, value } = payload[0].payload;
    return (
      <div
        style={{
          background: '#fff',
          border: '1px solid #eee',
          borderRadius: 8,
          padding: 10,
          color: '#A05A2C',
          fontWeight: 600,
          fontSize: 15,
        }}
      >
        {name}: {value} lượt
      </div>
    );
  }
  return null;
};

const ManagerDashboard: React.FC = () => {
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);
  const [selectedMonth] = useState<number>(new Date().getMonth() + 1);

  const { data: topProductsResponse, isLoading: topProductsLoading } = useQuery({
    queryKey: [GET_TOP_PRODUCTS_QUERY_KEY],
    queryFn: getTopProducts,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
  const { data: weeklyRevenueResponse } = useQuery({
    queryKey: ['WEEKLY_REVENUE', selectedMonth, selectedYear],
    queryFn: () => getWeeklyRevenue(selectedMonth, selectedYear),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
  const { data: monthlyRevenueResponse } = useQuery({
    queryKey: ['MONTHLY_REVENUE', selectedYear],
    queryFn: () => getMonthlyRevenue(selectedYear),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
  const { data: branchRevenueResponse } = useQuery({
    queryKey: ['BRANCH_REVENUE'],
    queryFn: getBranchRevenue,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
  const { data: managerDashboardResponse } = useQuery({
    queryKey: ['MANAGER_DASHBOARD'],
    queryFn: getManagerDashboard,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
  const weeklyRevenueRaw = weeklyRevenueResponse?.data
    ? [
        { week: 1, currentMonthRevenue: weeklyRevenueResponse.data.week1 },
        { week: 2, currentMonthRevenue: weeklyRevenueResponse.data.week2 },
        { week: 3, currentMonthRevenue: weeklyRevenueResponse.data.week3 },
        { week: 4, currentMonthRevenue: weeklyRevenueResponse.data.week4 },
      ]
    : [];

  const weeklyRevenue = weeklyRevenueRaw.map((item, idx, arr) => ({
    ...item,
    previousMonthRevenue: idx === 0 ? 0 : arr[idx - 1].currentMonthRevenue,
  }));

  console.log('topProductsResponse', topProductsResponse);

  const monthlyRevenueData = monthlyRevenueResponse?.data
    ? [
        { month: 'Tháng 1', revenue: monthlyRevenueResponse.data.month1 },
        { month: 'Tháng 2', revenue: monthlyRevenueResponse.data.month2 },
        { month: 'Tháng 3', revenue: monthlyRevenueResponse.data.month3 },
        { month: 'Tháng 4', revenue: monthlyRevenueResponse.data.month4 },
        { month: 'Tháng 5', revenue: monthlyRevenueResponse.data.month5 },
        { month: 'Tháng 6', revenue: monthlyRevenueResponse.data.month6 },
        { month: 'Tháng 7', revenue: monthlyRevenueResponse.data.month7 },
        { month: 'Tháng 8', revenue: monthlyRevenueResponse.data.month8 },
        { month: 'Tháng 9', revenue: monthlyRevenueResponse.data.month9 },
        { month: 'Tháng 10', revenue: monthlyRevenueResponse.data.month10 },
        { month: 'Tháng 11', revenue: monthlyRevenueResponse.data.month11 },
        { month: 'Tháng 12', revenue: monthlyRevenueResponse.data.month12 },
      ]
    : [];
  const currentMonthStats = managerDashboardResponse?.data
    ? {
        currentRevenue: managerDashboardResponse.data.revenue,
        percentageChange: 0,
        averageOrderValue: managerDashboardResponse.data.averageOrderValue,
        currentOrders: managerDashboardResponse.data.orders,
        currentQuantity: managerDashboardResponse.data.itemsSold,
      }
    : {
        currentRevenue: 0,
        percentageChange: 0,
        averageOrderValue: 0,
        currentOrders: 0,
        currentQuantity: 0,
      };

  const topProducts =
    topProductsResponse?.data?.map((item) => ({
      name: item.product.productName,
      sold: item.quantity,
      revenue: item.revenue,
      image: item.product.productImage,
    })) || [];

  console.log('topProducts', topProducts);

  const weeklyChartData = weeklyRevenue.map((w: any) => ({
    week: `Tuần ${w.week}`,
    'Doanh thu tháng trước': w.previousMonthRevenue,
    'Doanh thu tháng này': w.currentMonthRevenue,
  }));

  const storePerformance = branchRevenueResponse?.data
    ? Object.entries(branchRevenueResponse.data).map(([id, revenue]) => ({
        id,
        name: `Cửa hàng ${id}`,
        revenue: Number(revenue),
        completion: 100,
      }))
    : [];

  return (
    <div style={{ padding: 32, background: '#FFF9F0', minHeight: '100vh' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 24,
        }}
      >
        <Title level={2} style={{ margin: 0, fontWeight: 700, color: '#A05A2C', fontSize: 40 }}>
          Dashboard
        </Title>
        <Button type='primary' icon={<DownloadOutlined />} style={{ background: '#D97B41', borderColor: '#D97B41' }}>
          Xuất báo cáo
        </Button>
      </div>

      <style>{`
        /* Màu border và shadow khi focus vào Select */
        .ant-select-focused .ant-select-selector,
        .ant-select-selector:focus,
        .ant-select-selector:active {
          border-color: #D97B41 !important;
          box-shadow: 0 0 0 2px #F9E4B7 !important;
        }
        /* Màu option được chọn */
        .ant-select-item-option-selected:not(.ant-select-item-option-disabled) {
          background-color: #F9E4B7 !important;
          color: #D97B41 !important;
        }
        /* Màu option hover */
        .ant-select-item-option-active:not(.ant-select-item-option-disabled) {
          background-color: #F9E4B7 !important;
          color: #D97B41 !important;
        }
        /* Màu border Select khi hover */
        .ant-select-selector:hover {
          border-color: #D97B41 !important;
        }
        /* Màu icon dropdown */
        .ant-select-arrow {
          color: #D97B41 !important;
        }
      `}</style>
      <Row gutter={[24, 24]}>
        <Col xs={24} md={12} lg={6}>
          <Card
            bordered={false}
            style={{
              borderRadius: 12,
              boxShadow: '0 4px 16px rgba(160,90,44,0.08)',
            }}
          >
            <Statistic
              title={<span style={{ color: '#A05A2C', fontWeight: 600 }}>Doanh thu tháng này</span>}
              value={currentMonthStats?.currentRevenue || 0}
              valueStyle={{ color: '#D97B41', fontWeight: 700 }}
              prefix={<DollarOutlined />}
              precision={0}
              groupSeparator=','
            />
            {typeof currentMonthStats?.percentageChange === 'number' ? (
              <Text type={currentMonthStats.percentageChange >= 0 ? 'success' : 'warning'}>
                {currentMonthStats.percentageChange >= 0 ? '+' : ''}
                {currentMonthStats.percentageChange}% so với tháng trước
              </Text>
            ) : (
              <Text type='secondary'>Đang tải...</Text>
            )}
          </Card>
        </Col>
        <Col xs={24} md={12} lg={6}>
          <Card
            bordered={false}
            style={{
              borderRadius: 12,
              boxShadow: '0 4px 16px rgba(160,90,44,0.08)',
            }}
          >
            <Statistic
              title={<span style={{ color: '#A05A2C', fontWeight: 600 }}>Đơn hàng tháng này</span>}
              value={currentMonthStats?.currentOrders || 0}
              valueStyle={{ color: '#A05A2C', fontWeight: 700 }}
              prefix={<ShoppingOutlined />}
              precision={0}
              groupSeparator=','
            />
            {typeof currentMonthStats?.percentageChange === 'number' ? (
              <Text type={currentMonthStats.percentageChange >= 0 ? 'success' : 'warning'}>
                {currentMonthStats.percentageChange >= 0 ? '+' : ''}
                {currentMonthStats.percentageChange}% so với tháng trước
              </Text>
            ) : (
              <Text type='secondary'>Đang tải...</Text>
            )}
          </Card>
        </Col>
        <Col xs={24} md={12} lg={6}>
          <Card
            bordered={false}
            style={{
              borderRadius: 12,
              boxShadow: '0 4px 16px rgba(160,90,44,0.08)',
            }}
          >
            <Statistic
              title={<span style={{ color: '#A05A2C', fontWeight: 600 }}>Giá trị đơn trung bình</span>}
              value={currentMonthStats?.averageOrderValue || 0}
              valueStyle={{ color: '#D97B41', fontWeight: 700 }}
              prefix={<DollarOutlined />}
              suffix='đ'
              precision={0}
              groupSeparator=','
            />
            <Text type='secondary' style={{ color: '#A05A2C' }}>
              Mỗi đơn hàng trong tháng này
            </Text>
          </Card>
        </Col>
        <Col xs={24} md={12} lg={6}>
          <Card
            bordered={false}
            style={{
              borderRadius: 12,
              boxShadow: '0 4px 16px rgba(160,90,44,0.08)',
            }}
          >
            <Statistic
              title={<span style={{ color: '#A05A2C', fontWeight: 600 }}>Sản phẩm bán ra</span>}
              value={currentMonthStats?.currentQuantity || 0}
              valueStyle={{ color: '#faad14', fontWeight: 700 }}
              prefix={<ShoppingOutlined />}
              precision={0}
              groupSeparator=','
            />
            {typeof currentMonthStats?.percentageChange === 'number' ? (
              <Text type={currentMonthStats.percentageChange >= 0 ? 'success' : 'warning'}>
                {currentMonthStats.percentageChange >= 0 ? '+' : ''}
                {currentMonthStats.percentageChange}% so với tháng trước
              </Text>
            ) : (
              <Text type='secondary'>Đang tải...</Text>
            )}
          </Card>
        </Col>
      </Row>

      <Row gutter={[24, 24]} style={{ marginTop: 32 }}>
        <Col xs={24} lg={17}>
          <Card
            title={<span style={{ color: '#A05A2C', fontWeight: 700, fontSize: 20 }}>So sánh doanh thu</span>}
            style={{
              borderRadius: 16,
              boxShadow: '0 6px 24px rgba(160,90,44,0.10)',
            }}
          >
            <ResponsiveContainer width='100%' height={315}>
              <AreaChart data={weeklyChartData} margin={{ top: 0, left: 10, bottom: 0, right: 10 }}>
                <defs>
                  <linearGradient id='colorPrev' x1='0' y1='0' x2='0' y2='1'>
                    <stop offset='5%' stopColor='#d97b41' stopOpacity={0.6} />
                    <stop offset='95%' stopColor='#d97b41' stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id='colorCurr' x1='0' y1='0' x2='0' y2='1'>
                    <stop offset='5%' stopColor='#faad14' stopOpacity={0.6} />
                    <stop offset='95%' stopColor='#faad14' stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey='week' tick={{ fontSize: 12 }} />
                <YAxis tickFormatter={(v) => v.toLocaleString()} tick={{ fontSize: 12 }} />
                <CartesianGrid strokeDasharray='3 3' />
                <Tooltip formatter={(v: any) => v.toLocaleString()} />
                <Area
                  type='monotone'
                  dataKey='Doanh thu tháng trước'
                  stroke='#D97B41'
                  fillOpacity={2}
                  fill='url(#colorPrev)'
                />
                <Area
                  type='monotone'
                  dataKey='Doanh thu tháng này'
                  stroke='#faad14'
                  fillOpacity={1}
                  fill='url(#colorCurr)'
                />
              </AreaChart>
            </ResponsiveContainer>
            <div
              style={{
                display: 'flex',
                gap: 24,
                marginTop: 12,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span
                  style={{ width: 18, height: 6, background: '#D97B41', borderRadius: 3, display: 'inline-block' }}
                ></span>
                <span style={{ color: '#A05A2C', fontWeight: 500 }}>Doanh thu tháng trước</span>
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span
                  style={{ width: 18, height: 6, background: '#faad14', borderRadius: 3, display: 'inline-block' }}
                ></span>
                <span style={{ color: '#A05A2C', fontWeight: 500 }}>Doanh thu tháng này</span>
              </span>
            </div>
          </Card>

          <Card
            title={<span style={{ color: '#222', fontWeight: 700 }}>Báo cáo doanh thu năm {selectedYear}</span>}
            bordered={false}
            style={{
              borderRadius: 16,
              background: '#fff',
              marginTop: 32,
              boxShadow: '0 4px 16px rgba(160,90,44,0.08)',
            }}
            bodyStyle={{ padding: 24 }}
            extra={
              <Select value={selectedYear} onChange={(year) => setSelectedYear(year)} style={{ minWidth: 120 }}>
                {yearList.map((y) => (
                  <Select.Option key={y} value={y}>{`Năm ${y}`}</Select.Option>
                ))}
              </Select>
            }
          >
            <ResponsiveContainer width='100%' height={340}>
              <BarChart data={monthlyRevenueData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray='3 3' vertical={false} />
                <XAxis dataKey='month' tick={{ fontSize: 13 }} />
                <YAxis tickFormatter={(v: any) => `${v / 1000000}tr`} />
                <Tooltip formatter={(value: number) => `${value.toLocaleString()} đ`} />
                <Legend />
                <Bar dataKey='revenue' fill='#D97B41' name='Doanh thu' radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        {/* Cột bên phải */}
        <Col xs={24} lg={7}>
          <Row gutter={[0, 24]}>
            <Col span={24}>
              <Card
                title={<span style={{ color: '#A05A2C', fontWeight: 600 }}>Tỉ lệ hình thức mua hàng</span>}
                bordered={false}
                style={{ borderRadius: 12 }}
              >
                <ResponsiveContainer width='100%' height={260}>
                  <PieChart>
                    <Pie
                      data={customerTypeData}
                      dataKey='value'
                      nameKey='name'
                      cx='50%'
                      cy='50%'
                      outerRadius={90}
                      label={renderCustomerTypeLabel}
                      labelLine={true}
                      stroke='#fff'
                    >
                      {customerTypeData.map((_entry, idx) => (
                        <Cell key={`cell-${idx}`} fill={customerTypeColors[idx]} />
                      ))}
                    </Pie>
                    <Tooltip content={CustomCustomerTypeTooltip} />
                    <Legend verticalAlign='bottom' height={36} />
                  </PieChart>
                </ResponsiveContainer>
              </Card>
            </Col>
            <Col span={24}>
              <Card
                title={<span style={{ color: '#A05A2C', fontWeight: 600 }}>Top 6 sản phẩm bán chạy</span>}
                bordered={false}
                style={{ borderRadius: 12 }}
              >
                <List
                  itemLayout='horizontal'
                  dataSource={topProducts}
                  loading={topProductsLoading}
                  renderItem={(item, _idx) => (
                    <List.Item>
                      <List.Item.Meta
                        avatar={<Avatar src={item.image} style={{ background: '#D97B41' }} icon={<TrophyOutlined />} />}
                        title={<span style={{ fontWeight: 600 }}>{item.name}</span>}
                        description={
                          <span>
                            Bán: <b>{item.sold}</b> | Doanh thu: <b>{item.revenue.toLocaleString()}đ</b>
                          </span>
                        }
                      />
                    </List.Item>
                  )}
                />
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>

      <Row style={{ marginTop: 32 }}>
        <Col xs={24}>
          <LatestOrders />
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card title='Hiệu suất cửa hàng'>
            {storePerformance.map((store) => (
              <div key={store.id} style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span>{store.name}</span>
                  <span>{store.revenue.toLocaleString()}đ</span>
                </div>
                <Progress
                  percent={store.completion}
                  strokeColor={{
                    '0%': '#F9E4B7',
                    '100%': '#D97B41',
                  }}
                  showInfo={false}
                />
              </div>
            ))}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ManagerDashboard;
