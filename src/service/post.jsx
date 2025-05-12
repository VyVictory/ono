import api from "./components/api";
import authToken from "./storage/authToken";
import { nextLogin, nextError } from "./components/nextLogin";

export const Post = async (content, files, video, privacy) => {
  try {
    const token = authToken.getToken();
    if (!token) {
      nextLogin();
      return null; // Stop execution
    }

    if (!content && (!files || files.length === 0) && !video) return null;

    const formData = new FormData();
    formData.append("security", privacy);
    if (content) {
      formData.append("content", content);
    }
    if (files?.length) {
      console.log("co hinh", files);
      files.forEach((file) => {
        console.log("Adding file:", file.name);
        formData.append("media", file);
      });
    }

    if (video) {
      formData.append("media", video);
    }

    console.log("FormData contents:", formData);
    const response = await api.post(`/post`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response;
  } catch (error) {
    nextError(error);
    return null;
  }
};
export const getPostHome = async (start, limit) => {
  try {
    const response = await api.get(
      `/post/getAllVisiblePost/?start=${start}&limit=${Infinity}`
    );
    return response.data;
  } catch (error) {
    // nextError(error);
    return null;
  }
};
export const getAllPostOld = async (start, limit) => {
  try {
    const response = await api.get(
      `/post/postByRange/?start=${start}&limit=${Infinity}`
    );
    return response.data;
  } catch (error) {
    // nextError(error);
    return null;
  }
};

export const updatePost = async (
  content,
  files = [],
  video = null,
  privacy,
  postId,
  existingMedia = []
) => {
  try {
    const token = authToken.getToken();
    if (!token) {
      nextLogin();
      return null;
    }

    // Nếu không có gì để gửi thì dừng
    if (
      (content == null || content === "") &&
      files.length === 0 &&
      !video &&
      existingMedia.length === 0
    ) {
      return null;
    }

    const formData = new FormData();
    formData.append("security", privacy);

    if (content != null) {
      formData.append("content", content);
    }

    // stringify existingMedia array
    if (existingMedia.length > 0) {
      // Chỉ lấy trường _id của mỗi media
      const keepIds = existingMedia.map((m) => m._id.toString());
      formData.append("existingMedia", JSON.stringify(keepIds));
    }
    // đính kèm file ảnh mới
    files.forEach((file) => {
      formData.append("media", file);
    });

    // đính kèm file video mới (nếu có)
    if (video) {
      formData.append("media", video);
    }

    console.log("FormData contents:", formData);
    const response = await api.put(`/post/${postId}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response;
  } catch (error) {
    nextError(error);
    return null;
  }
};

export const getPostById = async (id) => {
  try {
    const response = await api.get(`/post/getpost/${id}`);
    return response.data;
  } catch (error) {
    // nextError(error);
    return null;
  }
};

export const getMyPost = async (start, limit) => {
  try {
    const response = await api.get(
      `/post/myPostByRange/?start=${start}&limit=${Infinity}`
    );
    return response.data;
  } catch (error) {
    // nextError(error);
    return null;
  }
};
export const getOrderPost = async ({ userId, start, limit }) => {
  if (!userId) return;
  try {
    const response = await api.get(
      `/post/postByUser/${userId}?start=${start}&limit=${Infinity}`
    );
    return response.data;
  } catch (error) {
    // nextError(error);
    return null;
  }
};
