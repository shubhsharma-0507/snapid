import axios from 'axios';

export async function detectFace(imageBase64: string) {
  try {
    const response = await fetch('/api/process/detect-face', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image: imageBase64 }),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Face detection error:', error);
    throw error;
  }
}

export async function removeBackground(imageBase64: string) {
  try {
    const response = await fetch('/api/process/remove-background', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image: imageBase64 }),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Background removal error:', error);
    throw error;
  }
}

export async function enhanceImage(imageBase64: string, enhancements: any) {
  try {
    const response = await fetch('/api/process/enhance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image: imageBase64, enhancements }),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Enhancement error:', error);
    throw error;
  }
}

export async function generateSheet(photoId: string, options: any) {
  try {
    const response = await fetch('/api/process/generate-sheet', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ photoId, options }),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Sheet generation error:', error);
    throw error;
  }
}

export function createCountryPresets() {
  return {
    india: { width: 35, height: 45, unit: 'mm', name: 'India' },
    usa: { width: 2, height: 2, unit: 'inch', name: 'USA' },
    canada: { width: 35, height: 45, unit: 'mm', name: 'Canada' },
    uk: { width: 35, height: 45, unit: 'mm', name: 'UK' },
    australia: { width: 35, height: 45, unit: 'mm', name: 'Australia' },
    europe: { width: 35, height: 45, unit: 'mm', name: 'Europe' },
    custom: { width: 35, height: 45, unit: 'mm', name: 'Custom' },
  };
}
