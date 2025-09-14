import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
  ScrollView,
  Platform,
  Dimensions,
  PermissionsAndroid,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';

const { width, height } = Dimensions.get('window');

const DocumentUpload = ({ language, onNext, onBack }) => {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  const translations = {
    en: {
      title: 'Upload Medical Documents',
      subtitle: 'Upload any relevant medical documents, reports, or prescriptions',
      dragDrop: 'Tap to select files or drag & drop here',
      supportedFormats: 'Supported: JPG, PNG, PDF (Max 5MB each)',
      uploadFromCamera: 'Take Photo',
      uploadFromGallery: 'Choose from Gallery',
      uploadFromFiles: 'Select PDF Files',
      noFiles: 'No files uploaded yet',
      uploading: 'Uploading...',
      uploadSuccess: 'Upload successful!',
      uploadError: 'Upload failed. Please try again.',
      removeFile: 'Remove',
      retryUpload: 'Retry',
      continue: 'Continue',
      back: 'Back',
      skip: 'Skip',
      offline: 'Offline - Files will be uploaded when connected',
      cameraPermission: 'Camera permission required',
      storagePermission: 'Storage permission required',
      maxFileSize: 'File size too large (Max 5MB)',
      maxFiles: 'Maximum 5 files allowed',
    },
    hi: {
      title: 'मेडिकल दस्तावेज़ अपलोड करें',
      subtitle: 'कोई भी संबंधित मेडिकल दस्तावेज़, रिपोर्ट या नुस्खे अपलोड करें',
      dragDrop: 'फाइलें चुनने के लिए टैप करें या यहाँ ड्रैग करें',
      supportedFormats: 'समर्थित: JPG, PNG, PDF (अधिकतम 5MB प्रत्येक)',
      uploadFromCamera: 'फोटो लें',
      uploadFromGallery: 'गैलरी से चुनें',
      uploadFromFiles: 'PDF फाइलें चुनें',
      noFiles: 'अभी तक कोई फाइल अपलोड नहीं की गई',
      uploading: 'अपलोड हो रहा है...',
      uploadSuccess: 'अपलोड सफल!',
      uploadError: 'अपलोड असफल। कृपया पुनः प्रयास करें।',
      removeFile: 'हटाएं',
      retryUpload: 'पुनः प्रयास',
      continue: 'जारी रखें',
      back: 'वापस',
      skip: 'छोड़ें',
      offline: 'ऑफलाइन - कनेक्ट होने पर फाइलें अपलोड होंगी',
      cameraPermission: 'कैमरा अनुमति आवश्यक',
      storagePermission: 'स्टोरेज अनुमति आवश्यक',
      maxFileSize: 'फाइल साइज़ बहुत बड़ा (अधिकतम 5MB)',
      maxFiles: 'अधिकतम 5 फाइलों की अनुमति है',
    },
    pa: {
      title: 'ਮੈਡੀਕਲ ਦਸਤਾਵੇਜ਼ ਅਪਲੋਡ ਕਰੋ',
      subtitle: 'ਕੋਈ ਵੀ ਸੰਬੰਧਿਤ ਮੈਡੀਕਲ ਦਸਤਾਵੇਜ਼, ਰਿਪੋਰਟ ਜਾਂ ਨੁਸਖੇ ਅਪਲੋਡ ਕਰੋ',
      dragDrop: 'ਫਾਈਲਾਂ ਚੁਣਨ ਲਈ ਟੈਪ ਕਰੋ ਜਾਂ ਇੱਥੇ ਖਿੱਚੋ',
      supportedFormats: 'ਸਮਰਥਿਤ: JPG, PNG, PDF (ਵੱਧ ਤੋਂ ਵੱਧ 5MB ਹਰੇਕ)',
      uploadFromCamera: 'ਫੋਟੋ ਲਓ',
      uploadFromGallery: 'ਗੈਲਰੀ ਤੋਂ ਚੁਣੋ',
      uploadFromFiles: 'PDF ਫਾਈਲਾਂ ਚੁਣੋ',
      noFiles: 'ਅਜੇ ਤੱਕ ਕੋਈ ਫਾਈਲ ਅਪਲੋਡ ਨਹੀਂ ਕੀਤੀ ਗਈ',
      uploading: 'ਅਪਲੋਡ ਹੋ ਰਿਹਾ ਹੈ...',
      uploadSuccess: 'ਅਪਲੋਡ ਸਫਲ!',
      uploadError: 'ਅਪਲੋਡ ਅਸਫਲ। ਕਿਰਪਾ ਕਰਕੇ ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ।',
      removeFile: 'ਹਟਾਓ',
      retryUpload: 'ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼',
      continue: 'ਜਾਰੀ ਰੱਖੋ',
      back: 'ਵਾਪਸ',
      skip: 'ਛੱਡੋ',
      offline: 'ਔਫਲਾਈਨ - ਕਨੈਕਟ ਹੋਣ ਤੇ ਫਾਈਲਾਂ ਅਪਲੋਡ ਹੋਣਗੀਆਂ',
      cameraPermission: 'ਕੈਮਰਾ ਇਜਾਜ਼ਤ ਚਾਹੀਦੀ',
      storagePermission: 'ਸਟੋਰੇਜ ਇਜਾਜ਼ਤ ਚਾਹੀਦੀ',
      maxFileSize: 'ਫਾਈਲ ਸਾਈਜ਼ ਬਹੁਤ ਵੱਡਾ (ਵੱਧ ਤੋਂ ਵੱਧ 5MB)',
      maxFiles: 'ਵੱਧ ਤੋਂ ਵੱਧ 5 ਫਾਈਲਾਂ ਦੀ ਇਜਾਜ਼ਤ ਹੈ',
    },
  };

  const t = translations[language];

  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true;
  };

  const requestStoragePermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true;
  };

  const simulateFileUpload = (file) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: Date.now() + Math.random(),
          name: file.name,
          type: file.type,
          size: file.size,
          status: 'success',
          url: file.uri || 'https://example.com/file',
        });
      }, 2000);
    });
  };

  const handleFileUpload = async (source) => {
    if (uploadedFiles.length >= 5) {
      Alert.alert('Error', t.maxFiles);
      return;
    }

    setIsUploading(true);

    try {
      let result = null;

      switch (source) {
        case 'camera':
          // Request camera permissions
          const cameraPermissions = await ImagePicker.requestCameraPermissionsAsync();
          if (!cameraPermissions.granted) {
            Alert.alert('Permission Required', t.cameraPermission);
            setIsUploading(false);
            return;
          }

          result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.8,
            base64: false,
          });
          break;

        case 'gallery':
          // Request media library permissions
          const libraryPermissions = await ImagePicker.requestMediaLibraryPermissionsAsync();
          if (!libraryPermissions.granted) {
            Alert.alert('Permission Required', t.storagePermission);
            setIsUploading(false);
            return;
          }

          result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.8,
            base64: false,
          });
          break;

        case 'files':
          result = await DocumentPicker.getDocumentAsync({
            type: ['application/pdf', 'image/*'],
            copyToCacheDirectory: true,
            multiple: false,
          });
          break;
      }

      if (result && !result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        
        // Check file size (5MB limit)
        if (asset.fileSize && asset.fileSize > 5000000) {
          Alert.alert('Error', t.maxFileSize);
          setIsUploading(false);
          return;
        }

        // Create file object
        const newFile = {
          id: Date.now() + Math.random(),
          name: asset.fileName || `${source}_${Date.now()}.${asset.type?.includes('pdf') ? 'pdf' : 'jpg'}`,
          type: asset.mimeType || (asset.type?.includes('pdf') ? 'application/pdf' : 'image/jpeg'),
          size: asset.fileSize || Math.random() * 3000000 + 500000,
          uri: asset.uri,
          status: 'uploading',
          progress: 0,
        };

        setUploadedFiles(prev => [...prev, newFile]);

        // Simulate upload progress
        const updateProgress = (fileId, progress) => {
          setUploadedFiles(prev => 
            prev.map(file => 
              file.id === fileId ? { ...file, progress } : file
            )
          );
        };

        // Simulate progress updates
        for (let progress = 10; progress <= 100; progress += 10) {
          setTimeout(() => {
            updateProgress(newFile.id, progress);
          }, (progress / 10) * 200);
        }

        // Simulate upload completion
        setTimeout(() => {
          setUploadedFiles(prev => 
            prev.map(file => 
              file.id === newFile.id ? { ...file, status: 'success' } : file
            )
          );
          Alert.alert('Success', t.uploadSuccess);
        }, 2000);

      } else if (result && result.canceled) {
        // User cancelled the picker
        console.log('User cancelled file selection');
      }
    } catch (error) {
      console.error('Error picking file:', error);
      Alert.alert('Error', t.uploadError);
    } finally {
      setIsUploading(false);
    }
  };

  const removeFile = (fileId) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== fileId));
  };

  const retryUpload = async (file) => {
    setUploadedFiles(prev => 
      prev.map(f => 
        f.id === file.id ? { ...f, status: 'uploading', progress: 0 } : f
      )
    );

    try {
      const uploadedFile = await simulateFileUpload(file);
      setUploadedFiles(prev => 
        prev.map(f => 
          f.id === file.id ? { ...uploadedFile } : f
        )
      );
    } catch (error) {
      setUploadedFiles(prev => 
        prev.map(f => 
          f.id === file.id ? { ...f, status: 'error' } : f
        )
      );
    }
  };

  const getFileIcon = (type) => {
    if (type.startsWith('image/')) {
      return 'image';
    } else if (type === 'application/pdf') {
      return 'picture-as-pdf';
    }
    return 'insert-drive-file';
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>{t.title}</Text>
        <Text style={styles.subtitle}>{t.subtitle}</Text>
      </View>

      {/* Upload Area */}
      <TouchableOpacity 
        style={styles.uploadArea}
        onPress={() => {
          console.log('Main upload area pressed');
          if (!isUploading) {
            handleFileUpload('files');
          }
        }}
        activeOpacity={0.7}
        disabled={isUploading}
      >
        <Icon name="cloud-upload" size={50} color="#00695C" />
        <Text style={styles.uploadText}>{t.dragDrop}</Text>
        <Text style={styles.supportedText}>{t.supportedFormats}</Text>
        
        <View style={styles.uploadOptions}>
          <TouchableOpacity
            style={[
              styles.uploadButton, 
              styles.cameraButton,
              isUploading && styles.uploadButtonDisabled
            ]}
            onPress={(e) => {
              e.stopPropagation();
              console.log('Camera button pressed');
              if (!isUploading) {
                handleFileUpload('camera');
              }
            }}
            disabled={isUploading}
            activeOpacity={isUploading ? 1 : 0.7}
          >
            <Icon name="camera-alt" size={24} color="#fff" />
            <Text style={styles.uploadButtonText}>{t.uploadFromCamera}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.uploadButton, 
              styles.galleryButton,
              isUploading && styles.uploadButtonDisabled
            ]}
            onPress={(e) => {
              e.stopPropagation();
              console.log('Gallery button pressed');
              if (!isUploading) {
                handleFileUpload('gallery');
              }
            }}
            disabled={isUploading}
            activeOpacity={isUploading ? 1 : 0.7}
          >
            <Icon name="photo-library" size={24} color="#fff" />
            <Text style={styles.uploadButtonText}>{t.uploadFromGallery}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.uploadButton, 
              styles.filesButton,
              isUploading && styles.uploadButtonDisabled
            ]}
            onPress={(e) => {
              e.stopPropagation();
              console.log('Files button pressed');
              if (!isUploading) {
                handleFileUpload('files');
              }
            }}
            disabled={isUploading}
            activeOpacity={isUploading ? 1 : 0.7}
          >
            <Icon name="folder-open" size={24} color="#fff" />
            <Text style={styles.uploadButtonText}>{t.uploadFromFiles}</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>

      {/* Offline Indicator */}
      <View style={styles.offlineIndicator}>
        <Icon name="wifi-off" size={16} color="#FF9800" />
        <Text style={styles.offlineText}>{t.offline}</Text>
      </View>

      {/* Uploaded Files */}
      <View style={styles.filesSection}>
        {uploadedFiles.length === 0 ? (
          <View style={styles.noFiles}>
            <Icon name="description" size={40} color="#ccc" />
            <Text style={styles.noFilesText}>{t.noFiles}</Text>
          </View>
        ) : (
          uploadedFiles.map((file) => (
            <View key={file.id} style={styles.fileItem}>
              <View style={styles.fileInfo}>
                <Icon 
                  name={getFileIcon(file.type)} 
                  size={40} 
                  color="#00695C" 
                />
                <View style={styles.fileDetails}>
                  <Text style={styles.fileName}>{file.name}</Text>
                  <Text style={styles.fileSize}>{formatFileSize(file.size)}</Text>
                  
                  {file.status === 'uploading' && (
                    <View style={styles.progressContainer}>
                      <View style={styles.progressBar}>
                        <View 
                          style={[
                            styles.progressFill, 
                            { width: `${file.progress || 0}%` }
                          ]} 
                        />
                      </View>
                      <Text style={styles.progressText}>{file.progress || 0}%</Text>
                    </View>
                  )}
                  
                  {file.status === 'success' && (
                    <View style={styles.statusContainer}>
                      <Icon name="check-circle" size={16} color="#4CAF50" />
                      <Text style={styles.successText}>{t.uploadSuccess}</Text>
                    </View>
                  )}
                  
                  {file.status === 'error' && (
                    <View style={styles.statusContainer}>
                      <Icon name="error" size={16} color="#F44336" />
                      <Text style={styles.errorText}>{t.uploadError}</Text>
                    </View>
                  )}
                </View>
              </View>
              
              <View style={styles.fileActions}>
                {file.status === 'error' && (
                  <TouchableOpacity
                    style={styles.retryButton}
                    onPress={() => {
                      console.log('Retry button pressed for file:', file.name);
                      retryUpload(file);
                    }}
                    activeOpacity={0.7}
                  >
                    <Icon name="refresh" size={20} color="#FF9800" />
                  </TouchableOpacity>
                )}
                
                <TouchableOpacity
                  style={[
                    styles.removeButton,
                    file.status === 'uploading' && styles.removeButtonDisabled
                  ]}
                  onPress={() => {
                    console.log('Remove button pressed for file:', file.name);
                    if (file.status !== 'uploading') {
                      removeFile(file.id);
                    }
                  }}
                  disabled={file.status === 'uploading'}
                  activeOpacity={file.status === 'uploading' ? 1 : 0.7}
                >
                  <Icon 
                    name="close" 
                    size={20} 
                    color={file.status === 'uploading' ? '#ccc' : '#F44336'} 
                  />
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </View>

      {/* Navigation Buttons */}
      <View style={styles.navigationButtons}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => {
            console.log('Back button pressed in DocumentUpload');
            if (onBack && typeof onBack === 'function') {
              onBack();
            } else {
              console.log('onBack function not available');
            }
          }}
          activeOpacity={0.7}
        >
          <Text style={styles.backButtonText}>{t.back}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.skipButton} 
          onPress={() => {
            console.log('Skip button pressed in DocumentUpload');
            if (onNext && typeof onNext === 'function') {
              onNext([]);
            } else {
              console.log('onNext function not available');
            }
          }}
          activeOpacity={0.7}
        >
          <Text style={styles.skipButtonText}>{t.skip}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[
            styles.continueButton,
            uploadedFiles.length === 0 && styles.continueButtonDisabled
          ]} 
          onPress={() => {
            console.log('Continue button pressed in DocumentUpload with files:', uploadedFiles.length);
            if (onNext && typeof onNext === 'function') {
              onNext(uploadedFiles);
            } else {
              console.log('onNext function not available');
            }
          }}
          disabled={uploadedFiles.length === 0}
          activeOpacity={uploadedFiles.length === 0 ? 1 : 0.7}
        >
          <Text style={[
            styles.continueButtonText,
            uploadedFiles.length === 0 && { color: '#999' }
          ]}>
            {t.continue}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
  uploadArea: {
    margin: 20,
    padding: 30,
    backgroundColor: '#E0F7FA',
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#00695C',
    borderStyle: 'dashed',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  uploadText: {
    fontSize: 18,
    color: '#00695C',
    fontWeight: '600',
    marginTop: 15,
    textAlign: 'center',
  },
  supportedText: {
    fontSize: 14,
    color: '#00695C',
    marginTop: 5,
    textAlign: 'center',
  },
  uploadOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 20,
    gap: 10,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 25,
    minWidth: width * 0.25,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3.84,
    elevation: 3,
  },
  uploadButtonDisabled: {
    opacity: 0.5,
  },
  cameraButton: {
    backgroundColor: '#FF5722',
  },
  galleryButton: {
    backgroundColor: '#2196F3',
  },
  filesButton: {
    backgroundColor: '#FF9800',
  },
  uploadButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 8,
  },
  offlineIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  offlineText: {
    fontSize: 14,
    color: '#FF9800',
    marginLeft: 8,
  },
  filesSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  noFiles: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  noFilesText: {
    fontSize: 16,
    color: '#999',
    marginTop: 10,
  },
  fileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  fileInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  fileDetails: {
    flex: 1,
    marginLeft: 15,
  },
  fileName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  fileSize: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    marginRight: 10,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: '#666',
    width: 35,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  successText: {
    fontSize: 12,
    color: '#4CAF50',
    marginLeft: 5,
  },
  errorText: {
    fontSize: 12,
    color: '#F44336',
    marginLeft: 5,
  },
  fileActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  retryButton: {
    padding: 8,
    marginRight: 10,
  },
  removeButton: {
    padding: 8,
  },
  removeButtonDisabled: {
    opacity: 0.5,
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 30,
    gap: 10,
  },
  backButton: {
    flex: 1,
    paddingVertical: 15,
    backgroundColor: '#E0E0E0',
    borderRadius: 12,
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '600',
  },
  skipButton: {
    flex: 1,
    paddingVertical: 15,
    backgroundColor: '#FFF',
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#00695C',
  },
  skipButtonText: {
    fontSize: 16,
    color: '#00695C',
    fontWeight: '600',
  },
  continueButton: {
    flex: 1,
    paddingVertical: 15,
    backgroundColor: '#00695C',
    borderRadius: 12,
    alignItems: 'center',
  },
  continueButtonDisabled: {
    backgroundColor: '#B0BEC5',
  },
  continueButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
});

export default DocumentUpload;
