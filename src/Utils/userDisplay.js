const COMMON_NESTED_KEYS = [
  "profile",
  "user",
  "userId",
  "patientId",
  "personalInfo",
  "personalDetails",
  "personal_details",
  "basicInfo",
  "basicDetails",
  "details",
];

const NAME_LIKE_KEY_PATTERN = /(name|full|display|first|last)/i;
const EXCLUDED_NAME_KEY_PATTERN = /(file|image|avatar|userType|timezone|timeZone|domain|path|url|id)$/i;

const readText = (value) => {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim();
};

const joinNameParts = (...parts) =>
  parts
    .map((part) => readText(part))
    .filter(Boolean)
    .join(" ")
    .trim();

const resolveNameFromSource = (source) => {
  if (!source || typeof source !== "object") {
    return "";
  }

  const directName =
    readText(source?.name) ||
    readText(source?.fullName) ||
    readText(source?.full_name) ||
    readText(source?.username) ||
    readText(source?.userName) ||
    readText(source?.displayName) ||
    readText(source?.display_name) ||
    readText(source?.patientName) ||
    readText(source?.patient_name) ||
    readText(source?.customerName) ||
    readText(source?.customer_name);

  if (directName) {
    return directName;
  }

  return (
    joinNameParts(source?.firstName, source?.lastName) ||
    joinNameParts(source?.first_name, source?.last_name) ||
    joinNameParts(source?.fname, source?.lname) ||
    ""
  );
};

const getGenericNameCandidates = (source) => {
  if (!source || typeof source !== "object") {
    return [];
  }

  return Object.entries(source)
    .filter(([key, value]) => {
      if (typeof value !== "string") {
        return false;
      }

      const normalizedValue = value.trim();

      if (!normalizedValue || normalizedValue.length < 2) {
        return false;
      }

      if (normalizedValue.includes("@")) {
        return false;
      }

      if (/^\+?\d[\d\s-]{6,}$/.test(normalizedValue)) {
        return false;
      }

      return NAME_LIKE_KEY_PATTERN.test(key) && !EXCLUDED_NAME_KEY_PATTERN.test(key);
    })
    .map(([, value]) => value.trim());
};

export const getUserName = (user) => {
  const queue = [user];
  const visited = new Set();

  while (queue.length > 0) {
    const current = queue.shift();

    if (!current || typeof current !== "object" || visited.has(current)) {
      continue;
    }

    visited.add(current);

    const resolvedName = resolveNameFromSource(current);

    if (resolvedName) {
      return resolvedName;
    }

    const genericCandidates = getGenericNameCandidates(current);

    if (genericCandidates.length > 0) {
      return genericCandidates[0];
    }

    COMMON_NESTED_KEYS.forEach((key) => {
      if (current?.[key] && typeof current[key] === "object") {
        queue.push(current[key]);
      }
    });

    Object.values(current).forEach((value) => {
      if (value && typeof value === "object" && !Array.isArray(value)) {
        queue.push(value);
      }
    });
  }

  return "N/A";
};

export const getUserId = (user) => user?._id || user?.id || "-";

export const getUserDisplayName = (user) => {
  const resolvedName = getUserName(user);

  if (resolvedName !== "N/A") {
    return resolvedName;
  }

  return "Unknown User";
};
