import Link from "next/link";
import { Button } from "../ui/button";
import { ArrowLeft } from "lucide-react";

const BackAdmin = () => {
  return (
    <Button asChild>
      <Link className="mt-5 ml-5 mb-5 flex items-center gap-2" href="/admin">
        <ArrowLeft />
        Voltar
      </Link>
    </Button>
  );
};

export default BackAdmin;
