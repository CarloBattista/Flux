export function formatJSON(jsonString, indent = 2) {
  if (!jsonString) return { success: true, data: '' };
  try {
    const obj = JSON.parse(jsonString);
    const indentValue = isNaN(indent) ? indent : parseInt(indent);
    return {
      success: true,
      data: JSON.stringify(obj, null, indentValue),
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
}

export function minifyJSON(jsonString) {
  if (!jsonString) return { success: true, data: '' };
  try {
    const obj = JSON.parse(jsonString);
    return {
      success: true,
      data: JSON.stringify(obj),
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
}
