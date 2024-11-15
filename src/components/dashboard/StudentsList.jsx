'use client';
import { useState } from 'react';
import UserForm from '../forms/UserForm';

export default function StudentsList({ students, courses, isAdmin, readOnly }) {
  const [showForm, setShowForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);

  const handleSubmit = async (formData) => {
    try {
      const url = editingStudent 
        ? `http://localhost:5000/api/students/${editingStudent._id}`
        : 'http://localhost:5000/api/students';
      
      const response = await fetch(url, {
        method: editingStudent ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setShowForm(false);
        setEditingStudent(null);
        window.location.reload();
      }
    } catch (error) {
      console.error('Error submitting student:', error);
    }
  };

  const handleEdit = (student) => {
    setEditingStudent(student);
    setShowForm(true);
  };

  const handleDelete = async (studentId) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet étudiant ?')) return;

    try {
      const response = await fetch(`http://localhost:5000/api/students/${studentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        window.location.reload();
      }
    } catch (error) {
      console.error('Error deleting student:', error);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Liste des étudiants</h2>
        {isAdmin && (
          <button 
            onClick={() => setShowForm(true)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium"
          >
            Ajouter un étudiant
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
                Date d&apos;inscription
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cours suivis
              </th>
              {isAdmin && (
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {Array.isArray(students) ? students.map((student) => (
              <tr key={student._id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {student.user.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {student.user.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(student.user.createdAt).toLocaleDateString('fr-FR')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {student.courses.map(course => course.name).join(', ')}
                </td>
                {isAdmin && (
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button 
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                      onClick={() => handleEdit(student)}
                    >
                      Modifier
                    </button>
                    <button 
                      className="text-red-600 hover:text-red-900"
                      onClick={() => handleDelete(student._id)}
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
          user={editingStudent?.user}
          type="étudiant"
          courses={courses}
          onSubmit={handleSubmit}
          onClose={() => {
            setShowForm(false);
            setEditingStudent(null);
          }}
        />
      )}
    </div>
  );
} 