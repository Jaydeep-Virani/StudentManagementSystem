import { FiDownload } from "react-icons/fi"; 
const materials = [
    { id: 1, name: "Material 1", file: "pdf.svg" },
    { id: 2, name: "Material 2", file: "pdf.svg" },
    { id: 3, name: "Material 3", file: "pdf.svg" },
    { id: 4, name: "Material 4", file: "pdf.svg" },
];
export const Material_Card = () => {
    return (
    <>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 p-6">
            {materials.map((material) => (
                <div key={material.id} className="bg-white shadow-md rounded-lg p-4 text-center relative group overflow-hidden">
                    <div className="overflow-hidden pt-3">
                        <img
                            src={material.file}
                            alt={material.name}
                            className="w-full h-48 object-contain mb-4 transition-transform duration-300 group-hover:scale-110"
                        />
                    </div>
                    <h3 className="text-lg font-semibold">{material.name}</h3>
                    <button className="absolute bottom-4 right-4 text-blue-600 hover:scale-120 hover:text-blue-800" title="Download">
                        <FiDownload size={25} />
                    </button>
                </div>
            ))}
        </div>
    </>
    );
};