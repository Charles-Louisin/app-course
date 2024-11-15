'use client';
import { useState, useEffect } from 'react';

export default function UserForm({ user, type, courses, onSubmit, onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    courses: []
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        courses: user.courses?.map(c => c._id) || []
      });
    }
  }, [user]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-6 text-gray-600">
          {user ? `Modifier ${type}` : `Ajouter ${type}`}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nom</label>
            <input
              type="text"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-gray-900"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              {type === 'étudiant' ? 'Cours suivis' : 'Cours enseignés'}
            </label>
            <select
              multiple
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              value={formData.courses}
              onChange={(e) => setFormData({
                ...formData,
                courses: Array.from(e.target.selectedOptions, option => option.value)
              })}
            >
              {Array.isArray(courses) ? courses.map(course => (
                <option className='text-gray-700' key={course._id} value={course._id}>
                  {course.name}
                </option>
              )) : null}
            </select>
            <p className="mt-1 text-sm text-gray-500">
              Maintenez Ctrl (ou Cmd sur Mac) pour sélectionner plusieurs cours
            </p>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              {user ? 'Modifier' : 'Créer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 