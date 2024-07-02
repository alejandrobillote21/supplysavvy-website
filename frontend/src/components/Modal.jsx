const Modal = ({ isOpen, onClose, children }) => {
  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="fixed inset-0 bg-black opacity-50"></div>
          <div className="relative bg-amber-500 p-4 rounded-lg z-10 text-center w-80">
            <button
              className="absolute top-2 right-2 text-black font-semibold hover:text-white focus:outline-none"
              onClick={onClose}
            >
              X
            </button>
            <div className="text-black">
              {children}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Modal;
