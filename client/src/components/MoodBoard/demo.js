// Demo script for the AI-Powered Travel Mood Board feature
// This file demonstrates the key features and capabilities

// Example usage of the Mood Board feature
export const demoUsage = {
    // 1. Create a new mood board
    createBoard: () => {
        console.log('🎨 Creating a new travel mood board...');
        // This would typically call the createNewBoard function
        return {
            id: Date.now(),
            title: 'Demo Travel Board',
            description: 'A demonstration of the mood board capabilities',
            colorPalette: ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe'],
            themes: ['Adventure', 'Culture', 'Nature'],
            elements: []
        };
    },

    // 2. Generate AI content
    generateAIContent: async (preferences) => {
        console.log('🤖 Generating AI content based on preferences...');
        console.log('Preferences:', preferences);

        // Simulate AI response
        const aiResponse = {
            title: 'AI-Generated Travel Concept',
            colorPalette: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4'],
            themes: ['Adventure', 'Nature', 'Culture'],
            activities: ['Hiking', 'Local cuisine', 'Historical sites'],
            accommodations: 'Eco-friendly resort',
            dining: 'Farm-to-table restaurants',
            vibe: 'Authentic and adventurous'
        };

        return aiResponse;
    },

    // 3. Add elements to the board
    addElements: (board, elements) => {
        console.log('➕ Adding elements to the mood board...');

        const updatedBoard = {
            ...board,
            elements: [...board.elements, ...elements]
        };

        console.log('Board updated with new elements:', updatedBoard.elements.length);
        return updatedBoard;
    },

    // 4. Collaborate with team members
    startCollaboration: (board, collaborators) => {
        console.log('👥 Starting collaboration session...');
        console.log('Collaborators:', collaborators.map(c => c.name));

        return {
            boardId: board.id,
            sessionId: Date.now(),
            collaborators: collaborators,
            isActive: true,
            startTime: new Date().toISOString()
        };
    },

    // 5. Export the final board
    exportBoard: (board, format = 'image') => {
        console.log(`📤 Exporting board as ${format}...`);

        const exportData = {
            boardId: board.id,
            title: board.title,
            format: format,
            timestamp: new Date().toISOString(),
            elements: board.elements.length,
            collaborators: board.collaborators?.length || 0
        };

        console.log('Export completed:', exportData);
        return exportData;
    }
};

// Demo scenarios
export const demoScenarios = {
    // Scenario 1: Solo Travel Planning
    soloTravel: async () => {
        console.log('\n🌍 Demo Scenario 1: Solo Travel Planning');

        const board = demoUsage.createBoard();
        const preferences = {
            destination: 'Japan',
            budget: 'moderate',
            style: 'cultural',
            duration: '2 weeks',
            companions: 'solo',
            interests: ['temples', 'food', 'nature'],
            mood: 'peaceful'
        };

        const aiContent = await demoUsage.generateAIContent(preferences);
        const updatedBoard = demoUsage.addElements(board, [
            { type: 'text', content: aiContent.title, x: 100, y: 100 },
            { type: 'shape', color: aiContent.colorPalette[0], x: 200, y: 150 }
        ]);

        demoUsage.exportBoard(updatedBoard, 'pdf');
    },

    // Scenario 2: Family Vacation Planning
    familyVacation: async () => {
        console.log('\n👨‍👩‍👧‍👦 Demo Scenario 2: Family Vacation Planning');

        const board = demoUsage.createBoard();
        const preferences = {
            destination: 'Disney World, Florida',
            budget: 'high',
            style: 'family-friendly',
            duration: '1 week',
            companions: 'family',
            interests: ['theme parks', 'shows', 'character meetups'],
            mood: 'magical'
        };

        const aiContent = await demoUsage.generateAIContent(preferences);
        const collaborators = [
            { name: 'Mom', role: 'planner' },
            { name: 'Dad', role: 'budget manager' },
            { name: 'Kids', role: 'activity choosers' }
        ];

        const collaboration = demoUsage.startCollaboration(board, collaborators);
        const updatedBoard = demoUsage.addElements(board, [
            { type: 'image', imageUrl: 'disney-castle.jpg', x: 100, y: 100 },
            { type: 'text', content: 'Family Magic', x: 300, y: 120 }
        ]);

        demoUsage.exportBoard(updatedBoard, 'image');
    },

    // Scenario 3: Business Trip Planning
    businessTrip: async () => {
        console.log('\n💼 Demo Scenario 3: Business Trip Planning');

        const board = demoUsage.createBoard();
        const preferences = {
            destination: 'New York City',
            budget: 'corporate',
            style: 'professional',
            duration: '3 days',
            companions: 'colleagues',
            interests: ['meetings', 'networking', 'efficient travel'],
            mood: 'productive'
        };

        const aiContent = await demoUsage.generateAIContent(preferences);
        const updatedBoard = demoUsage.addElements(board, [
            { type: 'text', content: 'Business NYC', x: 100, y: 100 },
            { type: 'shape', color: '#34495E', x: 200, y: 150 }
        ]);

        demoUsage.exportBoard(updatedBoard, 'presentation');
    }
};

// Run all demo scenarios
export const runAllDemos = async () => {
    console.log('🚀 Starting AI-Powered Travel Mood Board Demo');
    console.log('==============================================');

    try {
        await demoScenarios.soloTravel();
        await demoScenarios.familyVacation();
        await demoScenarios.businessTrip();

        console.log('\n✅ All demo scenarios completed successfully!');
        console.log('\n🎯 Key Features Demonstrated:');
        console.log('   • AI-powered content generation');
        console.log('   • Interactive mood board creation');
        console.log('   • Real-time collaboration');
        console.log('   • Multiple export formats');
        console.log('   • Responsive design');

    } catch (error) {
        console.error('❌ Demo failed:', error);
    }
};

// Export for use in development
export default {
    demoUsage,
    demoScenarios,
    runAllDemos
};

