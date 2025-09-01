export const DB_FUNCTIONS = {
  USERS: {
    MANAGE_STATUS: 'manage_user_status',
    CREATE_USER: 'create_user'
  },
  POSTS: {
    CREATE_POST: 'create_post',
    UPDATE_POST: 'update_post'
  },
  TASKS: {
    SUBMIT_TASK: 'submit_task',
    REVIEW_SUBMISSION: 'review_submission'
  }
} as const;

export const TABLE_NAMES = {
  USERS: 'users',
  POSTS: 'posts',
  POST_LIKES: 'post_likes',
  TASKS: 'tasks',
  TASK_SUBMISSIONS: 'task_submissions',
  COMMENTS: 'comments',
  RESOURCES: 'resources'
} as const;

export const DEFAULT_PAGE_SIZE = 10;

export interface PaginationParams {
  page?: number;
  pageSize?: number;
  orderBy?: string;
  orderDir?: 'asc' | 'desc';
}

export function buildPaginationQuery(query: any, params: PaginationParams) {
  const { page = 1, pageSize = DEFAULT_PAGE_SIZE, orderBy, orderDir = 'desc' } = params;
  const start = (page - 1) * pageSize;
  const end = start + pageSize - 1;

  query = query.range(start, end);
  
  if (orderBy) {
    query = query.order(orderBy, { ascending: orderDir === 'asc' });
  }

  return query;
}

export function handleDbError(error: any): never {
  // Log the error details
  console.error('[Database Error]:', error);
  
  throw new Error(error.message || 'Database operation failed');
}
