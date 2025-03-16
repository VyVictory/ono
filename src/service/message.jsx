export const SendToUser = async (idUser,content,) => {
  try {
    if (!token) {
      nextLogin();
    }
    const response = await api.delete(
      `/friend/unfriend/${encodeURIComponent(idUser)}`
    );
    return response;
  } catch (error) {
    nextError(error);
    return res(error);
  }
};
