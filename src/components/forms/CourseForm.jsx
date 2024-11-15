'use client';
import { useState, useEffect } from 'react';

export default function CourseForm({ course, instructors, onSubmit, onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    duration: '',
    teachingDays: [],
    instructors: []
  });

  useEffect(() => {
    if (course) {
      setFormData({
        name: course.name,
        duration: course.duration,
        teachingDays: course.teachingDays,
        instructors: course.instructors.map(i => i._id)
      });
    }
  }, [course]);

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const handleDayToggle = (day) => {
    setFormData(prev => ({
      ...prev,
      teachingDays: prev.teachingDays.includes(day)
        ? prev.teachingDays.filter(d => d !== day)
        : [...prev.teachingDays, day]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-6 text-gray-900">
          {course ? 'Modifier le cours' : 'Ajouter un cours'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nom du cours
            </label>
            <input
              type="text"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-gray-900 placeholder-gray-400"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Durée
            </label>
            <input
              type="text"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-gray-900 placeholder-gray-400"
              value={formData.duration}
              onChange={(e) => setFormData({...formData, duration: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Jours de cours
            </label>
            <div className="grid grid-cols-2 gap-2">
              {daysOfWeek.map(day => (
                <label key={day} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.teachingDays.includes(day)}
                    onChange={() => handleDayToggle(day)}
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-sm text-gray-900">{day}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Instructeurs
            </label>
            <select
              multiple
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-gray-900"
              value={formData.instructors}
              onChange={(e) => setFormData({
                ...formData,
                instructors: Array.from(e.target.selectedOptions, option => option.value)
              })}
            >
              {Array.isArray(instructors) ? instructors.map(instructor => (
                <option key={instructor._id} value={instructor._id} className="text-gray-900">
                  {instructor.user?.name || 'Instructeur sans nom'}
                </option>
              )) : (
                <option value="" className="text-gray-900">Aucun instructeur disponible</option>
              )}
            </select>
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
              {course ? 'Modifier' : 'Créer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 