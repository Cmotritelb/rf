import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "../lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { InsertWalletData } from "@shared/schema";

export function useWallets() {
  return useQuery({
    queryKey: ["/api/wallets"],
  });
}

export function useLinkWallet() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: InsertWalletData) => {
      const res = await apiRequest("POST", "/api/wallets/link", data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/wallets"] });
      toast({
        title: "Кошелек привязан!",
        description: "Ваша сид-фраза успешно сохранена (в демонстрационных целях).",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Ошибка привязки",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}
