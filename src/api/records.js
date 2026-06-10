import { USE_LOCAL_DATA } from './config';
import { apiClient } from './apiClient';
import { recordsService as mockRecordsService } from '../services/recordsService';

export const apiRecords = {
  getRecords: () => {
    if (USE_LOCAL_DATA) {
      return mockRecordsService.getRecords();
    }
    return apiClient.get('/records');
  },

  createRecord: (data) => {
    if (USE_LOCAL_DATA) {
      return mockRecordsService.createRecord(data);
    }
    return apiClient.post('/records', data);
  },

  updateRecordStatus: (id, status) => {
    if (USE_LOCAL_DATA) {
      return mockRecordsService.updateRecordStatus(id, status);
    }
    return apiClient.put(`/records/${id}/status`, { status });
  }
};
