// Get CSRF token from meta tag
export function getCsrfToken() {
    return document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
}

// Helper function to make authenticated API requests
export async function makeApiRequest(url, data) {
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-Requested-With": "XMLHttpRequest",
            "X-CSRF-TOKEN": getCsrfToken(),
        },
        body: JSON.stringify(data),
    });
    return response;
}

// Specific functions for survey operations
export async function publishSurvey(formData) {
    return await makeApiRequest("/api/surveys/publish", formData);
}

export async function unpublishSurvey(formData) {
    return await makeApiRequest("/api/surveys/unpublish", formData);
}
