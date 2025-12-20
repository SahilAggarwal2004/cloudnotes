export function validateClosestForm(event) {
  const form = event.currentTarget.closest("form");
  if (!form) return false;
  if (!form.checkValidity()) {
    form.reportValidity();
    return false;
  }
  return true;
}
