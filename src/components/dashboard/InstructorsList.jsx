'use client';
import { useState } from 'react';
import UserForm from '../forms/UserForm';

export default function InstructorsList({ instructors, courses, isAdmin, readOnly }) {
  const [showForm, setShowForm] = useState(false);
  const [editingInstructor, setEditingInstructor] = useState(null);

  const handleSubmit = async (formData) => {
    try {
      const url = editingInstructor 
        ? `http://localhost:5000/api/instructors/${editingInstructor._id}`
        : 'http://localhost:5000/api/instructors';
      
      const response = await fetch(url, {
        method: editingInstructor ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setShowForm(false);
        setEditingInstructor(null);
        window.location.reload();
      }
    } catch (error) {
      console.error('Error submitting instructor:', error);
    }
  };

  const handleEdit = (instructor) => {
    setEditingInstructor(instructor);
    setShowForm(true);
  };

  const handleDelete = async (instructorId) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet instructeur ?')) return;

    try {
      const response = await fetch(`http://localhost:5000/api/instructors/${instructorId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        window.location.reload();
      }
    } catch (error) {
      console.error('Error deleting instructor:', error);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Liste des instructeurs</h2>
        {isAdmin && (
          <button 
            onClick={() => setShowForm(true)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium"
          >
            Ajouter un instructeur
          </button>
        )}
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nom
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date d'embauche
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cours enseignés
              </th>
              {isAdmin && (
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {Array.isArray(instructors) ? instructors.map((instructor) => (
              <tr key={instructor._id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {instructor.user?.name || 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {instructor.user?.email || 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {instructor.user?.createdAt 
                    ? new Date(instructor.user.createdAt).toLocaleDateString('fr-FR')
                    : 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {instructor.courses?.map(course => course.name).join(', ') || 'Aucun cours'}
                </td>
                {isAdmin && (
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button 
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                      onClick={() => handleEdit(instructor)}
                    >
                      Modifier
                    </button>
                    <button 
                      className="text-red-600 hover:text-red-900"
                      onClick={() => handleDelete(instructor._id)}
                    >
                      Supprimer
                    </button>
                  </td>
                )}
              </tr>
            )) : null}
          </tbody>
        </table>
      </div>

      {showForm && isAdmin && (
        <UserForm
          user={editingInstructor?.user}
          type="instructeur"
          courses={courses}
          onSubmit={handleSubmit}
          onClose={() => {
            setShowForm(false);
            setEditingInstructor(null);
          }}
        />
      )}
    </div>
  );
} 