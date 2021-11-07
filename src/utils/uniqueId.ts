export default function uniqueId() {
  return Date.now().toString(16) + Math.round(Math.random() * 10e6).toString(16);
}
