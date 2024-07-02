import React from "react";

const CategoryForm = ({
  value,
  setValue,
  handleSubmit,
  handleUpdate,
  handleDelete,
}) => {
  const isNewCategory = !handleUpdate;

  return (
    <div className="p-3">
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="flex space-x-4">
          <input
            type="text"
            className="py-3 px-4 border border-black-500 rounded-lg w-full bg-white text-black placeholder-gray-400 focus:outline-none focus:border-amber-500"
            placeholder="Write category name"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />

          {isNewCategory && (
            <button
              type="submit"
              className="bg-amber-500 text-black py-2 px-4 rounded-lg hover:bg-amber-900 focus:outline-none focus:ring-2 focus:ring-amber focus:ring-opacity-50"
            >
              Submit
            </button>
          )}
        </div>

        {!isNewCategory && (
          <div className="flex justify-between mt-4">
            <button
              onClick={handleUpdate}
              className="bg-black text-white py-2 px-4 rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-black focus:ring-opacity-50"
            >
              Update
            </button>

            {handleDelete && (
              <button
                onClick={handleDelete}
                className="bg-black text-white py-2 px-4 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-black focus:ring-opacity-50"
              >
                Delete
              </button>
            )}
          </div>
        )}
      </form>
    </div>
  );
};

export default CategoryForm;
