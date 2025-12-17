export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          full_name: string;
          email: string;
          password_hash: string;
          role: "ADMIN" | "MENTOR" | "SISWA";
          division_id: string;
          angkatan: number;
          school_name: string;
          status: "pending" | "approved" | "rejected";
          created_at: string;
          updated_at: string;
        };
      };
      posts: {
        Row: {
          id: string;
          user_id: string;
          content: string;
          media_url?: string;
          created_at: string;
          updated_at: string;
        };
      };
    };
    Enums: {
      user_role: "ADMIN" | "MENTOR" | "SISWA";
      user_status: "pending" | "approved" | "rejected";
      alert_type: "approve" | "reject";
      alert_status: "yes" | "no";
      task_status: "pending" | "approved" | "rejected";
    };
  };
};
