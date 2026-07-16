// User Types
export interface User {
  _id: string;
  email: string;
  name: string;
  profilePicture?: string;
  role: 'user' | 'admin';
  createdAt: Date;
  updatedAt: Date;
}

// Passport Photo Types
export interface PassportPhoto {
  _id: string;
  userId: string;
  originalImageUrl: string;
  processedImageUrl: string;
  country: string;
  dimensions: {
    width: number;
    height: number;
    unit: 'mm' | 'inch';
  };
  backgroundColor: string;
  numberOfCopies: number;
  hasPrinting: boolean;
  printingDetails?: {
    text: string;
    fontSize: number;
    fontFamily: string;
    fontWeight: 'normal' | 'bold';
    color: string;
    alignment: 'left' | 'center' | 'right';
  };
  sheetImageUrl?: string;
  dpi: number;
  createdAt: Date;
  updatedAt: Date;
}

// Face Detection Types
export interface FaceDetectionResult {
  detected: boolean;
  coordinates?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  landmarks?: {
    leftEye: [number, number];
    rightEye: [number, number];
    nose: [number, number];
    mouth: [number, number];
  };
  headTiltAngle?: number;
  confidence: number;
}

// Validation Types
export interface PassportValidationRule {
  name: string;
  passed: boolean;
  message: string;
  suggestion?: string;
}

export interface PassportValidationResult {
  isValid: boolean;
  rules: PassportValidationRule[];
  overallScore: number;
}

// Country Preset Types
export interface CountryPreset {
  country: string;
  code: string;
  width: number;
  height: number;
  unit: 'mm' | 'inch';
  requirements: {
    minHeadSize: number;
    maxHeadSize: number;
    backgroundColor: string[];
    eyeLevel: number;
  };
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Generator State Types
export interface GeneratorState {
  step: 'upload' | 'face-detection' | 'background' | 'color' | 'validation' | 'enhancement' | 'dimensions' | 'preview' | 'complete';
  originalImage?: File;
  processedImageUrl?: string;
  faceDetectionResult?: FaceDetectionResult;
  backgroundColor: string;
  country: string;
  numberOfCopies: number;
  hasPrinting: boolean;
  printingText?: string;
  validationResult?: PassportValidationResult;
  enhancements: {
    brightness: number;
    contrast: number;
    exposure: number;
    sharpness: number;
    noiseReduction: number;
    skinTone: number;
    hairEdge: number;
  };
  dpi: number;
}

// Download Types
export interface Download {
  _id: string;
  photoId: string;
  userId: string;
  format: 'png' | 'jpg' | 'pdf';
  downloadedAt: Date;
}
