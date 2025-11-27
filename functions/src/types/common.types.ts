import { DocumentData } from "firebase-admin/firestore";

// Common response types
export interface SuccessResponse {
  status: "success";
  message: string;
}

export interface ProfileResponse {
  status: "success";
  profile: DocumentData;
}
