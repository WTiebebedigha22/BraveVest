export async function shareYearInReview(nodeId, filename = 'bravevest-year-in-review.png') {
  const node = document.getElementById(nodeId);
  if (!node) throw new Error('Year in Review card not found');
  const { default: html2canvas } = await import('html2canvas');
  const canvas = await html2canvas(node, { backgroundColor: 'var(--bv-success)', scale: 2 });
  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
      resolve(true);
    }, 'image/png');
  });
}
