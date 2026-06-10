export const ROLES = {
  ADMIN: 'admin',
  USER: 'user',
};

const PERMISSIONS = {
  [ROLES.ADMIN]: ['create', 'edit', 'delete', 'change_status', 'view_admin_panel', 'view_details'],
  [ROLES.USER]: ['create', 'view_details'],
};

export const hasPermission = (role, action) => {
  if (!role) return false;
  const rolePermissions = PERMISSIONS[role] || [];
  return rolePermissions.includes(action);
};
