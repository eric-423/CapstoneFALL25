import { DashboardProductItem, deleteDashboardProduct,getDashboardProducts } from '@/apis/dashboard.api';

import {
  Button,
  Card,
  Descriptions,
  Form,
  Image,
  Input,
  InputNumber,
  message,
  Modal,
  Select,
  Space,
  Table,
  Tag,
  Tooltip,
  Upload,
} from 'antd';
import type { ColumnType } from 'antd/es/table';
import type { UploadFile, UploadProps } from 'antd/es/upload/interface';
import React, { useEffect, useState } from 'react';

import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  MinusCircleOutlined,
  PlusOutlined,
  SearchOutlined,
} from '@ant-design/icons';

const { Option } = Select;

interface ProductType {
  productTypeId: number;
  name: string;
}

interface Material {
  materialId: number;
  name: string;
  quantity: number;
  storeId: number;
}

const productTypeApiOptions: ProductType[] = [
  { productTypeId: 1, name: 'Món chính' },
  { productTypeId: 2, name: 'Ăn kèm' },
  { productTypeId: 3, name: 'Đồ uống' },
];

// Mock product types hook
const useProductTypes = () => {
  return {
    data: productTypeApiOptions,
    isLoading: false,
  };
};

const ProductManagement: React.FC = () => {
  const [products, setProducts] = useState<DashboardProductItem[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [tableLoading, setTableLoading] = useState(false);
  const [materials] = useState<Material[]>([
    { materialId: 1, name: 'Gạo', quantity: 100, storeId: 1 },
    { materialId: 2, name: 'Sườn heo', quantity: 50, storeId: 1 },
    { materialId: 3, name: 'Trà đen', quantity: 100, storeId: 1 },
    { materialId: 4, name: 'Sữa tươi', quantity: 50, storeId: 1 },
    { materialId: 5, name: 'Trân châu', quantity: 30, storeId: 1 },
  ]);
  const [searchText, setSearchText] = useState('');
  const [selectedType, setSelectedType] = useState<string | undefined>(undefined);
  const [selectedStatus, setSelectedStatus] = useState<boolean | undefined>(undefined);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState<DashboardProductItem | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<DashboardProductItem | null>(null);
  const [modalMode, setModalMode] = useState<'view' | 'add' | 'edit'>('view');
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const { data: productTypes, isLoading: isProductTypesLoading } = useProductTypes();

  const fetchProducts = async () => {
    try {
      setTableLoading(true);
      const res = await getDashboardProducts(page - 1, pageSize);
      setProducts(res.data.content);
      setTotal(res.data.totalElements);
    } catch (error) {
      setProducts([]);
      message.error('Không thể tải danh sách sản phẩm! Vui lòng kiểm tra kết nối mạng và API server.');
    } finally {
      setTableLoading(false);
    }
  };

  const fetchMaterials = async () => {
    try {
      // Comment out API call
      // const token = localStorage.getItem("token");
      // const response = await axios.get<{ data?: Material[]; materials?: Material[]; results?: Material[] } | Material[]>(
      //   "https://wdp301-su25.space/api/materials",
      //   {
      //     headers: {
      //       accept: "application/json",
      //       Authorization: token ? `Bearer ${token}` : "",
      //     },
      //   }
      // );
      // let materialData: Material[] = [];
      // if (Array.isArray(response.data)) {
      //   materialData = response.data;
      // } else if (response.data && Array.isArray(response.data.data)) {
      //   materialData = response.data.data;
      // } else if (response.data && Array.isArray(response.data.materials)) {
      //   materialData = response.data.materials;
      // } else if (response.data && Array.isArray(response.data.results)) {
      //   materialData = response.data.results;
      // }
      // setMaterials(materialData);
    } catch (error) {
      console.error('Fetch materials error:', error);
      message.error('Không thể tải nguyên liệu!');
    }
  };

  const createProductApiCall = async (_payload: any) => {
    // Comment out API call
    // const token = localStorage.getItem("token");
    // const response = await axios.post(
    //   "https://wdp301-su25.space/api/products",
    //   payload,
    //   {
    //     headers: {
    //       accept: "application/json",
    //       Authorization: token ? `Bearer ${token}` : "",
    //       "Content-Type": "application/json",
    //     },
    //   }
    // );
    // return response.data;
    return { success: true };
  };

  const updateProductApiCall = async (_productId: number, _payload: any) => {
    // Comment out API call
    // const token = localStorage.getItem("token");
    // const response = await axios.put(
    //   `https://wdp301-su25.space/api/products/${productId}`,
    //   payload,
    //   {
    //     headers: {
    //       accept: "application/json",
    //       Authorization: token ? `Bearer ${token}` : "",
    //       "Content-Type": "application/json",
    //     },
    //   }
    // );
    // return response.data;
    return { success: true };
  };

  const deleteProductApiCall = async (productId: number) => {
    return await deleteDashboardProduct(productId);
  };

  const uploadImageAndGetUrl = async (_file: File) => {
    // Comment out Firebase upload
    // const storageRef = ref(storage, `products/${Date.now()}_${file.name}?alt=media`);
    // await uploadBytes(storageRef, file);
    // return getDownloadURL(storageRef);
    return 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500';
  };

  useEffect(() => {
    fetchProducts();
    fetchMaterials();
  }, [page, pageSize]);

  const handleAdd = () => {
    setEditingProduct(null);
    setSelectedProduct(null);
    setModalMode('add');
    form.resetFields();
    form.setFieldsValue({ isActive: true, recipes: [] });
    setFileList([]);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setModalVisible(true);
  };

  const handleEdit = (product: DashboardProductItem) => {
    setEditingProduct(product);
    setSelectedProduct(null);
    setModalMode('edit');
    form.setFieldsValue({
      ...product,
      productTypeId: product.productType,
      recipes: product.recipe.map((r: any) => ({ materialId: r.materialId, quantity: r.quantity })),
    });
    if (product.productImage) {
      setFileList([
        {
          uid: '-1',
          name: 'image.png',
          status: 'done',
          url: product.productImage,
        },
      ]);
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl(product.productImage);
    } else {
      setFileList([]);
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    setModalVisible(true);
  };

  const handleView = (product: DashboardProductItem) => {
    setSelectedProduct(product);
    setEditingProduct(null);
    setModalMode('view');
    setModalVisible(true);
  };

  const handleDelete = (productId: number) => {
    Modal.confirm({
      title: 'Bạn có chắc chắn muốn xóa sản phẩm này?',
      content: 'Hành động này không thể hoàn tác.',
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          await deleteProductApiCall(productId);
          message.success('Đã xóa sản phẩm!');
          await fetchProducts();
        } catch (error) {
          console.error('Delete product error:', error);
          message.error('Xóa sản phẩm thất bại!');
        }
      },
    });
  };

  const handleModalOk = async () => {
    setIsSubmitting(true);
    try {
      const values = await form.validateFields();
      let imageUrl = editingProduct?.productImage || '';

      if (Array.isArray(values.image) && values.image.length > 0 && values.image[0].originFileObj) {
        imageUrl = await uploadImageAndGetUrl(values.image[0].originFileObj as File);
      } else if (Array.isArray(values.image) && values.image.length > 0 && values.image[0].url) {
        imageUrl = values.image[0].url;
      } else if (typeof values.image === 'string') {
        imageUrl = values.image;
      }

      const productPayload = {
        ...values,
        price: Number(values.price),
        image: imageUrl,
        recipes: Array.isArray(values.recipes)
          ? values.recipes.map((r: any) => ({
              materialId: r.materialId,
              quantity: r.quantity,
            }))
          : [],
      };

      if (modalMode === 'add') {
        await createProductApiCall(productPayload);
        message.success('Đã thêm sản phẩm!');
      } else if (editingProduct) {
        await updateProductApiCall(editingProduct.productId, productPayload);
        message.success('Đã cập nhật sản phẩm!');
      }

      await fetchProducts();
      setModalVisible(false);
      form.resetFields();
      setFileList([]);
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    } catch (error: any) {
      console.error('Modal OK error:', error);
      let errorMessage = 'Có lỗi xảy ra!';
      if (error.errorFields) {
        errorMessage = 'Vui lòng điền đầy đủ các trường bắt buộc.';
      } else if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      message.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const onUploadChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
    setFileList(newFileList);
    if (newFileList.length > 0) {
      form.setFieldsValue({ image: newFileList });
      const file = newFileList[0];
      if (file.originFileObj) {
        if (previewUrl) URL.revokeObjectURL(previewUrl);
        const preview = URL.createObjectURL(file.originFileObj as File);
        setPreviewUrl(preview);
      } else if (file.url) {
        if (previewUrl) URL.revokeObjectURL(previewUrl);
        setPreviewUrl(file.url);
      }
    } else {
      form.setFieldsValue({ image: null });
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };
  const headerColor = '#A05A2C';
  const headerBgColor = '#F9E4B7';
  const evenRowBgColor = '#FFFDF5';
  const oddRowBgColor = '#FFF7E6';
  const cellTextColor = '#5D4037';
  const borderColor = '#F5EAD9';
  const tableBorderColor = '#E9C97B';

  const columns: ColumnType<DashboardProductItem>[] = [
    {
      title: 'ID',
      dataIndex: 'productId',
      key: 'productId',
      sorter: (a: DashboardProductItem, b: DashboardProductItem) => a.productId - b.productId,
      width: 70,
      render: (id: number) => `${id}`,
    },
    {
      title: 'Ảnh',
      dataIndex: 'productImage',
      key: 'productImage',
      width: 85,
      render: (img: string, record: DashboardProductItem) => (
        <Image
          src={img || 'https://via.placeholder.com/60x60?text=N/A'}
          alt={record.productName}
          width={60}
          height={60}
          style={{ objectFit: 'cover', borderRadius: 6, border: '1px solid #f0f0f0' }}
          preview={{ mask: <EyeOutlined style={{ fontSize: 14 }} /> }}
          fallback='https://via.placeholder.com/60x60?text=Lỗi'
        />
      ),
    },
    {
      title: 'Tên sản phẩm',
      dataIndex: 'productName',
      key: 'productName',
      width: 200,
      ellipsis: true,
      sorter: (a: DashboardProductItem, b: DashboardProductItem) => a.productName.localeCompare(b.productName),
      render: (name: string) => (
        <Tooltip title={name}>
          <span style={{ fontWeight: 600, color: '#D97B41' }}>{name}</span>
        </Tooltip>
      ),
    },
    {
      title: 'Mô tả',
      dataIndex: 'productDescription',
      key: 'productDescription',
      width: 220,
      ellipsis: true,
      render: (desc: string) => (
        <Tooltip title={desc}>
          <span>{desc}</span>
        </Tooltip>
      ),
    },
    {
      title: 'Giá',
      dataIndex: 'productPrice',
      key: 'productPrice',
      width: 120,
      align: 'right' as const,
      sorter: (a: DashboardProductItem, b: DashboardProductItem) => a.productPrice - b.productPrice,
      render: (price: number) => <span style={{ color: '#A05A2C', fontWeight: 600 }}>{price?.toLocaleString()}đ</span>,
    },
    {
      title: 'Loại',
      dataIndex: 'productType',
      key: 'productType',
      width: 130,
      ellipsis: true,
      render: (type: string) => (
        <Tooltip title={type || 'Không xác định'}>
          <Tag color='#F9E4B7' style={{ color: '#A05A2C', fontWeight: 500, padding: '3px 8px', borderRadius: '6px' }}>
            {type || 'Không xác định'}
          </Tag>
        </Tooltip>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      align: 'center' as const,
      render: (isActive: boolean) =>
        isActive ? (
          <Tag color='#D97B41' style={{ color: '#fff', fontWeight: 500, padding: '3px 8px', borderRadius: '6px' }}>
            Đang bán
          </Tag>
        ) : (
          <Tag color='#8c8c8c' style={{ color: '#fff', fontWeight: 500, padding: '3px 8px', borderRadius: '6px' }}>
            Ngừng bán
          </Tag>
        ),
    },
    {
      title: 'Hành động',
      key: 'actions',
      align: 'center' as const,
      width: 135,
      fixed: 'right',
      render: (_: any, record: DashboardProductItem) => (
        <Space size='small'>
          <Tooltip title='Xem chi tiết'>
            <Button
              type='text'
              style={{ outline: 'none', boxShadow: 'none', border: 'none' }}
              icon={<EyeOutlined style={{ color: '#D97B41', fontSize: 17 }} />}
              onClick={() => handleView(record)}
            />
          </Tooltip>
          <Tooltip title='Chỉnh sửa'>
            <Button
              type='text'
              icon={<EditOutlined style={{ color: '#A05A2C', fontSize: 17 }} />}
              onClick={() => handleEdit(record)}
              style={{ outline: 'none', boxShadow: 'none', border: 'none' }}
            />
          </Tooltip>
          <Tooltip title='Xóa'>
            <Button
              type='text'
              danger
              icon={<DeleteOutlined style={{ fontSize: 17 }} />}
              onClick={() => handleDelete(record.productId)}
              style={{ outline: 'none', boxShadow: 'none', border: 'none' }}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ minHeight: '90vh', background: '#FFF9F0', padding: '20px 30px 30px 60px' }}>
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
        .ant-btn-dashed {
          border-color: #D97B41 !important;
          color: #D97B41 !important;
        }
        .ant-btn-dashed:hover, .ant-btn-dashed:focus {
          border-color: #D97B41 !important;
          color: #D97B41 !important;
        }
      `}</style>
      <div style={{ maxWidth: 1300, margin: '0 auto' }}>
        <h1 style={{ margin: 0, fontWeight: 700, color: '#A05A2C', fontSize: 40, marginBottom: 24 }}>
          Quản lý Sản phẩm
        </h1>
        <Card
          style={{
            background: '#fff',
            borderRadius: 12,
            boxShadow: '0 6px 16px rgba(160, 90, 44, 0.08)',
            padding: '12px 24px',
            border: `1px solid ${tableBorderColor}`,
            marginBottom: 24,
          }}
        >
          <div
            style={{
              marginBottom: 20,
              display: 'flex',
              gap: 16,
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Space>
              <Input
                placeholder='Tìm theo tên sản phẩm...'
                prefix={<SearchOutlined style={{ color: '#A05A2C' }} />}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                style={{
                  width: 280,
                  borderRadius: 6,
                  borderColor: '#E9C97B',
                  height: 31,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                allowClear
              />
              <Select
                placeholder='Loại sản phẩm'
                style={{ width: 150, borderRadius: 6, borderColor: '#E9C97B' }}
                allowClear
                value={selectedType}
                onChange={setSelectedType}
              >
                {productTypeApiOptions.map((type) => (
                  <Option key={type.productTypeId} value={type.name}>
                    {type.name}
                  </Option>
                ))}
              </Select>
              <Select
                placeholder='Trạng thái'
                style={{ width: 150, borderRadius: 6, borderColor: '#E9C97B' }}
                allowClear
                value={selectedStatus}
                onChange={setSelectedStatus}
              >
                <Option value={true}>Đang bán</Option>
                <Option value={false}>Ngừng bán</Option>
              </Select>
            </Space>
            <Button
              type='primary'
              icon={<PlusOutlined />}
              style={{
                background: '#D97B41',
                borderColor: '#D97B41',
                fontWeight: 600,
                borderRadius: 6,
                boxShadow: '0 2px 0 rgba(0,0,0,0.043)',
                outline: 'none',
              }}
              onClick={handleAdd}
            >
              Thêm sản phẩm
            </Button>
          </div>
          <Table
            className='product-table'
            columns={columns}
            dataSource={products.filter(
              (product) =>
                product.productName.toLowerCase().includes(searchText.toLowerCase()) &&
                (selectedType === undefined || product.productType === selectedType) &&
                (selectedStatus === undefined || product.status === selectedStatus),
            )}
            loading={tableLoading}
            rowKey='productId'
            style={{
              borderRadius: 8,
              border: `1px solid ${tableBorderColor}`,
              overflow: 'hidden',
            }}
            rowClassName={(_, index) => (index % 2 === 0 ? 'even-row-product' : 'odd-row-product')}
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
          open={modalVisible}
          title={
            <span style={{ color: '#A05A2C', fontWeight: 600, fontSize: 22 }}>
              {modalMode === 'view'
                ? 'Chi tiết sản phẩm'
                : modalMode === 'add'
                  ? 'Thêm sản phẩm mới'
                  : 'Chỉnh sửa sản phẩm'}
            </span>
          }
          onCancel={() => {
            setModalVisible(false);
            form.resetFields();
            setFileList([]);
            if (previewUrl) URL.revokeObjectURL(previewUrl);
            setPreviewUrl(null);
          }}
          footer={
            modalMode === 'view'
              ? [
                  <Button key='close' onClick={() => setModalVisible(false)} style={{ borderRadius: 6 }}>
                    {' '}
                    Đóng{' '}
                  </Button>,
                ]
              : [
                  <Button
                    key='cancel'
                    onClick={() => {
                      setModalVisible(false);
                      form.resetFields();
                      setFileList([]);
                      if (previewUrl) URL.revokeObjectURL(previewUrl);
                      setPreviewUrl(null);
                    }}
                    style={{ borderRadius: 6 }}
                    disabled={isSubmitting}
                  >
                    Hủy
                  </Button>,
                  <Button
                    key='submit'
                    type='primary'
                    onClick={handleModalOk}
                    style={{ background: '#D97B41', borderColor: '#D97B41', borderRadius: 6 }}
                    loading={isSubmitting}
                  >
                    {modalMode === 'add' ? 'Thêm mới' : 'Cập nhật'}
                  </Button>,
                ]
          }
          width={modalMode === 'view' ? 700 : 600}
          destroyOnHidden
          styles={{ body: { background: '#FFF9F0', borderRadius: '0 0 12px 12px', padding: '24px' } }}
          style={{ borderRadius: 12, top: 20 }}
        >
          {modalMode === 'view' && selectedProduct ? (
            <Card bordered={false} style={{ background: '#fff', borderRadius: 8, padding: 0 }}>
              <Descriptions
                bordered
                column={{ xxl: 2, xl: 1, lg: 1, md: 1, sm: 1, xs: 1 }}
                size='default'
                labelStyle={{ color: '#A05A2C', fontWeight: 500, width: '150px', background: '#FFF9F0' }}
                contentStyle={{ color: '#555', background: '#FFFFFF' }}
              >
                <Descriptions.Item label='ID'>{selectedProduct.productId}</Descriptions.Item>
                <Descriptions.Item
                  label='Ảnh'
                  span={selectedProduct.productDescription && selectedProduct.productDescription.length > 100 ? 2 : 1}
                >
                  <Image
                    src={selectedProduct.productImage || 'https://via.placeholder.com/120x120?text=No+Image'}
                    width={120}
                    height={120}
                    style={{ objectFit: 'cover', borderRadius: 8, border: '1px solid #eee' }}
                  />
                </Descriptions.Item>
                <Descriptions.Item label='Tên sản phẩm'>{selectedProduct.productName}</Descriptions.Item>
                {selectedProduct.productDescription && selectedProduct.productDescription.length <= 100 && (
                  <Descriptions.Item label='Mô tả' span={1}>
                    {selectedProduct.productDescription}
                  </Descriptions.Item>
                )}
                <Descriptions.Item label='Giá'>{selectedProduct.productPrice?.toLocaleString()}đ</Descriptions.Item>
                <Descriptions.Item label='Loại'>{selectedProduct.productType || 'N/A'}</Descriptions.Item>
                <Descriptions.Item label='Trạng thái'>
                  {selectedProduct.status ? (
                    <Tag color='#D97B41' style={{ color: '#fff', borderRadius: 6 }}>
                      Đang bán
                    </Tag>
                  ) : (
                    <Tag color='#8c8c8c' style={{ color: '#fff', borderRadius: 6 }}>
                      Ngừng bán
                    </Tag>
                  )}
                </Descriptions.Item>
                {typeof selectedProduct.productQuantity === 'number' && (
                  <Descriptions.Item label='Số lượng tồn'>{selectedProduct.productQuantity}</Descriptions.Item>
                )}
              </Descriptions>
              {selectedProduct.productDescription && selectedProduct.productDescription.length > 100 && (
                <Descriptions
                  layout='vertical'
                  bordered
                  style={{ marginTop: 16 }}
                  labelStyle={{ color: '#A05A2C', fontWeight: 500, background: '#FFF9F0' }}
                  contentStyle={{ color: '#555', background: '#FFFFFF' }}
                >
                  <Descriptions.Item label='Mô tả chi tiết'>{selectedProduct.productDescription}</Descriptions.Item>
                </Descriptions>
              )}
              {selectedProduct.recipe && selectedProduct.recipe.length > 0 && (
                <div style={{ marginTop: 20 }}>
                  <h4 style={{ color: '#A05A2C', fontWeight: 600, marginBottom: 10 }}>Công thức (Recipe):</h4>
                  <Table
                    dataSource={selectedProduct.recipe.map((r: any) => ({
                      ...r,
                      materialName: r.material?.name || 'Không rõ',
                    }))}
                    columns={[
                      {
                        title: 'Nguyên liệu',
                        dataIndex: 'materialName',
                        key: 'materialName',
                        render: (text) => <span style={{ color: cellTextColor }}>{text}</span>,
                      },
                      {
                        title: 'Số lượng',
                        dataIndex: 'quantity',
                        key: 'quantity',
                        render: (text) => <span style={{ color: cellTextColor }}>{text}</span>,
                      },
                    ]}
                    pagination={false}
                    rowKey='materialId'
                    size='small'
                    style={{ background: evenRowBgColor, borderRadius: 8, border: `1px solid ${borderColor}` }}
                  />
                </div>
              )}
            </Card>
          ) : (
            <Form
              form={form}
              layout='vertical'
              style={{ background: '#fff', padding: '24px', borderRadius: '8px', border: '1px solid #f0f0f0' }}
              initialValues={{ isActive: true }}
            >
              <Form.Item
                name='image'
                label={<span style={{ color: '#A05A2C' }}>Ảnh sản phẩm</span>}
                rules={[{ required: modalMode === 'add', message: 'Vui lòng tải lên ảnh sản phẩm!' }]}
                valuePropName='fileList'
                getValueFromEvent={(e) => {
                  if (Array.isArray(e)) {
                    return e;
                  }
                  return e && e.fileList;
                }}
              >
                <Upload
                  style={{ borderColor: '#D97B41', color: '#D97B41' }}
                  listType='picture-card'
                  fileList={fileList}
                  onChange={onUploadChange}
                  beforeUpload={() => false}
                  maxCount={1}
                  accept='image/*'
                >
                  {fileList.length < 1 && (
                    <div>
                      <PlusOutlined />
                      <div style={{ marginTop: 8 }}>Tải lên</div>
                    </div>
                  )}
                </Upload>
                {previewUrl && (
                  <Image src={previewUrl} alt='preview' width={100} style={{ display: 'block', marginTop: 8 }} />
                )}
              </Form.Item>
              <Form.Item
                name='name'
                label={<span style={{ color: '#A05A2C' }}>Tên sản phẩm</span>}
                rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm!' }]}
              >
                <Input placeholder='Ví dụ: Cơm tấm sườn bì chả' style={{ borderRadius: 6 }} />
              </Form.Item>
              <Form.Item
                name='description'
                label={<span style={{ color: '#A05A2C' }}>Mô tả</span>}
                rules={[{ required: true, message: 'Vui lòng nhập mô tả!' }]}
              >
                <Input.TextArea rows={3} placeholder='Mô tả chi tiết về sản phẩm' style={{ borderRadius: 6 }} />
              </Form.Item>
              <Space align='start' style={{ display: 'flex', marginBottom: 0 }} size='large'>
                <Form.Item
                  name='price'
                  label={<span style={{ color: '#A05A2C' }}>Giá</span>}
                  rules={[{ required: true, message: 'Vui lòng nhập giá!' }]}
                  style={{ flex: 1 }}
                >
                  <InputNumber
                    style={{ width: '100%', borderRadius: 6 }}
                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={(value: any) => value!.replace(/\$\s?|(,*)/g, '')}
                    placeholder='Ví dụ: 35000'
                    min={0}
                  />
                </Form.Item>
              </Space>
              <Form.Item label={<span style={{ color: '#A05A2C' }}>Nguyên liệu</span>} required>
                <Form.List name='recipes'>
                  {(fields, { add, remove }) => (
                    <>
                      {fields.map((field, _index) => (
                        <Space key={field.key} align='baseline' style={{ display: 'flex', marginBottom: 8 }}>
                          <Form.Item
                            {...field}
                            name={[field.name, 'materialId']}
                            rules={[{ required: true, message: 'Chọn nguyên liệu' }]}
                            style={{ minWidth: 200 }}
                          >
                            <Select placeholder='Chọn nguyên liệu' style={{ borderRadius: 6 }}>
                              {materials.map((m) => (
                                <Option key={m.materialId} value={m.materialId}>
                                  {m.name}
                                </Option>
                              ))}
                            </Select>
                          </Form.Item>
                          <Form.Item
                            {...field}
                            name={[field.name, 'quantity']}
                            rules={[{ required: true, message: 'Nhập số lượng' }]}
                          >
                            <InputNumber min={1} style={{ width: 120, borderRadius: 6 }} />
                          </Form.Item>
                          {fields.length > 1 && (
                            <MinusCircleOutlined onClick={() => remove(field.name)} style={{ color: '#ff4d4f' }} />
                          )}
                        </Space>
                      ))}
                      <Button type='dashed' onClick={() => add()} block icon={<PlusOutlined />}>
                        Thêm nguyên liệu
                      </Button>
                    </>
                  )}
                </Form.List>
              </Form.Item>
              <Space align='start' style={{ display: 'flex', marginBottom: 0 }} size='large'>
                <Form.Item
                  name='productTypeId'
                  label={<span style={{ color: '#A05A2C' }}>Loại sản phẩm</span>}
                  rules={[{ required: true, message: 'Vui lòng chọn loại sản phẩm!' }]}
                  style={{ flex: 1 }}
                >
                  <Select placeholder='Chọn loại sản phẩm' style={{ borderRadius: 6 }}>
                    {isProductTypesLoading ? (
                      <Option value=''>Đang tải...</Option>
                    ) : (
                      productTypes?.map((type) => (
                        <Option key={type.productTypeId} value={type.name}>
                          {type.name}
                        </Option>
                      ))
                    )}
                  </Select>
                </Form.Item>
              </Space>
            </Form>
          )}
        </Modal>
      </div>
    </div>
  );
};

export default ProductManagement;
