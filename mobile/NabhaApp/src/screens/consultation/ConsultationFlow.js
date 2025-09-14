import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';

// Import individual consultation screens
import SpecialtySelector from './SpecialtySelector';
import ConsultationTypeSelector from './ConsultationTypeSelector';
import SymptomsForm from './SymptomsForm';
import { DocumentUpload, PersonalDetailsForm, DoctorSelection, PaymentGateway, ConfirmationScreen } from './PlaceholderScreens';

const translations = {
  en: {
    consultDoctor: "Consult Doctor",
    emergency: "Emergency Consultation",
    close: "Close",
    back: "Back",
    next: "Next",
    step: "Step",
    of: "of"
  },
  hi: {
    consultDoctor: "डॉक्टर से सलाह लें",
    emergency: "आपातकालीन सलाह",
    close: "बंद करें",
    back: "वापस",
    next: "आगे",
    step: "चरण",
    of: "का"
  },
  pa: {
    consultDoctor: "ਡਾਕਟਰ ਨਾਲ ਗੱਲ ਕਰੋ",
    emergency: "ਐਮਰਜੈਂਸੀ ਸਲਾਹ",
    close: "ਬੰਦ ਕਰੋ",
    back: "ਵਾਪਸ",
    next: "ਅੱਗੇ",
    step: "ਕਦਮ",
    of: "ਦਾ"
  }
};

const ConsultationFlow = ({ isVisible, onClose, language = 'en' }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [consultationData, setConsultationData] = useState({
    selectedSpecialty: null,
    consultationType: null,
    symptoms: {},
    documents: [],
    personalDetails: {},
    selectedDoctor: null,
    paymentStatus: null
  });

  const t = translations[language];
  const totalSteps = 8;

  const updateConsultationData = (step, data) => {
    setConsultationData(prev => ({ ...prev, ...data }));
  };

  const goToNextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderProgressBar = () => (
    <View style={styles.progressContainer}>
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${(currentStep / totalSteps) * 100}%` }]} />
      </View>
      <Text style={styles.progressText}>
        {t.step} {currentStep} {t.of} {totalSteps}
      </Text>
    </View>
  );

  const renderCurrentScreen = () => {
    switch (currentStep) {
      case 1:
        return (
          <SpecialtySelector
            language={language}
            selectedSpecialty={consultationData.selectedSpecialty}
            onSelect={(specialty) => {
              updateConsultationData('specialty', { selectedSpecialty: specialty });
              goToNextStep();
            }}
          />
        );
      case 2:
        return (
          <ConsultationTypeSelector
            language={language}
            selectedType={consultationData.consultationType}
            onSelect={(type) => {
              updateConsultationData('type', { consultationType: type });
              goToNextStep();
            }}
          />
        );
      case 3:
        return (
          <SymptomsForm
            language={language}
            symptomsData={consultationData.symptoms}
            onSubmit={(symptoms) => {
              updateConsultationData('symptoms', { symptoms });
              goToNextStep();
            }}
          />
        );
      case 4:
        return (
          <DocumentUpload
            language={language}
            documents={consultationData.documents}
            onNext={(documents) => {
              updateConsultationData('documents', { documents });
              goToNextStep();
            }}
            onBack={goToPreviousStep}
          />
        );
      case 5:
        return (
          <PersonalDetailsForm
            language={language}
            personalDetails={consultationData.personalDetails}
            onNext={(details) => {
              updateConsultationData('details', { personalDetails: details });
              goToNextStep();
            }}
            onBack={goToPreviousStep}
          />
        );
      case 6:
        return (
          <DoctorSelection
            language={language}
            specialty={consultationData.selectedSpecialty}
            consultationType={consultationData.consultationType}
            selectedDoctor={consultationData.selectedDoctor}
            onNext={(doctor) => {
              updateConsultationData('doctor', { selectedDoctor: doctor });
              goToNextStep();
            }}
            onBack={goToPreviousStep}
          />
        );
      case 7:
        return (
          <PaymentGateway
            language={language}
            doctor={consultationData.selectedDoctor}
            consultationType={consultationData.consultationType}
            onNext={(paymentStatus) => {
              updateConsultationData('payment', { paymentStatus });
              goToNextStep();
            }}
            onBack={goToPreviousStep}
          />
        );
      case 8:
        return (
          <ConfirmationScreen
            language={language}
            doctor={consultationData.selectedDoctor}
            consultationType={consultationData.consultationType}
            paymentDetails={consultationData.paymentStatus}
            personalDetails={consultationData.personalDetails}
            symptoms={consultationData.symptoms}
            onClose={onClose}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        <StatusBar style="dark" />
        
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={currentStep === 1 ? onClose : goToPreviousStep}>
            <Text style={styles.backButtonText}>
              {currentStep === 1 ? t.close : t.back}
            </Text>
          </TouchableOpacity>
          
          <Text style={styles.headerTitle}>{t.consultDoctor}</Text>
          
          {/* Emergency Button */}
          <TouchableOpacity style={styles.emergencyButton}>
            <Text style={styles.emergencyText}>🚨</Text>
          </TouchableOpacity>
        </View>

        {/* Progress Bar */}
        {renderProgressBar()}

        {/* Main Content */}
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {renderCurrentScreen()}
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  backButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: '#f8f9fa',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#dee2e6',
  },
  backButtonText: {
    fontSize: 14,
    color: '#495057',
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212529',
  },
  emergencyButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#ff4757',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#ff4757',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  emergencyText: {
    fontSize: 20,
  },
  progressContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
  },
  progressBar: {
    height: 6,
    backgroundColor: '#e9ecef',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4facfe',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: '#6c757d',
    textAlign: 'center',
    fontWeight: '500',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
});

export default ConsultationFlow;
