export interface VehMakeModel {
    Name: string;
    PictureURL: string;
    Keyless: string;
    Contactless: string;
}

export interface VehType {
    VehicleCategory: string;
    DoorCount: string;
    Baggage: string;
}

export interface VehClass {
    Size: string;
}

export interface Vehicle {
    AirConditionInd: string;
    TransmissionType: string;
    VehMakeModel: VehMakeModel;
    VehType: VehType;
    VehClass: VehClass;
}

export interface RateDistance {
    Unlimited: string;
    DistUnitName: string;
    VehiclePeriodName: string;
}

export interface RateQualifier {
    RateCategory: string;
    RateQualifier: string;
    RatePeriod: string;
    VendorRateID: string;
}

export interface RentalRate {
    RateDistance: RateDistance;
    RateQualifier: RateQualifier;
}

export interface TaxAmount {
    Total: string;
    CurrencyCode: string;
    Percentage: string;
    Description: string;
}

export interface TaxAmounts {
    TaxAmount: TaxAmount;
}

export interface Calculation {
    UnitCharge: string;
    UnitName: string;
    Quantity: string;
}

export interface VehicleCharge {
    Amount: string;
    CurrencyCode: string;
    TaxInclusive: string;
    GuaranteedInd: string;
    Purpose: string;
    TaxAmounts: TaxAmounts;
    Calculation: Calculation;
}

export interface VehicleCharges {
    VehicleCharge: VehicleCharge;
}

export interface TotalCharge {
    RateTotalAmount: string;
    CurrencyCode: string;
}

export interface Equipment {
    Description: string;
    EquipType: string;
    vendorEquipID: string;
}

export interface Taxamount {
    Total: string;
    CurrencyCode: string;
    Percentage: string;
}

export interface Taxamounts {
    Taxamount: Taxamount;
}

export interface Calculation2 {
    UnitCharge: string;
    UnitName: string;
    Quantity: string;
    TaxInclusive: string;
}

export interface Charge {
    Taxamounts: Taxamounts;
    Calculation: Calculation2;
    Amount: string;
    TaxInclusive: string;
    IncludedRate: string;
    IncludedInEstTotalInd: string;
}

export interface PricedEquip2 {
    Equipment: Equipment;
    Charge: Charge;
}

export interface PricedEquip {
    PricedEquip: PricedEquip2;
}

export interface VehAvailCore {
    Status: string;
    VehID: string;
    Supplier_ID: string;
    Supplier_Name: string;
    Vehicle: Vehicle;
    RentalRate: RentalRate;
    VehicleCharges: VehicleCharges;
    TotalCharge: TotalCharge;
    PricedEquips: PricedEquip[];
}

export interface CarSearchItem {
    VehAvailCore: VehAvailCore;
}
