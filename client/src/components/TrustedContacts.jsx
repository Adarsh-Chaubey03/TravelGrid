import React, { useState } from 'react';
import { useSafety } from '../context/SafetyContext';
import { User, Phone, Mail, Plus, Trash2, Edit } from 'lucide-react';

const TrustedContacts = () => {
  const { safetyProfile, addTrustedContact } = useSafety();
  const [showAddForm, setShowAddForm] = useState(false);
  const [newContact, setNewContact] = useState({
    name: '',
    email: '',
    phone: '',
    relationship: '',
    isEmergencyContact: false
  });
  const [editingContact, setEditingContact] = useState(null);

  const handleAddContact = async (e) => {
    e.preventDefault();
    
    try {
      await addTrustedContact(newContact);
      setNewContact({
        name: '',
        email: '',
        phone: '',
        relationship: '',
        isEmergencyContact: false
      });
      setShowAddForm(false);
    } catch (error) {
      alert('Failed to add contact: ' + error.message);
    }
  };

  const handleEditContact = (contact) => {
    setEditingContact(contact);
    setNewContact({ ...contact });
    setShowAddForm(true);
  };

  const handleDeleteContact = (contactId) => {
    // In a real implementation, this would call an API to delete the contact
    alert('Contact deletion would be implemented here');
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white flex items-center">
          <User className="mr-3 text-blue-500" />
          Trusted Contacts
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          Manage your trusted contacts who will be notified in case of emergencies
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Your Trusted Contacts</h2>
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Plus className="mr-2" size={18} />
            Add Contact
          </button>
        </div>

        {showAddForm && (
          <div className="mb-6 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4">
              {editingContact ? 'Edit Contact' : 'Add New Contact'}
            </h3>
            
            <form onSubmit={handleAddContact}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={newContact.name}
                    onChange={(e) => setNewContact({...newContact, name: e.target.value})}
                    required
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Relationship
                  </label>
                  <input
                    type="text"
                    value={newContact.relationship}
                    onChange={(e) => setNewContact({...newContact, relationship: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="email"
                      value={newContact.email}
                      onChange={(e) => setNewContact({...newContact, email: e.target.value})}
                      required
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="tel"
                      value={newContact.phone}
                      onChange={(e) => setNewContact({...newContact, phone: e.target.value})}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex items-center mb-4">
                <input
                  type="checkbox"
                  id="emergencyContact"
                  checked={newContact.isEmergencyContact}
                  onChange={(e) => setNewContact({...newContact, isEmergencyContact: e.target.checked})}
                  className="h-4 w-4 text-blue-500 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="emergencyContact" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  Emergency Contact (receives immediate alerts)
                </label>
              </div>
              
              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  {editingContact ? 'Update Contact' : 'Add Contact'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingContact(null);
                    setNewContact({
                      name: '',
                      email: '',
                      phone: '',
                      relationship: '',
                      isEmergencyContact: false
                    });
                  }}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {safetyProfile && safetyProfile.trustedContacts && safetyProfile.trustedContacts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {safetyProfile.trustedContacts.map((contact, index) => (
              <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex justify-between">
                  <div className="flex items-center">
                    <div className="bg-gray-200 border-2 border-dashed rounded-xl w-12 h-12 flex items-center justify-center">
                      <User className="text-gray-500" size={24} />
                    </div>
                    <div className="ml-4">
                      <h3 className="font-medium text-gray-800 dark:text-white">{contact.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{contact.relationship}</p>
                    </div>
                  </div>
                  {contact.isEmergencyContact && (
                    <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                      Emergency
                    </span>
                  )}
                </div>
                
                <div className="mt-4 space-y-2">
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <Mail className="mr-2" size={16} />
                    <span>{contact.email}</span>
                  </div>
                  {contact.phone && (
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <Phone className="mr-2" size={16} />
                      <span>{contact.phone}</span>
                    </div>
                  )}
                </div>
                
                <div className="flex space-x-2 mt-4">
                  <button
                    onClick={() => handleEditContact(contact)}
                    className="flex items-center text-blue-500 hover:text-blue-700 text-sm"
                  >
                    <Edit className="mr-1" size={16} />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteContact(contact._id)}
                    className="flex items-center text-red-500 hover:text-red-700 text-sm"
                  >
                    <Trash2 className="mr-1" size={16} />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <User className="mx-auto text-gray-400" size={48} />
            <h3 className="mt-4 text-lg font-medium text-gray-800 dark:text-white">No trusted contacts yet</h3>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Add trusted contacts who will be notified in case of emergencies
            </p>
            <button
              onClick={() => setShowAddForm(true)}
              className="mt-4 inline-flex items-center bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Plus className="mr-2" size={18} />
              Add Your First Contact
            </button>
          </div>
        )}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="text-blue-500 font-bold text-lg mb-2">1</div>
            <h3 className="font-medium text-gray-800 dark:text-white mb-2">Add Trusted Contacts</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Add family, friends, or colleagues who can be contacted in emergencies
            </p>
          </div>
          
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="text-green-500 font-bold text-lg mb-2">2</div>
            <h3 className="font-medium text-gray-800 dark:text-white mb-2">Emergency Notification</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              When you trigger SOS or miss a check-in, your contacts are immediately notified
            </p>
          </div>
          
          <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <div className="text-purple-500 font-bold text-lg mb-2">3</div>
            <h3 className="font-medium text-gray-800 dark:text-white mb-2">Location Sharing</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Your real-time location is shared with emergency contacts for quick assistance
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrustedContacts;