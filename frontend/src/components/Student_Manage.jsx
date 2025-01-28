const Student_Manage = () => {
  return (
    <>
      <div className="mb-4 ">
        <button className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-500 transition duration-300 hover:scale-104">
          Add Student
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="table-auto border-collapse border border-gray-300 w-full shadow-lg rounded-lg">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="border border-gray-300 px-4 py-2 text-left">Column 1</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Column 2</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Column 3</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Column 4</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Column 5</th>
            </tr>
          </thead>
          <tbody>
            <tr className="bg-gray-100 hover:bg-blue-100 transition duration-300">
              <td className="border border-gray-300 px-4 py-2">Row 1, Col 1</td>
              <td className="border border-gray-300 px-4 py-2">Row 1, Col 2</td>
              <td className="border border-gray-300 px-4 py-2">Row 1, Col 3</td>
              <td className="border border-gray-300 px-4 py-2">Row 1, Col 4</td>
              <td className="border border-gray-300 px-4 py-2">Row 1, Col 5</td>
            </tr>
            <tr className="hover:bg-blue-100 transition duration-300">
              <td className="border border-gray-300 px-4 py-2">Row 2, Col 1</td>
              <td className="border border-gray-300 px-4 py-2">Row 2, Col 2</td>
              <td className="border border-gray-300 px-4 py-2">Row 2, Col 3</td>
              <td className="border border-gray-300 px-4 py-2">Row 2, Col 4</td>
              <td className="border border-gray-300 px-4 py-2">Row 2, Col 5</td>
            </tr>
            <tr className="bg-gray-100 hover:bg-blue-100 transition duration-300">
              <td className="border border-gray-300 px-4 py-2">Row 3, Col 1</td>
              <td className="border border-gray-300 px-4 py-2">Row 3, Col 2</td>
              <td className="border border-gray-300 px-4 py-2">Row 3, Col 3</td>
              <td className="border border-gray-300 px-4 py-2">Row 3, Col 4</td>
              <td className="border border-gray-300 px-4 py-2">Row 3, Col 5</td>
            </tr>
            <tr className="hover:bg-blue-100 transition duration-300">
              <td className="border border-gray-300 px-4 py-2">Row 4, Col 1</td>
              <td className="border border-gray-300 px-4 py-2">Row 4, Col 2</td>
              <td className="border border-gray-300 px-4 py-2">Row 4, Col 3</td>
              <td className="border border-gray-300 px-4 py-2">Row 4, Col 4</td>
              <td className="border border-gray-300 px-4 py-2">Row 4, Col 5</td>
            </tr>
            <tr className="bg-gray-100 hover:bg-blue-100 transition duration-300">
              <td className="border border-gray-300 px-4 py-2">Row 5, Col 1</td>
              <td className="border border-gray-300 px-4 py-2">Row 5, Col 2</td>
              <td className="border border-gray-300 px-4 py-2">Row 5, Col 3</td>
              <td className="border border-gray-300 px-4 py-2">Row 5, Col 4</td>
              <td className="border border-gray-300 px-4 py-2">Row 5, Col 5</td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Student_Manage;
