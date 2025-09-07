import { EditEducationPage } from "@/components/pages/education/edit-education-page";
import { EducationProvider } from "@/components/pages/education/education-context/education-context";

export default function EditEducation() {
  return (
    <EducationProvider>
      <EditEducationPage />
    </EducationProvider>
  );
}

