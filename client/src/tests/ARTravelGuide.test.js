import React from 'react';
import { render, screen } from '@testing-library/react';
import ARTravelGuide from '../components/ARTravelGuide';

// Mock the useARSession hook
jest.mock('../hooks/useARSession', () => ({
  __esModule: true,
  default: () => ({
    isSupported: true,
    arSession: null,
    deviceOrientation: null,
    acceleration: null,
    error: null,
    initARSession: jest.fn(),
    endARSession: jest.fn()
  })
}));

// Mock the service functions
jest.mock('../services/objectRecognitionService', () => ({
  recognizeObjects: jest.fn().mockResolvedValue([]),
  getObjectInfo: jest.fn().mockResolvedValue({})
}));

jest.mock('../services/translationOverlay', () => ({
  translateText: jest.fn().mockResolvedValue('Translated Text')
}));

// Mock the ARPointCloud class
jest.mock('../models/ARPointCloud', () => {
  return jest.fn().mockImplementation(() => {
    return {
      update: jest.fn(),
      render: jest.fn(),
      findNearbyPoints: jest.fn().mockReturnValue([]),
      getStats: jest.fn().mockReturnValue({ totalPoints: 0 }),
      clear: jest.fn()
    };
  });
});

describe('ARTravelGuide', () => {
  const mockLocation = {
    id: 1,
    name: 'Test Location',
    country: 'Test Country',
    region: 'Test Region',
    coordinates: '0,0',
    overview: {
      description: 'Test description'
    }
  };

  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders without crashing', () => {
    render(<ARTravelGuide location={mockLocation} onClose={mockOnClose} />);
    expect(screen.getByText('Close AR')).toBeInTheDocument();
  });

  test('displays location information', () => {
    render(<ARTravelGuide location={mockLocation} onClose={mockOnClose} />);
    expect(screen.getByText('Test Location')).toBeInTheDocument();
    expect(screen.getByText('Test description')).toBeInTheDocument();
  });

  test('calls onClose when close button is clicked', () => {
    render(<ARTravelGuide location={mockLocation} onClose={mockOnClose} />);
    const closeButton = screen.getByText('Close AR');
    closeButton.click();
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
});