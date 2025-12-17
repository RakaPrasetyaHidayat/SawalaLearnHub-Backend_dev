import { Module } from "@nestjs/common";
import { InternsService } from "./interns.service";
import { InternsController } from "./interns.controller";
import { SupabaseModule } from "../../infra/supabase/supabase.module";
import { AuthModule } from "../auth/auth.module";

@Module({
  imports: [SupabaseModule, AuthModule],
  controllers: [InternsController],
  providers: [InternsService],
  exports: [InternsService],
})
export class InternsModule {}
