import { useState, useEffect, useCallback } from 'react';
import {
  Card, Table, Button, Input, Space, Tag, Avatar, Tooltip,
  Popconfirm, message, Typography, Select, Row, Col,
} from 'antd';
import {
  PlusOutlined, SearchOutlined, EditOutlined, DeleteOutlined,
  UserOutlined, ReloadOutlined,
} from '@ant-design/icons';
import { usersAPI } from '../../api/user';
import { useAuth } from '../../context/AuthContext';
import UserFormModal from '../../components/users/UserFormModal';

const { Title } = Typography;
const { Option } = Select;

const UsersPage = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const fetchUsers = useCallback(
    async (page = 1, pageSize = 10) => {
      setLoading(true);
      try {
        const { data } = await usersAPI.getAll({ page, limit: pageSize, search, role: roleFilter });
        setUsers(data.data);
        setPagination({ current: data.pagination.page, pageSize: data.pagination.limit, total: data.pagination.total });
      } catch (err) {
        message.error('Failed to load users');
      } finally {
        setLoading(false);
      }
    },
    [search, roleFilter]
  );

  useEffect(() => {
    fetchUsers(1, pagination.pageSize);
  }, [search, roleFilter]); // eslint-disable-line

  const handleTableChange = (pag) => fetchUsers(pag.current, pag.pageSize);

  const handleOpenAdd = () => { setEditingUser(null); setModalOpen(true); };
  const handleOpenEdit = (record) => { setEditingUser(record); setModalOpen(true); };

  const handleDelete = async (id) => {
    try {
      await usersAPI.remove(id);
      message.success('User deleted successfully');
      fetchUsers(pagination.current, pagination.pageSize);
    } catch (err) {
      message.error(err.response?.data?.message || 'Delete failed');
    }
  };

  const handleSubmit = async (values) => {
    setSubmitLoading(true);
    try {
      if (editingUser) {
        await usersAPI.update(editingUser._id, values);
        message.success('User updated successfully');
      } else {
        await usersAPI.create(values);
        message.success('User created successfully');
      }
      setModalOpen(false);
      fetchUsers(pagination.current, pagination.pageSize);
    } catch (err) {
      message.error(err.response?.data?.message || 'Operation failed');
    } finally {
      setSubmitLoading(false);
    }
  };

  const columns = [
    {
      title: 'User',
      key: 'user',
      render: (_, record) => (
        <Space>
          <Avatar
            style={{ background: record.role === 'admin' ? '#faad14' : '#667eea' }}
            icon={<UserOutlined />}
            size="small"
          />
          <div>
            <div className="font-medium">{record.name}</div>
            <div className="text-xs text-gray-400">{record.email}</div>
          </div>
        </Space>
      ),
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
      render: (phone) => phone || <span className="text-gray-300">—</span>,
      responsive: ['md'],
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (role) => <Tag color={role === 'admin' ? 'gold' : 'blue'}>{role.toUpperCase()}</Tag>,
    },
    {
      title: 'Status',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive) => <Tag color={isActive ? 'green' : 'red'}>{isActive ? 'Active' : 'Inactive'}</Tag>,
      responsive: ['sm'],
    },
    {
      title: 'Created',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => new Date(date).toLocaleDateString(),
      responsive: ['lg'],
    },
    {
      title: 'Actions',
      key: 'actions',
      align: 'center',
      render: (_, record) => (
        <Space>
          <Tooltip title="Edit">
            <Button type="text" icon={<EditOutlined />} onClick={() => handleOpenEdit(record)} />
          </Tooltip>
          <Tooltip title={record._id === currentUser._id ? "Can't delete yourself" : 'Delete'}>
            <Popconfirm
              title="Delete this user?"
              description="This action cannot be undone."
              onConfirm={() => handleDelete(record._id)}
              okText="Delete"
              okButtonProps={{ danger: true }}
              disabled={record._id === currentUser._id}
            >
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
                disabled={record._id === currentUser._id}
              />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <Title level={4} className="!mb-0">User Management</Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleOpenAdd}
          style={{ background: '#667eea' }}
        >
          Add User
        </Button>
      </div>

      <Card className="rounded-xl">
        <Row gutter={[12, 12]} className="mb-4">
          <Col xs={24} sm={14} md={16}>
            <Input
              placeholder="Search by name or email..."
              prefix={<SearchOutlined />}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              allowClear
            />
          </Col>
          <Col xs={16} sm={7} md={6}>
            <Select
              placeholder="Filter by role"
              allowClear
              className="w-full"
              onChange={(val) => setRoleFilter(val || '')}
              value={roleFilter || undefined}
            >
              <Option value="admin">Admin</Option>
              <Option value="user">User</Option>
            </Select>
          </Col>
          <Col xs={8} sm={3} md={2}>
            <Tooltip title="Refresh">
              <Button
                icon={<ReloadOutlined />}
                onClick={() => fetchUsers(1, pagination.pageSize)}
                className="w-full"
              />
            </Tooltip>
          </Col>
        </Row>

        <Table
          columns={columns}
          dataSource={users}
          rowKey="_id"
          loading={loading}
          pagination={{
            ...pagination,
            showSizeChanger: true,
            pageSizeOptions: ['5', '10', '20', '50'],
            showTotal: (total, range) => `${range[0]}–${range[1]} of ${total} users`,
          }}
          onChange={handleTableChange}
          scroll={{ x: 600 }}
        />
      </Card>

      <UserFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        editingUser={editingUser}
        loading={submitLoading}
      />
    </div>
  );
};

export default UsersPage;
