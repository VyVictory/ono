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
    console.log("dawdvaudaywdaw");
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
      `/post/postByRange/?start=${start}&limit=${limit}`
    );
    console.log(response)
    return response.data;
  } catch (error) {
    nextError(error);
    return null;
  }
};
