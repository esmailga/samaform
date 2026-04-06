import { LucideIcon } from 'lucide-react';

export type ProjectType = 'apartement' | 'villa' | 'shop' | 'restaurant' | 'office' | 'beautySalon';
export type BudgetTier = 'economy' | 'standard' | 'premium' | 'luxury';
export type AreaTier = 'small' | 'medium' | 'large' | 'veryLarge';
export type TimeLine = 'urgent' | 'normal' | 'relaxed' | 'flexible';
export type DesignType = 'modern' | 'arabic' | 'classic' | 'contemporary';
export type PriorityType = 'smartHome' | 'ecoFriendly' | 'storageSolution' | 'naturalLight';
export type OutdoorType = 'landscaping' | 'poolArea' | 'terrace' | 'parking';
export type ArchitecturalStyle = 'modeCont' | 'mediterranean' | 'islamic' | 'palatial';
export type BalconyAns = 'Yes' | 'No';
export type RoomCount = '1 - 2' | '3 - 4' | '5+';
export type FloorsCount = 'oneFloor' | 'twoFloor' | 'threeFloor';
export type ShopType = 'fashion' | 'electronics' | 'grocery' | 'otherShop';
export type FeaturesType = 'displayWindows' | 'storageRoom' | 'fittingRoom' | 'cashierCounter';
export type Atmoshpere = 'premiumL' | 'trendy' | 'welcoming' | 'minimal';
export type CuisineType = 'middleEastern' | 'international' | 'fastFood' | 'fineDining';
export type SeatingCapacity = 'thirtySeat' | 'thirtySixSeat' | 'sixtyHunSeat' | 'hundredSeat';
export type SpaceWanted = 'outdoorSeating' | 'privateRooms' | 'barCounter' | 'openKitchen';
export type EmployeeCount = 'tenEmployee' | 'thirtyEmployee' | 'fiftyEmployee' | 'fiftyMoreEmployee';
export type WorkEnvironment = 'openPlan' | 'privateOffices' | 'hybridMixed' | 'coWorkingStyle';
export type AmenitiesWanted = 'meetingRooms' | 'kitchenPantry' | 'receptionArea' | 'loungeArea';
export type SalonServices = 'hairStyling' | 'nailCare' | 'skinCare' | 'spaMassage';
export type StationsCount = 'threeStations' | 'sixStations' | 'sevenStations' | 'tenStations';
export type Ambiance = 'luxuryHigh' | 'modernTrendy' | 'zenRelaxing' | 'chicBoutique';

export interface FormData {
  // Section 1: Basic Info
  name: string;
  email: string;
  phone: string;
  city: string;
  // Section 2: Project Type
  projectType: ProjectType | '';
  // Section 3: Project Details
  budget: string;
  timeline: TimeLine | '';
  designType: DesignType | '';
  priorityType: PriorityType | '';
  outdoorType: OutdoorType | '';
  architecturalStyle: ArchitecturalStyle | '';
  budgetTier: BudgetTier | '';
  budgetExact: string;
  areaTier: AreaTier | '';
  areaExact: string;
  balconyAns: BalconyAns | '';
  roomCount: RoomCount | '';
  projectDetails: string;
  apartmentDetails: string;
  villaDetails: string;
  floorsCount: FloorsCount | '';
  shopType: ShopType | '';
  atmoshpere: Atmoshpere | '';
  shopDetails: string;
  cuisineType: CuisineType | '';
  spaceDetails: string;
  seatingCapacity: SeatingCapacity | '';
  spaceWanted: SpaceWanted | '';
  employeeCount: EmployeeCount | '';
  workEnvironment: WorkEnvironment | '';
  amenitiesWanted: AmenitiesWanted | '';
  officeDetails: string;
  salonServices: SalonServices | '';
  stationsCount: StationsCount | '';
  ambiance: Ambiance | '';
  salonDetails: string;
  featuresType: FeaturesType | '';
  roomCountExact: string;
  // Section 4: Project Specifics
  specifics: Record<string, string>;
  // Section 5: Images
  inspirationImages: File[];
  currentSpaceImages: File[];
}

const INITIAL_DATA: FormData = {
  name: '',
  email: '',
  phone: '',
  city: '',
  projectType: '',
  budget: '',
  timeline: '',
  designType: '',
  specifics: {},
  inspirationImages: [],
  currentSpaceImages: [],
  budgetTier: '',
  budgetExact: '',
  areaTier: '',
  atmoshpere: '',
  areaExact: '',
  projectDetails: '',
  apartmentDetails: '',
  balconyAns: '',
  villaDetails: '',
  floorsCount: '',
  shopDetails: '',
  spaceDetails: '',
  officeDetails: '',
  salonDetails: '',
  priorityType: '',
  outdoorType: '',
  architecturalStyle: '',
  roomCount: '',
  employeeCount: '',
  shopType: '',
  featuresType: '',
  cuisineType: '',
  seatingCapacity: '',
  spaceWanted: '',
  workEnvironment: '',
  amenitiesWanted: '',
  salonServices: '',
  stationsCount: '',
  ambiance: '',
  roomCountExact: '',
};

export interface StepProps {
  formData: FormData;
  updateFields: (fields: Partial<FormData>) => void;
  updateSpecifics?: (key: string, value: string) => void;
  
}

