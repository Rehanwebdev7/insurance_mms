import { Customer } from '../../types/customer.types';
import { storageService } from '../storage/storage.service';

export interface ICustomerService {
  getAll(): Promise<Customer[]>;
  getById(id: string): Promise<Customer | null>;
  create(customer: Omit<Customer, 'id' | 'code' | 'createdAt' | 'updatedAt'>): Promise<Customer>;
  update(id: string, customer: Partial<Customer>): Promise<Customer>;
  delete(id: string): Promise<boolean>;
}

export class MockCustomerService implements ICustomerService {
  async getAll(): Promise<Customer[]> {
    const customers = storageService.getCustomers();
    const policies = storageService.getPolicies();

    // Enrich customers with financial rollups
    return customers.map(cust => {
      const custPolicies = policies.filter(p => p.customerId === cust.id);
      const totalPremiumPaid = custPolicies.reduce((acc, p) => acc + p.paidAmount, 0);
      const totalPendingAmount = custPolicies.reduce((acc, p) => acc + p.pendingAmount, 0);
      return {
        ...cust,
        totalPolicies: custPolicies.length,
        totalPremiumPaid,
        totalPendingAmount,
      };
    });
  }

  async getById(id: string): Promise<Customer | null> {
    const customers = await this.getAll();
    return customers.find(c => c.id === id) || null;
  }

  async create(customerData: Omit<Customer, 'id' | 'code' | 'createdAt' | 'updatedAt'>): Promise<Customer> {
    const customers = storageService.getCustomers();
    const newId = `cust-${Date.now()}`;
    const newCode = `CUST-${1000 + customers.length + 1}`;
    
    const newCustomer: Customer = {
      ...customerData,
      id: newId,
      code: newCode,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    storageService.saveCustomers([newCustomer, ...customers]);
    
    storageService.logActivity({
      userId: storageService.getAuthUser()?.id || 'sys',
      userName: storageService.getAuthUser()?.name || 'System',
      userRole: storageService.getAuthUser()?.role || 'ADMIN',
      action: 'CREATE_CUSTOMER',
      module: 'Customers',
      entityId: newId,
      description: `Created new customer '${newCustomer.fullName}' (${newCode})`,
    });

    return newCustomer;
  }

  async update(id: string, updates: Partial<Customer>): Promise<Customer> {
    const customers = storageService.getCustomers();
    const index = customers.findIndex(c => c.id === id);
    if (index === -1) throw new Error('Customer not found');

    const updatedCustomer: Customer = {
      ...customers[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    customers[index] = updatedCustomer;
    storageService.saveCustomers(customers);

    storageService.logActivity({
      userId: storageService.getAuthUser()?.id || 'sys',
      userName: storageService.getAuthUser()?.name || 'System',
      userRole: storageService.getAuthUser()?.role || 'ADMIN',
      action: 'EDIT_CUSTOMER',
      module: 'Customers',
      entityId: id,
      description: `Updated customer details for '${updatedCustomer.fullName}'`,
    });

    return updatedCustomer;
  }

  async delete(id: string): Promise<boolean> {
    const customers = storageService.getCustomers();
    const target = customers.find(c => c.id === id);
    if (!target) return false;

    const filtered = customers.filter(c => c.id !== id);
    storageService.saveCustomers(filtered);

    storageService.logActivity({
      userId: storageService.getAuthUser()?.id || 'sys',
      userName: storageService.getAuthUser()?.name || 'System',
      userRole: storageService.getAuthUser()?.role || 'ADMIN',
      action: 'DELETE_CUSTOMER',
      module: 'Customers',
      entityId: id,
      description: `Deleted customer '${target.fullName}'`,
    });

    return true;
  }
}

export const mockCustomerService = new MockCustomerService();
