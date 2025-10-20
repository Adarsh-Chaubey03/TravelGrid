const expect = require('chai').expect;
const multiModalPlanner = require('../services/multiModalPlanner');

describe('Multi-Modal Planner Service', function() {
  describe('calculateDynamicPrice', function() {
    it('should calculate dynamic price based on factors', function() {
      const transportOption = {
        basePrice: 100,
        priceFactors: {
          demand: 1,
          timeFactor: 1,
          seasonFactor: 1
        }
      };
      
      const bookingDate = new Date();
      const dynamicPrice = multiModalPlanner.calculateDynamicPrice(transportOption, bookingDate);
      
      expect(dynamicPrice).to.be.a('number');
      expect(dynamicPrice).to.be.at.least(transportOption.basePrice);
    });
  });

  describe('calculateCarbonFootprint', function() {
    it('should calculate carbon footprint based on transport type', function() {
      const transportOption = {
        type: 'flight',
        origin: 'NYC',
        destination: 'LA'
      };
      
      const carbonFootprint = multiModalPlanner.calculateCarbonFootprint(transportOption);
      
      expect(carbonFootprint).to.be.a('number');
      expect(carbonFootprint).to.be.above(0);
    });
  });

  describe('estimateDistance', function() {
    it('should estimate distance between locations', function() {
      const distance = multiModalPlanner.estimateDistance('NYC', 'LA');
      
      expect(distance).to.be.a('number');
      expect(distance).to.be.at.least(100);
      expect(distance).to.be.at.most(2000);
    });
  });
});