export enum UserRole {
  ADMIN = 'ADMIN',
  SISWA = 'SISWA',
  MENTOR = 'MENTOR'
}

export enum UserStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

export enum TaskStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED'
}

export enum SubmissionStatus {
  SUBMITTED = 'SUBMITTED',
  OVERDUE = 'OVERDUE',
  REVISED = 'REVISED',
  APPROVED = 'APPROVED'
}

export enum ResourceType {
  ARTICLE = 'ARTICLE',
  VIDEO = 'VIDEO',
  DOCUMENT = 'DOCUMENT',
  LINK = 'LINK'
}
