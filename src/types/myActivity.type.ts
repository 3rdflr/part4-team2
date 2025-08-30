import { Activity } from './activities.type';

export interface MyActivitySchedule {
  id?: number;
  date: string;
  startTime: string;
  endTime: string;
}

export interface MyActivitiesListRequest {
  cursorId?: number;
  size?: number;
}

export interface MyActivitiesListResponse {
  cursorId: number;
  totalCount: number;
  activities: Activity[];
}

export interface ApiResponse {
  message: string;
}
