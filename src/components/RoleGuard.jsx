import { useAuth } from '../context/AuthContext';
import { hasPermission } from '../utils/permissions';

export default function RoleGuard({ action, children, fallback = null }) {
  const { user } = useAuth();
  
  if (!user || !hasPermission(user.role, action)) {
    return fallback;
  }
  
  return children;
}
