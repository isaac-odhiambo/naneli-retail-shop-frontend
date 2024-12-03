import React from 'react';

// Ensure selectedIcon is a string, and setSelectedIcon is a function
const IconSearch = ({ selectedIcon, setSelectedIcon }) => {
  // Assuming you are rendering a list of icon components or options
  const icons = ["FaHome", "FaCar", "FaSearch"]; // Example list of icons
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">Select Icon</label>
      <div className="mt-1">
        <select
          value={selectedIcon}
          onChange={(e) => setSelectedIcon(e.target.value)}  // Update selected icon
          className="block w-full border border-gray-300 rounded-md shadow-sm"
        >
          <option value="">Select Icon</option>
          {icons.map((icon, index) => (
            <option key={index} value={icon}>
              {icon}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default IconSearch;


// /** @jsxImportSource react */
// import React, { useState, useEffect } from 'react';
// import * as Icons from 'lucide-react';

// const IconSearch = ({ selectedIcon, setSelectedIcon }) => {
//   const [searchTerm, setSearchTerm] = useState('');
//   const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);

//   // Debounce effect to delay filtering
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setDebouncedSearchTerm(searchTerm);
//     }, 300); // 300ms debounce delay

//     return () => clearTimeout(timer); // Cleanup the timeout on component unmount or when searchTerm changes
//   }, [searchTerm]);

//   // Filter icons based on debounced search term
//   const filteredIcons = Object.keys(Icons).filter((icon) =>
//     icon.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
//   );

//   return (
//     <div className="space-y-2">
//       <input
//         type="text"
//         placeholder="Search for an icon..."
//         value={searchTerm}
//         onChange={(e) => setSearchTerm(e.target.value)}
//         className="w-full p-2 border border-gray-300 rounded"
//       />
//       <div className="grid grid-cols-4 gap-2">
//         {filteredIcons.map((icon) => {
//           const IconComponent = Icons[icon];

//           // Ensure the component is a valid React component before rendering
//           if (typeof IconComponent !== 'function' || !IconComponent.KshKshtypeof) {
//             console.warn(`Icon ${icon} is not a valid React component or is not properly exported.`);
//             return null; // Skip rendering if not a valid component
//           }

//           return (
//             <div
//               key={icon}
//               role="button"
//               aria-label={`Select ${icon} icon`}
//               className="cursor-pointer hover:text-indigo-600"
//               onClick={() => setSelectedIcon(icon)}
//             >
//               <IconComponent className="h-6 w-6" />
//             </div>
//           );
//         })}
//       </div>
//       {selectedIcon && (
//         <div className="mt-2 text-sm text-gray-700">
//           <strong>Selected Icon:</strong> {selectedIcon}
//         </div>
//       )}
//     </div>
//   );
// };

// export default IconSearch;


