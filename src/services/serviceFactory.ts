import { mockCustomerService } from './mock/mockCustomer.service';
import { mockPolicyService } from './mock/mockPolicy.service';
import { mockPaymentService } from './mock/mockPayment.service';
import { mockCompanyService } from './mock/mockCompany.service';
import { mockAdminService } from './mock/mockAdmin.service';

/**
 * Service Factory Abstraction
 * Currently provides mock implementation layer backed by localStorage.
 * When integrating with Spring Boot REST API, replace returns below with ApiService instances.
 */
export const services = {
  customer: mockCustomerService,
  policy: mockPolicyService,
  payment: mockPaymentService,
  company: mockCompanyService,
  admin: mockAdminService,
};
