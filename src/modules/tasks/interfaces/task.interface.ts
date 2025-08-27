export interface TaskWithProfile {
  id: string;
  title: string;
  description: string;
  deadline: string;
  channel_year: number;
  created_by: string;
  status: string;
  profile: {
    full_name: string;
  };
}

export interface TaskSubmissionWithProfile {
  id: string;
  task_id: string;
  submission_content: string;
  status: string;
  submitted_at: string;
  profile: {
    full_name: string;
  };
}
