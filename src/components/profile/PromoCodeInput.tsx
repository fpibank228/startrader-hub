
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Ticket, CheckCircle2, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PromoCodeInputProps {
  onSuccess?: (code: string) => void;
}

const PromoCodeInput = ({ onSuccess }: PromoCodeInputProps) => {
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!code.trim()) {
      toast({
        title: "Ошибка",
        description: "Введите промокод",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      try {
        // Mock successful response - in real app this would be an API call
        if (code === "TEST123") {
          setStatus("success");
          toast({
            title: "Успешно",
            description: "Промокод активирован",
          });
          onSuccess?.(code);
        } else {
          setStatus("error");
          toast({
            title: "Ошибка",
            description: "Неверный промокод",
            variant: "destructive",
          });
        }
      } finally {
        setIsLoading(false);
        setTimeout(() => setStatus("idle"), 3000);
      }
    }, 1000);
  };

  return (
    <div className="w-full bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10 mb-6">
      <div className="flex items-center gap-3 mb-3">
        <div className="rounded-full bg-gradient-to-br from-yellow-500 to-amber-600 p-2 shadow-inner">
          <Ticket size={18} className="text-white" />
        </div>
        <div>
          <h3 className="font-bold">Промокод</h3>
          <p className="text-xs text-white/70">Активируйте промокод для получения бонусов</p>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <Input
            type="text"
            placeholder="Введите промокод"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
          />
          {status === "success" && (
            <CheckCircle2 size={18} className="absolute right-2 top-1/2 transform -translate-y-1/2 text-green-400" />
          )}
          {status === "error" && (
            <AlertCircle size={18} className="absolute right-2 top-1/2 transform -translate-y-1/2 text-red-400" />
          )}
        </div>
        <Button 
          type="submit" 
          disabled={isLoading} 
          className="bg-yellow-500/80 hover:bg-yellow-500 text-white"
        >
          {isLoading ? "Проверка..." : "Активировать"}
        </Button>
      </form>
    </div>
  );
};

export default PromoCodeInput;
