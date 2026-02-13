// Toast API Types - Comprehensive TypeScript definitions

export interface ToastConfig {
  apiKey: string;
  clientId: string;
  clientSecret: string;
  restaurantGuid?: string;
  environment?: 'production' | 'sandbox';
}

export interface ToastAuthToken {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
}

// Base pagination types
export interface PaginationParams {
  page?: number;
  pageSize?: number;
  lastModified?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  page?: number;
  pageSize?: number;
  hasMore?: boolean;
}

// Orders API Types
export interface Order {
  guid: string;
  entityType: string;
  externalId?: string;
  openedDate: string;
  modifiedDate: string;
  promisedDate?: string;
  channelGuid?: string;
  source: string;
  duration?: number;
  businessDate: number;
  numberOfGuests?: number;
  voidDate?: string;
  paidDate?: string;
  closedDate?: string;
  deletedDate?: string;
  deleted: boolean;
  checks: Check[];
  table?: Table;
  serviceArea?: ServiceArea;
  estimatedFulfillmentDate?: string;
  deliveryInfo?: DeliveryInfo;
  curbsidePickupInfo?: CurbsidePickupInfo;
  numberOfSelections?: number;
  numberOfModifiers?: number;
  voided: boolean;
  voidBusinessDate?: number;
  approvalStatus?: string;
  createdDevice?: Device;
  modifiedDevice?: Device;
  numberOfPeople?: number;
  source?: string;
  curbsidePickupInfo?: CurbsidePickupInfo;
  deliveryInfo?: DeliveryInfo;
  requiredPrepTime?: string;
}

export interface Check {
  guid: string;
  entityType: string;
  externalId?: string;
  openedDate: string;
  modifiedDate: string;
  deletedDate?: string;
  deleted: boolean;
  selections: Selection[];
  customer?: Customer;
  appliedDiscounts?: AppliedDiscount[];
  payments?: Payment[];
  amount: number;
  taxAmount: number;
  totalAmount: number;
  tabName?: string;
  paymentStatus?: string;
  appliedLoyaltyInfo?: AppliedLoyaltyInfo;
  voided: boolean;
  voidDate?: string;
  paidDate?: string;
  closedDate?: string;
  taxExempt: boolean;
  displayNumber?: string;
  createdDevice?: Device;
  modifiedDevice?: Device;
  appliedServiceCharges?: AppliedServiceCharge[];
}

export interface Selection {
  guid: string;
  itemGuid: string;
  itemGroupGuid?: string;
  externalId?: string;
  quantity: number;
  unitOfMeasure: string;
  preDiscountPrice: number;
  price: number;
  tax: number;
  voided: boolean;
  voidDate?: string;
  voidBusinessDate?: number;
  displayName: string;
  modifiers?: Modifier[];
  appliedDiscounts?: AppliedDiscount[];
  deferred: boolean;
  preModifier?: string;
  fulfillmentStatus?: string;
  salesCategory?: SalesCategory;
  createdDevice?: Device;
  modifiedDevice?: Device;
  itemType?: string;
  refund?: boolean;
  openPriceAmount?: number;
  diningOption?: DiningOption;
}

export interface Modifier {
  guid: string;
  modifierGuid: string;
  modifierGroupGuid?: string;
  quantity: number;
  unitOfMeasure: string;
  preDiscountPrice: number;
  price: number;
  displayName: string;
  optionGroupGuid?: string;
  voided: boolean;
}

export interface Payment {
  guid: string;
  entityType: string;
  externalId?: string;
  paymentDate: string;
  amount: number;
  tipAmount: number;
  amountTendered: number;
  cardType?: string;
  last4Digits?: string;
  paymentStatus: string;
  type: string;
  cardEntryMode?: string;
  otherPayment?: OtherPayment;
  refund?: Refund;
  house_account?: HouseAccount;
  voidInfo?: VoidInfo;
  paidDate?: string;
  refundStatus?: string;
  refundTransaction?: RefundTransaction;
  originalProcessingFee?: number;
  server?: Employee;
  cashDrawer?: CashDrawer;
}

export interface OtherPayment {
  guid: string;
  otherPaymentTypeGuid: string;
  otherPaymentTypeName: string;
}

export interface Refund {
  refundAmount: number;
  refundDate: string;
  refundStatus: string;
  tipRefundAmount: number;
}

export interface RefundTransaction {
  guid: string;
  refundDate: string;
  refundAmount: number;
}

export interface HouseAccount {
  guid: string;
  paymentGuid: string;
}

export interface VoidInfo {
  voidUser?: Employee;
  voidApprover?: Employee;
  voidDate: string;
  voidBusinessDate: number;
  voidReason?: string;
}

export interface AppliedDiscount {
  guid: string;
  discountGuid: string;
  name: string;
  amount: number;
  discountAmount: number;
  nonTaxDiscountAmount?: number;
  approver?: Employee;
  processingState?: string;
  discountType?: string;
  triggers?: DiscountTrigger[];
  loyaltyDetails?: LoyaltyDetails;
}

export interface DiscountTrigger {
  selection?: Selection;
  quantity?: number;
}

export interface LoyaltyDetails {
  vendor?: string;
  referenceId?: string;
}

export interface AppliedLoyaltyInfo {
  loyaltyIdentifier: string;
  vendor: string;
  accrualText?: string;
  accrualFamilyGuid?: string;
}

export interface AppliedServiceCharge {
  guid: string;
  serviceChargeGuid: string;
  name: string;
  amount: number;
  chargeAmount: number;
  gratuity: boolean;
  serviceChargeType?: string;
}

export interface Customer {
  guid?: string;
  entityType: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  company?: string;
  deliveryInfo?: DeliveryInfo;
}

export interface DeliveryInfo {
  address1?: string;
  address2?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  latitude?: number;
  longitude?: number;
  notes?: string;
  deliveryEmployee?: Employee;
  deliveredDate?: string;
}

export interface CurbsidePickupInfo {
  transportDescription?: string;
  transportColor?: string;
  notes?: string;
}

// Menu Types
export interface Menu {
  guid: string;
  entityType: string;
  name: string;
  visibility: string[];
  groups: MenuGroup[];
  modifiedDate?: string;
}

export interface MenuGroup {
  guid: string;
  entityType: string;
  name: string;
  items: MenuItem[];
  modifiedDate?: string;
}

export interface MenuItem {
  guid: string;
  entityType: string;
  name: string;
  description?: string;
  sku?: string;
  plu?: string;
  price: number;
  pricingStrategy?: string;
  pricingRules?: PricingRule[];
  calories?: string;
  visibility?: string[];
  modifierGroups?: ModifierGroup[];
  images?: MenuImage[];
  unitOfMeasure: string;
  modifiedDate?: string;
  itemTags?: string[];
  masterId?: string;
  outOfStock86?: boolean;
  inheritedOutOfStock86?: boolean;
}

export interface ModifierGroup {
  guid: string;
  entityType: string;
  name: string;
  minSelections?: number;
  maxSelections?: number;
  options: ModifierOption[];
  modifiedDate?: string;
}

export interface ModifierOption {
  guid: string;
  entityType: string;
  name: string;
  price: number;
  pricingStrategy?: string;
  modifiedDate?: string;
  unitOfMeasure?: string;
  displayMode?: string;
}

export interface PricingRule {
  guid: string;
  name: string;
  price: number;
  channel?: string;
  dayPart?: string;
  diningOption?: string;
}

export interface MenuImage {
  url: string;
  description?: string;
}

// Configuration Types
export interface Restaurant {
  guid: string;
  entityType: string;
  externalGroupRef?: string;
  name: string;
  description?: string;
  timeZone: string;
  closeoutHour: number;
  managementGroupGuid: string;
  prepStations?: PrepStation[];
  revenuecenters?: RevenueCenter[];
  tables?: Table[];
  diningOptions?: DiningOption[];
  serviceAreas?: ServiceArea[];
  deliveryInfo?: DeliverySettings;
  onlineOrderingInfo?: OnlineOrderingInfo;
  locationType?: string;
}

export interface RevenueCenter {
  guid: string;
  entityType: string;
  name: string;
  externalId?: string;
}

export interface Table {
  guid: string;
  entityType: string;
  name: string;
  serviceArea?: ServiceArea;
  capacity?: number;
}

export interface ServiceArea {
  guid: string;
  entityType: string;
  name: string;
}

export interface DiningOption {
  guid: string;
  entityType: string;
  name: string;
  behavior: string;
  curbside?: boolean;
}

export interface PrepStation {
  guid: string;
  entityType: string;
  name: string;
}

export interface DeliverySettings {
  enabled: boolean;
  radius?: number;
  minimumAmount?: number;
}

export interface OnlineOrderingInfo {
  enabled: boolean;
  schedules?: OrderingSchedule[];
}

export interface OrderingSchedule {
  guid: string;
  name: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
}

// Labor Types
export interface Employee {
  guid: string;
  entityType: string;
  externalId?: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  externalEmployeeId?: string;
  chosenName?: string;
  deletedDate?: string;
  deleted: boolean;
  disabled: boolean;
  createdDate?: string;
  modifiedDate?: string;
  jobReferences?: JobReference[];
  wageOverrides?: WageOverride[];
  v2EmployeeGuid?: string;
}

export interface JobReference {
  guid: string;
  entityType: string;
  externalId?: string;
  jobGuid: string;
  job?: Job;
}

export interface Job {
  guid: string;
  entityType: string;
  title: string;
  externalId?: string;
  defaultWage?: number;
  tipped: boolean;
}

export interface WageOverride {
  guid: string;
  jobGuid: string;
  wage: number;
}

export interface Shift {
  guid: string;
  entityType: string;
  createdDate: string;
  modifiedDate: string;
  deletedDate?: string;
  deleted: boolean;
  inDate: string;
  outDate?: string;
  breakTimeSeconds?: number;
  employeeReference?: EmployeeReference;
  jobReference?: JobReference;
  regularHoursWorked?: number;
  overtimeHoursWorked?: number;
  hourlyWage?: number;
  businessDate?: number;
  clockInLocation?: Location;
  clockOutLocation?: Location;
}

export interface EmployeeReference {
  guid: string;
  entityType: string;
  externalId?: string;
  employeeGuid: string;
}

export interface TimeEntry {
  guid: string;
  entityType: string;
  inDate: string;
  outDate?: string;
  breakTimeSeconds?: number;
  shiftGuid?: string;
  employee?: Employee;
  jobReference?: JobReference;
  deleted: boolean;
  businessDate?: number;
  regularHours?: number;
  overtimeHours?: number;
  hourlyWage?: number;
}

export interface Location {
  latitude: number;
  longitude: number;
}

// Cash Management Types
export interface CashDrawer {
  guid: string;
  entityType: string;
  name: string;
  date: number;
  employee?: Employee;
}

export interface CashEntry {
  guid: string;
  entityType: string;
  date: string;
  amount: number;
  type: string;
  undoGuid?: string;
  createdByDevice?: Device;
  employee?: Employee;
  cashDrawer?: CashDrawer;
  reason?: string;
  comment?: string;
  deleted: boolean;
}

export interface CashDeposit {
  guid: string;
  date: string;
  amount: number;
  employee?: Employee;
  undoGuid?: string;
}

// Stock/Inventory Types
export interface StockItem {
  guid: string;
  itemGuid: string;
  locationGuid: string;
  quantity?: number;
  outOfStock: boolean;
  infiniteQuantity: boolean;
}

// Device Types
export interface Device {
  id: string;
}

// Sales Category
export interface SalesCategory {
  guid: string;
  name: string;
}

// Analytics/Reports Types
export interface SalesReport {
  businessDate: number;
  restaurantGuid: string;
  totalSales: number;
  netSales: number;
  grossSales: number;
  taxAmount: number;
  tipAmount: number;
  discountAmount: number;
  voidAmount: number;
  refundAmount: number;
  guestCount: number;
  checkCount: number;
  salesByDiningOption?: SalesByDiningOption[];
  salesByRevenueCenter?: SalesByRevenueCenter[];
  paymentSummary?: PaymentSummary[];
}

export interface SalesByDiningOption {
  diningOptionGuid: string;
  diningOptionName: string;
  netSales: number;
  guestCount: number;
  checkCount: number;
}

export interface SalesByRevenueCenter {
  revenueCenterGuid: string;
  revenueCenterName: string;
  netSales: number;
  guestCount: number;
  checkCount: number;
}

export interface PaymentSummary {
  paymentType: string;
  amount: number;
  tipAmount: number;
  count: number;
}

export interface LaborReport {
  businessDate: number;
  restaurantGuid: string;
  totalHours: number;
  regularHours: number;
  overtimeHours: number;
  totalWages: number;
  laborPercentage: number;
  employeeCount: number;
}

export interface MenuItemSales {
  itemGuid: string;
  itemName: string;
  quantity: number;
  netSales: number;
  grossSales: number;
}

// Kitchen Types
export interface KitchPrepStation {
  guid: string;
  name: string;
  targetPrepTime: number;
  orders?: KitchenOrder[];
}

export interface KitchenOrder {
  orderGuid: string;
  fireDate?: string;
  completedDate?: string;
  selections: KitchenSelection[];
}

export interface KitchenSelection {
  selectionGuid: string;
  displayName: string;
  quantity: number;
  modifiers?: string[];
  specialInstructions?: string;
}

// Partner/Location Access Types
export interface PartnerAccess {
  restaurantGuid: string;
  restaurantName: string;
  managementGroupGuid: string;
  locationName?: string;
  timeZone?: string;
}

// Availability Types
export interface RestaurantAvailability {
  restaurantGuid: string;
  acceptingOrders: boolean;
  temporarilyClosed: boolean;
  closedUntil?: string;
  nextOpenTime?: string;
  currentCapacity?: number;
  maxCapacity?: number;
}

// Packaging Types
export interface PackagingPreference {
  guid: string;
  name: string;
  itemGuid?: string;
  defaultPackaging?: boolean;
}

// Error Types
export interface ToastError {
  message: string;
  code?: string;
  status?: number;
  details?: unknown;
}
