import UserAddedConfirmation from "@/components/UserAddedConfirmation";
import { useRouter, useSearchParams } from "next/navigation";

export default function Registrado() {
  const searchParams = useSearchParams()
  const router = useRouter()
  return <UserAddedConfirmation status={searchParams.get("status") || "error"} name={searchParams.get("name") || ""} onClick={() => { router.push('/') }}></UserAddedConfirmation>
}