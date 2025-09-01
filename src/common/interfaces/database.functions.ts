import { UserRole, UserStatus, SubmissionStatus } from '../enums/database.enum';

export interface DatabaseFunctions {
  // User Management
  create_user: {
    Args: {
      p_email: string;
      p_password: string;
      p_full_name: string;
      p_school_name?: string;
      p_division_id?: string;
    };
    Returns: {
      id: string;
      email: string;
      full_name: string;
      role: UserRole;
      status: UserStatus;
    };
  };

  manage_user_status: {
    Args: {
      p_user_id: string;
      p_new_status: UserStatus;
      p_admin_id: string;
    };
    Returns: {
      id: string;
      status: UserStatus;
      updated_at: string;
    };
  };

  // Task Management
  create_task: {
    Args: {
      p_title: string;
      p_description: string;
      p_deadline: string;
      p_channel_year: number;
      p_created_by: string;
    };
    Returns: {
      id: string;
      title: string;
      description: string;
      deadline: string;
      channel_year: number;
      created_by: string;
      created_at: string;
    };
  };

  submit_task: {
    Args: {
      p_task_id: string;
      p_user_id: string;
      p_content: string;
    };
    Returns: {
      id: string;
      task_id: string;
      user_id: string;
      submission_content: string;
      submission_status: SubmissionStatus;
      created_at: string;
    };
  };

  review_submission: {
    Args: {
      p_submission_id: string;
      p_reviewer_id: string;
      p_status: SubmissionStatus;
      p_feedback: string;
    };
    Returns: {
      id: string;
      submission_status: SubmissionStatus;
      feedback: string;
      reviewed_by: string;
      reviewed_at: string;
    };
  };

  get_tasks_by_year: {
    Args: {
      p_year: string;
    };
    Returns: Array<{
      id: string;
      title: string;
      description: string;
      deadline: string;
      channel_year: number;
      created_by: string;
      created_at: string;
    }>;
  };

  get_user_tasks: {
    Args: {
      p_user_id: string;
    };
    Returns: Array<{
      id: string;
      task_id: string;
      user_id: string;
      submission_content: string;
      submission_status: SubmissionStatus;
      created_at: string;
      task: {
        id: string;
        title: string;
        description: string;
        deadline: string;
      };
    }>;
  };
}
