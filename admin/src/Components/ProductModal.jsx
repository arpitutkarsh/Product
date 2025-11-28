<div className="fixed inset-0 bg-black/50 backdrop-blur-md flex justify-center items-center z-50 p-2 sm:p-4 overflow-y-auto">
  <div className="bg-white rounded-3xl w-full max-w-lg sm:max-w-xl md:max-w-2xl shadow-2xl relative mx-auto">

    {/* Close Button */}
    <button
      onClick={onClose}
      className="absolute -top-3 -right-3 z-10 bg-white/60 backdrop-blur-lg w-10 h-10 sm:w-12 sm:h-12 flex justify-center items-center rounded-full shadow-lg hover:bg-red-200 transition"
    >
      <X size={22} className="sm:size-26 text-gray-800" />
    </button>

    {/* Image Section */}
    <div className="relative w-full h-52 sm:h-64 md:h-72 overflow-hidden rounded-t-3xl bg-black">
      {product.images?.length > 0 && (
        <img
          src={product.images[currentImage]}
          alt={product.title}
          className="w-full h-full object-contain bg-black"
        />
      )}

      {/* Arrows */}
      {product.images?.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 bg-white/40 backdrop-blur-md text-gray-900 p-1.5 sm:p-2 rounded-full hover:bg-white/70 transition"
          >
            <ChevronLeft size={18} className="sm:size-22" />
          </button>

          <button
            onClick={handleNext}
            className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 bg-white/40 backdrop-blur-md text-gray-900 p-1.5 sm:p-2 rounded-full hover:bg-white/70 transition"
          >
            <ChevronRight size={18} className="sm:size-22" />
          </button>
        </>
      )}

      {/* Dots */}
      <div className="absolute bottom-2 sm:bottom-3 left-1/2 -translate-x-1/2 flex gap-1 sm:gap-2">
        {product.images?.map((_, i) => (
          <span
            key={i}
            className={`w-1.5 h-1.5 sm:w-2.5 sm:h-2.5 rounded-full ${
              i === currentImage ? "bg-blue-600" : "bg-gray-300"
            }`}
          ></span>
        ))}
      </div>
    </div>

    {/* Scrollable Content */}
    <div className="p-4 sm:p-6 max-h-[60vh] overflow-y-auto space-y-3 sm:space-y-4">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-800">{product.title}</h2>

      <p className="text-gray-600 text-sm sm:text-base leading-relaxed whitespace-pre-line">
        {product.description}
      </p>

      <p className="text-xs sm:text-sm text-gray-500">
        <b>Category:</b> {product.category?.name || "Uncategorized"}
      </p>

      {/* Video Section */}
      {product.videos?.length > 0 && !removeVideo && (
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-gray-800 text-sm sm:text-base">
              Product Video
            </h3>

            <button
              onClick={() => setRemoveVideo(true)}
              className="p-1.5 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition"
            >
              <Minus size={16} className="sm:size-18" />
            </button>
          </div>

          <video
            src={product.videos[0]}
            controls
            className="w-full rounded-xl shadow-md max-h-48 sm:max-h-56"
          />
        </div>
      )}

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 mt-4">
        <button
          onClick={() => setShowUpdateModal(true)}
          className="px-3 py-2 text-sm sm:px-4 sm:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Update
        </button>

        <button
          onClick={() => setConfirmDelete(true)}
          className="px-3 py-2 text-sm sm:px-4 sm:py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
        >
          Delete
        </button>
      </div>

      {/* Delete Confirmation */}
      {confirmDelete && (
        <div className="mt-4 border-t pt-3 space-y-3 animate-fadeIn">
          <p className="text-red-600 font-medium text-sm sm:text-base">
            Type <b>delete</b> to confirm:
          </p>
          <input
            type="text"
            value={deleteText}
            onChange={(e) => setDeleteText(e.target.value)}
            className="border border-gray-300 rounded-lg w-full p-2 text-sm sm:text-base focus:ring-2 focus:ring-red-500 outline-none"
            placeholder="delete"
          />
          <div className="flex justify-end gap-2">
            <button
              onClick={() => {
                setConfirmDelete(false);
                setDeleteText("");
              }}
              className="px-3 py-1 text-sm border rounded-lg hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              className="px-3 py-1 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Confirm Delete
            </button>
          </div>
        </div>
      )}
    </div>
  </div>
</div>
