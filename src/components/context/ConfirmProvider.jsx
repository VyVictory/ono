import { createContext, useContext, useState } from "react";
import { createPortal } from "react-dom";

const ConfirmContext = createContext();

export const ConfirmProvider = ({ children }) => {
  const [confirmState, setConfirmState] = useState({
    isOpen: false,
    message: "",
    resolve: null,
  });

  const openConfirm = (message) => {
    return new Promise((resolve) => {
      setConfirmState({ isOpen: true, message, resolve });
    });
  };

  const closeConfirm = (confirmed) => {
    if (confirmState.resolve) confirmState.resolve(confirmed);
    setConfirmState({ isOpen: false, message: "", resolve: null });
  };

  return (
    <ConfirmContext.Provider value={openConfirm}>
      {children}
      {createPortal(
        confirmState.isOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[99999]">
            <div className="bg-white p-6 rounded-xl shadow-lg max-w-sm w-full">
              <h2 className="text-lg font-semibold">Xác nhận</h2>
              <p className="mt-2 text-gray-600">{confirmState.message}</p>
              <div className="mt-4 flex justify-end space-x-2">
                <button
                  className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
                  onClick={() => closeConfirm(false)}
                >
                  Hủy
                </button>
                <button
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  onClick={() => closeConfirm(true)}
                >
                  Xác nhận
                </button>
              </div>
            </div>
          </div>
        ),
        document.body
      )}
    </ConfirmContext.Provider>
  );
};

// Custom Hook để gọi hộp thoại ở bất cứ đâu
export const useConfirm = () => useContext(ConfirmContext);
