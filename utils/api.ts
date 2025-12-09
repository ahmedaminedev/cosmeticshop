
// Use relative URL to leverage Vite proxy in development
const BACKEND_URL = ''; 

// Flag to prevent multiple refresh calls simultaneously
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

const apiRequest = async (endpoint: string, method: string = 'GET', body?: any, isRetry: boolean = false): Promise<any> => {
    let token = localStorage.getItem('token');
    
    const headers: HeadersInit = { 'Content-Type': 'application/json' };
    
    // Check strict pour éviter d'envoyer "Bearer undefined" ou "Bearer null"
    if (token && token !== 'undefined' && token !== 'null') {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const options: RequestInit = {
        method,
        headers,
        credentials: 'include' // Important for sending cookies (Refresh Token)
    };

    if (body) {
        options.body = JSON.stringify(body);
    }

    try {
        const response = await fetch(`${BACKEND_URL}/api${endpoint}`, options);

        if (!response.ok) {
            // Gestion de l'expiration du token (401) ou 403
            if ((response.status === 401 || response.status === 403) && !isRetry && token) {
                if (isRefreshing) {
                    return new Promise((resolve, reject) => {
                        failedQueue.push({ resolve, reject });
                    }).then(newToken => {
                        return apiRequest(endpoint, method, body, true);
                    }).catch(err => {
                        return Promise.reject(err);
                    });
                }

                isRefreshing = true;

                try {
                    const refreshResponse = await fetch(`${BACKEND_URL}/api/auth/refresh`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        credentials: 'include' 
                    });

                    if (refreshResponse.ok) {
                        const data = await refreshResponse.json();
                        localStorage.setItem('token', data.accessToken);
                        processQueue(null, data.accessToken);
                        isRefreshing = false;
                        return apiRequest(endpoint, method, body, true);
                    } else {
                        throw new Error("Session expirée");
                    }
                } catch (refreshError) {
                    processQueue(refreshError, null);
                    isRefreshing = false;
                    localStorage.removeItem('token');
                    throw refreshError;
                }
            }

            const errorData = {
                status: response.status,
                message: ''
            };
            
            const textBody = await response.text();
            try {
                const errorJson = JSON.parse(textBody);
                errorData.message = errorJson.message || `API error: ${response.status}`;
            } catch (e) {
                errorData.message = textBody || `API error: ${response.status}`;
            }
            throw errorData;
        }

        if (response.status === 204) {
            return null;
        }
        return await response.json();
    } catch (error: any) {
        if (error.message !== "Session expirée") {
            console.error(`API Request failed: ${method} ${endpoint}`, error);
        }
        throw error;
    }
};

export const api = {
    // Auth
    login: (credentials: any) => apiRequest('/auth/login', 'POST', credentials),
    register: (userData: any) => apiRequest('/auth/register', 'POST', userData),
    getMe: () => apiRequest('/auth/me'),
    logout: () => {
        return apiRequest('/auth/logout').finally(() => {
            localStorage.removeItem('token');
        });
    },

    // Products
    getProducts: () => apiRequest('/products'),
    createProduct: (product: any) => apiRequest('/products', 'POST', product),
    updateProduct: (id: number | string, product: any) => apiRequest(`/products/${id}`, 'PUT', product),
    deleteProduct: (id: number | string) => apiRequest(`/products/${id}`, 'DELETE'),

    // Packs
    getPacks: () => apiRequest('/packs'),

    // Categories
    getCategories: () => apiRequest('/categories'),

    // Brands
    getBrands: () => apiRequest('/brands'),
    createBrand: (brand: any) => apiRequest('/brands', 'POST', brand),
    updateBrand: (id: number, brand: any) => apiRequest(`/brands/${id}`, 'PUT', brand),
    deleteBrand: (id: number) => apiRequest(`/brands/${id}`, 'DELETE'),

    // Stores
    getStores: () => apiRequest('/stores'),

    // Promotions
    getPromotions: () => apiRequest('/promotions'),

    // Advertisements
    getAdvertisements: () => apiRequest('/advertisements'),
    updateAdvertisements: (ads: any) => apiRequest('/advertisements', 'POST', ads),

    // Offers Config
    getOffersConfig: () => apiRequest('/offers-config'),
    updateOffersConfig: (config: any) => apiRequest('/offers-config', 'POST', config),

    // Orders
    createOrder: (order: any) => apiRequest('/orders', 'POST', order),
    getMyOrders: () => apiRequest('/orders/myorders'),
    getAllOrders: () => apiRequest('/orders'),

    // Payment
    initiatePayment: (data: { orderId: string; amount: number; customerInfo: any }) => apiRequest('/payment/create', 'POST', data),

    // Blog
    getBlogPosts: () => apiRequest('/blog'),
    getBlogPostBySlug: (slug: string) => apiRequest(`/blog/${slug}`),
    createBlogPost: (postData: any) => apiRequest('/blog', 'POST', postData),

    // Contact
    sendMessage: (data: { name: string; email: string; subject: string; message: string }) => apiRequest('/contact', 'POST', data),
    getMessages: () => apiRequest('/contact'),

    // Chat
    getChatHistory: (userId: string) => apiRequest(`/chat/${userId}`),
    getAllChats: () => apiRequest('/chat/all'),

    // Reviews
    getReviews: (targetType: 'product' | 'pack', targetId: number) => apiRequest(`/reviews/${targetType}/${targetId}`),
    createReview: (data: { targetId: number; targetType: 'product' | 'pack'; rating: number; comment: string }) => apiRequest('/reviews', 'POST', data),
};
