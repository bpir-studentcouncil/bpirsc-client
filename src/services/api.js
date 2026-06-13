const getFallbackUrl = () => {
  if (typeof window !== 'undefined' && 
      (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
    return 'http://localhost:5000';
  }
  return 'https://bpirsc-server.vercel.app';
};

const baseBackendUrl = import.meta.env.VITE_BACKEND_URL || getFallbackUrl();
const BACKEND_URL = baseBackendUrl.endsWith('/api') ? baseBackendUrl : `${baseBackendUrl}/api`;

// Helper to get headers with authentication
const getHeaders = (token = '', extraHeaders = {}) => {
  const headers = {
    'Content-Type': 'application/json',
    ...extraHeaders
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  } else {
    // If no token in memory, try fetching from localStorage mock state
    const storedUser = localStorage.getItem('bpirsc_user');
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        headers['Authorization'] = `Bearer ${parsed.token || parsed.uid}`;
        headers['x-user-name'] = parsed.name;
        headers['x-user-email'] = parsed.email;
      } catch (e) {
        console.error('Error reading localStorage token', e);
      }
    }
  }
  return headers;
};

// Generic response handler
const handleResponse = async (response) => {
  if (!response.ok) {
    let errorMessage = 'Something went wrong';
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorMessage;
    } catch {
      // Body is not json
    }
    throw new Error(errorMessage);
  }
  return await response.json();
};

export const api = {
  // News endpoints
  getNews: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const response = await fetch(`${BACKEND_URL}/news?${query}`);
    return handleResponse(response);
  },
  
  getNewsById: async (id) => {
    const response = await fetch(`${BACKEND_URL}/news/${id}`);
    return handleResponse(response);
  },
  
  createNews: async (data, token) => {
    const response = await fetch(`${BACKEND_URL}/news`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(data)
    });
    return handleResponse(response);
  },
  
  updateNews: async (id, data, token) => {
    const response = await fetch(`${BACKEND_URL}/news/${id}`, {
      method: 'PUT',
      headers: getHeaders(token),
      body: JSON.stringify(data)
    });
    return handleResponse(response);
  },
  
  deleteNews: async (id, token) => {
    const response = await fetch(`${BACKEND_URL}/news/${id}`, {
      method: 'DELETE',
      headers: getHeaders(token)
    });
    return handleResponse(response);
  },

  // Projects endpoints
  getProjects: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const response = await fetch(`${BACKEND_URL}/projects?${query}`);
    return handleResponse(response);
  },
  
  getProjectStats: async () => {
    const response = await fetch(`${BACKEND_URL}/projects/stats`);
    return handleResponse(response);
  },
  
  getProjectById: async (id) => {
    const response = await fetch(`${BACKEND_URL}/projects/${id}`);
    return handleResponse(response);
  },
  
  createProject: async (data, token) => {
    const response = await fetch(`${BACKEND_URL}/projects`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(data)
    });
    return handleResponse(response);
  },
  
  updateProject: async (id, data, token) => {
    const response = await fetch(`${BACKEND_URL}/projects/${id}`, {
      method: 'PUT',
      headers: getHeaders(token),
      body: JSON.stringify(data)
    });
    return handleResponse(response);
  },
  
  deleteProject: async (id, token) => {
    const response = await fetch(`${BACKEND_URL}/projects/${id}`, {
      method: 'DELETE',
      headers: getHeaders(token)
    });
    return handleResponse(response);
  },

  // Alumni endpoints
  registerAlumni: async (data, token) => {
    const response = await fetch(`${BACKEND_URL}/alumni/register`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(data)
    });
    return handleResponse(response);
  },
  
  getMyAlumniStatus: async (token) => {
    const response = await fetch(`${BACKEND_URL}/alumni/my-status`, {
      headers: getHeaders(token)
    });
    return handleResponse(response);
  },
  
  getAlumniDirectory: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const response = await fetch(`${BACKEND_URL}/alumni/directory?${query}`);
    return handleResponse(response);
  },
  
  getPendingAlumni: async (token) => {
    const response = await fetch(`${BACKEND_URL}/alumni/pending`, {
      headers: getHeaders(token)
    });
    return handleResponse(response);
  },
  
  updateAlumniStatus: async (id, status, token) => {
    const response = await fetch(`${BACKEND_URL}/alumni/${id}/status`, {
      method: 'PUT',
      headers: getHeaders(token),
      body: JSON.stringify({ status })
    });
    return handleResponse(response);
  },
  
  updateAlumniPayment: async (id, paymentStatus, token) => {
    const response = await fetch(`${BACKEND_URL}/alumni/${id}/payment`, {
      method: 'PUT',
      headers: getHeaders(token),
      body: JSON.stringify({ paymentStatus })
    });
    return handleResponse(response);
  },

  // User Administration
  getUsers: async (token) => {
    const response = await fetch(`${BACKEND_URL}/users`, {
      headers: getHeaders(token)
    });
    return handleResponse(response);
  },
  
  updateUserRole: async (uid, role, token) => {
    const response = await fetch(`${BACKEND_URL}/users/${uid}/role`, {
      method: 'PUT',
      headers: getHeaders(token),
      body: JSON.stringify({ role })
    });
    return handleResponse(response);
  },

  updateUserProfile: async (name, token) => {
    const response = await fetch(`${BACKEND_URL}/users/profile`, {
      method: 'PUT',
      headers: getHeaders(token),
      body: JSON.stringify({ name })
    });
    return handleResponse(response);
  },

  // Team Members Endpoints
  getTeam: async () => {
    const response = await fetch(`${BACKEND_URL}/team`);
    return handleResponse(response);
  },
  
  createTeamMember: async (data, token) => {
    const response = await fetch(`${BACKEND_URL}/team`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(data)
    });
    return handleResponse(response);
  },

  updateTeamMember: async (id, data, token) => {
    const response = await fetch(`${BACKEND_URL}/team/${id}`, {
      method: 'PUT',
      headers: getHeaders(token),
      body: JSON.stringify(data)
    });
    return handleResponse(response);
  },

  deleteTeamMember: async (id, token) => {
    const response = await fetch(`${BACKEND_URL}/team/${id}`, {
      method: 'DELETE',
      headers: getHeaders(token)
    });
    return handleResponse(response);
  },


  // Contact Form
  submitContactForm: async (data) => {
    const response = await fetch(`${BACKEND_URL}/contact`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse(response);
  },
  
  getContactMessages: async (token) => {
    const response = await fetch(`${BACKEND_URL}/contact`, {
      headers: getHeaders(token)
    });
    return handleResponse(response);
  },
  
  markContactMessageRead: async (id, isRead, token) => {
    const response = await fetch(`${BACKEND_URL}/contact/${id}/read`, {
      method: 'PUT',
      headers: getHeaders(token),
      body: JSON.stringify({ isRead })
    });
    return handleResponse(response);
  },

  // File Upload API
  uploadImage: async (file, token) => {
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

    if (cloudName && uploadPreset) {
      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', uploadPreset);
        
        const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
          method: 'POST',
          body: formData
        });
        const result = await handleResponse(response);
        return { url: result.secure_url };
      } catch (err) {
        console.warn('Direct Cloudinary upload failed, trying backend upload fallback...', err);
      }
    }

    const formData = new FormData();
    formData.append('image', file);
    
    // Custom header generation omitting 'Content-Type' so the browser sets the correct multipart boundary
    const headers = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    } else {
      const storedUser = localStorage.getItem('bpirsc_user');
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        headers['Authorization'] = `Bearer ${parsed.token || parsed.uid}`;
      }
    }

    const response = await fetch(`${BACKEND_URL}/upload`, {
      method: 'POST',
      headers,
      body: formData
    });
    return handleResponse(response);
  },
  
  uploadMultipleImages: async (files, token) => {
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

    if (cloudName && uploadPreset) {
      try {
        const uploadPromises = Array.from(files).map(async (file) => {
          const formData = new FormData();
          formData.append('file', file);
          formData.append('upload_preset', uploadPreset);
          
          const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
            method: 'POST',
            body: formData
          });
          const result = await handleResponse(response);
          return result.secure_url;
        });
        const urls = await Promise.all(uploadPromises);
        return { urls };
      } catch (err) {
        console.warn('Direct multiple Cloudinary upload failed, trying backend upload fallback...', err);
      }
    }

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('images', files[i]);
    }

    const headers = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    } else {
      const storedUser = localStorage.getItem('bpirsc_user');
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        headers['Authorization'] = `Bearer ${parsed.token || parsed.uid}`;
      }
    }

    const response = await fetch(`${BACKEND_URL}/upload/multiple`, {
      method: 'POST',
      headers,
      body: formData
    });
    return handleResponse(response);
  }
};
