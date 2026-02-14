
/**
 * Uploads a file to the server
 * @param file The file to upload
 * @param type The type of upload (e.g., 'profile-image', 'banner-image', 'document')
 * @returns The uploaded file URL and metadata
 */
export async function uploadFile(file: File, type: string) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to upload file');
    }

    // Expecting { fileUrl: string, fileName: string, ... }
    // Mapping to { url: string } for compatibility with some components if needed
    const result = await response.json();
    return {
        ...result,
        url: result.fileUrl // Alias fileUrl to url for convenience
    };
}

export const uploadProfilePicture = async (file: File) => {
    return uploadFile(file, 'profile-image');
};

export const uploadBannerImage = async (file: File) => {
    return uploadFile(file, 'banner-image');
};
