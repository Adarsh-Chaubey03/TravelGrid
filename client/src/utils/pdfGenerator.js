import jsPDF from "jspdf";
import "jspdf-autotable"; // for table formatting (if needed)

// Format date helper
export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Format duration
export const formatDuration = (days) => {
  return days === 1 ? '1 Day' : `${days} Days`;
};

// ✅ Generate Travel Plan PDF with real data
export const generateTravelPlanPDF = (planData) => {
  const doc = new jsPDF();

  // Header
  doc.setFontSize(18);
  doc.text("Travel Itinerary", 14, 20);

  // Basic Info
  doc.setFontSize(12);
  doc.text(`Destination: ${planData.destination}`, 14, 30);
  doc.text(`Number of Days: ${planData.numberOfDays}`, 14, 38);

  if (planData.startDate) {
    doc.text(`Start Date: ${formatDate(planData.startDate)}`, 14, 46);
  }

  doc.text("Interests: " + planData.interests.join(", "), 14, 54);

  // Day-wise plans
  let y = 64;
  planData.days.forEach((day, index) => {
    doc.setFontSize(14);
    doc.text(`Day ${index + 1}: ${day.title}`, 14, y);
    y += 8;

    doc.setFontSize(11);
    doc.text("Activities:", 16, y);
    y += 6;

    day.activities.forEach((activity) => {
      doc.text(`- ${activity}`, 20, y);
      y += 5;
    });

    doc.text(`Breakfast: ${day.meals.breakfast}`, 16, y);
    y += 5;
    doc.text(`Lunch: ${day.meals.lunch}`, 16, y);
    y += 5;
    doc.text(`Dinner: ${day.meals.dinner}`, 16, y);
    y += 10;

    // If content reaches bottom of page
    if (y > 270) {
      doc.addPage();
      y = 20;
    }
  });

  // Save the PDF
  const fileName = `${planData.destination}_Itinerary.pdf`;
  doc.save(fileName);
};
