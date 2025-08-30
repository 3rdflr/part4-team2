import axiosInstance from './axiosInstance';

export const getNotifications = async () => {
  const response = await axiosInstance.get('/my-notifications');
  return response.data;
};

export const deleteNotification = async (id: number) => {
  const response = await axiosInstance.delete(`/my-notifications/${id}`);
  return response.data;
};
