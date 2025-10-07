const extractDuration = (service: string): number => {
  const match = service.match(/\((?:(\d+)h)?(?:\s*e\s*)?(?:(\d+)min)?\)/);

  if (!match) return 0;

  const hours = match[1] ? parseInt(match[1], 10) : 0;
  const minutes = match[2] ? parseInt(match[2], 10) : 0;

  return hours * 60 + minutes;
};

export default extractDuration;
