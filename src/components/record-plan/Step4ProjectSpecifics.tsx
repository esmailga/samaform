import { motion } from 'motion/react';
import { useLanguage } from '../../context/LanguageContext';
import { StepProps, RoomCount, DesignType, BalconyAns, ShopType, Atmoshpere, CuisineType, SeatingCapacity, SpaceWanted, EmployeeCount, WorkEnvironment, AmenitiesWanted, SalonServices, StationsCount, Ambiance, ArchitecturalStyle, FeaturesType } from './types';

export default function Step4ProjectSpecifics({ formData, updateFields, updateSpecifics }: StepProps) {
  const { t } = useLanguage();

  const roomCount = [
    { id: '1', label: t('roomc') },
    { id: '2', label: t('roomcc') },
    { id: '3', label: t('roomccc') }
  ];

  const designType = [
    { id: 'modern', label: t('modern') },
    { id: 'arabic', label: t('arabic') },
    { id: 'classic', label: t('classic') },
    { id: 'contemporary', label: t('contemporary') }
  ];

  const priorityType = [
    { id: 'smartHome', label: t('smartHome') },
    { id: 'ecoFriendly', label: t('ecoFriendly') },
    { id: 'storageSolution', label: t('storageSolution') },
    { id: 'naturalLight', label: t('naturalLight') }
  ];

  const balconyAns = [
    { id: 'yes', label: t('yes') },
    { id: 'no', label: t('no') }
  ];

  const outdoorType = [
    { id: 'landscaping', label: t('landscaping') },
    { id: 'poolArea', label: t('poolArea') },
    { id: 'terrace', label: t('terrace') },
    { id: 'parking', label: t('parking') }
  ];

  const architecturalStyle = [
    { id: 'modeCont', label: t('modeCont') },
    { id: 'mediterranean', label: t('mediterranean') },
    { id: 'islamic', label: t('islamic') },
    { id: 'palatial', label: t('palatial') }
  ];

  const shopType = [
    { id: 'fashion', label: t('fashion') },
    { id: 'electronics', label: t('electronics') },
    { id: 'grocery', label: t('grocery') },
    { id: 'otherShop', label: t('otherShop') }
  ];

  const featuresType = [
    { id: 'displayWindows', label: t('displayWindows') },
    { id: 'storageRoom', label: t('storageRoom') },
    { id: 'fittingRoom', label: t('fittingRoom') },
    { id: 'cashierCounter', label: t('cashierCounter') }
  ];

  const atmoshpere = [
    { id: 'premiumL', label: t('premiumL') },
    { id: 'trendy', label: t('trendy') },
    { id: 'welcoming', label: t('welcoming') },
    { id: 'minimal', label: t('minimal') }
  ];

  const cuisineType = [
    { id: 'middleEastern', label: t('middleEastern') },
    { id: 'international', label: t('international') },
    { id: 'fastFood', label: t('fastFood') },
    { id: 'fineDining', label: t('fineDining') }
  ];

  const seatingCapacity = [
    { id: 'thirtySeat', label: t('thirtySeat') },
    { id: 'thirtySixSeat', label: t('thirtySixSeat') },
    { id: 'sixtyHunSeat', label: t('sixtyHunSeat') },
    { id: 'hundredSeat', label: t('hundredSeat') }
  ];

  const spaceWanted = [
    { id: 'outdoorSeating', label: t('outdoorSeating') },
    { id: 'privateRooms', label: t('privateRooms') },
    { id: 'barCounter', label: t('barCounter') },
    { id: 'openKitchen', label: t('openKitchen') }
  ];

  const employeeCount = [
    { id: 'tenEmployee', label: t('tenEmployee') },
    { id: 'thirtyEmployee', label: t('thirtyEmployee') },
    { id: 'fiftyEmployee', label: t('fiftyEmployee') },
    { id: 'fiftyMoreEmployee', label: t('fiftyMoreEmployee') }
  ];

  const workEnvironment = [
    { id: 'openPlan', label: t('openPlan') },
    { id: 'privateOffices', label: t('privateOffices') },
    { id: 'hybridMixed', label: t('hybridMixed') },
    { id: 'coWorkingStyle', label: t('coWorkingStyle') }
  ];

  const amenitiesWanted = [
    { id: 'meetingRooms', label: t('meetingRooms') },
    { id: 'kitchenPantry', label: t('kitchenPantry') },
    { id: 'receptionArea', label: t('receptionArea') },
    { id: 'loungeArea', label: t('loungeArea') }
  ];

  const salonServices = [
    { id: 'hairStyling', label: t('hairStyling') },
    { id: 'nailCare', label: t('nailCare') },
    { id: 'skinCare', label: t('skinCare') },
    { id: 'spaMassage', label: t('spaMassage') }
  ];

  const stationsCount = [
    { id: 'threeStations', label: t('threeStations') },
    { id: 'sixStations', label: t('sixStations') },
    { id: 'sevenStations', label: t('sevenStations') },
    { id: 'tenStations', label: t('tenStations') }
  ];

  const ambiance = [
    { id: 'luxuryHigh', label: t('luxuryHigh') },
    { id: 'modernTrendy', label: t('modernTrendy') },
    { id: 'zenRelaxing', label: t('zenRelaxing') },
    { id: 'chicBoutique', label: t('chicBoutique') }
  ];

  return (
    <motion.div 
      key="step4"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <h2 className="text-white text-lg uppercase tracking-widest mb-2">{t('stepFour')}</h2>
        <p className="text-4xl font-serif text-main-text">
          {t('stepFourDesc', { type: t(formData.projectType as any) })}
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
        {formData.projectType === 'apartement' && (
          <>
            <div className="md:col-span-2">
              <label className="block text-white text-sm uppercase tracking-widest mt-6 mb-6 px-1">{t('roomsCount')}</label>
              <div className="flex flex-wrap gap-2 md:gap-4">
                {roomCount.map((num) => (
                  <button
                    key={num.id}
                    type="button"
                    onClick={() => updateFields({roomCount: num.id as RoomCount})}
                    className={`flex-1 py-3 rounded-xl border transition-all ${
                      formData.roomCount === num.id 
                        ? 'bg-main-text border-main-text text-header' 
                        : 'bg-header/30 border-main-text/20 text-white hover:border-main-text/60'
                    }`}
                  >
                    <h3 className="font-medium text-md">{num.label}</h3>
                  </button>
                ))}
              </div>
            </div>
            <div className="md:col-span-2">
              <label className="block text-white text-sm uppercase tracking-widest mt-6 mb-6 px-1">{t('interiorDesign')}</label>
              <div className="grid grid-cols-2 md:grid-cols-2 gap-3">
                {designType.map((design) => (
                  <button
                    key={design.id}
                    type="button"
                    onClick={() => updateFields({designType: design.id as DesignType})}
                    className={`p-4 text-lg text-center rounded-xl border transition-all ${
                      formData.designType === design.id 
                        ? 'bg-main-text border-main-text text-header' 
                        : 'bg-header/30 border-main-text/20 text-white hover:border-main-text/60'
                    }`}
                  >
                    <h3 className="font-medium text-md">{design.label}</h3>
                  </button>
                ))}
              </div>
            </div>
            <div className="md:col-span-2">
              <label className="block text-white text-sm uppercase tracking-widest mb-6 mt-6 px-1">{t('priorities')}</label>
              <div className="grid grid-cols-2 md:grid-cols-2 gap-3">
                {priorityType.map((priority) => (
                  <button
                    key={priority.id}
                    type="button"
                    onClick={() => {
                      const currentPriorities = (formData.priorityType as unknown as string[]) || [];
                      const isSelected = currentPriorities.includes(priority.id);
                      const newPriorities = isSelected
                        ? currentPriorities.filter((id) => id !== priority.id) 
                        : [...currentPriorities, priority.id];
                      updateFields({ priorityType: newPriorities as any });
                    }}
                    className={`p-4 text-lg text-center rounded-xl border transition-all ${
                      ((formData.priorityType as unknown as string[]) || []).includes(priority.id)
                        ? 'bg-main-text border-main-text text-header' 
                        : 'bg-header/30 border-main-text/20 text-white hover:border-main-text/60'
                    }`}
                  >
                    <h3 className="font-medium text-md">{priority.label}</h3>
                  </button>
                ))}
              </div>
            </div>
            <div className="md:col-span-2">
              <label className="block text-white text-sm uppercase tracking-widest mb-6 mt-6 px-1">{t('balcony')}</label>
              <div className="flex gap-4">
                {balconyAns.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => updateFields({balconyAns: opt.id as BalconyAns})}
                    className={`flex-1 py-3 rounded-xl border transition-all ${
                      formData.balconyAns === opt.id
                        ? 'bg-main-text border-main-text text-header' 
                        : 'bg-header/30 border-main-text/20 text-white hover:border-main-text/60'
                    }`}
                  >
                    <h3 className="font-medium text-md">{opt.label}</h3>
                  </button>
                ))}
              </div>
            </div>
            <div className="md:col-span-2">
              <label className="block text-white text-md uppercase tracking-widest mb-6 mt-6 px-1 flex items-center gap-2">
                {t('apartmentDetails') || 'Apartment Details'} 
              </label>
              <textarea
                rows={4}
                placeholder={t('apartmentDetailsPlaceholder') || 'Tell us more about your dream apartment...'}
                value={formData.apartmentDetails || ''}
                onChange={(e) => updateFields({ apartmentDetails: e.target.value })}
                className="w-full bg-header/50 border border-main-text/10 text-white rounded-xl p-4 focus:outline-none focus:border-main-text transition-colors resize-none"
              />
            </div>
          </>
        )}
        {formData.projectType === 'villa' && (
          <>
            <div className="md:col-span-2">
              <label className="block text-white text-sm uppercase tracking-widest mt-6 mb-6 px-1">{t('floorsCount')}</label>
              <div className="flex flex-wrap gap-2 md:gap-4">
                {['1', '2', '3+'].map(num => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => updateSpecifics?.('floors', num)}
                    className={`flex-1 py-3 rounded-xl border transition-all ${
                      formData.specifics.floors === num 
                        ? 'bg-main-text border-main-text text-header' 
                        : 'bg-header/30 border-main-text/10 text-white hover:border-main-text/30'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>
            <div className="md:col-span-2">
              <label className="block text-white text-sm uppercase tracking-widest mt-6 mb-6 px-1">{t('outdoorArea')}</label>
              <div className="grid grid-cols-2 md:grid-cols-2 gap-3">
                {outdoorType.map((outdoor) => (
                  <button
                    key={outdoor.id}
                    type="button"
                    onClick={() => {
                      const currentOutdoor = (formData.outdoorType as unknown as string[]) || [];
                      const isSelected = currentOutdoor.includes(outdoor.id);
                      const newOutdoor = isSelected
                        ? currentOutdoor.filter((id) => id !== outdoor.id) 
                        : [...currentOutdoor, outdoor.id];
                      updateFields({ outdoorType: newOutdoor as any });
                    }}
                    className={`p-4 text-lg text-center rounded-xl border transition-all ${
                      ((formData.outdoorType as unknown as string[]) || []).includes(outdoor.id)
                        ? 'bg-main-text border-main-text text-header' 
                        : 'bg-header/30 border-main-text/10 text-white hover:border-main-text/30'
                    }`}
                  >
                    <h3 className="font-medium text-md">{outdoor.label}</h3>
                  </button>
                ))}
              </div>
            </div>
            <div className="md:col-span-2">
              <label className="block text-white text-sm uppercase tracking-widest mt-6 mb-6 px-1">{t('architectural')}</label>
              <div className="grid grid-cols-2 md:grid-cols-2 gap-3">
                {architecturalStyle.map((style) => (
                  <button
                    key={style.id}
                    type="button"
                    onClick={() => updateFields({architecturalStyle: style.id as ArchitecturalStyle})}
                    className={`p-4 text-lg text-center rounded-xl border transition-all ${
                      formData.architecturalStyle === style.id 
                        ? 'bg-main-text border-main-text text-header' 
                        : 'bg-header/30 border-main-text/10 text-white hover:border-main-text/30'
                    }`}
                  >
                    <h3 className="font-medium text-md">{style.label}</h3>
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-3">
              <label className="block text-white text-md uppercase tracking-widest mb-6 mt-6 px-1 flex items-center gap-2">
                {t('villaDetails') || 'House Details'} 
              </label>
              <textarea
                rows={4}
                placeholder={t('villaDetailsPlaceholder') || 'Tell us more about your dream home...'}
                value={formData.villaDetails || ''}
                onChange={(e) => updateFields({ villaDetails: e.target.value })}
                className="w-full bg-header/30 border border-main-text/10 text-white rounded-xl p-4 focus:outline-none focus:border-main-text transition-colors resize-none"
              />
            </div>               
          </>
        )}
        {formData.projectType === 'shop' && (
          <>
            <div className="md:col-span-2">
              <label className="block text-white text-sm uppercase tracking-widest mt-6 mb-6 px-1">{t('businessType')}</label>
              <div className="grid grid-cols-2 md:grid-cols-2 gap-3">
                {shopType.map((shop) => (
                  <button
                    key={shop.id}
                    type="button"
                    onClick={() => updateFields({shopType: shop.id as ShopType})}
                    className={`flex-1 text-lg py-3 rounded-xl border transition-all ${
                      formData.shopType === shop.id 
                        ? 'bg-main-text border-main-text text-header' 
                        : 'bg-header/30 border-main-text/20 text-white hover:border-main-text/60'
                    }`}
                  >
                    <h3 className="font-medium text-md">{shop.label}</h3>
                  </button>
                ))}
              </div>
            </div>
            <div className="md:col-span-2">
              <label className="block text-white text-sm uppercase tracking-widest mb-6 mt-6 px-1">{t('features')}</label>
              <div className="grid grid-cols-2 md:grid-cols-2 gap-3">
                {featuresType.map((features) => (
                  <button
                    key={features.id}
                    type="button"
                    onClick={() => {
                      const currentFeatures = (formData.featuresType as unknown as string[]) || [];
                      const isSelected = currentFeatures.includes(features.id);
                      const newFeatures = isSelected
                        ? currentFeatures.filter((id) => id !== features.id) 
                        : [...currentFeatures, features.id];
                      updateFields({ featuresType: newFeatures as any });
                    }}
                    className={`p-4 text-lg text-center rounded-xl border transition-all ${
                      ((formData.featuresType as unknown as string[]) || []).includes(features.id)
                        ? 'bg-main-text border-main-text text-header' 
                        : 'bg-header/30 border-main-text/20 text-white hover:border-main-text/60'
                    }`}
                  >
                    <h3 className="font-medium text-md">{features.label}</h3>
                  </button>
                ))}
              </div>
            </div>
            <div className="md:col-span-2">
              <label className="block text-white text-sm uppercase tracking-widest mt-6 mb-6 px-1">{t('atmosphere')}</label>
              <div className="grid grid-cols-2 md:grid-cols-2 gap-3">
                {atmoshpere.map((atom) => (
                  <button
                    key={atom.id}
                    type="button"
                    onClick={() => updateFields({atmoshpere: atom.id as Atmoshpere})}
                    className={`flex-1 text-lg py-3 rounded-xl border transition-all ${
                      formData.atmoshpere === atom.id 
                        ? 'bg-main-text border-main-text text-header' 
                        : 'bg-header/30 border-main-text/20 text-white hover:border-main-text/60'
                    }`}
                  >
                    <h3 className="font-medium text-md">{atom.label}</h3>
                  </button>
                ))}
              </div>
            </div>
            <div className="md:col-span-2">
              <label className="block text-white text-md uppercase tracking-widest mb-6 mt-6 px-1 flex items-center gap-2">
                {t('shopDetails') || 'Shop Details'} 
              </label>
              <textarea
                rows={4}
                placeholder={t('shopDetailsPlaceholder') || 'Tell us more about your dream shop...'}
                value={formData.shopDetails || ''}
                onChange={(e) => updateFields({ shopDetails: e.target.value })}
                className="w-full bg-header/50 border border-main-text/10 text-white rounded-xl p-4 focus:outline-none focus:border-main-text transition-colors resize-none"
              />
            </div>
          </>
        )}
        {formData.projectType === 'restaurant' && (
          <>
            <div className="md:col-span-2">
              <label className="block text-white text-sm uppercase tracking-widest mt-6 mb-6 px-1">{t('cuisineType')}</label>
              <div className="grid grid-cols-2 md:grid-cols-2 gap-3">
                {cuisineType.map((cuisine) => (
                  <button
                    key={cuisine.id}
                    type="button"
                    onClick={() => updateFields({cuisineType: cuisine.id as CuisineType})}
                    className={`flex-1 text-lg py-3 rounded-xl border transition-all ${
                      formData.cuisineType === cuisine.id 
                        ? 'bg-main-text border-main-text text-header' 
                        : 'bg-header/30 border-main-text/20 text-white hover:border-main-text/60'
                    }`}
                  >
                    <h3 className="font-medium text-md">{cuisine.label}</h3>
                  </button>
                ))}
              </div>
            </div>
            <div className="md:col-span-2">
              <label className="block text-white text-sm uppercase tracking-widest mt-6 mb-6 px-1">{t('seatingCapacity')}</label>
              <div className="grid grid-cols-2 md:grid-cols-2 gap-3">
                {seatingCapacity.map((seating) => (
                  <button
                    key={seating.id}
                    type="button"
                    onClick={() => updateFields({seatingCapacity: seating.id as SeatingCapacity})}
                    className={`flex-1 text-lg py-3 rounded-xl border transition-all ${
                      formData.seatingCapacity === seating.id 
                        ? 'bg-main-text border-main-text text-header' 
                        : 'bg-header/30 border-main-text/20 text-white hover:border-main-text/60'
                    }`}
                  >
                    <h3 className="font-medium text-md">{seating.label}</h3>
                  </button>
                ))}
              </div>
            </div>
            <div className="md:col-span-2">
              <label className="block text-white text-sm uppercase tracking-widest mb-6 mt-6 px-1">{t('spaceWanted')}</label>
              <div className="grid grid-cols-2 md:grid-cols-2 gap-3">
                {spaceWanted.map((space) => (
                  <button
                    key={space.id}
                    type="button"
                    onClick={() => {
                      const currentSpace = (formData.spaceWanted as unknown as string[]) || [];
                      const isSelected = currentSpace.includes(space.id);
                      const newSpace = isSelected
                        ? currentSpace.filter((id) => id !== space.id) 
                        : [...currentSpace, space.id];
                      updateFields({ spaceWanted: newSpace as any });
                    }}
                    className={`p-4 text-lg text-center rounded-xl border transition-all ${
                      ((formData.spaceWanted as unknown as string[]) || []).includes(space.id)
                        ? 'bg-main-text border-main-text text-header' 
                        : 'bg-header/30 border-main-text/20 text-white hover:border-main-text/60'
                    }`}
                  >
                    <h3 className="font-medium text-md">{space.label}</h3>
                  </button>
                ))}
              </div>
            </div>
            <div className="md:col-span-2">
              <label className="block text-white text-md uppercase tracking-widest mb-6 mt-6 px-1 flex items-center gap-2">
                {t('spaceDetails') || 'Space Details'} 
              </label>
              <textarea
                rows={4}
                placeholder={t('spaceDetailsPlaceholder') || 'Tell us more about your dream space...'}
                value={formData.spaceDetails || ''}
                onChange={(e) => updateFields({ spaceDetails: e.target.value })}
                className="w-full bg-header/50 border border-main-text/10 text-white rounded-xl p-4 focus:outline-none focus:border-main-text transition-colors resize-none"
              />
            </div>
          </>
        )}
        {formData.projectType === 'office' && (
          <>
            <div className="md:col-span-2">
              <label className="block text-white text-sm uppercase tracking-widest mt-6 mb-6 px-1">{t('employeeCount')}</label>
              <div className="grid grid-cols-2 md:grid-cols-2 gap-3">
                {employeeCount.map((employee) => (
                  <button
                    key={employee.id}
                    type="button"
                    onClick={() => updateFields({employeeCount: employee.id as EmployeeCount})}
                    className={`flex-1 text-lg py-3 rounded-xl border transition-all ${
                      formData.employeeCount === employee.id 
                        ? 'bg-main-text border-main-text text-header' 
                        : 'bg-header/30 border-main-text/20 text-white hover:border-main-text/60'
                    }`}
                  >
                    <h3 className="font-medium text-md">{employee.label}</h3>
                  </button>
                ))}
              </div>
            </div>
            <div className="md:col-span-2">
              <label className="block text-white text-sm uppercase tracking-widest mt-6 mb-6 px-1">{t('workEnvironment')}</label>
              <div className="grid grid-cols-2 md:grid-cols-2 gap-3">
                {workEnvironment.map((environment) => (
                  <button
                    key={environment.id}
                    type="button"
                    onClick={() => updateFields({workEnvironment: environment.id as WorkEnvironment})}
                    className={`flex-1 text-lg py-3 rounded-xl border transition-all ${
                      formData.workEnvironment === environment.id 
                        ? 'bg-main-text border-main-text text-header' 
                        : 'bg-header/30 border-main-text/20 text-white hover:border-main-text/60'
                    }`}
                  >
                    <h3 className="font-medium text-md">{environment.label}</h3>
                  </button>
                ))}
              </div>
            </div>
            <div className="md:col-span-2">
              <label className="block text-white text-sm uppercase tracking-widest mb-6 mt-6 px-1">{t('amenitiesWanted')}</label>
              <div className="grid grid-cols-2 md:grid-cols-2 gap-3">
                {amenitiesWanted.map((amenities) => (
                  <button
                    key={amenities.id}
                    type="button"
                    onClick={() => {
                      const currentAmenities = (formData.amenitiesWanted as unknown as string[]) || [];
                      const isSelected = currentAmenities.includes(amenities.id);
                      const newAmenities = isSelected
                        ? currentAmenities.filter((id) => id !== amenities.id) 
                        : [...currentAmenities, amenities.id];
                      updateFields({ amenitiesWanted: newAmenities as any });
                    }}
                    className={`p-4 text-lg text-center rounded-xl border transition-all ${
                      ((formData.amenitiesWanted as unknown as string[]) || []).includes(amenities.id)
                        ? 'bg-main-text border-main-text text-header' 
                        : 'bg-header/30 border-main-text/20 text-white hover:border-main-text/60'
                    }`}
                  >
                    <h3 className="font-medium text-md">{amenities.label}</h3>
                  </button>
                ))}
              </div>
            </div>
            <div className="md:col-span-2">
              <label className="block text-white text-md uppercase tracking-widest mb-6 mt-6 px-1 flex items-center gap-2">
                {t('officeDetails') || 'Office Details'} 
              </label>
              <textarea
                rows={4}
                placeholder={t('officeDetailsPlaceholder') || 'Tell us more about your dream office...'}
                value={formData.officeDetails || ''}
                onChange={(e) => updateFields({ officeDetails: e.target.value })}
                className="w-full bg-header/50 border border-main-text/10 text-white rounded-xl p-4 focus:outline-none focus:border-main-text transition-colors resize-none"
              />
            </div>
          </>
        )}
        {formData.projectType === 'beautySalon' && (
          <>
            <div className="md:col-span-2">
              <label className="block text-white text-sm uppercase tracking-widest mb-6 mt-6 px-1">{t('salonServices')}</label>
              <div className="grid grid-cols-2 md:grid-cols-2 gap-3">
                {salonServices.map((salon) => (
                  <button
                    key={salon.id}
                    type="button"
                    onClick={() => {
                      const currentSalon = (formData.salonServices as unknown as string[]) || [];
                      const isSelected = currentSalon.includes(salon.id);
                      const newSalon = isSelected
                        ? currentSalon.filter((id) => id !== salon.id) 
                        : [...currentSalon, salon.id];
                      updateFields({ salonServices: newSalon as any });
                    }}
                    className={`p-4 text-lg text-center rounded-xl border transition-all ${
                      ((formData.salonServices as unknown as string[]) || []).includes(salon.id)
                        ? 'bg-main-text border-main-text text-header' 
                        : 'bg-header/30 border-main-text/20 text-white hover:border-main-text/60'
                    }`}
                  >
                    <h3 className="font-medium text-md">{salon.label}</h3>
                  </button>
                ))}
              </div>
            </div>
            <div className="md:col-span-2">
              <label className="block text-white text-sm uppercase tracking-widest mt-6 mb-6 px-1">{t('stationsCount')}</label>
              <div className="grid grid-cols-2 md:grid-cols-2 gap-3">
                {stationsCount.map((station) => (
                  <button
                    key={station.id}
                    type="button"
                    onClick={() => updateFields({stationsCount: station.id as StationsCount})}
                    className={`flex-1 text-lg py-3 rounded-xl border transition-all ${
                      formData.stationsCount === station.id 
                        ? 'bg-main-text border-main-text text-header' 
                        : 'bg-header/30 border-main-text/20 text-white hover:border-main-text/60'
                    }`}
                  >
                    <h3 className="font-medium text-md">{station.label}</h3>
                  </button>
                ))}
              </div>
            </div>
            <div className="md:col-span-2">
              <label className="block text-white text-sm uppercase tracking-widest mt-6 mb-6 px-1">{t('ambiance')}</label>
              <div className="grid grid-cols-2 md:grid-cols-2 gap-3">
                {ambiance.map((ambi) => (
                  <button
                    key={ambi.id}
                    type="button"
                    onClick={() => updateFields({ambiance: ambi.id as Ambiance})}
                    className={`flex-1 text-lg py-3 rounded-xl border transition-all ${
                      formData.ambiance === ambi.id 
                        ? 'bg-main-text border-main-text text-header' 
                        : 'bg-header/30 border-main-text/20 text-white hover:border-main-text/60'
                    }`}
                  >
                    <h3 className="font-medium text-md">{ambi.label}</h3>
                  </button>
                ))}
              </div>
            </div>
            <div className="md:col-span-2">
              <label className="block text-white text-md uppercase tracking-widest mb-6 mt-6 px-1 flex items-center gap-2">
                {t('salonDetails') || 'Salon Details'} 
              </label>
              <textarea
                rows={4}
                placeholder={t('salonDetailsPlaceholder') || 'Tell us more about your dream salon...'}
                value={formData.salonDetails || ''}
                onChange={(e) => updateFields({ salonDetails: e.target.value })}
                className="w-full bg-header/50 border border-main-text/10 text-white rounded-xl p-4 focus:outline-none focus:border-main-text transition-colors resize-none"
              />
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
}
