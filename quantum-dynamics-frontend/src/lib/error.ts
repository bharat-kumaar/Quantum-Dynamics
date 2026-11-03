export function getErrorMessage(err: unknown): string {
  if (!err) return 'An unexpected error occurred.';
  if (typeof err === 'string') return err;
  try {
    const errObj = err as Record<string, unknown>;
    const nested = errObj?.response as Record<string, unknown>;
    const data = nested?.data as Record<string, unknown>;
    return (data?.message ?? errObj?.message ?? 'An unexpected error occurred.') as string;
  } catch {
    return 'An unexpected error occurred.';
  }
}
