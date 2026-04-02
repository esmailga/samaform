import { ChangeEvent, RefObject } from 'react';
import { motion } from 'motion/react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { StepProps } from './types';

interface Step5Props extends StepProps {
  inspirationInputRef: RefObject<HTMLInputElement | null>;
  currentSpaceInputRef: RefObject<HTMLInputElement | null>;
  handleFileChange: (e: ChangeEvent<HTMLInputElement>, type: 'inspiration' | 'current') => void;
  removeFile: (index: number, type: 'inspiration' | 'current') => void;
}

export default function Step5Images({ 
  formData, 
  inspirationInputRef, 
  currentSpaceInputRef, 
  handleFileChange, 
  removeFile 
}: Step5Props) {
  const { t } = useLanguage();

  return (
    <motion.div 
      key="step5"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-8"
    >
      <div className="text-center mb-8">
        <h2 className="text-white text-sm uppercase tracking-widest mb-2">{t('stepFive')}</h2>
        <p className="text-4xl font-serif text-main-text">{t('stepFiveDesc')}</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Inspiration Images */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="block text-white text-sm uppercase tracking-widest">{t('inspirationImages')}</label>
            <span className="text-[10px] text-white/40">{formData.inspirationImages.length}/5</span>
          </div>
          <p className="text-white/40  text-sm lowercase">{t('inspirationImagesDesc')}</p>
          <div 
            onClick={() => inspirationInputRef.current?.click()}
            className={`border-2 border-dashed border-main-text/20 rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition-colors hover:border-main-text/40 bg-header/20`}
          >
            <Upload className="text-main-text mb-2" size={32} />
            <span className="text-white/60 text-sm">{t('uploadLimit')}</span>
            <input 
              ref={inspirationInputRef}
              type="file" 
              multiple 
              accept="image/*"
              onChange={e => handleFileChange(e, 'inspiration')}
              className="hidden" 
            />
          </div>
          <div className="grid grid-cols-5 gap-2">
            {formData.inspirationImages.map((file, i) => (
              <div key={i} className="relative aspect-square rounded-lg overflow-hidden bg-header/50 group">
                <img src={URL.createObjectURL(file)} alt="Preview" className="w-full h-full object-cover" />
                <button 
                  onClick={() => removeFile(i, 'inspiration')}
                  className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                >
                  <X size={16} className="text-white" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Current Space Images */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="block text-white text-sm uppercase tracking-widest">{t('currentSpaceImages')}</label>
            <span className="text-[10px] text-white/40">{formData.currentSpaceImages.length}/5</span>
          </div>
          <p className="text-white/40  text-sm lowercase">{t('currentSpaceImagesDesc')}</p>
          <div 
            onClick={() => currentSpaceInputRef.current?.click()}
            className={`border-2 border-dashed border-main-text/20 rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition-colors hover:border-main-text/40 bg-header/20`}
          >
            <ImageIcon className="text-main-text mb-2" size={32} />
            <span className="text-white/60 text-sm">{t('uploadLimit')}</span>
            <input 
              ref={currentSpaceInputRef}
              type="file" 
              multiple 
              accept="image/*"
              onChange={e => handleFileChange(e, 'current')}
              className="hidden" 
            />
          </div>
          <div className="grid grid-cols-5 gap-2">
            {formData.currentSpaceImages.map((file, i) => (
              <div key={i} className="relative aspect-square rounded-lg overflow-hidden bg-header/50 group">
                <img src={URL.createObjectURL(file)} alt="Preview" className="w-full h-full object-cover" />
                <button 
                  onClick={() => removeFile(i, 'current')}
                  className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                >
                  <X size={16} className="text-white" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
