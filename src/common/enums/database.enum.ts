export enum UserStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

export enum UserRole {
  ADMIN = "ADMIN",
  SISWA = "SISWA",
  MENTOR = "MENTOR",
}

export enum TaskStatus {
  OPEN = "OPEN",
  IN_PROGRESS = "IN_PROGRESS",
  ON_PROGRES = "ON-PROGRESS",
  ON_PROGRESS = "ON-PROGRESS", // alias for consistency
  COMPLETED = "COMPLETED",
  ACTIVE = "ACTIVE",
  ARCHIVED = "ARCHIVED",
}

export enum SubmissionStatus {
  SUBMITTED = "SUBMITTED",
  OVERDUE = "OVERDUE",
  REVISION = "REVISION",
  APPROVED = "APPROVED",
  ON_PROGRES = "ON-PROGRESS",
  ON_PROGRESS = "ON-PROGRESS", // alias for consistency
}

export enum Division {
  BACKEND = "BACKEND",
  FRONTEND = "FRONTEND",
  UI_UX = "UI_UX",
  DEVOPS = "DEVOPS",
}

export enum ResourceType {
  DOCUMENT = "DOCUMENT",
  VIDEO = "VIDEO",
  CODE = "CODE",
  LINK = "LINK",
}
