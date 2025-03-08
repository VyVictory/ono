import { useState, forwardRef, useImperativeHandle } from "react";

const ConfirmDialog = forwardRef((props, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const [resolveCallback, setResolveCallback] = useState(null);

  // Expose openDialog to parent via ref
  useImperativeHandle(ref, () => ({
    openDialog: () => {
      setIsOpen(true);
      return new Promise((resolve) => {
        setResolveCallback(() => resolve);
      });
    },
  }));

  const handleClose = (confirmed) => {
    setIsOpen(false);
    if (resolveCallback) resolveCallback(confirmed);
  };

  return (
    <>
      {isOpen && (
        <div
          className="w-full min-h-full fixed z-50 bg-black bg-opacity-50 transition-opacity flex items-center justify-center inset-0"
        >
               {/* <div className="w-full min-h-full fixed z-50 bg-black bg-opacity-50 transition-opacity flex items-center justify-center inset-0"> */}
          <div className="bg-white p-6 rounded-xl shadow-lg max-w-sm w-full">
            <h2 className="text-lg font-semibold">Xác nhận hành động</h2>
            <p className="mt-2 text-gray-600">{props.message}</p>
            <div className="mt-4 flex justify-end space-x-2">
              <button
                id="false"
                className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
                onClick={() => handleClose(false)}
              >
                Hủy
              </button>
              <button
                id="true"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                onClick={() => handleClose(true)}
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
});

export default ConfirmDialog;
