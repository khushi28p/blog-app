export const extractPlainTextDescription = (htmlString, maxLength = 200) => {
  if (!htmlString) return '';

  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = htmlString + ' ';
  const plainText = tempDiv.textContent || tempDiv.innerText || '';

  if (plainText.length > maxLength) {
    return plainText.substring(0, maxLength).trim() + '...';
  }
  return plainText.trim();
};