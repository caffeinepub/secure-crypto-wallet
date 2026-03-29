import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useActor } from "./useActor";

export function useBiometricsEnabled() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["biometricsEnabled"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.getBiometricsEnabled();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAutoLockTimeout() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["autoLockTimeout"],
    queryFn: async () => {
      if (!actor) return BigInt(2);
      return actor.getAutoLockTimeout();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSetBiometricsEnabled() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (enabled: boolean) => {
      if (!actor) return;
      await actor.setBiometricsEnabled(enabled);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["biometricsEnabled"] }),
  });
}

export function useSetAutoLockTimeout() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (minutes: bigint) => {
      if (!actor) return;
      await actor.setAutoLockTimeout(minutes);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["autoLockTimeout"] }),
  });
}

export function useSetWalletSetup() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (hasWallet: boolean) => {
      if (!actor) return;
      await actor.setWalletSetup(hasWallet);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["hasWallet"] }),
  });
}
