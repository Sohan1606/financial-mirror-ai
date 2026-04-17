import { createContext, useContext, useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';

const AnalysisContext = createContext();

export function AnalysisProvider({ children }) {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  const fetchAnalysis = async () => {
    setLoading(true);
    try {
      const res = await axiosClient.get('/leaks/analyze');
      setAnalysis(res.data);
    } catch (error) {
      console.error('Error fetching analysis:', error);
    } finally {
      setLoading(false);
    }
  };

  const uploadCSV = async (file) => {
    setLoading(true);
    const formData = new FormData();
    formData.append('csv', file);
    
    try {
      const res = await axiosClient.post('/upload/csv', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setData(res.data.transactions || []);
      setAnalysis(res.data.analysis);
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalysis();
  }, []);

  return (
    <AnalysisContext.Provider value={{
      analysis,
      data,
      loading,
      uploadCSV,
      refetch: fetchAnalysis
    }}>
      {children}
    </AnalysisContext.Provider>
  );
}

export const useAnalysis = () => {
  const context = useContext(AnalysisContext);
  if (!context) {
    throw new Error('useAnalysis must be used within AnalysisProvider');
  }
  return context;
};

