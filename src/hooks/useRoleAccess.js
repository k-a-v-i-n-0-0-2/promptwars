import { useState, useCallback } from 'react';

export const ROLES = {
  CEO: {
    id: 'ceo',
    label: 'CEO / Executive',
    accessLevel: 5,
    modules: ['overview', 'analytics', 'executive', 'risk'],
  },
  OPS: {
    id: 'ops',
    label: 'Operations Manager',
    accessLevel: 4,
    modules: ['overview', 'analytics', 'crowd', 'transport', 'food', 'volunteer', 'maintenance', 'weather', 'risk'],
  },
  SECURITY: {
    id: 'security',
    label: 'Security Chief',
    accessLevel: 4,
    modules: ['overview', 'security', 'emergency', 'crowd', 'risk'],
  },
  MEDICAL: {
    id: 'medical',
    label: 'Medical Director',
    accessLevel: 3,
    modules: ['overview', 'medical', 'emergency', 'accessibility'],
  },
  TRANSPORT: {
    id: 'transport',
    label: 'Transport Manager',
    accessLevel: 2,
    modules: ['overview', 'transport', 'crowd', 'weather'],
  },
  FOOD: {
    id: 'food',
    label: 'Food Operations',
    accessLevel: 2,
    modules: ['overview', 'food', 'vendor', 'analytics'],
  },
  MAINTENANCE: {
    id: 'maintenance',
    label: 'Maintenance Team',
    accessLevel: 2,
    modules: ['overview', 'maintenance', 'power'],
  },
  VOLUNTEER: {
    id: 'volunteer',
    label: 'Volunteer Coordinator',
    accessLevel: 2,
    modules: ['overview', 'volunteer', 'crowd'],
  },
  ADMIN: {
    id: 'admin',
    label: 'System Admin',
    accessLevel: 5,
    modules: ['*'],
  }
};

/**
 * Hook to manage role-based access control.
 * Filters visible modules based on the active role.
 *
 * @param {string} initialRole - The initial role ID
 * @returns {Object} Role state and helpers
 */
export function useRoleAccess(initialRole = 'admin') {
  const [activeRole, setActiveRole] = useState(initialRole);

  const setRole = useCallback((roleId) => {
    if (Object.values(ROLES).some(r => r.id === roleId)) {
      setActiveRole(roleId);
    }
  }, []);

  const hasAccessToModule = useCallback((moduleId) => {
    const roleConfig = Object.values(ROLES).find(r => r.id === activeRole);
    if (!roleConfig) return false;
    if (roleConfig.modules.includes('*')) return true;
    return roleConfig.modules.includes(moduleId);
  }, [activeRole]);

  const currentRole = Object.values(ROLES).find(r => r.id === activeRole) || ROLES.ADMIN;

  return { activeRole, setRole, hasAccessToModule, currentRole, ROLES };
}

export default useRoleAccess;
