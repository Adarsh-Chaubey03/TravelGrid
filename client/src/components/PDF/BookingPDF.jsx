import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 25,
    fontSize: 10,
    fontFamily: 'Helvetica',
    backgroundColor: '#ffffff',
    color: '#333333'
  },
  header: {
    backgroundColor: '#ec4899',
    padding: 12,
    marginBottom: 15,
    borderRadius: 6,
    color: 'white'
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 3
  },
  subtitle: {
    fontSize: 10,
    textAlign: 'center',
    opacity: 0.9
  },
  section: {
    marginBottom: 12,
    padding: 10,
    backgroundColor: '#f8f9fa',
    borderRadius: 4,
    border: '1px solid #e9ecef'
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#ec4899',
    borderBottom: '1px solid #ec4899',
    paddingBottom: 3
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 3,
    paddingVertical: 1
  },
  label: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#555555',
    flex: 1
  },
  value: {
    fontSize: 10,
    color: '#333333',
    flex: 1,
    textAlign: 'right'
  },
  totalSection: {
    backgroundColor: '#ec4899',
    padding: 10,
    borderRadius: 4,
    marginTop: 8
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  totalLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'white'
  },
  totalValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white'
  },
  footer: {
    marginTop: 15,
    padding: 8,
    backgroundColor: '#f1f3f4',
    borderRadius: 4,
    textAlign: 'center'
  },
  footerText: {
    fontSize: 8,
    color: '#666666',
    marginBottom: 2
  },
  qrImage: {
    width: 80,
    height: 80,
    marginTop: 15,
    alignSelf: 'center'
  },
  divider: {
    borderBottom: '1px solid #e9ecef',
    marginVertical: 10
  }
});

const BookingPDF = ({ user, hotel, bookingId, bookingData, totalPrice, qrImage }) => {
  const roomTypes = {
    'standard': 'Standard Room',
    'deluxe': 'Deluxe Room',
    'suite': 'Executive Suite',
    'presidential': 'Presidential Suite'
  };

  return (
    <Document>
      <Page style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Hotel Booking Confirmation</Text>
          <Text style={styles.subtitle}>TravelGrid - Your Travel Partner</Text>
        </View>
        
        {/* Booking ID Highlight */}
        <View style={styles.totalSection}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Booking ID:</Text>
            <Text style={styles.totalValue}>{bookingId}</Text>
          </View>
        </View>
        
        {/* Guest Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Guest Information</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Name:</Text>
            <Text style={styles.value}>{bookingData?.guestName || user?.name || "Guest"}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Email:</Text>
            <Text style={styles.value}>{user?.email || bookingData?.email || "guest@example.com"}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Contact:</Text>
            <Text style={styles.value}>{bookingData?.contactNumber || "N/A"}</Text>
          </View>
        </View>
        
        {/* Hotel Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Hotel Information</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Hotel Name:</Text>
            <Text style={styles.value}>{hotel.name}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Location:</Text>
            <Text style={styles.value}>{hotel.location}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Room Type:</Text>
            <Text style={styles.value}>{roomTypes[bookingData?.roomType] || 'Standard Room'}</Text>
          </View>
        </View>
        
        {/* Booking Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Booking Details</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Check-in Date:</Text>
            <Text style={styles.value}>{bookingData?.checkIn || 'N/A'}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Check-out Date:</Text>
            <Text style={styles.value}>{bookingData?.checkOut || 'N/A'}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Number of Guests:</Text>
            <Text style={styles.value}>{bookingData?.guests || 1}</Text>
          </View>
          {bookingData?.checkIn && bookingData?.checkOut && (
            <View style={styles.row}>
              <Text style={styles.label}>Number of Nights:</Text>
              <Text style={styles.value}>{Math.ceil((new Date(bookingData.checkOut) - new Date(bookingData.checkIn)) / (1000 * 60 * 60 * 24))} nights</Text>
            </View>
          )}
        </View>
        
        {/* Special Requests */}
        {bookingData?.specialRequests && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Special Requests</Text>
            <Text style={styles.value}>{bookingData.specialRequests}</Text>
          </View>
        )}
        
        {/* Total Amount */}
        <View style={styles.totalSection}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total Amount:</Text>
            <Text style={styles.totalValue}>₹{totalPrice || hotel.price}</Text>
          </View>
        </View>
        
        {/* QR Code */}
        {qrImage && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>QR Code</Text>
            <Image style={styles.qrImage} src={qrImage} />
          </View>
        )}
        
        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Thank you for choosing TravelGrid!</Text>
          <Text style={styles.footerText}>Please present this confirmation at check-in.</Text>
          <Text style={styles.footerText}>For any queries, contact us at support@travelgrid.com</Text>
        </View>
      </Page>
    </Document>
  );
};

export default BookingPDF;
