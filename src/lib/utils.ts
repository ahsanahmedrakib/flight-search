import { MONTHS, WEEKDAYS } from "./constants";

export const formatTime = (isoString: string) => {
  if (!isoString) return "";
  const timePart = isoString.split("T")[1] || "00:00:00";
  const [hour, minute] = timePart.split(":");
  return `${hour}:${minute}`;
};

export const formatDate = (isoString: string) => {
  if (!isoString) return "";
  const datePart = isoString.split("T")[0];
  const [year, month, day] = datePart.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return `${day} ${MONTHS[month - 1]}, ${WEEKDAYS[date.getDay()]}`;
};

export const formatDateDisplay = (dateString: string) => {
  if (!dateString) return "Select Date";
  const parts = dateString.split("-");
  if (parts.length !== 3) return "Select Date";
  const year = Number(parts[0]);
  const month = Number(parts[1]);
  const day = Number(parts[2]);
  return `${day} ${MONTHS[month - 1]} ${year}`;
};

export const formatWeekdayDisplay = (dateString: string) => {
  if (!dateString) return "";
  const parts = dateString.split("-");
  if (parts.length !== 3) return "";
  const year = Number(parts[0]);
  const month = Number(parts[1]);
  const day = Number(parts[2]);
  const date = new Date(year, month - 1, day);
  return WEEKDAYS[date.getDay()];
};

export const formatDuration = (totalMinutes: number) => {
  const hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;
  return `${hours}h ${mins}m`;
};
