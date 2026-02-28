import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type InsertUser } from "@shared/schema"; // Ideally from shared/routes but schema works for types
import { getQueryFn, apiRequest } from "../lib/queryClient";
import { useToast } from "@/hooks/use-toast";

// Helper to handle API requests using the schema/route definitions
export function useUser() {
  const { data, ...rest } = useQuery({
    queryKey: ["/api/user"],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });
  return { data, ...rest };
}

export function useLogin() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (credentials: InsertUser) => {
      const res = await apiRequest("POST", "/api/login", {
        username: credentials.email, // Passport expects username
        password: credentials.password,
      });
      return await res.json();
    },
    onSuccess: (user) => {
      queryClient.setQueryData(["/api/user"], user);
      toast({
        title: "Добро пожаловать!",
        description: "Вы успешно вошли в систему.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Ошибка входа",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function useRegister() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (credentials: InsertUser) => {
      const res = await apiRequest("POST", "/api/register", credentials);
      return await res.json();
    },
    onSuccess: (user) => {
      queryClient.setQueryData(["/api/user"], user);
      toast({
        title: "Регистрация успешна",
        description: "Добро пожаловать в S-Wallet!",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Ошибка регистрации",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "api/logout");
    },
    onSuccess: () => {
      queryClient.setQueryData(["api/user"], null);
      toast({
        title: "Выход выполнен",
        description: "До скорой встречи!",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Ошибка",
        description: "Не удалось выйти из системы.",
        variant: "destructive",
      });
    },
  });
}
