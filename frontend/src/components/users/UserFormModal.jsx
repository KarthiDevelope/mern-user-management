import { useEffect } from 'react';
import { Modal, Form, Input, Select, Switch, Row, Col } from 'antd';

const { Option } = Select;

const UserFormModal = ({ open, onClose, onSubmit, editingUser, loading }) => {
  const [form] = Form.useForm();
  const isEditing = !!editingUser;

  useEffect(() => {
    if (open) {
      if (isEditing) {
        form.setFieldsValue({
          name:     editingUser.name,
          email:    editingUser.email,
          role:     editingUser.role,
          phone:    editingUser.phone,
          isActive: editingUser.isActive,
          password: '',
        });
      } else {
        form.resetFields();
        form.setFieldsValue({ role: 'user', isActive: true });
      }
    }
  }, [open, editingUser, isEditing, form]);

  const handleOk = async () => {
    const values = await form.validateFields();
    if (isEditing && !values.password) delete values.password;
    onSubmit(values);
  };

  return (
    <Modal
      title={isEditing ? 'Edit User' : 'Add New User'}
      open={open}
      onOk={handleOk}
      onCancel={onClose}
      confirmLoading={loading}
      okText={isEditing ? 'Save Changes' : 'Create User'}
      destroyOnClose
      width={520}
    >
      <Form form={form} layout="vertical" requiredMark={false} className="mt-4">
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="name"
              label="Full Name"
              rules={[
                { required: true, message: 'Name is required' },
                { min: 2, message: 'Name must be at least 2 characters' },
              ]}
            >
              <Input placeholder="John Doe" />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: 'Email is required' },
                { type: 'email', message: 'Enter a valid email' },
              ]}
            >
              <Input placeholder="john@example.com" />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              name="password"
              label={isEditing ? 'New Password (leave blank to keep unchanged)' : 'Password'}
              rules={
                isEditing
                  ? [{ min: 6, message: 'Password must be at least 6 characters' }]
                  : [
                      { required: true, message: 'Password is required' },
                      { min: 6, message: 'Password must be at least 6 characters' },
                    ]
              }
            >
              <Input.Password placeholder={isEditing ? 'Leave blank to keep unchanged' : 'Min 6 characters'} />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item name="phone" label="Phone (optional)">
              <Input placeholder="9876543210" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item name="role" label="Role" rules={[{ required: true }]}>
              <Select>
                <Option value="user">User</Option>
                <Option value="admin">Admin</Option>
              </Select>
            </Form.Item>
          </Col>

          {isEditing && (
            <Col span={24}>
              <Form.Item name="isActive" label="Account Status" valuePropName="checked">
                <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
              </Form.Item>
            </Col>
          )}
        </Row>
      </Form>
    </Modal>
  );
};

export default UserFormModal;
