import { User } from "./User";

export interface JsonResponse {
    totalCount: number;
    status: {
      success: boolean;
      message: string;
    };
    value: User[];
  }