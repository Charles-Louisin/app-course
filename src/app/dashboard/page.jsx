'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import CoursesList from '@/components/dashboard/CoursesList';
import StudentsList from '@/components/dashboard/StudentsList';
import InstructorsList from '@/components/dashboard/InstructorsList';

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('courses');
  const [data, setData] = useState({
    courses: [],
    students: [],
    instructors: []
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/login');
      return;
    }

    const fetchUserData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
          fetchDashboardData(token, userData.user.userType);
        } else {
          router.push('/auth/login');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const fetchDashboardData = async (token, userType) => {
    try {
      // Toujours récupérer les cours
      const coursesRes = await fetch('http://localhost:5000/api/courses', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const coursesData = await coursesRes.json();

      // Récupérer les étudiants pour tous sauf les étudiants eux-mêmes
      let studentsData = { data: [] };
      if (userType !== 'student') {
        const studentsRes = await fetch('http://localhost:5000/api/students', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        studentsData = await studentsRes.json();
      }

      // Récupérer les instructeurs uniquement pour les administrateurs et les instructeurs
      let instructorsData = { data: [] };
      if (userType === 'administrator' || userType === 'instructor') {
        const instructorsRes = await fetch('http://localhost:5000/api/instructors', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        instructorsData = await instructorsRes.json();
      }

      setData({
        courses: coursesData.data || [],
        students: studentsData.data || [],
        instructors: instructorsData.data || []
      });
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const userType = user?.user.userType;

  const getAvailableTabs = () => {
    switch (userType) {
      case 'administrator':
        return ['courses', 'students', 'instructors'];
      case 'instructor':
        return ['courses', 'students', 'instructors'];
      case 'student':
        return ['courses', 'students'];
      default:
        return ['courses'];
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold text-gray-900">Tableau de bord</h1>
              </div>
            </div>
            <div className="flex items-center">
              <span className="text-gray-700 mr-4">
                Bienvenue, {user?.user.name}
              </span>
              <button
                onClick={() => {
                  localStorage.removeItem('token');
                  router.push('/auth/login');
                }}
                className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Onglets de navigation */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            {getAvailableTabs().map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`${
                  activeTab === tab
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </div>

        {/* Contenu du tableau de bord */}
        <div className="bg-white shadow rounded-lg p-6">
          {activeTab === 'courses' && (
            <CoursesList 
              courses={data.courses} 
              instructors={data.instructors}
              isAdmin={userType === 'administrator'}
            />
          )}
          {activeTab === 'students' && (
            <StudentsList 
              students={data.students}
              courses={data.courses}
              isAdmin={userType === 'administrator'}
              readOnly={userType !== 'administrator'}
            />
          )}
          {activeTab === 'instructors' && (userType === 'administrator' || userType === 'instructor') && (
            <InstructorsList 
              instructors={data.instructors}
              courses={data.courses}
              isAdmin={userType === 'administrator'}
              readOnly={userType !== 'administrator'}
            />
          )}
        </div>
      </div>
    </div>
  );
} 