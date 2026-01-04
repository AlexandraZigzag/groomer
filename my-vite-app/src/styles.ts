export const styles = {
    container: {
        maxWidth: '800px',
        margin: '0 auto',
        padding: '20px',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        backgroundColor: '#f5f5f5',
        minHeight: '100vh'
    },
    header: {
        textAlign: 'center' as const,
        marginBottom: '30px'
    },
    title: {
        margin: '0 0 10px 0',
        color: '#333',
        fontSize: '28px'
    },
    subtitle: {
        margin: '0',
        color: '#666',
        fontSize: '16px'
    },
    main: {
        marginBottom: '40px'
    },
    section: {
        marginBottom: '30px'
    },
    sectionTitle: {
        fontSize: '20px',
        marginBottom: '15px',
        color: '#333'
    },
    card: {
        backgroundColor: 'white',
        borderRadius: '10px',
        padding: '20px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        marginBottom: '20px'
    },
    cardHeader: {
        marginBottom: '15px'
    },
    cardTitle: {
        margin: '0 0 10px 0',
        fontSize: '18px'
    },
    cardContent: {
        marginBottom: '20px'
    },
    infoRow: {
        display: 'flex' as const,
        justifyContent: 'space-between' as const,
        marginBottom: '8px'
    },
    infoLabel: {
        color: '#666',
        fontWeight: '500' as const
    },
    infoValue: {
        fontWeight: '500' as const
    },
    commentBox: {
        backgroundColor: '#f8f9fa',
        padding: '10px',
        borderRadius: '6px',
        marginTop: '10px',
        fontSize: '14px',
        color: '#555'
    },
    emptyCard: {
        backgroundColor: 'white',
        borderRadius: '10px',
        padding: '40px 20px',
        textAlign: 'center' as const,
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    },
    emptyText: {
        margin: '0',
        color: '#999'
    },
    addButton: {
        width: '100%',
        padding: '15px',
        backgroundColor: '#2196F3',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        fontSize: '18px',
        cursor: 'pointer',
        marginBottom: '20px',
        fontWeight: 'bold' as const
    },
    stats: {
        display: 'flex' as const,
        justifyContent: 'space-between' as const,
        backgroundColor: 'white',
        borderRadius: '10px',
        padding: '20px',
        marginBottom: '30px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    },
    statItem: {
        textAlign: 'center' as const,
        flex: '1'
    },
    statNumber: {
        display: 'block',
        fontSize: '24px',
        fontWeight: 'bold' as const,
        color: '#2196F3',
        marginBottom: '5px'
    },
    statLabel: {
        fontSize: '14px',
        color: '#666'
    },
    overlay: {
        position: 'fixed' as const,
        top: '0',
        left: '0',
        right: '0',
        bottom: '0',
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex' as const,
        alignItems: 'center' as const,
        justifyContent: 'center' as const,
        zIndex: '1000'
    },
    formContainer: {
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '25px',
        width: '90%',
        maxWidth: '500px',
        maxHeight: '90vh',
        overflow: 'auto' as const
    },
    formHeader: {
        display: 'flex' as const,
        justifyContent: 'space-between' as const,
        alignItems: 'center' as const,
        marginBottom: '20px'
    },
    formTitle: {
        margin: '0',
        fontSize: '20px'
    },
    closeButton: {
        background: 'none',
        border: 'none',
        fontSize: '28px',
        cursor: 'pointer',
        color: '#666',
        lineHeight: '1'
    },
    form: {
        display: 'flex' as const,
        flexDirection: 'column' as const
    },
    formGroup: {
        marginBottom: '20px'
    },
    label: {
        display: 'block',
        marginBottom: '8px',
        fontWeight: '500' as const,
        color: '#333'
    },
    input: {
        width: '100%',
        padding: '12px',
        border: '1px solid #ddd',
        borderRadius: '6px',
        fontSize: '16px',
        boxSizing: 'border-box' as const
    },
    textarea: {
        width: '100%',
        padding: '12px',
        border: '1px solid #ddd',
        borderRadius: '6px',
        fontSize: '16px',
        minHeight: '80px',
        resize: 'vertical' as const,
        fontFamily: 'inherit'
    },
    formButtons: {
        display: 'flex' as const,
        gap: '10px',
        marginTop: '20px'
    },
    cancelButton: {
        flex: '1',
        padding: '12px',
        backgroundColor: '#f5f5f5',
        color: '#333',
        border: 'none',
        borderRadius: '6px',
        fontSize: '16px',
        cursor: 'pointer'
    },
    submitButton: {
        flex: '1',
        padding: '12px',
        backgroundColor: '#2196F3',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        fontSize: '16px',
        cursor: 'pointer',
        fontWeight: 'bold' as const
    },
    historyList: {
        display: 'flex' as const,
        flexDirection: 'column' as const,
        gap: '10px'
    },
    historyItem: {
        backgroundColor: 'white',
        borderRadius: '8px',
        padding: '15px',
        boxShadow: '0 1px 4px rgba(0,0,0,0.1)'
    },
    historyHeader: {
        display: 'flex' as const,
        justifyContent: 'space-between' as const,
        alignItems: 'center' as const,
        marginBottom: '10px'
    },
    historyTitle: {
        margin: '0',
        fontSize: '16px'
    },
    historyDetails: {
        display: 'flex' as const,
        justifyContent: 'space-between' as const,
        alignItems: 'center' as const,
        marginBottom: '10px',
        fontSize: '14px',
        color: '#666'
    },
    historyDate: {},
    historyService: {
        backgroundColor: '#f0f0f0',
        padding: '4px 8px',
        borderRadius: '4px'
    },
    historyPrice: {
        fontWeight: 'bold' as const,
        color: '#2196F3'
    },
    historyComment: {
        fontSize: '14px',
        color: '#555',
        marginTop: '8px',
        padding: '8px',
        backgroundColor: '#f8f9fa',
        borderRadius: '4px'
    },
    historyActions: {
        display: 'flex' as const,
        gap: '5px',
        marginTop: '10px'
    },
    smallButton: {
        padding: '6px 12px',
        backgroundColor: '#6a5acd',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '14px'
    },
    footer: {
        textAlign: 'center' as const,
        padding: '20px 0',
        color: '#666',
        fontSize: '14px',
        borderTop: '1px solid #ddd'
    },
    clientStats: {
        backgroundColor: '#6a5acd',
        color: 'white',
        borderRadius: '10px',
        padding: '20px',
        marginBottom: '20px'
    },
    clientStatItem: {
        display: 'flex' as const,
        justifyContent: 'space-between' as const,
        marginBottom: '10px'
    },
    clientSelect: {
        width: '100%',
        padding: '12px',
        border: '1px solid #ddd',
        borderRadius: '6px',
        fontSize: '16px',
        marginBottom: '20px'
    },
    backButton: {
        backgroundColor: '#666',
        color: 'white',
        border: 'none',
        padding: '10px 20px',
        borderRadius: '6px',
        cursor: 'pointer',
        marginBottom: '20px'
    },
    viewHistoryButton: {
        backgroundColor: '#6a5acd',
        color: 'white',
        border: 'none',
        padding: '10px 15px',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '14px',
        marginTop: '10px'
    },
    deleteButton: {
        backgroundColor: '#f44336',
        color: 'white',
        border: 'none',
        padding: '6px 12px',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '14px'
    },
    editButton: {
        backgroundColor: '#FF9800',
        color: 'white',
        border: 'none',
        padding: '6px 12px',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '14px'
    },

    suggestionsContainer: {
        position: 'relative' as const
    },

    suggestionsList: {
        position: 'absolute' as const,
        top: '100%',
        left: 0,
        right: 0,
        backgroundColor: 'white',
        border: '1px solid #ddd',
        borderRadius: '6px',
        maxHeight: '200px',
        overflowY: 'auto' as const,
        zIndex: 1000,
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
    },

    suggestionItem: {
        padding: '10px 15px',
        cursor: 'pointer',
        borderBottom: '1px solid #f0f0f0',
        backgroundColor: 'white',
        color: '#333'
    },

    suggestionItemHover: {
        backgroundColor: '#f5f5f5'
    },

    suggestionItemSelected: {
        backgroundColor: '#f0f7ff',
        color: '#2196F3'
    }
} as const;