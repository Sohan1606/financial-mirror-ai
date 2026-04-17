import axiosClient from './axiosClient';

export const authApi = {
  register: (data) => axiosClient.post('/auth/register', data),
  login: (data) => axiosClient.post('/auth/login', data),
  getMe: () => axiosClient.get('/auth/me'),
};

export const transactionsApi = {
  getAll: (params) => axiosClient.get('/transactions', { params }),
  create: (data) => axiosClient.post('/transactions', data),
  update: (id, data) => axiosClient.put(`/transactions/${id}`, data),
  delete: (id) => axiosClient.delete(`/transactions/${id}`),
  deleteBulk: (ids) => axiosClient.delete('/transactions/bulk', { data: { ids } }),
  getCategories: () => axiosClient.get('/transactions/categories'),
};

export const uploadApi = {
  uploadCSV: (file) => {
    const formData = new FormData();
    formData.append('csv', file);
    return axiosClient.post('/upload/csv', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};

export const goalsApi = {
  getAll: () => axiosClient.get('/goals'),
  create: (data) => axiosClient.post('/goals', data),
  update: (id, data) => axiosClient.put(`/goals/${id}`, data),
  delete: (id) => axiosClient.delete(`/goals/${id}`),
};

export const budgetsApi = {
  getAll: () => axiosClient.get('/budgets'),
  create: (data) => axiosClient.post('/budgets', data),
  update: (id, data) => axiosClient.put(`/budgets/${id}`, data),
  delete: (id) => axiosClient.delete(`/budgets/${id}`),
};

export const reportsApi = {
  getMonthly: (year, month) => axiosClient.get('/reports/monthly', { params: { year, month } }),
  getYearly: (year) => axiosClient.get('/reports/yearly', { params: { year } }),
  getComparison: () => axiosClient.get('/reports/comparison'),
};
