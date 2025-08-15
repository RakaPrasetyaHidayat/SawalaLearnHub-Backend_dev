import { Button } from "@/components/atoms/ui/button";
import {
   Card,
   CardAction,
   CardContent,
   CardDescription,
   CardFooter,
   CardHeader,
   CardTitle,
} from "@/components/molecules/cards/card"
import { LoginCard } from "@/components/teamplates/login-card/login-card";


export default function Home() {
   return (
      <div>
         <LoginCard />
      </div>
   )
}
