import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../../../lib/queryKeys.js';
import { updateProfileRequest } from '../api/auth.js';

function updatedUserFrom(response) {
  return response?.user ?? response?.data?.user ?? response?.data ?? response;
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProfileRequest,
    onSuccess: async (response, submittedProfile) => {
      const currentUser = queryClient.getQueryData(queryKeys.me) ?? {};
      const returnedUser = updatedUserFrom(response);

      queryClient.setQueryData(queryKeys.me, {
        ...currentUser,
        ...(returnedUser && typeof returnedUser === 'object' ? returnedUser : {}),
        name: returnedUser?.name ?? submittedProfile.name,
        phone: returnedUser?.phone ?? submittedProfile.phone,
      });

      await queryClient.invalidateQueries({ queryKey: queryKeys.me });
    },
  });
}