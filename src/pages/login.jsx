import React, { useState } from 'react';
import {
  Input,
  Button,
  Select,
  PinInputField,
  PinInput,
  HStack,
} from "@chakra-ui/react";
import SVG from "../assets/image17.png";
import Apple from "../assets/apple.svg";
import Google from "../assets/google.svg";
import Phone from "../assets/keyboard.svg";
import Back from "../assets/back.svg";
import SVG2 from "../assets/image16.png";
import { useTranslation } from 'react-i18next';

const countryCodes = [
  { code: '+1', country: 'USA' },
  { code: '+44', country: 'UK' },
  { code: '+91', country: 'India' },
];

const LoginPage = () => {
  const { t, i18n } = useTranslation();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [isOtpScreen, setIsOtpScreen] = useState(false);
  const [otp, setOtp] = useState('');
  const [resendTimer, setResendTimer] = useState(60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [selectedCountryCode, setSelectedCountryCode] = useState('+1');

  const handleLanguageChange = (event) => {
    const newLanguage = event.target.value;
    setSelectedLanguage(newLanguage);
    i18n.changeLanguage(newLanguage);
  };

  const handleSignIn = (event) => {
    event.preventDefault();
    console.log('Sign in with phone number:', selectedCountryCode + phoneNumber);
    setIsOtpScreen(true);
    startResendTimer();
  };

  const handleOtpSubmit = (event) => {
    event.preventDefault();
    console.log('OTP submitted:', otp);
  };

  const handleResendOtp = () => {
    console.log('Resending OTP...');
    setResendTimer(60);
    startResendTimer();
  };

  const startResendTimer = () => {
    setIsTimerRunning(true);
    const interval = setInterval(() => {
      setResendTimer((prevTime) => {
        if (prevTime === 1) {
          setIsTimerRunning(false);
          clearInterval(interval);
        }
        return prevTime - 1;
      });
    }, 1000);
  };

  const toggleLanguage = () => {
    const newLanguage = selectedLanguage === 'en' ? 'ar' : 'en';
    setSelectedLanguage(newLanguage);
    i18n.changeLanguage(newLanguage);
  };

  return (
    <div className="login-page">
      <div className="left-half">
        <img className={isOtpScreen ? 'svg2' : 'svg'} src={isOtpScreen ? SVG2 : SVG} alt="Login SVG" />
      </div>
      <div className="right-half">
        {isOtpScreen ? (
          <OtpScreen
            resendTimer={resendTimer}
            isTimerRunning={isTimerRunning}
            handleOtpSubmit={handleOtpSubmit}
            handleResendOtp={handleResendOtp}
            toggleOtpScreen={() => setIsOtpScreen(false)}
            selectedLanguage={selectedLanguage}
            t={t}
          />
        ) : (
          <SignInScreen
            phoneNumber={phoneNumber}
            setPhoneNumber={setPhoneNumber}
            selectedCountryCode={selectedCountryCode}
            setSelectedCountryCode={setSelectedCountryCode}
            handleSignIn={handleSignIn}
            toggleLanguage={toggleLanguage}
            selectedLanguage={selectedLanguage}
            t={t}
          />
        )}
      </div>
    </div>
  );
};

const OtpScreen = ({
  resendTimer,
  isTimerRunning,
  handleOtpSubmit,
  handleResendOtp,
  toggleOtpScreen,
  selectedLanguage,
  t
}) => (
  <div className='otp'>
    <h1 className="heading">{t('EnterCode')}</h1>
    <form onSubmit={handleOtpSubmit} className='otp2'>
      <HStack>
        <PinInput otp>
          <PinInputField />
          <PinInputField />
          <PinInputField />
          <PinInputField />
        </PinInput>
      </HStack>
      <p>{t('YouCanResend')} <span className='timer'> {resendTimer}</span> {t('Seconds')}</p>
      <Button
        variant="link"
        onClick={handleResendOtp}
        isDisabled={isTimerRunning}
      >
        <span className='timer resend'>{t('ResendCode')}</span>
      </Button>
    </form>
    <div className={`buttons-container ${selectedLanguage === 'en' ? 'ltr' : 'rtl'}`}>
      <button className='auth2' onClick={toggleOtpScreen}>
        <img src={Back} alt="Back" />
      </button>
      <button type="submit" className='verify-button'>
        {t('Verify')}
      </button>
    </div>
  </div>
);

const SignInScreen = ({
  phoneNumber,
  setPhoneNumber,
  selectedCountryCode,
  setSelectedCountryCode,
  handleSignIn,
  toggleLanguage,
  selectedLanguage,
  t
}) => (
  <>
    <div className='translater'>
      <h1 className="heading">{t('SignIn')}</h1>
      <div className="language-toggle">
        <Button onClick={toggleLanguage}>
          {selectedLanguage === 'en' ? t('اللغة العربية') : t('English')}
        </Button>
      </div>
    </div>
    <form onSubmit={handleSignIn}>
      <div className="input">
        <img className='phone' src={Phone} alt="Phone" />
        <Select
          className="country-code-select"
          value={selectedCountryCode}
          size='sm'
          border='none'
          width='200px'
          onChange={(event) => setSelectedCountryCode(event.target.value)}
        >
          {countryCodes.map((code) => (
            <option key={code.code} value={code.code}>
              {code.country} ({code.code})
            </option>
          ))}
        </Select>
        <Input
          type="text"
          placeholder={t('MobileNumber')}
          value={phoneNumber}
          onChange={(event) => setPhoneNumber(event.target.value)}
          style={{border:'none'}}
          required
        />
      </div>
      <button className='next' type="submit">{t('Next')}</button>
    </form>
    <div className='or'>
      <span className='line'></span>
      <span>{t('OR')}</span>
      <span className='line'></span>
    </div>
    <div className="options">
      <button className='auth'><img src={Google} alt="Google Auth" /></button>
      <button className='auth'><img src={Apple} alt="Apple Auth" /></button>
    </div>
    <div className='other-options'>
      <p className="guest-option">{t('ContinueAsGuest')}</p>
      <div className="legal">
        <p>
          {t('By registering you agree to our')}{' '}
          <a href="#">{t('TermsOfUse')}</a> <br /> {t('and')} &nbsp;
          <a href="#">{t('PrivacyPolicy')}</a>
        </p>
      </div>
    </div>
  </>
);

export default LoginPage;
