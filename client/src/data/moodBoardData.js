// Demo data for the AI-Powered Travel Mood Board feature

export const sampleMoodBoards = [
    {
        id: 1,
        title: "Paris Dream Vacation",
        description: "A romantic getaway to the City of Light",
        colorPalette: ['#E8F4FD', '#FFE5E5', '#F0F8FF', '#FFF8DC', '#F5F5DC'],
        themes: ['Romance', 'Culture', 'Food', 'Architecture'],
        activities: ['Eiffel Tower visit', 'Louvre Museum', 'Seine River cruise', 'Montmartre exploration'],
        accommodations: 'Boutique hotel in Le Marais',
        dining: 'Traditional French bistros and patisseries',
        vibe: 'Elegant and romantic',
        createdAt: '2024-01-15',
        updatedAt: '2024-01-20',
        lastModified: '2024-01-20',
        collaborators: 2,
        elements: [
            {
                id: 1,
                type: 'image',
                x: 100,
                y: 100,
                width: 200,
                height: 150,
                rotation: 0,
                zIndex: 0,
                imageUrl: 'https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=400&h=300&fit=crop',
                opacity: 1
            },
            {
                id: 2,
                type: 'text',
                x: 350,
                y: 120,
                width: 180,
                height: 100,
                rotation: 0,
                zIndex: 1,
                content: 'Paris, France',
                color: '#2C3E50',
                fontSize: 24,
                fontFamily: 'Inter',
                fontWeight: 'bold',
                opacity: 1
            },
            {
                id: 3,
                type: 'shape',
                x: 320,
                y: 250,
                width: 120,
                height: 80,
                rotation: 0,
                zIndex: 2,
                color: '#E74C3C',
                opacity: 0.8
            }
        ]
    },
    {
        id: 2,
        title: "Bali Adventure",
        description: "Tropical paradise with cultural experiences",
        colorPalette: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'],
        themes: ['Adventure', 'Nature', 'Culture', 'Relaxation'],
        activities: ['Temple visits', 'Rice terrace trekking', 'Beach relaxation', 'Balinese cooking class'],
        accommodations: 'Eco-resort in Ubud',
        dining: 'Local warungs and fresh seafood',
        vibe: 'Peaceful and adventurous',
        createdAt: '2024-01-10',
        updatedAt: '2024-01-18',
        lastModified: '2024-01-18',
        collaborators: 1,
        elements: [
            {
                id: 4,
                type: 'image',
                x: 150,
                y: 150,
                width: 220,
                height: 160,
                rotation: 5,
                zIndex: 0,
                imageUrl: 'https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=400&h=300&fit=crop',
                opacity: 1
            },
            {
                id: 5,
                type: 'text',
                x: 400,
                y: 180,
                width: 160,
                height: 80,
                rotation: 0,
                zIndex: 1,
                content: 'Bali, Indonesia',
                color: '#27AE60',
                fontSize: 20,
                fontFamily: 'Inter',
                fontWeight: '600',
                opacity: 1
            }
        ]
    },
    {
        id: 3,
        title: "New York City Experience",
        description: "The city that never sleeps",
        colorPalette: ['#34495E', '#E74C3C', '#F39C12', '#3498DB', '#9B59B6'],
        themes: ['Urban', 'Culture', 'Food', 'Entertainment'],
        activities: ['Broadway show', 'Central Park walk', 'Museum visits', 'Times Square exploration'],
        accommodations: 'Modern hotel in Manhattan',
        dining: 'Diverse international cuisine',
        vibe: 'Dynamic and energetic',
        createdAt: '2024-01-05',
        updatedAt: '2024-01-15',
        lastModified: '2024-01-15',
        collaborators: 3,
        elements: [
            {
                id: 6,
                type: 'image',
                x: 200,
                y: 100,
                width: 180,
                height: 140,
                rotation: -3,
                zIndex: 0,
                imageUrl: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400&h=300&fit=crop',
                opacity: 1
            }
        ]
    }
];

export const sampleCollaborators = [
    {
        id: 1,
        name: 'Sarah Johnson',
        email: 'sarah.j@example.com',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
        status: 'online',
        lastActive: '2024-01-20T10:30:00Z'
    },
    {
        id: 2,
        name: 'Mike Chen',
        email: 'mike.chen@example.com',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
        status: 'online',
        lastActive: '2024-01-20T10:25:00Z'
    },
    {
        id: 3,
        name: 'Emma Davis',
        email: 'emma.davis@example.com',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
        status: 'away',
        lastActive: '2024-01-20T09:45:00Z'
    }
];

export const sampleMessages = [
    {
        id: 1,
        text: "I love the color palette for the Paris board!",
        sender: "Sarah Johnson",
        senderId: 1,
        timestamp: "2024-01-20T10:30:00Z",
        type: "text"
    },
    {
        id: 2,
        text: "Maybe we should add more food-related elements?",
        sender: "Mike Chen",
        senderId: 2,
        timestamp: "2024-01-20T10:28:00Z",
        type: "text"
    },
    {
        id: 3,
        text: "Great idea! I'll add some restaurant recommendations.",
        sender: "Sarah Johnson",
        senderId: 1,
        timestamp: "2024-01-20T10:25:00Z",
        type: "text"
    }
];

export const defaultBoard = {
    id: null,
    title: 'Untitled Mood Board',
    description: 'Start creating your travel vision',
    colorPalette: ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe'],
    themes: [],
    activities: [],
    accommodations: '',
    dining: '',
    vibe: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    elements: []
};
