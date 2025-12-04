import { Complaint, Teacher } from '../types';

const COMPLAINTS_KEY = 'seacollege_complaints';
const TEACHERS_KEY = 'seacollege_teachers';

export const getComplaints = (): Complaint[] => {
  const data = localStorage.getItem(COMPLAINTS_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveComplaint = (complaint: Complaint): void => {
  const current = getComplaints();
  localStorage.setItem(COMPLAINTS_KEY, JSON.stringify([...current, complaint]));
};

export const updateComplaintStatus = (id: string, status: 'solved'): void => {
  const current = getComplaints();
  const updated = current.map((c) => (c.id === id ? { ...c, status } : c));
  localStorage.setItem(COMPLAINTS_KEY, JSON.stringify(updated));
};

export const getTeachers = (): Teacher[] => {
  const data = localStorage.getItem(TEACHERS_KEY);
  return data ? JSON.parse(data) : [];
};

export const registerTeacher = (teacher: Teacher): boolean => {
  const teachers = getTeachers();
  if (teachers.some((t) => t.email === teacher.email)) {
    return false; // Already exists
  }
  localStorage.setItem(TEACHERS_KEY, JSON.stringify([...teachers, teacher]));
  return true;
};

export const verifyTeacher = (email: string, password: string): Teacher | null => {
  const teachers = getTeachers();
  const teacher = teachers.find((t) => t.email === email && t.password === password);
  return teacher || null;
};
