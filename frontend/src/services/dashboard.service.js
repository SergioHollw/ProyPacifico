import api from './http.service';

export async function getDashboardStats() {
  return api.get('/dashboard/stats/');
}
