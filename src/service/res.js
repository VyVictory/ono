export default (error) => {
  if (error.response) {
    return error.response.data;
  } else {
    return { message: "Lỗi kết nối" };
  }
};
