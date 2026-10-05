import { User } from '../../types/auth.types';
import { Role, PermissionCode } from '../../types/permission.types';
import { SystemSettings } from '../../types/common.types';
import { storageService } from '../storage/storage.service';

export class MockAdminService {
  // Users
  async getUsers(): Promise<User[]> {
    return storageService.getUsers();
  }

  async createUser(userData: Omit<User, 'id' | 'createdAt'>): Promise<User> {
    const users = storageService.getUsers();
    const newUser: User = {
      ...userData,
      id: `usr-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    storageService.saveUsers([newUser, ...users]);

    storageService.logActivity({
      userId: storageService.getAuthUser()?.id || 'sys',
      userName: storageService.getAuthUser()?.name || 'System',
      userRole: storageService.getAuthUser()?.role || 'SUPER_ADMIN',
      action: 'CREATE_USER',
      module: 'Administration',
      entityId: newUser.id,
      description: `Created new user '${newUser.name}' with role '${newUser.roleName || newUser.role}'`,
    });

    return newUser;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User> {
    const users = storageService.getUsers();
    const index = users.findIndex(u => u.id === id);
    if (index === -1) throw new Error('User not found');

    const updated = { ...users[index], ...updates };
    users[index] = updated;
    storageService.saveUsers(users);

    storageService.logActivity({
      userId: storageService.getAuthUser()?.id || 'sys',
      userName: storageService.getAuthUser()?.name || 'System',
      userRole: storageService.getAuthUser()?.role || 'SUPER_ADMIN',
      action: 'UPDATE_USER',
      module: 'Administration',
      entityId: id,
      description: `Updated user '${updated.name}' details`,
    });

    return updated;
  }

  async deleteUser(id: string): Promise<boolean> {
    const users = storageService.getUsers();
    const filtered = users.filter(u => u.id !== id);
    storageService.saveUsers(filtered);
    return true;
  }

  // Roles & Permissions
  async getRoles(): Promise<Role[]> {
    const roles = storageService.getRoles();
    const users = storageService.getUsers();

    // Enrich with current user counts
    return roles.map(r => ({
      ...r,
      userCount: users.filter(u => u.role === r.code).length,
    }));
  }

  async updateRolePermissions(roleId: string, permissions: PermissionCode[]): Promise<Role> {
    const roles = storageService.getRoles();
    const index = roles.findIndex(r => r.id === roleId);
    if (index === -1) throw new Error('Role not found');

    const updated: Role = {
      ...roles[index],
      permissions,
      updatedAt: new Date().toISOString(),
    };

    roles[index] = updated;
    storageService.saveRoles(roles);

    storageService.logActivity({
      userId: storageService.getAuthUser()?.id || 'sys',
      userName: storageService.getAuthUser()?.name || 'System',
      userRole: storageService.getAuthUser()?.role || 'SUPER_ADMIN',
      action: 'UPDATE_ROLE_PERMISSIONS',
      module: 'Administration',
      entityId: roleId,
      description: `Updated permissions matrix for role '${updated.name}'`,
    });

    return updated;
  }

  // Settings
  async getSettings(): Promise<SystemSettings> {
    return storageService.getSettings();
  }

  async updateSettings(settings: SystemSettings): Promise<SystemSettings> {
    storageService.saveSettings(settings);

    storageService.logActivity({
      userId: storageService.getAuthUser()?.id || 'sys',
      userName: storageService.getAuthUser()?.name || 'System',
      userRole: storageService.getAuthUser()?.role || 'SUPER_ADMIN',
      action: 'UPDATE_SETTINGS',
      module: 'Settings',
      description: `Updated global system settings (Agency: ${settings.agencyName})`,
    });

    return settings;
  }
}

export const mockAdminService = new MockAdminService();
