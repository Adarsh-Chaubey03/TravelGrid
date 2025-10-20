const expect = require('chai').expect;
const sinon = require('sinon');
const multiModalController = require('../controller/multiModalController');
const multiModalPlanner = require('../services/multiModalPlanner');
const TransportOption = require('../models/TransportOption');

describe('Multi-Modal Controller', function() {
  let req, res;

  beforeEach(function() {
    req = {
      query: {},
      body: {},
      params: {}
    };
    
    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub().returnsThis()
    };
  });

  describe('getTransportOptions', function() {
    it('should return 400 if required parameters are missing', async function() {
      await multiModalController.getTransportOptions(req, res);
      
      expect(res.status.calledWith(400)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
    });

    it('should return transport options when parameters are valid', async function() {
      req.query = {
        origin: 'NYC',
        destination: 'LA',
        date: '2023-12-01'
      };
      
      const mockOptions = [
        { type: 'flight', provider: 'Delta', price: 300 },
        { type: 'train', provider: 'Amtrak', price: 150 }
      ];
      
      sinon.stub(multiModalPlanner, 'findTransportOptions').resolves(mockOptions);
      
      await multiModalController.getTransportOptions(req, res);
      
      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
      
      multiModalPlanner.findTransportOptions.restore();
    });
  });

  describe('getOptimizedItinerary', function() {
    it('should return 400 if route segments are missing', async function() {
      await multiModalController.getOptimizedItinerary(req, res);
      
      expect(res.status.calledWith(400)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
    });

    it('should return optimized itinerary when route segments are provided', async function() {
      req.body = {
        routeSegments: [
          { origin: 'NYC', destination: 'LA', date: '2023-12-01' }
        ]
      };
      
      const mockItinerary = [
        {
          segment: { origin: 'NYC', destination: 'LA' },
          selectedOption: { type: 'flight', price: 300 }
        }
      ];
      
      sinon.stub(multiModalPlanner, 'createMultiModalItinerary').resolves(mockItinerary);
      
      await multiModalController.getOptimizedItinerary(req, res);
      
      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
      
      multiModalPlanner.createMultiModalItinerary.restore();
    });
  });
});