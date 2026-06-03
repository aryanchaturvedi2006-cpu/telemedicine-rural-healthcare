import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { SPECIALIZATIONS } from '../translations/translations';

const DoctorRegistration = () => {
  const { t, setLanguage } = useLanguage();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    specialization: '',
    hospital: '',
    mobileNumber: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.specialization || !formData.hospital || !formData.mobileNumber) {
      alert(t('fillAllFields'));
      return;
    }
    // Dummy navigation
    navigate('/doctor-dashboard');
  };

  const handleChangeLanguage = () => {
    setLanguage('');
    navigate('/');
  };

  return (
    <div className="form-container">
      <div className="top-bar">
        <button className="btn-text" style={{ marginRight: 'auto' }} onClick={() => navigate('/landing')}>
          ← {t('back')}
        </button>
        <button className="btn-secondary small" onClick={handleChangeLanguage}>
          {t('changeLanguage')}
        </button>
      </div>

      <div className="form-card">
        <div className="form-header">
          <h2>{t('doctorRegTitle')}</h2>
          <p>{t('doctorRegSub')}</p>
        </div>

        <form onSubmit={handleSubmit} className="form-body">
          <div className="input-group">
            <label>{t('fullName')}</label>
            <input 
              type="text" 
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder={t('fullNamePH')} 
              className="large-input"
            />
          </div>

          <div className="input-group">
            <label>{t('specialization')}</label>
            <select 
              name="specialization" 
              value={formData.specialization} 
              onChange={handleChange}
              className="large-input"
            >
              <option value="">{t('selectSpec')}</option>
              {SPECIALIZATIONS.map((spec) => (
                <option key={spec} value={spec}>{t(spec)}</option>
              ))}
            </select>
          </div>

          <div className="input-group">
            <label>{t('hospitalName')}</label>
            <input 
              type="text" 
              name="hospital"
              value={formData.hospital}
              onChange={handleChange}
              placeholder={t('hospitalNamePH')} 
              className="large-input"
            />
          </div>

          <div className="input-group">
            <label>{t('mobileNumber')}</label>
            <input 
              type="number" 
              name="mobileNumber"
              value={formData.mobileNumber}
              onChange={handleChange}
              placeholder={t('mobileNumberPH')} 
              className="large-input"
            />
          </div>

          <button type="submit" className="btn-primary large mt-4" style={{ backgroundColor: 'var(--primary-blue)' }}>
            {t('createAccountBtn')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default DoctorRegistration;
