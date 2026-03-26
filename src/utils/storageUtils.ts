/**
 * Safely parses a JSON string gracefully recovering from corruption.
 */
export const safeParse = <T>(
  data: string | null,
  fallback: T,
  validator?: (parsed: any) => boolean
): T => {
  if (!data) return fallback;
  try {
    const parsed = JSON.parse(data);
    
    // Validate if a schema checker is provided
    if (validator && !validator(parsed)) {
       console.warn('Data validation failed. Resetting to fallback.', { parsed, expectedFallback: fallback });
       return fallback;
    }

    return parsed as T;
  } catch (err) {
    console.warn('Data parsing failed (corrupted JSON). Resetting to fallback.', err);
    return fallback;
  }
};
