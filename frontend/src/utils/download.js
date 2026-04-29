import api from '@/lib/api';

export const downloadResumeFile = async (id, format) => {
  try {
    const response = await api.get(`/resume/${id}/download/${format}`, {
      responseType: 'blob',
    });
    
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `resume.${format === 'docx' ? 'docx' : 'pdf'}`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error(`Error downloading ${format}:`, error);
    throw error;
  }
};
