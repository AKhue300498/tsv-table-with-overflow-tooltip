export interface Employee {
  id: number;
  name: string;
  email: string;
  department: string;
  position: string;
  phone: string;
  address: string;
  status: 'Active' | 'Inactive' | 'Pending' | 'On Leave';
  salary: number;
  startDate: Date;
  notes: string;
  avatar?: string;
}
